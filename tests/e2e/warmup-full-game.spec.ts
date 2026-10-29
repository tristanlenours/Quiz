import { test } from '@playwright/test'
import { runFullGame, type RoundScenario } from './full-game'

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

test('Warm-Up Love Actually : partie complète à 4 joueurs jusqu’au podium et à l’analyse', async ({
  browser,
  baseURL,
}) => {
  await runFullGame(browser, baseURL, 'Love Actually — Le Warm-Up', SCENARIO)
})
