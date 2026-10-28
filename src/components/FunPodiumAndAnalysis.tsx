'use client'

import { getParticipantIdentity } from '@/avatars'
import type { GameAnalysisPayload } from '@/app/api/game-analysis/route'
import { GameResult, Participant } from '@/types/types'
import { useEffect, useState } from 'react'

export function FunPodiumAndAnalysis({
  gameId,
  gameResults,
  participants,
  highlightParticipantId,
  compact = false,
}: {
  gameId: string
  gameResults: GameResult[]
  participants?: Participant[]
  highlightParticipantId?: string
  compact?: boolean
}) {
  const [analysis, setAnalysis] = useState<GameAnalysisPayload | null>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(true)

  useEffect(() => {
    if (gameResults.length === 0) return
    let cancelled = false
    setLoadingAnalysis(true)
    fetch('/api/game-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && !data.error) {
          setAnalysis(data)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingAnalysis(false)
      })

    return () => {
      cancelled = true
    }
  }, [gameId, gameResults.length])

  const participantById = new Map(
    (participants ?? []).map((p) => [p.id, p])
  )

  const resolveIdentity = (row: GameResult) => {
    const p = row.participant_id ? participantById.get(row.participant_id) : null
    return getParticipantIdentity({
      nickname: row.nickname ?? p?.nickname,
      avatar_id: (row as any).avatar_id ?? (p as any)?.avatar_id,
    })
  }

  const podiumSlots = [
    { idx: 1, medal: '🥈', label: '2e', heightClass: compact ? 'h-20' : 'h-28', ringClass: 'border-slate-300 shadow-slate-400/20', barClass: 'from-slate-600 to-slate-800 border-slate-400/40' },
    { idx: 0, medal: '👑', label: '1er', heightClass: compact ? 'h-28' : 'h-40', ringClass: 'border-amber-400 shadow-amber-500/40', barClass: 'from-amber-500 via-yellow-600 to-amber-800 border-amber-300' },
    { idx: 2, medal: '🥉', label: '3e', heightClass: compact ? 'h-16' : 'h-24', ringClass: 'border-amber-600 shadow-amber-700/20', barClass: 'from-amber-700 to-amber-950 border-amber-600/40' },
  ]

  return (
    <div className="w-full space-y-6">
      {/* 1. Podium Visuel Top 3 (2e, 1er, 3e) */}
      {gameResults.length > 0 && (
        <div className="max-w-3xl mx-auto pt-4 px-2">
          <div className="flex justify-center items-end gap-3 md:gap-6">
            {podiumSlots.map((slot) => {
              const row = gameResults[slot.idx]
              if (!row) return null
              const idInfo = resolveIdentity(row)
              const isWinner = slot.idx === 0
              const isMe =
                highlightParticipantId &&
                row.participant_id === highlightParticipantId

              return (
                <div
                  key={row.participant_id}
                  className="flex flex-col items-center flex-1 max-w-[220px]"
                >
                  {/* Médaillon Avatar */}
                  <div className="relative mb-2 flex flex-col items-center">
                    <span
                      className={`${
                        isWinner
                          ? 'text-3xl md:text-4xl animate-bounce'
                          : 'text-2xl'
                      } mb-1`}
                    >
                      {slot.medal}
                    </span>
                    {idInfo.avatar ? (
                      <div className="relative">
                        <img
                          src={idInfo.avatar.imageUrl}
                          alt={idInfo.avatar.name}
                          className={`${
                            isWinner
                              ? compact
                                ? 'w-20 h-20'
                                : 'w-24 h-24 md:w-28 md:h-28'
                              : compact
                              ? 'w-16 h-16'
                              : 'w-20 h-20 md:w-22 md:h-22'
                          } rounded-full object-cover border-4 ${
                            slot.ringClass
                          } shadow-2xl`}
                        />
                        <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border border-white/30 flex items-center justify-center text-sm shadow">
                          {idInfo.avatar.emoji}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`${
                          isWinner ? 'w-24 h-24' : 'w-20 h-20'
                        } rounded-full bg-slate-800 border-4 ${
                          slot.ringClass
                        } flex items-center justify-center text-3xl`}
                      >
                        🎮
                      </div>
                    )}
                  </div>

                  {/* Pseudo + Personnage */}
                  <div className="text-center mb-2 px-1 w-full">
                    <div
                      className={`font-black text-white truncate ${
                        isWinner ? 'text-base md:text-xl' : 'text-sm md:text-base'
                      }`}
                    >
                      {idInfo.displayName} {isMe && '⭐'}
                    </div>
                    {idInfo.characterName && (
                      <div className="text-[11px] font-bold text-rose-300 truncate">
                        {idInfo.characterName}
                      </div>
                    )}
                  </div>

                  {/* Marche du Podium */}
                  <div
                    className={`w-full ${slot.heightClass} rounded-t-2xl bg-gradient-to-b ${slot.barClass} border-t-2 border-x flex flex-col items-center justify-center p-2 shadow-2xl`}
                  >
                    <div className="text-xs font-black uppercase tracking-widest text-white/80">
                      {slot.label}
                    </div>
                    <div className="text-lg md:text-2xl font-mono font-black text-white">
                      {row.total_score}
                      <span className="text-xs font-normal ml-0.5">pts</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 2. Analyse Fun & Trophées Spéciaux (Gemini + Fallback déterministe — Décision D22) */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-rose-950/80 via-slate-900/95 to-indigo-950/80 border border-rose-400/30 rounded-3xl p-5 md:p-7 shadow-2xl text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
            🎬 Le Débrief du Réalisateur & Trophées
          </div>
          {analysis && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
              {analysis.source === 'gemini'
                ? '✨ Chronique générée par Gemini IA'
                : '🎄 Chronique Studio Love Actually'}
            </span>
          )}
        </div>

        {loadingAnalysis && !analysis ? (
          <div className="text-slate-300 text-sm animate-pulse py-4 text-center">
            ✨ Rédaction de la chronique humoristique et remise des trophées en
            cours...
          </div>
        ) : analysis ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-2">
                {analysis.headline}
              </h3>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-white/10">
                {analysis.chronicle}
              </p>
            </div>

            {analysis.awards.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-2.5">
                  🏅 Cérémonie des Awards Spéciaux
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.awards.map((award) => (
                    <div
                      key={award.id}
                      className="flex items-start gap-3 bg-slate-950/80 border border-white/10 p-3.5 rounded-2xl"
                    >
                      {award.winnerAvatarUrl ? (
                        <div className="relative flex-shrink-0">
                          <img
                            src={award.winnerAvatarUrl}
                            alt={award.winnerName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                          />
                          <span className="absolute -bottom-1 -right-1 text-sm bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center border border-amber-400/50">
                            {award.emoji}
                          </span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                          {award.emoji}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                          {award.emoji} {award.title}
                        </div>
                        <div className="text-sm font-black text-white">
                          {award.winnerName}{' '}
                          {award.winnerCharacter && (
                            <span className="text-xs font-semibold text-rose-300">
                              ({award.winnerCharacter})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5 leading-snug">
                          {award.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* 3. Classement Complet Illustré */}
      <div className="max-w-3xl mx-auto space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-2">
          📊 Classement Général Complet
        </div>
        {gameResults.map((gameResult, index) => {
          const idInfo = resolveIdentity(gameResult)
          const isMe =
            highlightParticipantId &&
            gameResult.participant_id === highlightParticipantId
          return (
            <div
              key={gameResult.participant_id}
              className={`flex justify-between items-center bg-slate-900/90 border py-3 px-4 md:px-6 rounded-2xl w-full transition ${
                isMe
                  ? 'border-rose-400 bg-rose-950/40 shadow-lg shadow-rose-500/20'
                  : index === 0
                  ? 'border-yellow-400/80 shadow-lg'
                  : index === 1
                  ? 'border-slate-300/60'
                  : index === 2
                  ? 'border-amber-600/60'
                  : 'border-white/10'
              }`}
            >
              <div className="pr-3 text-xl md:text-2xl font-black w-10 text-left">
                {index === 0
                  ? '🥇'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : `#${index + 1}`}
              </div>

              <div className="flex items-center gap-3 flex-grow min-w-0 text-left">
                {idInfo.avatar ? (
                  <img
                    src={idInfo.avatar.imageUrl}
                    alt={idInfo.avatar.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-rose-400/60 flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                    🎮
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-black text-base md:text-xl text-white truncate">
                    {idInfo.displayName} {isMe && '(Toi)'}
                  </div>
                  {idInfo.characterName && (
                    <div className="text-xs font-semibold text-rose-300 truncate">
                      {idInfo.avatar?.emoji} {idInfo.characterName}
                    </div>
                  )}
                </div>
              </div>

              <div className="pl-3 text-right flex-shrink-0">
                <span className="text-lg md:text-2xl font-mono font-black text-indigo-400">
                  {gameResult.total_score}
                </span>
                <span className="text-xs text-slate-400 ml-1">pts</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
