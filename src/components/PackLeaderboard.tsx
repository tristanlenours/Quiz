'use client'

import { getParticipantIdentity } from '@/avatars'
import type { ScoreEntry } from '@/leaderboard'

const REASON_LABEL: Record<NonNullable<ScoreEntry['reason']>, string> = {
  replay: 'partie rejouée',
  unfinished: 'abandonnée en cours de route',
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return ''
  }
}

function EntryRow({
  entry,
  rank,
  highlight,
}: {
  entry: ScoreEntry
  rank?: number
  highlight: boolean
}) {
  const identity = getParticipantIdentity({
    nickname: entry.nickname,
    avatar_id: entry.avatarId,
  })
  return (
    <li
      data-testid="score-row"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
        highlight
          ? 'bg-rose-500/20 border-rose-400/60'
          : 'bg-slate-900/80 border-white/10'
      }`}
    >
      {rank !== undefined && (
        <span className="w-8 text-center font-black text-amber-300">
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
        </span>
      )}
      {identity.avatar ? (
        <img
          src={identity.avatar.imageUrl}
          alt={identity.avatar.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-rose-400/60 flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
          🎮
        </div>
      )}
      <div className="min-w-0 flex-1 text-left">
        <div className="text-sm font-black text-white truncate">
          {identity.displayName}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          {entry.playMode === 'solo' ? '🏠 Solo' : '🎉 Live'} ·{' '}
          {formatDate(entry.playedAt)}
          {identity.characterName ? ` · ${identity.characterName}` : ''}
          {entry.reason ? ` · ${REASON_LABEL[entry.reason]}` : ''}
        </div>
      </div>
      <span className="font-mono font-black text-indigo-300 flex-shrink-0">
        {entry.totalScore} pts
      </span>
    </li>
  )
}

/** Tableau des scores d'un pack : live et solo ensemble, mode affiché sur chaque ligne (D63). */
export function PackLeaderboard({
  entries,
  highlightGameId,
  showUncounted = false,
}: {
  entries: ScoreEntry[]
  highlightGameId?: string
  showUncounted?: boolean
}) {
  const counted = entries.filter((e) => e.counted)
  const uncounted = entries.filter((e) => !e.counted)

  return (
    <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 space-y-3 text-left">
      <div className="text-xs font-bold uppercase tracking-widest text-amber-300 text-center">
        🏆 Tableau des scores
      </div>
      {counted.length === 0 ? (
        <p className="text-sm text-slate-400 text-center">
          Aucun score enregistré pour l&apos;instant.
        </p>
      ) : (
        <ol className="space-y-2">
          {counted.map((entry, idx) => (
            <EntryRow
              key={entry.participantId}
              entry={entry}
              rank={idx + 1}
              highlight={entry.gameId === highlightGameId}
            />
          ))}
        </ol>
      )}
      {showUncounted && uncounted.length > 0 && (
        <details className="text-xs text-slate-400">
          <summary className="cursor-pointer font-semibold">
            Hors classement ({uncounted.length})
          </summary>
          <ol className="space-y-2 mt-2">
            {uncounted.map((entry) => (
              <EntryRow
                key={entry.participantId}
                entry={entry}
                highlight={entry.gameId === highlightGameId}
              />
            ))}
          </ol>
        </details>
      )}
    </div>
  )
}
