import { getParticipantIdentity, resolveAvatarTheme } from '@/avatars'
import {
  buildDeterministicSoloComment,
  buildSoloPrompt,
  computeSoloStats,
} from '@/soloAnalysis'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Commentaire humoristique de fin de partie solo (D66).
 *
 * Fondé uniquement sur la performance du joueur (précision, vitesse, séries, manches
 * laissées au chrono, début contre fin), dans le ton de l'univers du pack.
 * Zéro spoil : ni intitulé ni réponse ne sont lus ici, seulement des scores et des numéros de manche.
 * Gemini si une clé existe, sinon texte déterministe.
 */

const analysisCache = new Map<string, { headline: string; chronicle: string; source: string }>()

async function tryGemini(prompt: string): Promise<{ headline: string; chronicle: string } | null> {
  const env = process.env
  const apiKey = (env['GEMINI_API_KEY'] || env['GOOGLE_API_KEY'] || '').trim()
  if (!apiKey) return null
  for (const model of ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash']) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 6500)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.85, maxOutputTokens: 600, responseMimeType: 'application/json' },
          }),
          signal: controller.signal,
        }
      )
      clearTimeout(timer)
      if (!res.ok) continue
      const data = await res.json()
      const raw: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!raw) continue
      const parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim())
      if (typeof parsed?.headline === 'string' && typeof parsed?.chronicle === 'string' && parsed.chronicle.length > 20) {
        return { headline: parsed.headline.trim(), chronicle: parsed.chronicle.trim() }
      }
    } catch {
      // modèle suivant, puis repli déterministe
    }
  }
  return null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const gameId: string | undefined = body?.gameId
    if (!gameId) return NextResponse.json({ error: 'Missing gameId' }, { status: 400 })

    const cached = analysisCache.get(gameId)
    if (cached) return NextResponse.json(cached)

    const env = process.env
    const url = (env['SUPABASE_URL'] || env['NEXT_PUBLIC_SUPABASE_URL'] || '').trim()
    const key = (
      env['SUPABASE_SERVICE_ROLE_KEY'] ||
      env['SUPABASE_ANON_KEY'] ||
      env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
      ''
    ).trim()
    if (!url || !key) return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 })
    const db = createClient(url, key)

    const { data: game } = await db
      .from('quiz_games')
      .select('id, play_mode, quiz_set_id, quiz_sets(*)')
      .eq('id', gameId)
      .single()
    if (!game || (game as any).play_mode !== 'solo') {
      return NextResponse.json({ error: 'Solo game not found' }, { status: 404 })
    }
    const set = (game as any).quiz_sets
    const [{ data: participant }, { data: questions }] = await Promise.all([
      db.from('quiz_participants').select('*').eq('game_id', gameId).limit(1).maybeSingle(),
      db.from('quiz_questions').select('id, order, is_disabled').eq('quiz_set_id', game.quiz_set_id).order('order'),
    ])
    if (!participant) return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    const { data: answers } = await db
      .from('quiz_answers')
      .select('question_id, score')
      .eq('participant_id', participant.id)

    const active = (questions ?? []).filter((q: any) => !q.is_disabled)
    const scoreByQuestion = new Map((answers ?? []).map((a: any) => [a.question_id, a.score as number]))
    const identity = getParticipantIdentity(participant)
    const stats = computeSoloStats(
      { displayName: identity.displayName, characterName: identity.characterName },
      active.map((q: any) => (scoreByQuestion.has(q.id) ? scoreByQuestion.get(q.id)! : null))
    )
    const themeId = resolveAvatarTheme(set)

    const gemini = await tryGemini(buildSoloPrompt(themeId, set?.name ?? 'Quiz', stats))
    const payload = gemini
      ? { ...gemini, source: 'gemini' }
      : { ...buildDeterministicSoloComment(themeId, stats), source: 'deterministic' }
    analysisCache.set(gameId, payload)
    return NextResponse.json(payload)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
