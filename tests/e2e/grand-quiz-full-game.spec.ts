import { test } from '@playwright/test'
import { runFullGame, type PlayerAction, type PlayerKey, type RoundScenario } from './full-game'

/**
 * E2E « vraie soirée » sur le Grand Quiz Love Actually (15 manches actives, Décisions D31, D38).
 *
 * Même moteur que le Warm-Up (1 TV + 4 manettes sur la vraie base), sur toutes
 * les manches du pack : images, 3 Blind Tests, 3 extraits YouTube. À chaque
 * manche, la TV doit porter le bon média (extrait calé, bande-son, image
 * chargée) et les manettes n'afficher que la question et les réponses.
 */

type Actions = Record<PlayerKey, PlayerAction | null>

/** Manche « tout le monde répond vite » : révélation automatique dès la 4e réponse */
const quick = (label: string, actions: Actions): RoundScenario => ({ label, reveal: 'auto', actions })

const SCENARIO: RoundScenario[] = [
  quick('Manche 1 — image, tout le monde répond → révélation automatique', {
    titou: { at: 500, pick: 'correct' },
    chloe: { at: 1200, pick: 'correct' },
    sam: { at: 2000, pick: 'correct' },
    max: { at: 2600, pick: 'wrong' },
  }),
  quick('Manche 2 — Blind Test Jump', {
    titou: { at: 800, pick: 'correct' },
    chloe: { at: 1500, pick: 'correct' },
    sam: { at: 3000, pick: 'wrong' },
    max: { at: 2200, pick: 'correct' },
  }),
  {
    label: 'Manche 3 — extrait Billy Mack joué en entier, un absent, réponse au buzzer',
    reveal: 'timer',
    actions: {
      titou: { at: 25_000, pick: 'correct' },
      chloe: { at: 8000, pick: 'wrong' },
      sam: null,
      max: { at: 28_000, pick: 'correct', lastSecond: true },
    },
  },
  quick('Manche 4 — question éclair (20 s)', {
    titou: { at: 1000, pick: 'correct' },
    chloe: { at: 700, pick: 'correct' },
    sam: { at: 1800, pick: 'correct' },
    max: { at: 3500, pick: 'wrong' },
  }),
  quick('Manche 5 — Blind Test Both Sides Now', {
    titou: { at: 2500, pick: 'wrong' },
    chloe: { at: 900, pick: 'correct' },
    sam: { at: 1600, pick: 'correct' },
    max: { at: 3200, pick: 'correct' },
  }),
  {
    label: "Manche 6 — Blind Test Bye Bye Baby, l'hôte révèle en avance, un retardataire bloqué",
    reveal: 'host',
    hostRevealAt: 10_000,
    actions: {
      titou: { at: 1500, pick: 'correct' },
      chloe: { at: 4000, pick: 'wrong' },
      sam: { at: 6000, pick: 'correct' },
      max: { at: 14_000, pick: 'correct', expectBlocked: true },
    },
  },
  {
    label: 'Manche 7 — extrait des pancartes, rechargement de manette après réponse',
    reveal: 'timer',
    actions: {
      titou: { at: 20_000, pick: 'correct' },
      chloe: null,
      sam: { at: 12_000, pick: 'correct', reloadAfter: true },
      max: { at: 5000, pick: 'wrong' },
    },
  },
  quick('Manche 8 — image Milwaukee', {
    titou: { at: 1100, pick: 'wrong' },
    chloe: { at: 2100, pick: 'correct' },
    sam: { at: 600, pick: 'correct' },
    max: { at: 2900, pick: 'correct' },
  }),
  quick('Manche 9 — image Milwaukee (accent)', {
    titou: { at: 1300, pick: 'correct' },
    chloe: { at: 2400, pick: 'wrong' },
    sam: { at: 3100, pick: 'correct' },
    max: { at: 800, pick: 'correct' },
  }),
  quick('Manche 10 — question éclair (20 s)', {
    titou: { at: 600, pick: 'correct' },
    chloe: { at: 1000, pick: 'correct' },
    sam: { at: 1400, pick: 'correct' },
    max: { at: 1800, pick: 'correct' },
  }),
  quick('Manche 11 — image', {
    titou: { at: 2000, pick: 'correct' },
    chloe: { at: 1500, pick: 'wrong' },
    sam: { at: 2500, pick: 'wrong' },
    max: { at: 3000, pick: 'correct' },
  }),
  quick('Manche 12 — question éclair (20 s)', {
    titou: { at: 900, pick: 'wrong' },
    chloe: { at: 1700, pick: 'correct' },
    sam: { at: 2300, pick: 'correct' },
    max: { at: 1200, pick: 'correct' },
  }),
  quick('Manche 13 — question éclair (20 s)', {
    titou: { at: 1500, pick: 'correct' },
    chloe: { at: 600, pick: 'correct' },
    sam: { at: 3300, pick: 'wrong' },
    max: { at: 2700, pick: 'correct' },
  }),
  quick('Manche 14 — image Rufus', {
    titou: { at: 1200, pick: 'correct' },
    chloe: { at: 2200, pick: 'correct' },
    sam: { at: 800, pick: 'wrong' },
    max: { at: 3400, pick: 'correct' },
  }),
  {
    label: "Manche 15 — dernière question, extrait de l'emballage en entier, un absent, réponse à 26 s",
    reveal: 'timer',
    actions: {
      titou: null,
      chloe: { at: 15_000, pick: 'correct' },
      sam: { at: 22_000, pick: 'wrong' },
      max: { at: 26_000, pick: 'correct', lastSecond: true },
    },
  },
]

test('Grand Quiz Love Actually : 15 manches à 4 joueurs jusqu’au podium et à l’analyse', async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(25 * 60 * 1000)
  await runFullGame(browser, baseURL, 'Love Actually — Le Grand Quiz', SCENARIO, {
    lightCount: Number(process.env.E2E_LIGHT) || 0,
  })
})
