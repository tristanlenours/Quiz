import { getParticipantIdentity } from '@/avatars'
import { supabase } from '@/types/types'

/**
 * Tableau des scores d'un pack (D63, D65).
 *
 * - Les parties training ne sont jamais lues.
 * - Live : chaque joueur d'une partie terminée est classé.
 * - Solo : seule la toute première tentative d'une personne compte, et seulement si elle
 *   est allée au bout. Une personne = un appareil (`client_session_id`) ou un prénom saisi.
 *   Une partie rejouée, ou une première partie abandonnée, n'est jamais classée.
 */

export type ScoreEntry = {
  gameId: string
  participantId: string
  nickname: string
  avatarId: string | null
  clientSessionId: string
  playMode: 'live' | 'solo'
  playedAt: string
  totalScore: number
  counted: boolean
  /** Pourquoi une partie solo n'est pas classée */
  reason?: 'replay' | 'unfinished'
}

type ParticipantRow = {
  id: string
  nickname: string
  avatar_id: string | null
  client_session_id: string
  created_at: string
  answers: { score: number | null }[] | null
}

type GameRow = {
  id: string
  created_at: string
  phase: string
  play_mode: 'live' | 'solo' | null
  participants: ParticipantRow[] | null
}

/** Prénom saisi, normalisé (casse, accents, espaces). Vide quand le joueur a gardé le nom du personnage. */
export function normalizedCustomName(nickname: string, avatarId?: string | null): string {
  const identity = getParticipantIdentity({ nickname, avatar_id: avatarId })
  if (!identity.hasCustomName && identity.avatar) return ''
  return identity.displayName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/** Fonction pure : applique les règles de classement aux parties lues en base (testée par `npm test`). */
export function rankPackGames(games: GameRow[]): ScoreEntry[] {
  const entries: ScoreEntry[] = []
  for (const game of games) {
    const playMode = game.play_mode === 'solo' ? 'solo' : 'live'
    for (const p of game.participants ?? []) {
      entries.push({
        gameId: game.id,
        participantId: p.id,
        nickname: p.nickname,
        avatarId: p.avatar_id,
        clientSessionId: p.client_session_id,
        playMode,
        playedAt: game.created_at,
        totalScore: (p.answers ?? []).reduce((sum, a) => sum + (a.score ?? 0), 0),
        counted: false,
        // Une partie live non terminée n'apparaît pas ; une solo non terminée garde sa trace
        reason: game.phase === 'result' ? undefined : 'unfinished',
      })
    }
  }

  const live = entries.filter((e) => e.playMode === 'live' && !e.reason)
  for (const e of live) e.counted = true

  const solos = entries
    .filter((e) => e.playMode === 'solo')
    .sort((a, b) => a.playedAt.localeCompare(b.playedAt))
  const seenSessions = new Set<string>()
  const seenNames = new Set<string>()
  for (const e of solos) {
    const name = normalizedCustomName(e.nickname, e.avatarId)
    const isReplay = seenSessions.has(e.clientSessionId) || (name !== '' && seenNames.has(name))
    seenSessions.add(e.clientSessionId)
    if (name) seenNames.add(name)
    if (isReplay) {
      e.reason = 'replay'
    } else if (!e.reason) {
      e.counted = true
    }
  }

  return [...live, ...solos].sort((a, b) => {
    if (a.counted !== b.counted) return a.counted ? -1 : 1
    return b.totalScore - a.totalScore
  })
}

export async function fetchPackScores(quizSetId: string): Promise<ScoreEntry[]> {
  const { data, error } = await supabase
    .from('quiz_games')
    .select(
      'id, created_at, phase, play_mode, participants:quiz_participants(id, nickname, avatar_id, client_session_id, created_at, answers:quiz_answers(score))'
    )
    .eq('quiz_set_id', quizSetId)
    .eq('is_training', false)
  if (error) throw new Error(error.message)
  return rankPackGames((data ?? []) as unknown as GameRow[])
}

/** Supprime les parties training de plus de 24 h (D64). Silencieux si la migration n'est pas jouée. */
export async function purgeStaleTrainingGames(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  await supabase
    .from('quiz_games')
    .delete()
    .eq('is_training', true)
    .lt('created_at', cutoff)
}
