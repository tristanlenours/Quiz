import { test, expect, devices, type Browser, type Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { rankPackGames } from '../../src/leaderboard'
import { computeAnswerScore } from '../../src/scoring'
import { expectHostMedia, expectVideoDuringReading, type Question } from './full-game'

/**
 * Partie solo à distance (D62 à D66) : écran unique sur téléphone, mot de passe,
 * cadencement et barème identiques au live, médias diffusés par l'écran, commentaire
 * individuel, et règle « seule la première partie compte ».
 */

for (const file of ['.env.local', '.env']) {
  const envPath = path.resolve(process.cwd(), file)
  if (!fs.existsSync(envPath)) continue
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

const db = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
)
const SOLO_PASSWORD =
  process.env.SOLO_PASSWORD?.trim() || process.env.SITE_PASSWORD?.trim() || 'Quiz007!'
const READING_MS = 5000
const TEMP_PACK_PREFIX = 'E2E solo'
const RESULT_LINE = /^(Exact ! \+\d+ pts|Dommage !|Temps écoulé !)$/

async function loadWarmup() {
  const { data, error } = await db
    .from('quiz_sets')
    .select('id, name, mode, avatar_theme, questions:quiz_questions(*, choices:quiz_choices(id, body, is_correct))')
    .ilike('name', '%Love Actually — Le Warm-Up%')
    .single()
  expect(error).toBeNull()
  const questions = ((data!.questions as unknown as (Question & { is_disabled?: boolean })[]) || [])
    .filter((q) => !q.is_disabled)
    .sort((a, b) => a.order - b.order)
  return { ...data!, questions }
}

/** Téléphone : `host` simule le Studio déverrouillé (training autorisé), sinon seul le mot de passe solo est connu */
async function phone(browser: Browser, unlock: 'host' | 'solo' | 'none') {
  const { defaultBrowserType: _ignored, ...pixel } = devices['Pixel 7']
  const context = await browser.newContext({ ...pixel, locale: 'fr-FR' })
  if (unlock !== 'none') {
    await context.addInitScript((mode: string) => {
      try {
        if (window.top !== window) return
        if (mode === 'host') window.sessionStorage.setItem('quiz_host_unlocked', '1')
        window.localStorage.setItem('quiz_solo_unlocked', '1')
      } catch {
        // frame tierce
      }
    }, unlock)
  }
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (err) => {
    if (/youtube\.com|ytimg\.com|googlevideo\.com/.test(err.stack || '')) return
    errors.push(`pageerror: ${err.message}`)
  })
  page.on('dialog', async (d) => {
    errors.push(`alert: ${d.message()}`)
    await d.dismiss().catch(() => {})
  })
  return { context, page, errors }
}

async function startSolo(page: Page, avatarName: string, nickname: string) {
  await page.locator('form button').filter({ has: page.locator(`img[alt="${avatarName}"]`) }).click()
  await page.getByPlaceholder(/^Ton prénom/).fill(nickname)
  await page.getByRole('button', { name: '🎬 Commencer' }).click()
}

async function latestSoloGame(quizSetId: string, training: boolean) {
  const { data } = await db
    .from('quiz_games')
    .select('id, play_mode, is_training, phase, participants:quiz_participants(id, nickname)')
    .eq('quiz_set_id', quizSetId)
    .eq('play_mode', 'solo')
    .eq('is_training', training)
    .order('created_at', { ascending: false })
    .limit(1)
  return data?.[0] as
    | { id: string; play_mode: string; is_training: boolean; phase: string; participants: { id: string }[] }
    | undefined
}

test('Classement solo : seule la première tentative d’une personne compte, si elle est terminée', () => {
  const game = (id: string, at: string, phase: string, mode: 'live' | 'solo', players: Array<[string, string, number[]]>) => ({
    id,
    created_at: at,
    phase,
    play_mode: mode,
    participants: players.map(([nickname, session, scores], i) => ({
      id: `${id}-p${i}`,
      nickname,
      avatar_id: null,
      client_session_id: session,
      created_at: at,
      answers: scores.map((score) => ({ score })),
    })),
  })
  const entries = rankPackGames([
    game('live1', '2026-11-01', 'result', 'live', [['[#sam]Titou', 'l1', [900, 800]], ['[#mia]Léa', 'l2', [500]]]),
    game('live2', '2026-11-02', 'quiz', 'live', [['[#mark]Jo', 'l3', [1000]]]),
    game('alice1', '2026-11-03', 'result', 'solo', [['[#karen]Alice', 'dev-a', [700]]]),
    game('alice2', '2026-11-04', 'result', 'solo', [['[#karen]Alice', 'dev-a', [2000]]]),
    game('alice3', '2026-11-05', 'result', 'solo', [['[#juliet]ALICE ', 'dev-z', [3000]]]),
    game('bob1', '2026-11-03', 'quiz', 'solo', [['[#harry]Bob', 'dev-b', [900]]]),
    game('bob2', '2026-11-06', 'result', 'solo', [['[#harry]Bob', 'dev-b', [1900]]]),
    game('anon1', '2026-11-07', 'result', 'solo', [['[#rufus]Rufus (Mr Bean)', 'dev-c', [400]]]),
    game('anon2', '2026-11-08', 'result', 'solo', [['[#rufus]Rufus (Mr Bean)', 'dev-d', [300]]]),
  ])
  const byGame = (id: string) => entries.find((e) => e.gameId === id)!
  expect(entries.filter((e) => e.counted).map((e) => e.gameId)).toEqual(['live1', 'alice1', 'live1', 'anon1', 'anon2'])
  expect(byGame('live1').totalScore).toBe(1700)
  expect(entries.some((e) => e.gameId === 'live2'), 'Partie live non terminée absente').toBe(false)
  expect(byGame('alice2').reason, 'Même appareil').toBe('replay')
  expect(byGame('alice3').reason, 'Même prénom, autre appareil').toBe('replay')
  expect(byGame('bob1').reason).toBe('unfinished')
  expect(byGame('bob2').reason, 'Une première partie abandonnée bloque les suivantes').toBe('replay')
  expect(byGame('anon2').counted, 'Sans prénom saisi, seul l’appareil compte').toBe(true)
  expect(byGame('live1').playMode).toBe('live')
  expect(byGame('alice1').playMode).toBe('solo')
})

test('Solo : mot de passe obligatoire, partagé avec le tableau des scores', async ({ browser }) => {
  const warmup = await loadWarmup()
  const { context, page, errors } = await phone(browser, 'none')
  try {
    await page.goto(`/solo/${warmup.id}`)
    await expect(page.getByRole('heading', { name: 'Quiz sur invitation' })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByRole('heading', { name: warmup.name })).toHaveCount(0)

    await page.getByPlaceholder('Mot de passe').fill('pas-le-bon')
    await page.getByRole('button', { name: 'Entrer' }).click()
    await expect(page.getByText('Mot de passe incorrect.')).toBeVisible()

    await page.getByPlaceholder('Mot de passe').fill(SOLO_PASSWORD)
    await page.getByRole('button', { name: 'Entrer' }).click()
    await expect(page.getByRole('heading', { name: warmup.name })).toBeVisible({ timeout: 15_000 })

    // Le training est réservé au Studio déverrouillé
    await page.goto(`/solo/${warmup.id}?training=1`)
    await expect(page.getByText(/Le training est réservé à l’organisateur|Le training est réservé à l'organisateur/)).toBeVisible({
      timeout: 15_000,
    })

    await page.goto(`/scores/${warmup.id}`)
    await expect(page.getByText('🏆 Tableau des scores')).toBeVisible({ timeout: 15_000 })
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
})

test('Solo training : partie complète du Warm-Up sur téléphone, rien n’est conservé', async ({ browser }) => {
  const warmup = await loadWarmup()
  const questions = warmup.questions
  const { context, page, errors } = await phone(browser, 'host')
  let gameId: string | undefined
  try {
    await page.goto(`/solo/${warmup.id}?training=1`)
    await expect(page.getByRole('heading', { name: warmup.name })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText('🧪 Training : cette partie ne sera ni classée ni conservée.')).toBeVisible()
    await startSolo(page, 'Natalie', 'Solène')

    await expect.poll(async () => (await latestSoloGame(warmup.id, true))?.participants?.length ?? 0, {
      timeout: 15_000,
    }).toBe(1)
    const game = (await latestSoloGame(warmup.id, true))!
    gameId = game.id
    const participantId = game.participants[0].id
    expect(game.phase).toBe('quiz')

    // Une manche à la réponse éclair, une fausse, une laissée au chrono, puis on recommence
    const plan: Array<{ pick: 'correct' | 'wrong' | 'none'; at: number }> = [
      { pick: 'correct', at: 1200 },
      { pick: 'wrong', at: 2500 },
      { pick: 'none', at: 0 },
      { pick: 'correct', at: 9000 },
      { pick: 'correct', at: 600 },
    ]
    const recorded: number[] = []
    let correctCount = 0

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const step = plan[i % plan.length]
      const durationMs = (q.audio_duration_sec || 30) * 1000
      await test.step(`Manche ${i + 1} — ${step.pick}`, async () => {
        const heading = page.getByRole('heading', { name: q.body, exact: true })
        await expect(heading).toBeVisible({ timeout: 10_000 })
        const shownAt = Date.now()
        await expect(
          page.getByText(new RegExp(`(Manche|Blind Test) ${i + 1}/${questions.length}$`))
        ).toBeVisible()
        for (const c of q.choices) {
          await expect(page.getByRole('button', { name: c.body, exact: true }), 'Choix affiché pendant la lecture').toHaveCount(0)
        }
        await expectVideoDuringReading(page, q)

        const firstChoice = page.getByRole('button', { name: q.choices[0].body, exact: true })
        await expect(firstChoice).toBeVisible({ timeout: READING_MS + 4000 })
        const choicesAt = Date.now()
        expect(choicesAt - shownAt, 'Lecture de 5 s avant les choix').toBeGreaterThan(READING_MS - 1200)
        expect(choicesAt - shownAt).toBeLessThan(READING_MS + 2500)

        // L'Écran Solo diffuse le média de la manche, comme la TV en live (D62)
        await expectHostMedia(page, q)

        const resultLine = page.getByText(RESULT_LINE)
        if (step.pick === 'none') {
          await expect(resultLine).toHaveText('Temps écoulé !', { timeout: durationMs + 6000 })
          expect(Date.now() - choicesAt, 'Pas de révélation avant la fin du chrono').toBeGreaterThan(durationMs - 1500)
        } else {
          const choice = q.choices.find((c) => c.is_correct === (step.pick === 'correct'))!
          await page.waitForTimeout(Math.max(0, choicesAt + step.at - Date.now()))
          await page.getByRole('button', { name: choice.body, exact: true }).click()
          await expect(resultLine).toBeVisible({ timeout: 5000 })
        }

        // Plus aucun bouton de réponse, bonne réponse marquée
        for (const c of q.choices) {
          await expect(page.getByRole('button', { name: c.body, exact: true })).toHaveCount(0)
        }
        const correctIdx = q.choices.findIndex((c) => c.is_correct)
        await expect(page.getByTestId(`solo-choice-tile-${correctIdx}`)).toContainText('✅')
        if (q.question_type === 'blind_test' && q.reveal_title) {
          await expect(page.getByText(q.reveal_title, { exact: true }).first()).toBeVisible()
        }

        // Vérité terrain : la base
        await expect
          .poll(async () => {
            const { data } = await db
              .from('quiz_answers')
              .select('score, choice_id')
              .eq('participant_id', participantId)
              .eq('question_id', q.id)
            return data?.length ?? 0
          }, { timeout: 8000 })
          .toBe(step.pick === 'none' ? 0 : 1)
        if (step.pick !== 'none') {
          const { data: row } = await db
            .from('quiz_answers')
            .select('score')
            .eq('participant_id', participantId)
            .eq('question_id', q.id)
            .single()
          if (step.pick === 'wrong') {
            expect(row!.score).toBe(0)
            await expect(resultLine).toHaveText('Dommage !')
          } else {
            const expected = computeAnswerScore(true, step.at, durationMs)
            expect(Math.abs(row!.score - expected), `Score ${row!.score} pour une réponse à ${step.at} ms`).toBeLessThanOrEqual(2)
            await expect(resultLine).toHaveText(`Exact ! +${row!.score} pts`)
            correctCount++
          }
          recorded.push(row!.score)
        }

        const isLast = i === questions.length - 1
        await page.getByRole('button', { name: isLast ? '🏆 Voir mon score' : 'Manche suivante →' }).click()
      })
    }

    await test.step('Score final, commentaire, et partie training supprimée', async () => {
      const total = recorded.reduce((s, v) => s + v, 0)
      await expect(page.getByText('Bravo Solène !')).toBeVisible({ timeout: 15_000 })
      await expect(page.getByTestId('solo-total-score')).toHaveText(`${total} pts`)
      await expect(page.getByTestId('solo-correct-count')).toHaveText(`${correctCount} / ${questions.length}`)
      await expect(page.getByTestId('solo-analysis').locator('h3')).toBeVisible({ timeout: 60_000 })
      await expect(page.getByTestId('solo-analysis').locator('h3')).not.toBeEmpty()
      await expect(page.getByText('🧪 Training : rien n’a été enregistré.').or(page.getByText("🧪 Training : rien n'a été enregistré."))).toBeVisible()
      await expect
        .poll(async () => (await db.from('quiz_games').select('id').eq('id', gameId!)).data?.length ?? -1, {
          message: 'La partie training est supprimée après le commentaire',
          timeout: 15_000,
        })
        .toBe(0)
    })

    expect(errors).toEqual([])
  } finally {
    await context.close()
    if (gameId) await db.from('quiz_games').delete().eq('id', gameId)
  }
})

test('Solo classé : la première partie est enregistrée, la suivante n’est pas classée', async ({ browser }) => {
  const warmup = await loadWarmup()
  // Pack temporaire de 2 manches sans vidéo : les vrais tableaux des scores ne bougent pas
  await db.from('quiz_sets').delete().like('name', `${TEMP_PACK_PREFIX}%`)
  const { data: set, error } = await db
    .from('quiz_sets')
    .insert({ name: `${TEMP_PACK_PREFIX} ${Date.now()}`, mode: warmup.mode, avatar_theme: warmup.avatar_theme })
    .select('id, name')
    .single()
  expect(error).toBeNull()
  const source = warmup.questions.filter((q) => !q.video_url).slice(0, 2)
  const questions: Question[] = []
  for (let order = 0; order < source.length; order++) {
    const { id: _id, choices, ...row } = source[order] as Question & { created_at?: string }
    delete (row as { created_at?: string }).created_at
    const { data: copy } = await db.from('quiz_questions').insert({ ...row, order, quiz_set_id: set!.id }).select().single()
    const { data: copied } = await db
      .from('quiz_choices')
      .insert(choices.map(({ body, is_correct }) => ({ body, is_correct, question_id: copy!.id })))
      .select('id, body, is_correct')
    questions.push({ ...copy!, choices: copied! })
  }

  const { context, page, errors } = await phone(browser, 'solo')
  const play = async (pick: 'correct' | 'wrong') => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const choice = q.choices.find((c) => c.is_correct === (pick === 'correct'))!
      await expect(page.getByRole('heading', { name: q.body, exact: true })).toBeVisible({ timeout: 10_000 })
      await page.getByRole('button', { name: choice.body, exact: true }).click({ timeout: READING_MS + 5000 })
      await expect(page.getByText(RESULT_LINE)).toBeVisible({ timeout: 5000 })
      await page.getByRole('button', { name: i === questions.length - 1 ? '🏆 Voir mon score' : 'Manche suivante →' }).click()
    }
  }

  try {
    await page.goto(`/solo/${set!.id}`)
    await expect(page.getByRole('heading', { name: set!.name })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByTestId('solo-previous-attempt')).toHaveCount(0)
    await startSolo(page, 'Juliet', 'Première')
    await play('correct')
    await expect(page.getByTestId('solo-ranking-status')).toHaveText('Score enregistré : 1ᵉʳ du classement.', { timeout: 15_000 })
    const first = await latestSoloGame(set!.id, false)
    expect(first?.phase).toBe('result')
    await expect(page.getByTestId('score-row')).toHaveCount(1)
    await expect(page.getByTestId('score-row')).toContainText('🏠 Solo')

    // Deuxième tentative depuis le même téléphone : prévenue, jouée, pas classée
    await page.goto(`/solo/${set!.id}`)
    await expect(page.getByTestId('solo-previous-attempt')).toBeVisible({ timeout: 30_000 })
    await startSolo(page, 'Mark', 'Deuxième')
    await play('wrong')
    await expect(page.getByTestId('solo-ranking-status')).toContainText('Partie rejouée', { timeout: 15_000 })

    await page.goto(`/scores/${set!.id}`)
    await expect(page.getByTestId('score-row')).toHaveCount(1, { timeout: 15_000 })
    await expect(page.getByTestId('score-row')).toContainText('Première')
    expect(errors).toEqual([])
  } finally {
    await context.close()
    await db.from('quiz_sets').delete().eq('id', set!.id)
  }
})
