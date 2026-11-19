/**
 * Prénom ou pseudo du joueur, gardé dans un cookie (D72) : il est obligatoire pour rejoindre
 * un salon (quiz live, Downing Street Groove) ou lancer une partie solo, et pré-rempli
 * quand on enchaîne sur un autre jeu depuis le même téléphone.
 */
export const PLAYER_NAME_COOKIE = 'quiz_player_name'
export const PLAYER_NAME_MAX_LENGTH = 18
const ONE_YEAR_SEC = 365 * 24 * 3600

/** Nettoie une saisie : espaces superflus retirés, longueur bornée, préfixe d'avatar `[#id]` interdit. */
export function cleanPlayerName(raw: string): string {
  return raw
    .replace(/^\[#[^\]]*\]/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, PLAYER_NAME_MAX_LENGTH)
}

export function readSavedPlayerName(): string {
  if (typeof document === 'undefined') return ''
  try {
    const entry = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${PLAYER_NAME_COOKIE}=`))
    if (!entry) return ''
    return cleanPlayerName(decodeURIComponent(entry.slice(PLAYER_NAME_COOKIE.length + 1)))
  } catch {
    return ''
  }
}

export function savePlayerName(name: string): void {
  if (typeof document === 'undefined') return
  const clean = cleanPlayerName(name)
  if (!clean) return
  try {
    document.cookie = `${PLAYER_NAME_COOKIE}=${encodeURIComponent(clean)}; Max-Age=${ONE_YEAR_SEC}; Path=/; SameSite=Lax`
  } catch {
    // Cookies bloqués : le joueur ressaisira son prénom la prochaine fois
  }
}
