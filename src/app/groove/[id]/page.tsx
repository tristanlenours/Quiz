'use client'

import Lobby from '@/app/game/[id]/lobby'
import { getParticipantIdentity, preloadAvatarImages } from '@/avatars'
import {
  buildGrooveChronicle,
  computeGrooveTrophies,
  COUNTDOWN_DURATION_SEC,
  DoorState,
  FINISH_DISTANCE,
  GROOVE_SEQUENCE_MARKER,
  GroovePhase,
  RacerState,
  rankRacers,
  StepSide,
} from '@/groove'
import { getUniverseTheme } from '@/themes'
import { getClientSessionId, Participant, supabase } from '@/types/types'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function PlayerGroovePage({
  params: { id: gameId },
}: {
  params: { id: string }
}) {
  const theme = getUniverseTheme('love_actually')
  const [participant, setParticipant] = useState<Participant | null>(null)
  const participantRef = useRef<Participant | null>(null)
  participantRef.current = participant

  const [phase, setPhase] = useState<GroovePhase>('lobby')
  const [countdownSec, setCountdownSec] = useState<number>(
    COUNTDOWN_DURATION_SEC
  )
  const [doorState, setDoorState] = useState<DoorState>('dancing')
  const [remainingSec, setRemainingSec] = useState<number>(60)
  const [finalSprintRemainingSec, setFinalSprintRemainingSec] = useState<
    number | null
  >(null)
  const [racers, setRacers] = useState<RacerState[]>([])
  const [recentFlagText, setRecentFlagText] = useState<string | null>(null)
  const [lastLocalSide, setLastLocalSide] = useState<StepSide | null>(null)

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const stepSeqRef = useRef<number>(0)
  // Écart entre l'horloge de la TV et celle du téléphone : le gel est daté par la TV
  const hostClockOffsetRef = useRef<number>(0)

  useEffect(() => {
    preloadAvatarImages('love_actually')
  }, [])

  // Récupérer le participant existant et l'état de la partie en base
  const syncFromDatabase = useCallback(async () => {
    const sessionId = getClientSessionId()
    const { data: pList } = await supabase
      .from('quiz_participants')
      .select()
      .eq('game_id', gameId)
    if (pList) {
      const mine = pList.find((p) => p.client_session_id === sessionId)
      if (mine && !participantRef.current) {
        setParticipant(mine)
        participantRef.current = mine
      }
    }

    const { data: gData } = await supabase
      .from('quiz_games')
      .select('phase, current_question_sequence')
      .eq('id', gameId)
      .single()

    // Code d'une partie de quiz ouvert ici : manette du quiz live
    if (gData && gData.current_question_sequence !== GROOVE_SEQUENCE_MARKER) {
      window.location.replace(`/game/${gameId}`)
      return
    }

    if (gData && participantRef.current) {
      if (gData.phase === 'result') {
        setPhase('result')
      } else if (gData.phase === 'quiz') {
        setPhase((prev) => (prev === 'lobby' ? 'racing' : prev))
      } else if (gData.phase === 'lobby') {
        setPhase('lobby')
      }
    }
  }, [gameId])

  useEffect(() => {
    syncFromDatabase()

    const syncChannel = supabase
      .channel(`groove_sync_${gameId}`, {
        config: { broadcast: { ack: false, self: false } },
      })
      .on('broadcast', { event: 'groove_state' }, ({ payload }) => {
        if (!payload) return
        if (typeof payload.hostNowMs === 'number') {
          hostClockOffsetRef.current = payload.hostNowMs - Date.now()
        }
        if (participantRef.current && payload.phase) {
          if (payload.phase === 'countdown') setLastLocalSide(null)
          setPhase(payload.phase as GroovePhase)
        }
        if (typeof payload.countdownSec === 'number') {
          setCountdownSec(payload.countdownSec)
        }
        if (payload.doorState) {
          setDoorState(payload.doorState as DoorState)
        }
        if (typeof payload.remainingSec === 'number') {
          setRemainingSec(payload.remainingSec)
        }
        if (payload.finalSprintRemainingSec !== undefined) {
          setFinalSprintRemainingSec(payload.finalSprintRemainingSec)
        }
        if (Array.isArray(payload.racers)) {
          setRacers(payload.racers as RacerState[])
        }
        if (payload.recentFlagText !== undefined) {
          setRecentFlagText(payload.recentFlagText)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          syncChannel
            .send({
              type: 'broadcast',
              event: 'request_sync',
              payload: {},
            })
            .catch(() => {})
        }
      })

    channelRef.current = syncChannel
    const poll = setInterval(syncFromDatabase, 2000)

    return () => {
      clearInterval(poll)
      supabase.removeChannel(syncChannel)
    }
  }, [gameId, syncFromDatabase])

  const sendStep = useCallback((side: StepSide) => {
    const me = participantRef.current
    const ch = channelRef.current
    if (!me || !ch) return
    stepSeqRef.current += 1
    setLastLocalSide(side)

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12)
      } catch {
        // Ignorer sur iOS / navigateurs sans vibration
      }
    }

    ch.send({
      type: 'broadcast',
      event: 'player_step',
      payload: {
        participantId: me.id,
        side,
        seq: stepSeqRef.current,
      },
    }).catch(() => {})
  }, [])

  // Tant que le joueur n'est pas inscrit ou que la partie est au salon, afficher le Salon Love Actually
  if (!participant || phase === 'lobby') {
    return (
      <Lobby
        gameId={gameId}
        themeId="love_actually"
        onRegisterCompleted={(registered) => {
          setParticipant(registered)
          participantRef.current = registered
          channelRef.current
            ?.send({
              type: 'broadcast',
              event: 'request_sync',
              payload: {},
            })
            .catch(() => {})
          syncFromDatabase()
        }}
      />
    )
  }

  const identity = getParticipantIdentity(participant)
  const ranked = rankRacers(racers)
  const myRacer = racers.find((r) => r.participantId === participant.id)
  const myRank =
    ranked.findIndex((r) => r.participantId === participant.id) + 1
  const isStunned = myRacer
    ? Date.now() + hostClockOffsetRef.current < myRacer.stunnedUntilMs
    : false
  const hasFinished = myRacer?.finishedAtMs != null
  const nextRecommendedSide: StepSide | null =
    (myRacer?.lastSide ?? lastLocalSide) === 'L'
      ? 'R'
      : (myRacer?.lastSide ?? lastLocalSide) === 'R'
        ? 'L'
        : null

  // ===========================================================================
  // ÉCRAN DE FIN DE COURSE SUR LA MANETTE (RESULT)
  // ===========================================================================
  if (phase === 'result') {
    const trophies = computeGrooveTrophies(racers)
    const chronicle = buildGrooveChronicle(racers)
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.pageBg} text-white p-4 flex flex-col justify-between select-none`}
      >
        <div className="max-w-lg w-full mx-auto my-auto space-y-4">
          <div className="bg-slate-900/95 border-2 border-amber-400/50 rounded-3xl p-6 text-center shadow-2xl space-y-3">
            <div className="text-xs font-black uppercase tracking-widest text-amber-300">
              🏁 Course Terminée • 10 Downing Street
            </div>
            {identity.avatar && (
              <img
                src={identity.avatar.imageUrl}
                alt={identity.avatar.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-rose-400 mx-auto shadow-lg"
              />
            )}
            <h1 className="text-2xl font-black">
              {identity.hasCustomName && identity.characterName
                ? `${identity.displayName} (${identity.characterName})`
                : identity.displayName}
            </h1>
            <div className="text-4xl font-black text-amber-300">
              {myRank === 1
                ? '🥇 1re Place !'
                : myRank === 2
                  ? '🥈 2e Place !'
                  : myRank === 3
                    ? '🥉 3e Place !'
                    : myRank > 0
                      ? `${myRank}e place`
                      : '🏁 Course terminée'}
            </div>
            {myRacer && (
              <div className="flex flex-wrap justify-center gap-2 text-xs font-bold pt-1">
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-emerald-300">
                  {myRacer.finishedAtMs !== null
                    ? `100 m en ${(myRacer.finishedAtMs / 1000).toFixed(1)} s`
                    : `${Math.round(myRacer.distance)} m parcourus`}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-amber-300">
                  🔥 Combo max : {myRacer.maxCombo}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-rose-300">
                  🚨 Flags : {myRacer.caughtCount}
                </span>
              </div>
            )}
          </div>

          <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed">
            <div className="font-black text-rose-300 uppercase mb-1">
              🎬 Rapport du Chef de Cabinet
            </div>
            {chronicle}
          </div>

          {trophies.length > 0 && (
            <div className="grid grid-cols-1 gap-2.5">
              {trophies.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900/90 border border-white/10 rounded-2xl p-3 flex items-center gap-3"
                >
                  <span className="text-2xl shrink-0">{t.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-amber-300">
                      {t.title} — {t.winnerName}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {t.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-xs text-slate-400">
            Regardez la TV : l’Hôte peut relancer une course immédiatement !
          </p>
        </div>
      </div>
    )
  }

  // ===========================================================================
  // MANETTE DE COURSE (COUNTDOWN & RACING)
  // ===========================================================================
  const distanceMeters = Math.round(myRacer?.distance ?? 0)
  const pct = Math.min(100, Math.max(0, (distanceMeters / FINISH_DISTANCE) * 100))

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 select-none touch-manipulation transition-colors duration-150 ${
        isStunned
          ? 'bg-red-950 text-white'
          : doorState === 'watching'
            ? 'bg-gradient-to-b from-red-950 via-slate-950 to-red-950 text-white'
            : doorState === 'warning'
              ? 'bg-gradient-to-b from-amber-950 via-slate-950 to-amber-950 text-white'
              : `bg-gradient-to-br ${theme.pageBg} text-white`
      }`}
    >
      {/* En-tête Joueur : Avatar + Distance + Rang + Chrono */}
      <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-3 space-y-2 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {identity.avatar && (
              <img
                src={identity.avatar.imageUrl}
                alt={identity.avatar.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-rose-400 shrink-0"
              />
            )}
            <div className="min-w-0">
              <div className="font-black text-sm truncate">
                {identity.displayName}
              </div>
              <div className="text-[11px] text-rose-300 truncate">
                {myRank > 0 ? `Rang #${myRank}` : 'En piste'} • Combo x
                {myRacer?.combo ?? 0}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-lg font-mono font-black text-amber-300">
              {distanceMeters} / {FINISH_DISTANCE} m
            </div>
            <div className="text-[10px] font-bold uppercase text-slate-400">
              {finalSprintRemainingSec !== null
                ? `Sprint : ${finalSprintRemainingSec}s`
                : `Chrono : ${remainingSec}s`}
            </div>
          </div>
        </div>

        {/* Jauge de progression personnelle */}
        <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Zone Centrale : Signal lumineux « 1, 2, 3 Soleil » */}
      <div
        data-testid="player-door-signal"
        data-door-state={doorState}
        className={`my-3 rounded-3xl p-5 text-center border-2 shadow-2xl flex flex-col items-center justify-center min-h-[160px] transition-all ${
          phase === 'countdown'
            ? 'bg-slate-900/95 border-amber-400'
            : hasFinished
              ? 'bg-emerald-900/90 border-emerald-300'
              : isStunned
                ? 'bg-red-700 border-white animate-pulse'
                : doorState === 'watching'
                  ? 'bg-red-600/95 border-white shadow-red-600/50'
                  : doorState === 'warning'
                    ? 'bg-amber-500/90 border-amber-200 text-slate-950'
                    : 'bg-emerald-950/85 border-emerald-400/70'
        }`}
      >
        {phase === 'countdown' ? (
          <>
            <div className="text-xs font-black uppercase tracking-widest text-amber-300">
              Départ imminent
            </div>
            <div className="text-6xl font-black my-1">{countdownSec}</div>
            <div className="text-xs text-slate-300">
              Alterne GAUCHE et DROITE dès le GO !
            </div>
          </>
        ) : hasFinished ? (
          <>
            <div className="text-4xl mb-1">🏆</div>
            <div className="text-xl font-black">
              TU ES EN BAS DE L’ESCALIER !
            </div>
            <div className="text-xs text-emerald-200 mt-1">
              Temps : {((myRacer?.finishedAtMs ?? 0) / 1000).toFixed(1)} s •
              Regarde la fin du sprint sur la TV !
            </div>
          </>
        ) : isStunned ? (
          <>
            <div className="text-4xl mb-1">😱🚨</div>
            <div className="text-xl font-black uppercase">
              PRIS EN FLAGRANT DÉLIT !
            </div>
            <div className="text-xs font-bold mt-1">
              La secrétaire t’a vu danser : -8 mètres &amp; gelé de honte !
            </div>
          </>
        ) : doorState === 'watching' ? (
          <>
            <div className="text-4xl mb-1">🧐🛑</div>
            <div className="text-2xl font-black uppercase tracking-tight">
              STOP ! NE BOUGE PLUS !
            </div>
            <div className="text-xs font-bold mt-1 opacity-95">
              La porte est ouverte : lâche les boutons !
            </div>
          </>
        ) : doorState === 'warning' ? (
          <>
            <div className="text-4xl mb-1">⚠️🚪</div>
            <div className="text-xl font-black uppercase">
              LA POIGNÉE BOUGE…
            </div>
            <div className="text-xs font-bold mt-1">
              Prépare-toi à lever les pouces immédiatement !
            </div>
          </>
        ) : (
          <>
            <div className="text-4xl mb-1">🪩🕺</div>
            <div className="text-2xl font-black uppercase text-emerald-300">
              DANSE À FOND !
            </div>
            <div className="text-xs text-slate-200 mt-1">
              Alterne <strong>GAUCHE</strong> et <strong>DROITE</strong> le plus
              vite possible !
            </div>
          </>
        )}
      </div>

      {recentFlagText && (
        <div className="text-center text-xs font-bold text-rose-200 bg-rose-950/80 border border-rose-400/40 rounded-xl py-1.5 px-3 mb-2 truncate">
          {recentFlagText}
        </div>
      )}

      {/* Deux énormes boutons GAUCHE / DROITE au pouce */}
      <div className="grid grid-cols-2 gap-3 h-52 sm:h-60">
        <button
          type="button"
          data-testid="groove-btn-left"
          disabled={phase !== 'racing' || hasFinished}
          onPointerDown={(e) => {
            e.preventDefault()
            sendStep('L')
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={`rounded-3xl border-4 font-black flex flex-col items-center justify-center gap-2 shadow-2xl active:scale-95 transition select-none touch-manipulation ${
            doorState === 'watching'
              ? 'bg-slate-900/90 border-red-500/60 text-red-300'
              : nextRecommendedSide === 'L' || nextRecommendedSide === null
                ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 border-indigo-200 text-white shadow-indigo-500/40'
                : 'bg-slate-900/90 border-indigo-500/40 text-indigo-200'
          }`}
        >
          <span className="text-5xl">🕺</span>
          <span className="text-xl tracking-wider">GAUCHE</span>
          {doorState === 'dancing' && nextRecommendedSide === 'L' && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-white">
              ⚡ À TOI !
            </span>
          )}
        </button>

        <button
          type="button"
          data-testid="groove-btn-right"
          disabled={phase !== 'racing' || hasFinished}
          onPointerDown={(e) => {
            e.preventDefault()
            sendStep('R')
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={`rounded-3xl border-4 font-black flex flex-col items-center justify-center gap-2 shadow-2xl active:scale-95 transition select-none touch-manipulation ${
            doorState === 'watching'
              ? 'bg-slate-900/90 border-red-500/60 text-red-300'
              : nextRecommendedSide === 'R' || nextRecommendedSide === null
                ? 'bg-gradient-to-b from-rose-500 to-rose-700 border-rose-200 text-white shadow-rose-500/40'
                : 'bg-slate-900/90 border-rose-500/40 text-rose-200'
          }`}
        >
          <span className="text-5xl">💃</span>
          <span className="text-xl tracking-wider">DROITE</span>
          {doorState === 'dancing' && nextRecommendedSide === 'R' && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-white">
              ⚡ À TOI !
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
