import {
  test,
  expect,
  devices,
  type Browser,
  type BrowserContext,
  type Locator,
  type Page,
} from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

/**
 * E2E « vraie soirée » sur le pack Warm-Up Love Actually (Décision D28).
 *
 * 1 Écran Hôte (TV, desktop) + 4 manettes mobiles, chacune dans son propre
 * contexte navigateur (localStorage isolé = 4 vrais téléphones), branchés sur
 * la vraie base Supabase. Le scénario mélange réponses éclair, réponses à la
 * dernière seconde, joueurs qui ne répondent pas, rechargement de page en
 * cours de manche et révélation anticipée par l'hôte, puis va jusqu'au podium
 * et à l'analyse de fin de partie. Chaque écran est confronté à la base.
 */

for (const file of ['.env.local', '.env']) {
  const envPath = path.resolve(process.cwd(), file)
  if (!fs.existsSync(envPath)) continue
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

const db = createClient(SUPABASE_URL, SUPABASE_KEY)

const SET_NAME_FRAGMENT = 'Love Actually — Le Warm-Up'
const CHOICE_REVEAL_MS = 5000
const PLAYER_COUNT = 4

type Choice = { id: string; body: string; is_correct: boolean }
type Question = {
  id: string
  order: number
  body: string
  question_type: string
  audio_duration_sec: number | null
  choices: Choice[]
}

type PlayerKey = 'titou' | 'chloe' | 'sam' | 'max'

type PlayerAction = {
  /** Délai (ms) après l'apparition des choix sur CETTE manette */
  at: number
  pick: 'correct' | 'wrong'
  /** Recharge la page juste après avoir répondu (téléphone qui se met en veille, etc.) */
  reloadAfter?: boolean
  /** La réponse arrive après la révélation : la manette doit l'empêcher */
  expectBlocked?: boolean
  /** Réponse au buzzer : elle peut légitimement passer ou être refusée, mais tout doit rester cohérent */
  lastSecond?: boolean
}

type RoundScenario = {
  label: string
  reveal: 'auto' | 'timer' | 'host'
  hostRevealAt?: number
  actions: Record<PlayerKey, PlayerAction | null>
}

const SCENARIO: RoundScenario[] = [
  {
    label: 'Manche 1 — tout le monde répond en 3 s → révélation automatique',
    reveal: 'auto',
    actions: {
      titou: { at: 400, pick: 'correct' },
      chloe: { at: 1500, pick: 'correct' },
      sam: { at: 2500, pick: 'correct' },
      max: { at: 900, pick: 'wrong' },
    },
  },
  {
    label: 'Manche 2 — Blind Test, un joueur ne répond pas → chrono complet de 30 s',
    reveal: 'timer',
    actions: {
      titou: { at: 800, pick: 'correct' },
      chloe: { at: 12_000, pick: 'correct' },
      sam: { at: 24_000, pick: 'wrong' },
      max: null,
    },
  },
  {
    label: 'Manche 3 — Vidéo, rechargement de manette et réponse au buzzer',
    reveal: 'timer',
    actions: {
      titou: { at: 27_000, pick: 'correct', lastSecond: true },
      chloe: null,
      sam: { at: 3000, pick: 'correct', reloadAfter: true },
      max: null,
    },
  },
  {
    label: "Manche 4 — l'hôte révèle en avance, un retardataire est bloqué",
    reveal: 'host',
    hostRevealAt: 12_000,
    actions: {
      titou: { at: 1000, pick: 'correct' },
      chloe: { at: 4000, pick: 'wrong' },
      sam: { at: 6000, pick: 'correct' },
      max: { at: 17_000, pick: 'correct', expectBlocked: true },
    },
  },
  {
    label: 'Manche 5 — tout le monde répond, le dernier à 26 s → révélation automatique',
    reveal: 'auto',
    actions: {
      titou: { at: 600, pick: 'correct' },
      chloe: { at: 5000, pick: 'correct' },
      sam: { at: 9000, pick: 'wrong' },
      max: { at: 26_000, pick: 'correct', lastSecond: true },
    },
  },
]

type Player = {
  key: PlayerKey
  nickname: string
  displayName: string
  avatarName: string
  context: BrowserContext
  page: Page
  participantId?: string
  errors: string[]
}

const PLAYER_DEFS: Array<Pick<Player, 'key' | 'nickname' | 'displayName' | 'avatarName'>> = [
  { key: 'titou', nickname: 'Titou', displayName: 'Titou', avatarName: 'Le Premier Ministre' },
  { key: 'chloe', nickname: 'Chloé', displayName: 'Chloé', avatarName: 'Natalie' },
  // Pas de surnom : le joueur prend le nom du personnage
  { key: 'sam', nickname: '', displayName: 'Sam', avatarName: 'Sam' },
  { key: 'max', nickname: 'Max', displayName: 'Max', avatarName: 'Rufus (Mr Bean)' },
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const sleepUntil = (t: number) => sleep(Math.max(0, t - Date.now()))

function log(msg: string) {
  // eslint-disable-next-line no-console
  console.log(`[e2e ${new Date().toISOString().slice(11, 23)}] ${msg}`)
}

function trackErrors(page: Page, sink: string[], label: string) {
  page.on('pageerror', (err) => {
    // Erreurs internes du lecteur YouTube embarqué (iframe tierce) : hors périmètre de l'appli
    if (/youtube\.com|ytimg\.com|googlevideo\.com/.test(err.stack || '')) return
    const stack = (err.stack || '').split('\n').slice(0, 3).join(' | ')
    sink.push(`[${label}] pageerror: ${err.message} @ ${stack}`)
  })
  page.on('dialog', async (dialog) => {
    sink.push(`[${label}] alert inattendue: ${dialog.message()}`)
    await dialog.dismiss().catch(() => {})
  })
}

async function newPlayerContext(browser: Browser) {
  const { defaultBrowserType: _ignored, ...pixel } = devices['Pixel 7']
  return browser.newContext({ ...pixel, locale: 'fr-FR' })
}

function choiceButton(page: Page, choice: Choice): Locator {
  return page.getByRole('button', { name: choice.body, exact: true })
}

async function fetchAnswers(questionId: string, participantIds: string[]) {
  const { data, error } = await db
    .from('quiz_answers')
    .select('participant_id, choice_id, score, created_at')
    .eq('question_id', questionId)
    .in('participant_id', participantIds)
  if (error) throw new Error(error.message)
  return data ?? []
}

async function fetchStandings(gameId: string) {
  const { data, error } = await db
    .from('quiz_game_results')
    .select()
    .eq('game_id', gameId)
    .order('total_score', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Array<{ participant_id: string; nickname: string; total_score: number }>
}

test('Warm-Up Love Actually : partie complète à 4 joueurs jusqu’au podium et à l’analyse', async ({
  browser,
  baseURL,
}) => {
  expect(SUPABASE_URL, 'SUPABASE_URL manquant (.env.local)').toBeTruthy()
  expect(SUPABASE_KEY, 'Clé Supabase manquante (.env.local)').toBeTruthy()

  const { data: sets, error: setErr } = await db
    .from('quiz_sets')
    .select('id, name, questions:quiz_questions(id, order, body, question_type, audio_duration_sec, choices:quiz_choices(id, body, is_correct))')
    .ilike('name', `%${SET_NAME_FRAGMENT}%`)
  expect(setErr).toBeNull()
  expect(sets?.length, 'Le pack Warm-Up doit exister en base').toBeGreaterThan(0)
  const quizSet = sets![0] as unknown as { id: string; name: string; questions: Question[] }
  const questions = [...quizSet.questions].sort((a, b) => a.order - b.order)
  expect(questions).toHaveLength(SCENARIO.length)

  const errors: string[] = []
  const timeline: Array<Record<string, unknown>> = []
  let gameId: string | undefined
  const contexts: BrowserContext[] = []

  try {
    // ───────────────────────── Studio Hôte → lancement ─────────────────────────
    const hostContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'fr-FR',
    })
    contexts.push(hostContext)
    await hostContext.addInitScript((appOrigin: string) => {
      // Uniquement le document principal (pas l'iframe YouTube, cross-origin)
      try {
        if (window.top !== window || location.origin !== appOrigin) return
        window.sessionStorage.setItem('quiz_host_unlocked', '1')
      } catch {
        // frame sandboxée : rien à faire
      }
    }, new URL(baseURL!).origin)
    const dashboard = await hostContext.newPage()
    trackErrors(dashboard, errors, 'dashboard')

    const host = await test.step('L’hôte lance le Warm-Up depuis le Studio', async () => {
      await dashboard.goto('/host/dashboard')
      const card = dashboard
        .locator('div')
        .filter({ hasText: quizSet.name })
        .filter({ has: dashboard.getByRole('button', { name: '▶ Lancer la partie' }) })
        .last()
      const popup = hostContext.waitForEvent('page')
      await card.getByRole('button', { name: '▶ Lancer la partie' }).click()
      const hostPage = await popup
      trackErrors(hostPage, errors, 'hôte')
      await hostPage.waitForURL(/\/host\/game\/[0-9a-f-]+/)
      gameId = hostPage.url().match(/\/host\/game\/([0-9a-f-]+)/)![1]
      log(`partie créée ${gameId}`)
      await expect(hostPage.getByRole('heading', { name: quizSet.name })).toBeVisible({ timeout: 30_000 })
      await expect(hostPage.getByText('0 / 15 joueurs')).toBeVisible()
      const joinUrl = `${baseURL}/game/${gameId}`
      await expect(hostPage.getByText(joinUrl)).toBeVisible()
      return hostPage
    })

    // ───────────────────────── Arrivée des 4 joueurs ─────────────────────────
    const players: Player[] = []
    for (const def of PLAYER_DEFS) {
      const context = await newPlayerContext(browser)
      contexts.push(context)
      const page = await context.newPage()
      const player: Player = { ...def, context, page, errors }
      trackErrors(page, errors, def.displayName)
      players.push(player)
    }
    const byKey = (k: PlayerKey) => players.find((p) => p.key === k)!

    const join = async (player: Player) => {
      const { page } = player
      await page.goto(`/game/${gameId}`)
      const avatarBtn = page
        .locator('button')
        .filter({ has: page.locator(`img[alt="${player.avatarName}"]`) })
      await expect(avatarBtn).toBeEnabled({ timeout: 30_000 })
      await avatarBtn.click()
      if (player.nickname) {
        await page.getByPlaceholder(/^Ex:/).fill(player.nickname)
      }
      await page.getByRole('button', { name: /Rejoindre en tant que/ }).click()
      await expect(page.getByRole('button', { name: /Changer de personnage/ })).toBeVisible({
        timeout: 15_000,
      })
      await expect(page.getByRole('heading', { name: player.displayName, exact: true })).toBeVisible()
    }

    await test.step('Titou rejoint en Premier Ministre', async () => {
      await join(byKey('titou'))
    })

    await test.step('Chloé voit le Premier Ministre verrouillé et prend Natalie', async () => {
      const chloe = byKey('chloe')
      await chloe.page.goto(`/game/${gameId}`)
      const pmBtn = chloe.page
        .locator('button')
        .filter({ has: chloe.page.locator('img[alt="Le Premier Ministre"]') })
      await expect(pmBtn).toBeDisabled({ timeout: 15_000 })
      await expect(pmBtn).toContainText('Pris par Titou')
      await join(chloe)
    })

    await test.step('Sam (sans surnom) et Max rejoignent en même temps', async () => {
      await Promise.all([join(byKey('sam')), join(byKey('max'))])
    })

    await test.step('Le salon affiche les 4 joueurs côté hôte et côté manettes', async () => {
      await expect(host.getByText(`${PLAYER_COUNT} / 15 joueurs`)).toBeVisible({ timeout: 10_000 })
      for (const p of players) {
        await expect(host.getByText(p.displayName, { exact: true }).first()).toBeVisible()
        await expect(p.page.getByText(`${PLAYER_COUNT} joueurs prêts`)).toBeVisible({ timeout: 10_000 })
      }
      const { data: dbParticipants } = await db
        .from('quiz_participants')
        .select('id, nickname, client_session_id')
        .eq('game_id', gameId!)
      expect(dbParticipants).toHaveLength(PLAYER_COUNT)
      const sessionIds = new Set(dbParticipants!.map((p) => p.client_session_id))
      expect(sessionIds.size, 'Chaque téléphone doit avoir sa propre session').toBe(PLAYER_COUNT)
      for (const p of players) {
        const row = dbParticipants!.find((r) => r.nickname.endsWith(`]${p.displayName}`))
        expect(row, `Participant ${p.displayName} en base`).toBeTruthy()
        p.participantId = row!.id
      }
    })

    const participantIds = players.map((p) => p.participantId!)

    // ───────────────────────── Les 5 manches ─────────────────────────
    let advance: () => Promise<void> = async () => {
      await host.getByRole('button', { name: /Démarrer la partie \(4\)/ }).click()
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const round = SCENARIO[i]
      const correct = q.choices.find((c) => c.is_correct)!
      const wrong = q.choices.find((c) => !c.is_correct)!
      const durationMs = (q.audio_duration_sec || 30) * 1000
      const isLast = i === questions.length - 1

      await test.step(round.label, async () => {
        // 1. Passage à la manche : tous les écrans doivent suivre en quelques secondes
        const tAdvance = Date.now()
        await advance()
        const heading = (page: Page) => page.getByRole('heading', { name: q.body, exact: true })
        const headingAt: Partial<Record<PlayerKey | 'host', number>> = {}
        await Promise.all([
          expect(heading(host))
            .toBeVisible({ timeout: 8000 })
            .then(() => (headingAt.host = Date.now())),
          ...players.map((p) =>
            expect(heading(p.page))
              .toBeVisible({ timeout: 8000 })
              .then(() => (headingAt[p.key] = Date.now()))
          ),
        ])
        // Cadencement : la nouvelle manche arrive quasi simultanément partout
        for (const p of players) {
          expect(
            headingAt[p.key]! - tAdvance,
            `Délai d'arrivée de la manche ${i + 1} sur la manette de ${p.displayName}`
          ).toBeLessThan(3500)
        }
        log(`${round.label} — tous les écrans affichent la question (${Date.now() - tAdvance} ms)`)

        // Pendant la phase de lecture : décompte visible, AUCUN choix affiché nulle part
        for (const c of q.choices) {
          for (const p of players) {
            await expect(choiceButton(p.page, c), `Choix affiché trop tôt sur ${p.displayName}`).toHaveCount(0)
          }
        }
        await expect(host.getByText('Réponses', { exact: true })).toHaveCount(0)

        // Aucun résidu de la manche précédente (révélation, score) sur les manettes
        for (const p of players) {
          await expect(p.page.getByText(/^(Exact ! \+\d+ pts|Dommage !)$/)).toHaveCount(0)
          await expect(p.page.getByText('Réponse verrouillée')).toHaveCount(0)
        }

        // 2. Apparition synchronisée des choix (Décision D27)
        const hostCounter = host.getByText('Réponses', { exact: true }).locator('..')
        const choicesShownAt: Partial<Record<PlayerKey | 'host', number>> = {}
        await Promise.all([
          expect(hostCounter)
            .toBeVisible({ timeout: CHOICE_REVEAL_MS + 6000 })
            .then(() => (choicesShownAt.host = Date.now())),
          ...players.map((p) =>
            expect(choiceButton(p.page, q.choices[0]))
              .toBeVisible({ timeout: CHOICE_REVEAL_MS + 6000 })
              .then(() => (choicesShownAt[p.key] = Date.now()))
          ),
        ])
        const tHost = choicesShownAt.host!
        for (const p of players) {
          const drift = Math.abs(choicesShownAt[p.key]! - tHost)
          expect(drift, `Décalage d'affichage des choix hôte/${p.displayName}`).toBeLessThan(2500)
        }
        // Cadencement : 5 s de lecture sur chaque écran, ni plus ni moins
        for (const key of ['host', ...players.map((p) => p.key)] as const) {
          const reading = choicesShownAt[key]! - headingAt[key]!
          expect(reading, `Durée de lecture avant les choix (${key})`).toBeGreaterThan(CHOICE_REVEAL_MS - 1200)
          expect(reading, `Durée de lecture avant les choix (${key})`).toBeLessThan(CHOICE_REVEAL_MS + 2500)
        }

        // Les manettes guettent la révélation dès maintenant pour mesurer leur retard sur la TV
        const resultLine = (page: Page) => page.getByText(/^(Exact ! \+\d+ pts|Dommage !)$/)
        const revealSeenAt: Partial<Record<PlayerKey, number>> = {}
        const revealWatchers = players.map((p) =>
          expect(resultLine(p.page))
            .toBeVisible({ timeout: durationMs + 20_000 })
            .then(() => (revealSeenAt[p.key] = Date.now()))
        )

        // 3. Les joueurs jouent, l'hôte observe
        const answeredAt: Partial<Record<PlayerKey, number>> = {}
        const blockedAnswer: Partial<Record<PlayerKey, boolean>> = {}
        const revealButton = host.getByRole('button', {
          name: isLast ? '🏆 Voir le Podium Final' : 'Manche suivante →',
        })

        const playerTasks = players.map(async (p) => {
          const action = round.actions[p.key]
          if (!action) return
          const choice = action.pick === 'correct' ? correct : wrong
          await sleepUntil(choicesShownAt[p.key]! + action.at)
          const btn = choiceButton(p.page, choice)
          if (action.expectBlocked) {
            await expect(btn, `${p.displayName} ne doit plus pouvoir répondre après la révélation`).toHaveCount(0)
            blockedAnswer[p.key] = true
            return
          }
          try {
            await btn.click({ timeout: action.lastSecond ? 1500 : 5000 })
            answeredAt[p.key] = Date.now()
          } catch (e) {
            if (!action.lastSecond) throw e
            blockedAnswer[p.key] = true
            log(`${p.displayName} a raté le buzzer (bouton déjà retiré)`)
            return
          }
          await expect(p.page.getByText('Réponse verrouillée')).toBeVisible({ timeout: 5000 })

          if (action.reloadAfter) {
            await p.page.reload()
            await expect(heading(p.page)).toBeVisible({ timeout: 15_000 })
            await expect(p.page.getByText('Réponse verrouillée')).toBeVisible({ timeout: 8000 })
            // Une fois le décompte local écoulé, la manette ne doit PAS reproposer les choix
            await sleep(CHOICE_REVEAL_MS + 1000)
            for (const c of q.choices) {
              await expect(
                choiceButton(p.page, c),
                `${p.displayName} ne doit pas pouvoir re-répondre après un rechargement`
              ).toHaveCount(0)
            }
          }
        })

        const hostTask = (async () => {
          if (round.reveal === 'host') {
            await sleepUntil(tHost + round.hostRevealAt!)
            await host.getByRole('button', { name: '⏭️ Révéler maintenant' }).click()
            log("l'hôte révèle la réponse en avance")
          }
          await expect(revealButton).toBeVisible({ timeout: durationMs + 10_000 })
          return Date.now()
        })()

        const nonFinalActions = players.filter((p) => {
          const a = round.actions[p.key]
          return a && !a.lastSecond && !a.expectBlocked
        })

        // Compteur de réponses de l'hôte pendant la manche (avant révélation)
        if (round.reveal !== 'auto') {
          const lastNormalAt = Math.max(0, ...nonFinalActions.map((p) => round.actions[p.key]!.at))
          const checkAt = tHost + lastNormalAt + 2500
          const revealDeadline = round.reveal === 'host' ? tHost + round.hostRevealAt! : tHost + durationMs
          if (checkAt < revealDeadline - 1500) {
            await sleepUntil(checkAt)
            await expect(
              hostCounter,
              `Compteur hôte pendant la manche (${nonFinalActions.length} réponses attendues)`
            ).toContainText(`${nonFinalActions.length}/${PLAYER_COUNT}`, { timeout: 3000 })
          }
        }

        const [tReveal] = await Promise.all([hostTask, Promise.all(playerTasks)])
        const revealAfter = tReveal - tHost
        log(`${round.label} — révélation à ${revealAfter} ms après les choix`)

        if (round.reveal === 'auto') {
          const lastAnswer = Math.max(...Object.values(answeredAt).map(Number))
          expect(
            tReveal - lastAnswer,
            'Révélation automatique attendue dès que les 4 joueurs ont répondu'
          ).toBeLessThan(6000)
        } else if (round.reveal === 'timer') {
          expect(revealAfter, 'Pas de révélation prématurée avant la fin du chrono').toBeGreaterThan(durationMs - 2000)
          expect(revealAfter, 'Révélation à la fin du chrono').toBeLessThan(durationMs + 6000)
        } else {
          expect(revealAfter).toBeGreaterThan(round.hostRevealAt! - 500)
          expect(revealAfter).toBeLessThan(round.hostRevealAt! + 4000)
        }
        // Laisser passer d'éventuelles écritures en vol (réponse au buzzer)
        await sleep(1500)

        // 4. Vérité terrain : la base
        const answers = await fetchAnswers(q.id, participantIds)
        const answerOf = (p: Player) => answers.find((a) => a.participant_id === p.participantId)
        expect(
          new Set(answers.map((a) => a.participant_id)).size,
          'Une seule réponse par joueur et par manche'
        ).toBe(answers.length)

        for (const p of players) {
          const action = round.actions[p.key]
          const row = answerOf(p)
          if (!action || action.expectBlocked || blockedAnswer[p.key]) {
            expect(row, `${p.displayName} ne doit avoir aucune réponse enregistrée`).toBeUndefined()
            continue
          }
          expect(row, `Réponse de ${p.displayName} enregistrée`).toBeTruthy()
          const expectedChoice = action.pick === 'correct' ? correct : wrong
          expect(row!.choice_id).toBe(expectedChoice.id)
          if (action.pick === 'wrong') {
            expect(row!.score).toBe(0)
          } else {
            expect(row!.score).toBeGreaterThanOrEqual(500)
            expect(row!.score).toBeLessThanOrEqual(1000)
            // Barème linéaire 1000 → 500 sur la durée de la manche (marge pour la latence)
            const expectedScore = 1000 - Math.round((action.at / durationMs) * 500)
            expect(
              Math.abs(row!.score - expectedScore),
              `Score de ${p.displayName} (${row!.score}) cohérent avec un temps de réponse de ${action.at} ms`
            ).toBeLessThanOrEqual(40)
          }
        }

        // 5. Affichage de la réponse sur la TV : bonne réponse ✅, autres grisées ✖, histogramme = base
        for (let idx = 0; idx < q.choices.length; idx++) {
          const c = q.choices[idx]
          const tile = host.getByText(c.body, { exact: true }).locator('..')
          await expect(tile, `Tuile hôte « ${c.body} »`).toContainText(c.is_correct ? '✅' : '✖')
          if (c.is_correct) {
            await expect(tile).not.toHaveClass(/opacity-40/)
          } else {
            await expect(tile).toHaveClass(/opacity-40/)
          }
          const expectedCount = answers.filter((a) => a.choice_id === c.id).length
          await expect(
            host.getByTestId(`host-choice-count-${idx}`),
            `Histogramme hôte pour « ${c.body} »`
          ).toHaveText(String(expectedCount), { timeout: 5000 })
        }
        await expect(host.getByRole('button', { name: '⏭️ Révéler maintenant' })).toHaveCount(0)

        // 6. Affichage de la réponse sur les manettes : synchronisé avec la TV, plus aucun bouton
        await Promise.all(revealWatchers)
        for (const p of players) {
          expect(
            revealSeenAt[p.key]! - tReveal,
            `Retard de la révélation sur la manette de ${p.displayName} par rapport à la TV`
          ).toBeLessThan(2500)
          for (const c of q.choices) {
            await expect(choiceButton(p.page, c)).toHaveCount(0)
          }
        }
        timeline.push({
          manche: i + 1,
          mode: round.reveal,
          arriveeManche_ms: Object.fromEntries(
            Object.entries(headingAt).map(([k, t]) => [k, t! - tAdvance])
          ),
          lecture_ms: Object.fromEntries(
            Object.entries(choicesShownAt).map(([k, t]) => [k, t! - headingAt[k as PlayerKey | 'host']!])
          ),
          revelationApresChoix_ms: revealAfter,
          retardRevelationManettes_ms: Object.fromEntries(
            Object.entries(revealSeenAt).map(([k, t]) => [k, t! - tReveal])
          ),
        })

        // 7. Écran de révélation de chaque manette = la base
        const standings = await fetchStandings(gameId!)
        await Promise.all(
          players.map(async (p) => {
            const row = answerOf(p)
            const isCorrect = row ? row.choice_id === correct.id : false
            await expect(resultLine(p.page), `Écran de révélation de ${p.displayName}`).toHaveText(
              isCorrect ? `Exact ! +${row!.score} pts` : 'Dommage !',
              { timeout: 8000 }
            )
            const mine = standings.find((s) => s.participant_id === p.participantId)
            const total = mine?.total_score ?? 0
            await expect(
              p.page.getByText(`${total} pts`, { exact: true }).first(),
              `Score cumulé affiché sur la manette de ${p.displayName}`
            ).toBeVisible({ timeout: 8000 })
          })
        )

        // 8. Top 3 provisoire de l'hôte = la base
        if (standings.length > 0) {
          const top3 = host.getByText('🏆 Top 3 Provisoire').locator('..')
          await expect(top3).toBeVisible({ timeout: 8000 })
          for (const s of standings.slice(0, 3)) {
            await expect(top3).toContainText(`${s.total_score} pts`)
          }
        }
        log(
          `${round.label} — scores: ${standings
            .map((s) => `${s.nickname.replace(/^\[#[^\]]+\]/, '')}=${s.total_score}`)
            .join(', ')}`
        )

        advance = async () => {
          await revealButton.click()
        }
      })
    }

    // ───────────────────────── Podium & analyse ─────────────────────────
    await test.step('Podium final et analyse sur l’hôte et les 4 manettes', async () => {
      await advance()

      const { data: allAnswers } = await db
        .from('quiz_answers')
        .select('participant_id, score')
        .in('participant_id', participantIds)
      const standings = await fetchStandings(gameId!)

      expect(
        standings.map((s) => s.participant_id).sort(),
        'Les 4 joueurs doivent figurer au classement final'
      ).toEqual([...participantIds].sort())
      for (const s of standings) {
        const sum = (allAnswers ?? [])
          .filter((a) => a.participant_id === s.participant_id)
          .reduce((acc, a) => acc + (a.score ?? 0), 0)
        expect(s.total_score, `Total de ${s.nickname}`).toBe(sum)
      }

      // Hôte : podium, classement complet, débrief
      await expect(host.getByText('📊 Classement Général Complet')).toBeVisible({ timeout: 15_000 })
      const ranking = host.getByText('📊 Classement Général Complet').locator('..')
      for (const s of standings) {
        const name = s.nickname.replace(/^\[#[^\]]+\]/, '')
        await expect(ranking).toContainText(name)
        await expect(ranking).toContainText(String(s.total_score))
      }
      const rankingText = (await ranking.innerText()).replace(/\s+/g, ' ')
      const positions = standings.map((s) => rankingText.indexOf(s.nickname.replace(/^\[#[^\]]+\]/, '')))
      expect(positions, 'Ordre du classement hôte = ordre des scores').toEqual([...positions].sort((a, b) => a - b))

      const debrief = host.getByText('🎬 Le Débrief du Réalisateur & Trophées').locator('../..')
      await expect(debrief.locator('h3')).toBeVisible({ timeout: 90_000 })
      await expect(debrief.locator('h3')).not.toBeEmpty()
      await expect(host.getByText('🏅 Cérémonie des Awards Spéciaux')).toBeVisible()
      log(`débrief hôte: ${await debrief.locator('h3').innerText()}`)

      // Manettes : rang et score final de chacun
      await Promise.all(
        players.map(async (p) => {
          const idx = standings.findIndex((s) => s.participant_id === p.participantId)
          const mine = standings[idx]
          await expect(p.page.getByText(`Bravo ${p.displayName} !`)).toBeVisible({ timeout: 15_000 })
          await expect(p.page.getByText(`#${idx + 1} / ${PLAYER_COUNT}`)).toBeVisible({ timeout: 15_000 })
          await expect(p.page.getByText(`${mine.total_score} pts`, { exact: true }).first()).toBeVisible()
          await expect(p.page.getByText('📊 Classement Général Complet')).toBeVisible()
          await expect(
            p.page.getByText('🎬 Le Débrief du Réalisateur & Trophées').locator('../..').locator('h3')
          ).toBeVisible({ timeout: 90_000 })
        })
      )
    })

    expect(errors, 'Aucune erreur JS ni alerte sur les 5 écrans').toEqual([])
  } finally {
    if (timeline.length > 0) {
      log(`cadencement:
${JSON.stringify(timeline, null, 2)}`)
      await test.info().attach('cadencement.json', {
        body: JSON.stringify(timeline, null, 2),
        contentType: 'application/json',
      })
    }
    for (const ctx of contexts) await ctx.close().catch(() => {})
    if (gameId && !process.env.E2E_KEEP_GAME) {
      await db.from('quiz_games').delete().eq('id', gameId)
    }
  }
})
