import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getParticipantIdentity } from '@/avatars'

export const dynamic = 'force-dynamic'

export interface GameAward {
  id: string
  emoji: string
  title: string
  winnerName: string
  winnerCharacter: string | null
  winnerAvatarUrl: string | null
  description: string
}

export interface GameAnalysisPayload {
  headline: string
  chronicle: string
  awards: GameAward[]
  hardestQuestionText: string | null
  hardestQuestionSuccessPct: number | null
  source: 'gemini' | 'deterministic'
}

const analysisCache = new Map<string, GameAnalysisPayload>()

const CHARACTER_VICTORY_QUIPS: Record<string, string> = {
  david:
    'a littéralement dansé sur la concurrence dans les couloirs du 10 Downing Street au son des Pointer Sisters',
  natalie:
    'a conquis tout le quartier de Wandsworth avec un naturel désarmant (« Oh, et puis merde ! »)',
  billy_mack:
    'décroche la place de numéro 1 de Noël devant le boys band Blue et gagne le droit de fêter ça avec son manager Joe',
  mark: 'n’a même pas eu besoin de sortir ses pancartes « To me, you are perfect » pour mettre tout le monde d’accord',
  juliet:
    'repart avec la cassette du mariage, son chapeau gavroche et une part bien méritée de Banoffee Pie',
  jamie:
    'a tapé un sans-faute digne de son meilleur roman avant de plonger dans le lac pour célébrer son triomphe',
  aurelia:
    'a traversé toute la brasserie portugaise sous les applaudissements pour s’emparer de la couronne',
  karen:
    'prend une revanche éclatante, bien loin des larmes sur Joni Mitchell et avec la grâce d’un homard de crèche',
  harry:
    'a validé ses réponses en cachette au comptoir de la bijouterie avant même que sa femme ne revienne',
  sam: 'a sprinté à travers tout l’aéroport d’Heathrow pour arracher la victoire à la dernière seconde',
  joanna:
    'a électrisé toute la salle du spectacle de Noël avec une voix (et un score) de diva absolue',
  rufus:
    'a pris le temps d’emballer la première place avec du papier transparent, de la lavande et un bâton de cannelle',
  colin:
    'prouve qu’il n’avait même pas besoin d’aller dans le Wisconsin pour régner sans partage sur la soirée',
  mia: 'a sorti ses cornes de diable rouges de la soirée de Noël pour chiper le trophée sous le nez des favoris',
  john: 'a géré la pression avec une politesse toute britannique au milieu des embouteillages de Londres',
}

interface PlayerComputedStats {
  participantId: string
  displayName: string
  characterName: string | null
  avatarId: string | null
  avatarUrl: string | null
  totalScore: number
  rank: number
  answeredCount: number
  correctCount: number
  accuracyPct: number
  bestSingleScore: number
  avgSpeedScore: number
  maxStreak: number
  lateGameScore: number
}

function buildDeterministicAnalysis(
  quizName: string,
  players: PlayerComputedStats[],
  hardestQ: { body: string; pct: number } | null,
  totalQuestions: number
): GameAnalysisPayload {
  if (players.length === 0) {
    return {
      headline: '🎬 Clap de fin sur le plateau !',
      chronicle:
        'Aucune réponse enregistrée sur cette session, mais les projecteurs de Noël restent allumés pour la prochaine manche !',
      awards: [],
      hardestQuestionText: null,
      hardestQuestionSuccessPct: null,
      source: 'deterministic',
    }
  }

  const winner = players[0]
  const second = players[1] ?? null
  const third = players[2] ?? null

  const winnerQuip =
    (winner.avatarId && CHARACTER_VICTORY_QUIPS[winner.avatarId]) ||
    'a survolé les débats avec un sang-froid magistral du début à la fin'

  const winnerIdentityLabel = winner.characterName
    ? `${winner.displayName} (alias ${winner.characterName})`
    : winner.displayName

  const headline =
    players.length > 1 && second && winner.totalScore - second.totalScore <= 400
      ? `🎄 Photo-finish haletante : ${winner.displayName} l'emporte sur le fil !`
      : `👑 Triomphe de Noël : ${winner.displayName} règne sur « ${quizName} » !`

  const parts: string[] = []
  parts.push(
    `Quel spectacle digne d’un final à l’aéroport d’Heathrow ! Avec ${winner.totalScore} points (${winner.correctCount}/${totalQuestions} bonnes réponses), ${winnerIdentityLabel} ${winnerQuip}.`
  )

  if (second) {
    const gap = winner.totalScore - second.totalScore
    const secondLabel = second.characterName
      ? `${second.displayName} (${second.characterName})`
      : second.displayName
    if (gap === 0) {
      parts.push(
        `Égalité parfaite au sommet avec ${secondLabel} qui affiche exactement le même score : il va falloir partager le Banoffee Pie !`
      )
    } else if (gap <= 450) {
      parts.push(
        `Le suspense a duré jusqu'au bout : ${secondLabel} échoue à seulement ${gap} petits points du sommet après une lutte acharnée${third ? `, tandis que ${third.displayName} complète ce podium de rêve avec ${third.totalScore} pts` : ''}.`
      )
    } else {
      parts.push(
        `Derrière cette démonstration, ${secondLabel} décroche une belle médaille d'argent (${second.totalScore} pts)${third ? ` juste devant ${third.displayName} (${third.totalScore} pts) qui s'invite sur la boîte` : ''}.`
      )
    }
  }

  if (hardestQ) {
    parts.push(
      `Le moment le plus impitoyable de la soirée ? La question « ${hardestQ.body} », qui n’a laissé passer que ${hardestQ.pct}% de bonnes réponses !`
    )
  }

  // Compute fun deterministic awards
  const awards: GameAward[] = []

  // 1. Lucky Luke du Buzzer (highest single question score or avgSpeedScore)
  const fastest = [...players]
    .filter((p) => p.correctCount > 0)
    .sort((a, b) => b.bestSingleScore - a.bestSingleScore || b.avgSpeedScore - a.avgSpeedScore)[0]
  if (fastest) {
    awards.push({
      id: 'speed',
      emoji: '⚡',
      title: 'Lucky Luke du Buzzer',
      winnerName: fastest.displayName,
      winnerCharacter: fastest.characterName,
      winnerAvatarUrl: fastest.avatarUrl,
      description: `Réflexes supersoniques avec une pointe à ${fastest.bestSingleScore} pts sur une seule question (moyenne de ${fastest.avgSpeedScore} pts/bonne réponse) !`,
    })
  }

  // 2. Sniper sans pitié (longest streak or highest accuracy)
  const sniper = [...players]
    .filter((p) => p.correctCount > 0)
    .sort((a, b) => b.maxStreak - a.maxStreak || b.accuracyPct - a.accuracyPct)[0]
  if (sniper && (sniper.maxStreak >= 2 || players.length === 1)) {
    awards.push({
      id: 'sniper',
      emoji: '🎯',
      title: 'Sniper de Downing Street',
      winnerName: sniper.displayName,
      winnerCharacter: sniper.characterName,
      winnerAvatarUrl: sniper.avatarUrl,
      description: `Une série insolente de ${sniper.maxStreak} bonnes réponses consécutives (${sniper.accuracyPct}% de réussite globale).`,
    })
  }

  // 3. Prix Rufus / Mr Bean de l'emballage (player who took the most time on correct answers)
  if (players.length >= 2) {
    const carefulCandidates = [...players].filter(
      (p) => p.correctCount > 0 && p.participantId !== fastest?.participantId
    )
    const careful = carefulCandidates.sort((a, b) => a.avgSpeedScore - b.avgSpeedScore)[0]
    if (careful) {
      awards.push({
        id: 'rufus',
        emoji: '🎁',
        title: "Prix Mr Bean de l'Emballage",
        winnerName: careful.displayName,
        winnerCharacter: careful.characterName,
        winnerAvatarUrl: careful.avatarUrl,
        description: `Prend soin d'ajouter la lavande et le bâton de cannelle avant de buzzer (${careful.avgSpeedScore} pts de moyenne par bonne réponse) : lentement mais sûrement !`,
      })
    }
  }

  // 4. Remontada de Noël (strong finish on the last 3 questions)
  const finisher = [...players]
    .filter((p) => p.lateGameScore > 0)
    .sort((a, b) => b.lateGameScore - a.lateGameScore)[0]
  if (finisher && finisher.lateGameScore >= 600) {
    awards.push({
      id: 'finisher',
      emoji: '🔥',
      title: 'Sprint Final à Heathrow',
      winnerName: finisher.displayName,
      winnerCharacter: finisher.characterName,
      winnerAvatarUrl: finisher.avatarUrl,
      description: `A tout donné dans le money-time avec ${finisher.lateGameScore} pts engrangés sur les 3 dernières manches !`,
    })
  }

  // 5. Cœur Vaillant de Karen (encouragement award for a player outside top 1)
  if (players.length >= 3) {
    const brave = players[players.length - 1]
    if (brave) {
      awards.push({
        id: 'brave',
        emoji: '💝',
        title: 'Cœur Vaillant de Noël',
        winnerName: brave.displayName,
        winnerCharacter: brave.characterName,
        winnerAvatarUrl: brave.avatarUrl,
        description: `N'a jamais lâché sa manette malgré les pièges (${brave.answeredCount} manches jouées) : la revanche sera terrible !`,
      })
    }
  }

  return {
    headline,
    chronicle: parts.join(' '),
    awards: awards.slice(0, 4),
    hardestQuestionText: hardestQ?.body ?? null,
    hardestQuestionSuccessPct: hardestQ?.pct ?? null,
    source: 'deterministic',
  }
}

async function tryGenerateGeminiChronicle(
  quizName: string,
  players: PlayerComputedStats[],
  awards: GameAward[],
  hardestQ: { body: string; pct: number } | null,
  totalQuestions: number
): Promise<{ headline: string; chronicle: string } | null> {
  const env = process.env
  const apiKey = (
    env['GEMINI_API_KEY'] ||
    env['GOOGLE_API_KEY'] ||
    env['NEXT_PUBLIC_GEMINI_API_KEY'] ||
    ''
  ).trim()

  if (!apiKey) return null

  const summaryLines = players.map(
    (p) =>
      `- #${p.rank} ${p.displayName} (Avatar Love Actually: ${p.characterName || 'Aucun'}) : ${p.totalScore} pts, ${p.correctCount}/${totalQuestions} bonnes réponses, série max ${p.maxStreak}, pic vitesse ${p.bestSingleScore} pts`
  )

  const awardsLines = awards.map(
    (a) => `- ${a.emoji} ${a.title} attribué à ${a.winnerName} (${a.description})`
  )

  const prompt = `Tu es le présentateur survolté, drôle et bienveillant d'une soirée Quiz & Blind Test entre amis sur le thème de "Love Actually".
Voici les résultats réels de la partie sur le pack "${quizName}" (${totalQuestions} questions) :

Classement :
${summaryLines.join('\n')}

Trophées spéciaux :
${awardsLines.join('\n')}
${hardestQ ? `Question la plus difficile : "${hardestQ.body}" (${hardestQ.pct}% de réussite).` : ''}

Rédige en français un JSON strict avec 2 clés :
- "headline": Un titre accrocheur et fun avec un emoji (max 90 caractères).
- "chronicle": Un débrief humoristique, chaleureux et rythmé de 3 à 4 phrases maximum qui commente le podium, taquine gentiment les joueurs en faisant des clins d'œil aux personnages de Love Actually qu'ils ont choisis comme avatars, et mentionne un fait marquant de la partie.

Réponds UNIQUEMENT avec l'objet JSON valide, sans balises markdown.`

  const models = [
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash',
  ]
  for (const model of models) {
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
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 450,
              responseMimeType: 'application/json',
            },
          }),
          signal: controller.signal,
        }
      )
      clearTimeout(timer)
      if (!res.ok) continue
      const data = await res.json()
      const rawText: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!rawText) continue
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/```$/i, '')
        .trim()
      const parsed = JSON.parse(cleaned)
      if (
        typeof parsed?.headline === 'string' &&
        typeof parsed?.chronicle === 'string' &&
        parsed.chronicle.length > 20
      ) {
        return {
          headline: parsed.headline.trim(),
          chronicle: parsed.chronicle.trim(),
        }
      }
    } catch {
      // Continue to fallback model or deterministic fallback
    }
  }
  return null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const gameId: string | undefined = body?.gameId
    if (!gameId) {
      return NextResponse.json({ error: 'Missing gameId' }, { status: 400 })
    }

    const env = process.env
    const supabaseUrl = (
      env['SUPABASE_URL'] ||
      env['NEXT_PUBLIC_SUPABASE_URL'] ||
      ''
    ).trim()
    const supabaseKey = (
      env['SUPABASE_SERVICE_ROLE_KEY'] ||
      env['SUPABASE_ANON_KEY'] ||
      env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
      ''
    ).trim()

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const [gameRes, participantsRes, resultsRes] = await Promise.all([
      supabase.from('quiz_games').select('*, quiz_sets(*)').eq('id', gameId).single(),
      supabase.from('quiz_participants').select('*').eq('game_id', gameId),
      supabase
        .from('quiz_game_results')
        .select('*')
        .eq('game_id', gameId)
        .order('total_score', { ascending: false }),
    ])

    const quizSetId = gameRes.data?.quiz_set_id
    const quizName = (gameRes.data as any)?.quiz_sets?.name || 'Quiz Love Actually'

    let questions: { id: string; body: string; order: number }[] = []
    if (quizSetId) {
      const { data: qData } = await supabase
        .from('quiz_questions')
        .select('id, body, order')
        .eq('quiz_set_id', quizSetId)
        .order('order', { ascending: true })
      questions = qData ?? []
    }

    const participants = participantsRes.data ?? []
    const participantMap = new Map(participants.map((p: any) => [p.id, p]))
    const results = resultsRes.data ?? []

    const cacheKey = `${gameId}_${results.length}_${results.reduce((s: number, r: any) => s + (r.total_score || 0), 0)}`
    const cached = analysisCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const participantIdsList = participants.map((p: any) => p.id)
    let gameAnswers: any[] = []
    if (participantIdsList.length > 0) {
      const { data: ansData } = await supabase
        .from('quiz_answers')
        .select('*')
        .in('participant_id', participantIdsList)
      gameAnswers = ansData ?? []
    }

    const totalQuestions = Math.max(questions.length, 1)
    const lastThreeQuestionIds = new Set(questions.slice(-3).map((q) => q.id))

    const playerStats: PlayerComputedStats[] = results.map((r: any, idx: number) => {
      const pRow = participantMap.get(r.participant_id)
      const identity = getParticipantIdentity({
        nickname: r.nickname ?? pRow?.nickname,
        avatar_id: r.avatar_id ?? pRow?.avatar_id,
      })

      const myAnswers = gameAnswers.filter(
        (a: any) => a.participant_id === r.participant_id
      )
      const correctAnswers = myAnswers.filter((a: any) => (a.score ?? 0) > 0)
      const bestSingleScore = correctAnswers.reduce(
        (max: number, a: any) => Math.max(max, a.score ?? 0),
        0
      )
      const avgSpeedScore =
        correctAnswers.length > 0
          ? Math.round(
              correctAnswers.reduce((s: number, a: any) => s + (a.score ?? 0), 0) /
                correctAnswers.length
            )
          : 0

      // Compute max streak across ordered questions
      const answerByQ = new Map(myAnswers.map((a: any) => [a.question_id, a]))
      let currentStreak = 0
      let maxStreak = 0
      for (const q of questions) {
        const ans = answerByQ.get(q.id)
        if (ans && (ans.score ?? 0) > 0) {
          currentStreak += 1
          if (currentStreak > maxStreak) maxStreak = currentStreak
        } else {
          currentStreak = 0
        }
      }

      const lateGameScore = myAnswers
        .filter((a: any) => lastThreeQuestionIds.has(a.question_id))
        .reduce((s: number, a: any) => s + (a.score ?? 0), 0)

      return {
        participantId: r.participant_id,
        displayName: identity.displayName,
        characterName: identity.characterName,
        avatarId: identity.avatarId,
        avatarUrl: identity.avatar?.imageUrl ?? null,
        totalScore: r.total_score ?? 0,
        rank: idx + 1,
        answeredCount: myAnswers.length,
        correctCount: correctAnswers.length,
        accuracyPct: Math.round((correctAnswers.length / totalQuestions) * 100),
        bestSingleScore,
        avgSpeedScore,
        maxStreak,
        lateGameScore,
      }
    })

    // Find hardest question
    let hardestQ: { body: string; pct: number } | null = null
    if (questions.length > 0 && participants.length > 0) {
      let minPct = 101
      for (const q of questions) {
        const qAnswers = gameAnswers.filter((a: any) => a.question_id === q.id)
        if (qAnswers.length === 0) continue
        const qCorrect = qAnswers.filter((a: any) => (a.score ?? 0) > 0).length
        const pct = Math.round((qCorrect / Math.max(participants.length, 1)) * 100)
        if (pct < minPct) {
          minPct = pct
          hardestQ = { body: q.body, pct }
        }
      }
    }

    const baseAnalysis = buildDeterministicAnalysis(
      quizName,
      playerStats,
      hardestQ,
      totalQuestions
    )

    const geminiOut = await tryGenerateGeminiChronicle(
      quizName,
      playerStats,
      baseAnalysis.awards,
      hardestQ,
      totalQuestions
    )

    const finalPayload: GameAnalysisPayload = geminiOut
      ? {
          ...baseAnalysis,
          headline: geminiOut.headline,
          chronicle: geminiOut.chronicle,
          source: 'gemini',
        }
      : baseAnalysis

    analysisCache.set(cacheKey, finalPayload)
    return NextResponse.json(finalPayload)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal error' },
      { status: 500 }
    )
  }
}
