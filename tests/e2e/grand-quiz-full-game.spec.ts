import { test } from '@playwright/test'
import { runFullGame, type PlayerAction, type PlayerKey, type RoundScenario } from './full-game'

/**
 * E2E « vraie soirée » sur le Grand Quiz Love Actually (20 manches actives, Décisions D31, D38, D67 à D69).
 *
 * Même moteur que le Warm-Up (1 TV + 4 manettes sur la vraie base), sur toutes
 * les manches du pack : images, 2 Blind Tests, 5 extraits YouTube, des questions en texte seul. À chaque
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
  {
    label: "Manche 5 — Blind Test Bye Bye Baby, l'hôte révèle en avance, un retardataire bloqué",
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
    label: 'Manche 6 — extrait des pancartes, rechargement de manette après réponse',
    reveal: 'timer',
    actions: {
      titou: { at: 20_000, pick: 'correct' },
      chloe: null,
      sam: { at: 12_000, pick: 'correct', reloadAfter: true },
      max: { at: 5000, pick: 'wrong' },
    },
  },
  quick("Manche 7 — image Milwaukee (accent)", {
    titou: { at: 1100, pick: 'wrong' },
    chloe: { at: 2100, pick: 'correct' },
    sam: { at: 600, pick: 'correct' },
    max: { at: 2900, pick: 'correct' },
  }),
  quick("Manche 8 — question éclair (20 s)", {
    titou: { at: 1300, pick: 'correct' },
    chloe: { at: 2400, pick: 'wrong' },
    sam: { at: 3100, pick: 'correct' },
    max: { at: 800, pick: 'correct' },
  }),
  quick("Manche 9 — image", {
    titou: { at: 600, pick: 'correct' },
    chloe: { at: 1000, pick: 'correct' },
    sam: { at: 1400, pick: 'correct' },
    max: { at: 1800, pick: 'correct' },
  }),
  quick("Manche 10 — question éclair (20 s)", {
    titou: { at: 2000, pick: 'correct' },
    chloe: { at: 1500, pick: 'wrong' },
    sam: { at: 2500, pick: 'wrong' },
    max: { at: 3000, pick: 'correct' },
  }),
  quick("Manche 11 — extrait Rufus (végétal), tout le monde répond vite", {
    titou: { at: 900, pick: 'wrong' },
    chloe: { at: 1700, pick: 'correct' },
    sam: { at: 2300, pick: 'correct' },
    max: { at: 1200, pick: 'correct' },
  }),
  quick("Manche 12 — extrait de l'emballage (durée)", {
    titou: { at: 1500, pick: 'correct' },
    chloe: { at: 600, pick: 'correct' },
    sam: { at: 3300, pick: 'wrong' },
    max: { at: 2700, pick: 'correct' },
  }),
  quick("Manche 13 — image, la rue de Mia", {
    titou: { at: 1200, pick: 'correct' },
    chloe: { at: 2200, pick: 'correct' },
    sam: { at: 800, pick: 'wrong' },
    max: { at: 3400, pick: 'correct' },
  }),
  quick("Manche 14 — texte seul, la promesse de Billy Mack", {
    titou: { at: 1800, pick: 'wrong' },
    chloe: { at: 900, pick: 'correct' },
    sam: { at: 2600, pick: 'correct' },
    max: { at: 1300, pick: 'correct' },
  }),
  quick("Manche 15 — texte seul, le film de Daniel et Sam", {
    titou: { at: 700, pick: 'correct' },
    chloe: { at: 2800, pick: 'wrong' },
    sam: { at: 1500, pick: 'wrong' },
    max: { at: 2100, pick: 'correct' },
  }),
  quick("Manche 16 — texte seul, le chant de Noël de David", {
    titou: { at: 2400, pick: 'correct' },
    chloe: { at: 1100, pick: 'correct' },
    sam: { at: 600, pick: 'wrong' },
    max: { at: 3000, pick: 'wrong' },
  }),
  quick("Manche 17 — texte seul, Sarah et Karl", {
    titou: { at: 900, pick: 'correct' },
    chloe: { at: 1900, pick: 'wrong' },
    sam: { at: 2700, pick: 'correct' },
    max: { at: 1400, pick: 'correct' },
  }),
  quick("Manche 18 — texte seul, le surnom de Natalie", {
    titou: { at: 1600, pick: 'wrong' },
    chloe: { at: 800, pick: 'correct' },
    sam: { at: 2200, pick: 'correct' },
    max: { at: 3100, pick: 'correct' },
  }),
  quick("Manche 19 — texte seul, Daniel et la top model", {
    titou: { at: 1200, pick: 'correct' },
    chloe: { at: 2500, pick: 'correct' },
    sam: { at: 700, pick: 'wrong' },
    max: { at: 1900, pick: 'correct' },
  }),
  {
    label: 'Manche 20 — dernière question, extrait du discours de David en entier, un absent, réponse à 26 s',
    reveal: 'timer',
    actions: {
      titou: null,
      chloe: { at: 15_000, pick: 'correct' },
      sam: { at: 22_000, pick: 'wrong' },
      max: { at: 26_000, pick: 'correct', lastSecond: true },
    },
  },
]

test('Grand Quiz Love Actually : 20 manches à 4 joueurs jusqu’au podium et à l’analyse', async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(25 * 60 * 1000)
  await runFullGame(browser, baseURL, 'Love Actually — Le Grand Quiz', SCENARIO, {
    lightCount: Number(process.env.E2E_LIGHT) || 0,
  })
})
