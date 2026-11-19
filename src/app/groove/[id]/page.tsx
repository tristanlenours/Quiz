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
  isLadyPresent,
  RacerState,
  rankRacers,
  StepSide,
} from '@/groove'
import { StaffLady } from '@/components/DowningStreetScene'
import { ChristmasTree, Garland, Snowfall } from '@/components/GrooveDecor'
import { getClientSessionId, Participant, supabase } from '@/types/types'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function PlayerGroovePage({
  params: { id: gameId },
}: {
  params: { id: string }
}) {
  const [participant, setParticipant] = useState<Participant | null>(null)
  const participantRef = useRef<Participant | null>(null)
  participantRef.current = participant

  const [phase, setPhase] = useState<GroovePhase>('lobby')
  const [countdownSec, setCountdownSec] = useState<number>(
    COUNTDOWN_DURATION_SEC,
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
  const myRank = ranked.findIndex((r) => r.participantId === participant.id) + 1
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
      <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-950 to-red-950 text-white flex flex-col select-none">
        <Snowfall flakes={18} />
        <Garland bulbs={12} className="shrink-0 z-10" />
        <div className="relative z-10 max-w-lg w-full mx-auto my-auto space-y-4 p-4">
          <ChristmasTree className="h-24 w-auto mx-auto" />
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
  const pct = Math.min(
    100,
    Math.max(0, (distanceMeters / FINISH_DISTANCE) * 100),
  )
  const ladyPresent = isLadyPresent(doorState)
  const lightsOn = !ladyPresent && !isStunned
  const buttonsDisabled = phase !== 'racing' || hasFinished

  const stepButtonClass = (side: StepSide) => {
    const recommended =
      nextRecommendedSide === side || nextRecommendedSide === null
    if (ladyPresent) {
      return 'bg-slate-900/90 border-red-500/60 text-red-300'
    }
    if (side === 'L') {
      return recommended
        ? 'bg-gradient-to-b from-emerald-500 to-emerald-800 border-emerald-200 text-white shadow-emerald-500/40'
        : 'bg-slate-900/90 border-emerald-500/40 text-emerald-200'
    }
    return recommended
      ? 'bg-gradient-to-b from-rose-500 to-red-800 border-rose-200 text-white shadow-rose-500/40'
      : 'bg-slate-900/90 border-rose-500/40 text-rose-200'
  }

  return (
    <div
      className={`relative h-[100dvh] overflow-hidden flex flex-col select-none touch-manipulation transition-colors duration-150 text-white ${
        isStunned
          ? 'bg-red-950'
          : ladyPresent
            ? 'bg-gradient-to-b from-red-950 via-slate-950 to-red-950'
            : doorState === 'warning'
              ? 'bg-gradient-to-b from-amber-950 via-slate-950 to-amber-950'
              : 'bg-gradient-to-b from-emerald-950 via-slate-950 to-red-950'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Snowfall flakes={18} />
      <Garland lit={lightsOn} bulbs={12} className="shrink-0 z-10" />

      <div className="relative z-10 flex-1 min-h-0 flex flex-col gap-2 px-3 pb-2">
        {/* En-tête Joueur : Avatar + Distance + Rang + Chrono */}
        <div className="shrink-0 bg-slate-900/90 border border-white/15 rounded-2xl p-2.5 space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {identity.avatar && (
                <img
                  src={identity.avatar.imageUrl}
                  alt={identity.avatar.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-rose-400 shrink-0"
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
              <div className="text-base font-mono font-black text-amber-300">
                {distanceMeters} / {FINISH_DISTANCE} m
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                {finalSprintRemainingSec !== null
                  ? `Sprint : ${finalSprintRemainingSec}s`
                  : `Chrono : ${remainingSec}s`}
              </div>
            </div>
          </div>

          {/* Jauge de progression jusqu'au sapin */}
          <div className="relative h-2.5 bg-slate-950 rounded-full border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-400 transition-all duration-150"
              style={{ width: `${pct}%` }}
            />
            <span className="absolute -right-1 -top-2 text-sm leading-none">
              🎄
            </span>
          </div>
        </div>

        {/* Signal lumineux « 1, 2, 3 Soleil » */}
        <div
          data-testid="player-door-signal"
          data-door-state={doorState}
          className={`relative shrink-0 rounded-3xl px-4 py-3 text-center border-2 shadow-2xl flex flex-col items-center justify-center min-h-[104px] transition-all overflow-hidden ${
            ladyPresent && !isStunned && !hasFinished && phase === 'racing'
              ? 'pl-24 '
              : ''
          }${
            phase === 'countdown'
              ? 'bg-slate-900/95 border-amber-400'
              : hasFinished
                ? 'bg-emerald-900/90 border-emerald-300'
                : isStunned
                  ? 'bg-red-700 border-white animate-pulse'
                  : doorState === 'lingering'
                    ? 'bg-fuchsia-800/95 border-white shadow-fuchsia-600/50'
                    : doorState === 'watching'
                      ? 'bg-red-600/95 border-white shadow-red-600/50'
                      : doorState === 'warning'
                        ? 'bg-amber-500/90 border-amber-200 text-slate-950'
                        : 'bg-emerald-950/85 border-emerald-400/70'
          }`}
        >
          {ladyPresent && !isStunned && !hasFinished && phase === 'racing' && (
            <div className="absolute left-2 bottom-0 top-2 w-20 rounded-t-2xl bg-[#f6e9b4] border-x-4 border-t-4 border-white overflow-hidden groove-appear">
              <StaffLady
                judging={doorState === 'lingering'}
                className="w-full h-auto"
              />
            </div>
          )}
          {phase === 'countdown' ? (
            <>
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                Départ imminent
              </div>
              <div className="text-5xl font-black leading-none my-1">
                {countdownSec}
              </div>
              <div className="text-xs text-slate-300">
                Alterne GAUCHE et DROITE dès le GO !
              </div>
            </>
          ) : hasFinished ? (
            <>
              <div className="text-xl font-black">
                🎄 TU AS ATTEINT LE SAPIN !
              </div>
              <div className="text-xs text-emerald-200 mt-1">
                Temps : {((myRacer?.finishedAtMs ?? 0) / 1000).toFixed(1)} s •
                Regarde la fin du sprint sur la TV !
              </div>
            </>
          ) : isStunned ? (
            <>
              <div className="text-xl font-black uppercase">
                😱 PRIS EN FLAGRANT DÉLIT !
              </div>
              <div className="text-xs font-bold mt-1">
                La secrétaire t’a vu danser : -8 mètres &amp; gelé de honte !
              </div>
            </>
          ) : doorState === 'lingering' ? (
            <>
              <div className="text-xl font-black uppercase tracking-tight">
                😒 ELLE EST TOUJOURS LÀ !
              </div>
              <div className="text-xs font-bold mt-1 opacity-95">
                La musique repart, pas elle : attends qu’elle s’en aille !
              </div>
            </>
          ) : doorState === 'watching' ? (
            <>
              <div className="text-2xl font-black uppercase tracking-tight">
                🧐 FIGE-TOI !
              </div>
              <div className="text-xs font-bold mt-1 opacity-95">
                La secrétaire te regarde : pas un geste !
              </div>
            </>
          ) : doorState === 'warning' ? (
            <>
              <div className="text-xl font-black uppercase">
                🔉 LA MUSIQUE BAISSE…
              </div>
              <div className="text-xs font-bold mt-1">
                Quelqu’un arrive : prépare-toi à te figer !
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-black uppercase text-emerald-300">
                🪩 DANSE À FOND !
              </div>
              <div className="text-xs text-slate-200 mt-1">
                Alterne <strong>GAUCHE</strong> et <strong>DROITE</strong>{' '}
                jusqu’au sapin !
              </div>
            </>
          )}
        </div>

        {/* Emplacement fixe du message de flag : les touches ne bougent pas */}
        <div className="shrink-0 h-6">
          {recentFlagText && (
            <div className="text-center text-[11px] font-bold text-rose-200 bg-rose-950/80 border border-rose-400/40 rounded-xl py-1 px-3 truncate">
              {recentFlagText}
            </div>
          )}
        </div>

        {/* Deux énormes boutons GAUCHE / DROITE, au milieu de l'écran sous les pouces */}
        <div className="shrink-0 grid grid-cols-2 gap-3 h-[34dvh] min-h-[160px] max-h-[300px]">
          {(['L', 'R'] as const).map((side) => (
            <button
              key={side}
              type="button"
              data-testid={
                side === 'L' ? 'groove-btn-left' : 'groove-btn-right'
              }
              disabled={buttonsDisabled}
              onPointerDown={(e) => {
                e.preventDefault()
                sendStep(side)
              }}
              onContextMenu={(e) => e.preventDefault()}
              className={`rounded-3xl border-4 font-black flex flex-col items-center justify-center gap-1.5 shadow-2xl active:scale-95 transition select-none touch-manipulation disabled:opacity-60 ${stepButtonClass(side)}`}
            >
              <span className="text-5xl">{side === 'L' ? '🕺' : '💃'}</span>
              <span className="text-xl tracking-wider">
                {side === 'L' ? 'GAUCHE' : 'DROITE'}
              </span>
              {doorState === 'dancing' && nextRecommendedSide === side && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  ⚡ À TOI !
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Décor : le sapin du 10 Downing Street, ligne d'arrivée de la course */}
        <div className="flex-1 min-h-0 flex items-end justify-center gap-3 overflow-hidden">
          <ChristmasTree
            lit={lightsOn}
            className="h-full max-h-[200px] w-auto"
          />
          <div className="pb-2 text-[11px] font-bold text-amber-200/90 leading-tight max-w-[9rem]">
            🎄 Le sapin du 10 Downing Street t’attend en bas de l’escalier
          </div>
        </div>
      </div>
    </div>
  )
}
