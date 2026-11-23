/**
 * Barème d'une réponse (D82) : 0 si faux ; sinon 1000 points fixes, plus un bonus de rapidité
 * de 0 à 25 points (25 instantané, 0 au bout du chrono).
 *
 * Le nombre de bonnes réponses prime : sur un pack de 39 manches au plus, le bonus cumulé
 * (39 × 25 = 975) reste sous la valeur d'une bonne réponse, donc 11 bonnes réponses lentes
 * battent toujours 10 bonnes réponses instantanées. La vitesse ne départage qu'à nombre égal.
 * `npm test` refuse un pack actif trop long pour garder cette garantie.
 *
 * Partagé par la Manette live et l'Écran Solo pour que les scores restent comparables (D62).
 */
export const POINTS_PER_CORRECT = 1000
export const MAX_SPEED_BONUS = 25
/** Nombre de manches actives au-delà duquel la vitesse pourrait compenser une bonne réponse. */
export const MAX_QUESTIONS_FOR_CORRECT_FIRST = Math.ceil(POINTS_PER_CORRECT / MAX_SPEED_BONUS) - 1

export function computeAnswerScore(
  isCorrect: boolean,
  elapsedMs: number,
  durationMs: number
): number {
  if (!isCorrect) return 0
  const timeShare = Math.max(0, Math.min(elapsedMs / durationMs, 1))
  return POINTS_PER_CORRECT + Math.round((1 - timeShare) * MAX_SPEED_BONUS)
}

/** Part du chrono utilisée (0 → 1) retrouvée depuis le score d'une bonne réponse. */
export function timeShareFromScore(score: number): number {
  return Math.min(1, Math.max(0, (POINTS_PER_CORRECT + MAX_SPEED_BONUS - score) / MAX_SPEED_BONUS))
}
