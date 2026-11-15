/**
 * Score de rapidité d'une réponse (0 à 1000 points par manche) :
 * 0 si faux, sinon 1000 dégressif jusqu'à 500 sur la durée de la manche.
 * Partagé par la Manette live et l'Écran Solo pour que les scores restent comparables (D62).
 */
export function computeAnswerScore(
  isCorrect: boolean,
  elapsedMs: number,
  durationMs: number
): number {
  if (!isCorrect) return 0
  return 1000 - Math.round(Math.max(0, Math.min(elapsedMs / durationMs, 1)) * 500)
}
