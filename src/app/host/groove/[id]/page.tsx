'use client'

import { getParticipantIdentity, preloadAvatarImages } from '@/avatars'
import {
  applyDoorCloseComposureBonus,
  applyRacerStep,
  buildGrooveChronicle,
  computeGrooveTrophies,
  COUNTDOWN_DURATION_SEC,
  createInitialRacer,
  DoorState,
  FINAL_SPRINT_SEC,
  FINISH_DISTANCE,
  GroovePhase,
  isLadyPresent,
  LINGER_CHANCE,
  LINGER_MAX_MS,
  LINGER_MIN_MS,
  RACE_DURATION_SEC,
  RacerState,
  rankRacers,
  StepSide,
  WARNING_DURATION_MS,
} from '@/groove'
import { CorridorBackdrop, StaffLady } from '@/components/DowningStreetScene'
import { ChristmasTree, Garland, Snowfall } from '@/components/GrooveDecor'
import { Participant, supabase } from '@/types/types'
import { useQRCode } from 'next-qrcode'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

// Musique de la scène de danse du film (D73) : le même extrait que la manche Blind Test du
// Grand Quiz. Le Groove se lance donc APRÈS le Grand Quiz (avertissement dans le Studio).
// Aucun titre ni artiste n'est affiché à l'écran.
const GROOVE_MUSIC_URL =
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a9/b6/16/a9b61684-87c1-2b2a-b255-5b951a4dcaff/mzaf_17251563327851743190.plus.aac.p.m4a'

export default function HostGroovePage({
  params: { id: gameId },
}: {
  params: { id: string }
}) {
  const { Canvas } = useQRCode()
  const { width, height } = useWindowSize()

  const [pinCode, setPinCode] = useState<string>('')
  const [joinUrl, setJoinUrl] = useState<string>('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [phase, setPhase] = useState<GroovePhase>('lobby')
  const [countdownSec, setCountdownSec] = useState<number>(
    COUNTDOWN_DURATION_SEC,
  )
  const [doorState, setDoorState] = useState<DoorState>('dancing')
  const [elapsedSec, setElapsedSec] = useState<number>(0)
  const [finalSprintRemainingSec, setFinalSprintRemainingSec] = useState<
    number | null
  >(null)
  const [racers, setRacers] = useState<RacerState[]>([])
  const [recentFlagText, setRecentFlagText] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  // Re-rendu régulier pendant la course : les badges « Pris en flag » s'éteignent à l'heure
  const [, setFrameTick] = useState<number>(0)

  // Refs synchrones pour l'arbitrage temps réel à haute fréquence
  const phaseRef = useRef<GroovePhase>('lobby')
  const countdownRef = useRef<number>(COUNTDOWN_DURATION_SEC)
  const doorStateRef = useRef<DoorState>('dancing')
  const doorOpenedAtMsRef = useRef<number>(0)
  const raceStartMsRef = useRef<number>(0)
  const firstFinishMsRef = useRef<number | null>(null)
  const racersRef = useRef<RacerState[]>([])
  const recentFlagTextRef = useRef<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const soundEnabledRef = useRef<boolean>(true)

  soundEnabledRef.current = soundEnabled

  useEffect(() => {
    preloadAvatarImages('love_actually')
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    setJoinUrl(`${origin}/groove/${gameId}`)
  }, [gameId])

  // Synthétiseur d'effets sonores Web Audio (poignée, ouverture de porte, flag, victoire)
  const playSfx = useCallback(
    (
      type:
        | 'tick'
        | 'go'
        | 'warning'
        | 'door_open'
        | 'judge'
        | 'door_close'
        | 'caught'
        | 'win',
    ) => {
      if (!soundEnabledRef.current || typeof window === 'undefined') return
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        if (!Ctx) return
        if (!audioCtxRef.current) {
          audioCtxRef.current = new Ctx()
        }
        const ctx = audioCtxRef.current
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {})
        }
        const now = ctx.currentTime

        const tone = (
          freq: number,
          startOffset: number,
          duration: number,
          wave: OscillatorType = 'sine',
          gainVal = 0.15,
        ) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = wave
          osc.frequency.setValueAtTime(freq, now + startOffset)
          gain.gain.setValueAtTime(gainVal, now + startOffset)
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + startOffset + duration,
          )
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + startOffset)
          osc.stop(now + startOffset + duration)
        }

        if (type === 'tick') {
          tone(520, 0, 0.12, 'triangle', 0.18)
        } else if (type === 'go') {
          tone(523.25, 0, 0.12, 'triangle', 0.2)
          tone(659.25, 0.1, 0.12, 'triangle', 0.2)
          tone(783.99, 0.2, 0.28, 'triangle', 0.25)
        } else if (type === 'warning') {
          tone(440, 0, 0.08, 'square', 0.12)
          tone(440, 0.18, 0.08, 'square', 0.12)
        } else if (type === 'door_open') {
          // Bruit de porte / raclement de gorge sévère
          tone(220, 0, 0.18, 'sawtooth', 0.2)
          tone(165, 0.16, 0.28, 'sawtooth', 0.22)
        } else if (type === 'judge') {
          // « Hmm… » réprobateur : elle est toujours là
          tone(196, 0, 0.35, 'sine', 0.22)
          tone(174.61, 0.3, 0.45, 'sine', 0.2)
        } else if (type === 'door_close') {
          tone(140, 0, 0.08, 'square', 0.12)
          tone(110, 0.06, 0.12, 'square', 0.1)
        } else if (type === 'caught') {
          // Sirène descendante comique « Pris en flag ! »
          tone(392, 0, 0.14, 'sawtooth', 0.22)
          tone(349.23, 0.14, 0.14, 'sawtooth', 0.22)
          tone(293.66, 0.28, 0.3, 'sawtooth', 0.25)
        } else if (type === 'win') {
          tone(523.25, 0, 0.12, 'triangle', 0.22)
          tone(659.25, 0.12, 0.12, 'triangle', 0.22)
          tone(783.99, 0.24, 0.12, 'triangle', 0.22)
          tone(1046.5, 0.36, 0.4, 'triangle', 0.28)
        }
      } catch {
        // Ignorer si l'autoplay audio navigateur est bloqué
      }
    },
    [],
  )

  // Fondu de la musique : elle baisse quand quelqu'un approche, comme dans la scène (D75)
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fadeMusicTo = useCallback((target: number, durationMs: number) => {
    const audio = musicRef.current
    if (!audio) return
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current)
    if (audio.paused) {
      audio.play().catch(() => {})
    }
    const start = audio.volume
    const steps = Math.max(1, Math.round(durationMs / 50))
    let step = 0
    fadeTimerRef.current = setInterval(() => {
      step += 1
      audio.volume = Math.min(
        1,
        Math.max(0, start + ((target - start) * step) / steps),
      )
      if (step >= steps && fadeTimerRef.current) {
        clearInterval(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }, 50)
  }, [])

  const syncMusicPlayback = useCallback(
    (state: DoorState, active: boolean) => {
      const audio = musicRef.current
      if (!audio) return
      if (!active || !soundEnabledRef.current) {
        if (fadeTimerRef.current) clearInterval(fadeTimerRef.current)
        audio.pause()
        return
      }
      if (state === 'dancing') fadeMusicTo(0.6, 300)
      // La musique baisse pendant que la poignée tourne…
      else if (state === 'warning') fadeMusicTo(0.12, WARNING_DURATION_MS)
      // … presque plus rien pendant qu'elle observe…
      else if (state === 'watching') fadeMusicTo(0.03, 250)
      // … et elle repart alors qu'elle est toujours là : c'est le piège
      else fadeMusicTo(0.5, 500)
    },
    [fadeMusicTo],
  )

  const broadcastState = useCallback(
    (
      override?: Partial<{
        phase: GroovePhase
        countdownSec: number
        doorState: DoorState
        elapsedSec: number
        finalSprintRemainingSec: number | null
        racers: RacerState[]
        recentFlagText: string | null
      }>,
    ) => {
      const ch = channelRef.current
      if (!ch) return
      const curPhase = override?.phase ?? phaseRef.current
      const curDoor = override?.doorState ?? doorStateRef.current
      const curRacers = override?.racers ?? racersRef.current
      const curFlag =
        override?.recentFlagText !== undefined
          ? override.recentFlagText
          : recentFlagTextRef.current
      const now = Date.now()
      const curElapsed =
        override?.elapsedSec ??
        (raceStartMsRef.current > 0
          ? Math.min(
              RACE_DURATION_SEC,
              Math.floor((now - raceStartMsRef.current) / 1000),
            )
          : 0)
      const curSprint =
        override?.finalSprintRemainingSec !== undefined
          ? override.finalSprintRemainingSec
          : firstFinishMsRef.current !== null
            ? Math.max(
                0,
                FINAL_SPRINT_SEC -
                  Math.floor((now - firstFinishMsRef.current) / 1000),
              )
            : null

      ch.send({
        type: 'broadcast',
        event: 'groove_state',
        payload: {
          phase: curPhase,
          countdownSec: override?.countdownSec ?? countdownRef.current,
          // Horloge de la TV : les manettes en déduisent la fin du gel sans dépendre de leur propre heure
          hostNowMs: now,
          doorState: curDoor,
          elapsedSec: curElapsed,
          remainingSec: Math.max(0, RACE_DURATION_SEC - curElapsed),
          finalSprintRemainingSec: curSprint,
          racers: curRacers,
          recentFlagText: curFlag,
        },
      }).catch(() => {})
    },
    [],
  )

  const finishRace = useCallback(async () => {
    if (phaseRef.current === 'result') return
    phaseRef.current = 'result'
    setPhase('result')
    syncMusicPlayback('watching', false)
    playSfx('win')

    broadcastState({
      phase: 'result',
      racers: racersRef.current,
    })

    await supabase
      .from('quiz_games')
      .update({ phase: 'result' })
      .eq('id', gameId)
  }, [broadcastState, gameId, playSfx, syncMusicPlayback])

  // Traitement d'un pas envoyé par une manette mobile
  const handlePlayerStep = useCallback(
    (participantId: string, side: StepSide) => {
      if (phaseRef.current !== 'racing') return
      const now = Date.now()
      const idx = racersRef.current.findIndex(
        (r) => r.participantId === participantId,
      )
      if (idx === -1) return

      const currentRacer = racersRef.current[idx]
      const { racer: updatedRacer, outcome } = applyRacerStep(
        currentRacer,
        side,
        now,
        raceStartMsRef.current,
        doorStateRef.current,
        doorOpenedAtMsRef.current,
      )

      const nextRacers = [...racersRef.current]
      nextRacers[idx] = updatedRacer
      racersRef.current = nextRacers
      setRacers(nextRacers)

      if (outcome === 'caught') {
        const id = getParticipantIdentity({
          nickname: updatedRacer.nickname,
          avatar_id: updatedRacer.avatarId,
        })
        const label =
          id.hasCustomName && id.characterName
            ? `${id.displayName} (${id.characterName})`
            : id.displayName
        const flagMsg =
          doorStateRef.current === 'lingering'
            ? `😒 ${label} est reparti trop tôt : elle était toujours là ! (-8 m)`
            : `🚨 ${label} s'est fait griller en plein déhanché ! (-8 m)`
        recentFlagTextRef.current = flagMsg
        setRecentFlagText(flagMsg)
        playSfx('caught')
        broadcastState({ racers: nextRacers, recentFlagText: flagMsg })
      } else if (outcome === 'finished') {
        if (firstFinishMsRef.current === null) {
          firstFinishMsRef.current = now
          setFinalSprintRemainingSec(FINAL_SPRINT_SEC)
          playSfx('win')
        }
        // Si tous les joueurs ont franchi la ligne, terminer immédiatement !
        if (nextRacers.every((r) => r.finishedAtMs !== null)) {
          finishRace()
          return
        }
        broadcastState({ racers: nextRacers })
      }
    },
    [broadcastState, finishRace, playSfx],
  )

  // Chargement initial et abonnement aux participants + canal Broadcast
  useEffect(() => {
    const fetchInitial = async () => {
      const { data: gData } = await supabase
        .from('quiz_games')
        .select()
        .eq('id', gameId)
        .single()
      if (gData) {
        setPinCode(gData.pin_code)
      }

      const { data: pData } = await supabase
        .from('quiz_participants')
        .select()
        .eq('game_id', gameId)
        .order('created_at', { ascending: true })
      if (pData) {
        setParticipants(pData)
        // En phase lobby, synchroniser la liste des coureurs
        if (phaseRef.current === 'lobby') {
          const initial = pData.map(createInitialRacer)
          racersRef.current = initial
          setRacers(initial)
        } else {
          // Ajouter un éventuel retardataire sans écraser les coureurs en course
          const existingIds = new Set(
            racersRef.current.map((r) => r.participantId),
          )
          const newcomers = pData
            .filter((p) => !existingIds.has(p.id))
            .map(createInitialRacer)
          if (newcomers.length > 0) {
            const merged = [...racersRef.current, ...newcomers]
            racersRef.current = merged
            setRacers(merged)
          }
        }
      }
    }

    fetchInitial()

    const dbChannel = supabase
      .channel(`host_groove_db_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_participants',
          filter: `game_id=eq.${gameId}`,
        },
        () => {
          fetchInitial()
        },
      )
      .subscribe()

    const syncChannel = supabase
      .channel(`groove_sync_${gameId}`, {
        config: { broadcast: { ack: false, self: false } },
      })
      .on('broadcast', { event: 'player_step' }, ({ payload }) => {
        if (
          payload &&
          typeof payload.participantId === 'string' &&
          (payload.side === 'L' || payload.side === 'R')
        ) {
          handlePlayerStep(payload.participantId, payload.side)
        }
      })
      .on('broadcast', { event: 'request_sync' }, () => {
        broadcastState()
      })
      .subscribe()

    channelRef.current = syncChannel
    const poll = setInterval(fetchInitial, 2000)

    return () => {
      clearInterval(poll)
      supabase.removeChannel(dbChannel)
      supabase.removeChannel(syncChannel)
    }
  }, [broadcastState, gameId, handlePlayerStep])

  // Démarrer ou relancer une course
  const startRace = useCallback(async () => {
    const freshRacers = participants.map(createInitialRacer)
    racersRef.current = freshRacers
    setRacers(freshRacers)
    recentFlagTextRef.current = null
    setRecentFlagText(null)
    firstFinishMsRef.current = null
    setFinalSprintRemainingSec(null)
    setElapsedSec(0)
    doorStateRef.current = 'dancing'
    setDoorState('dancing')

    phaseRef.current = 'countdown'
    countdownRef.current = COUNTDOWN_DURATION_SEC
    setPhase('countdown')
    setCountdownSec(COUNTDOWN_DURATION_SEC)

    await supabase.from('quiz_games').update({ phase: 'quiz' }).eq('id', gameId)

    broadcastState({
      phase: 'countdown',
      countdownSec: COUNTDOWN_DURATION_SEC,
      doorState: 'dancing',
      elapsedSec: 0,
      finalSprintRemainingSec: null,
      racers: freshRacers,
      recentFlagText: null,
    })
  }, [broadcastState, gameId, participants])

  // Gestion du décompte 3, 2, 1 -> GO ! (effets hors des updaters React, joués une seule fois)
  useEffect(() => {
    if (phase !== 'countdown') return
    playSfx('tick')
    const interval = setInterval(() => {
      const next = countdownRef.current - 1
      countdownRef.current = Math.max(0, next)
      if (next > 0) {
        setCountdownSec(next)
        playSfx('tick')
        broadcastState({ phase: 'countdown', countdownSec: next })
        return
      }
      clearInterval(interval)
      raceStartMsRef.current = Date.now()
      doorStateRef.current = 'dancing'
      phaseRef.current = 'racing'
      setCountdownSec(0)
      setDoorState('dancing')
      setPhase('racing')
      playSfx('go')
      syncMusicPlayback('dancing', true)
      broadcastState({
        phase: 'racing',
        countdownSec: 0,
        doorState: 'dancing',
        elapsedSec: 0,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [broadcastState, phase, playSfx, syncMusicPlayback])

  // Cycle « 1, 2, 3 Soleil » de la porte de la secrétaire pendant la course
  useEffect(() => {
    if (phase !== 'racing') return
    let timer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false

    const scheduleNextDoorPhase = (current: DoorState) => {
      if (cancelled || phaseRef.current !== 'racing') return
      if (current === 'dancing') {
        // On danse entre 3,4 s et 5,2 s avant que la poignée ne bouge
        const danceDuration = 3400 + Math.floor(Math.random() * 1800)
        timer = setTimeout(() => {
          if (cancelled || phaseRef.current !== 'racing') return
          doorStateRef.current = 'warning'
          setDoorState('warning')
          playSfx('warning')
          syncMusicPlayback('warning', true)
          broadcastState({ doorState: 'warning' })
          scheduleNextDoorPhase('warning')
        }, danceDuration)
      } else if (current === 'warning') {
        timer = setTimeout(() => {
          if (cancelled || phaseRef.current !== 'racing') return
          const now = Date.now()
          doorOpenedAtMsRef.current = now
          doorStateRef.current = 'watching'
          setDoorState('watching')
          playSfx('door_open')
          syncMusicPlayback('watching', true)
          broadcastState({ doorState: 'watching' })
          scheduleNextDoorPhase('watching')
        }, WARNING_DURATION_MS)
      } else if (current === 'watching') {
        // La secrétaire regarde pendant 2,1 s à 3,0 s, puis s'en va… ou s'attarde (D75)
        const watchDuration = 2100 + Math.floor(Math.random() * 900)
        timer = setTimeout(() => {
          if (cancelled || phaseRef.current !== 'racing') return
          if (Math.random() < LINGER_CHANCE) {
            doorStateRef.current = 'lingering'
            setDoorState('lingering')
            playSfx('judge')
            syncMusicPlayback('lingering', true)
            broadcastState({ doorState: 'lingering' })
            scheduleNextDoorPhase('lingering')
          } else {
            closeDoor()
          }
        }, watchDuration)
      } else {
        // La musique est repartie mais elle est toujours là, à juger
        const lingerDuration =
          LINGER_MIN_MS +
          Math.floor(Math.random() * (LINGER_MAX_MS - LINGER_MIN_MS))
        timer = setTimeout(closeDoor, lingerDuration)
      }
    }

    // Elle s'en va : bonus de sang-froid pour ceux qui sont restés de marbre
    const closeDoor = () => {
      if (cancelled || phaseRef.current !== 'racing') return
      const boosted = applyDoorCloseComposureBonus(
        racersRef.current,
        Date.now(),
      )
      racersRef.current = boosted
      setRacers(boosted)
      doorStateRef.current = 'dancing'
      setDoorState('dancing')
      playSfx('door_close')
      syncMusicPlayback('dancing', true)
      broadcastState({ doorState: 'dancing', racers: boosted })
      scheduleNextDoorPhase('dancing')
    }

    scheduleNextDoorPhase('dancing')

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [broadcastState, phase, playSfx, syncMusicPlayback])

  // Boucle horloge 200 ms pendant la course (chrono 60 s, sprint final 5 s et synchro manettes)
  useEffect(() => {
    if (phase !== 'racing') return
    const tick = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - raceStartMsRef.current) / 1000)
      setElapsedSec(Math.min(RACE_DURATION_SEC, elapsed))
      setFrameTick(now)

      if (firstFinishMsRef.current !== null) {
        const sprintLeft =
          FINAL_SPRINT_SEC - Math.floor((now - firstFinishMsRef.current) / 1000)
        setFinalSprintRemainingSec(Math.max(0, sprintLeft))
        if (sprintLeft <= 0) {
          clearInterval(tick)
          finishRace()
          return
        }
      }

      if (elapsed >= RACE_DURATION_SEC) {
        clearInterval(tick)
        finishRace()
        return
      }

      broadcastState({ elapsedSec: elapsed })
    }, 250)

    return () => clearInterval(tick)
  }, [broadcastState, finishRace, phase])

  // En phase résultat, diffuser périodiquement l'état pour les manettes qui rafraîchissent
  useEffect(() => {
    if (phase !== 'result') return
    const interval = setInterval(() => {
      broadcastState({ phase: 'result' })
    }, 1500)
    return () => clearInterval(interval)
  }, [broadcastState, phase])

  const rankedRacers = rankRacers(racers)
  const trophies = computeGrooveTrophies(racers)
  const chronicle = buildGrooveChronicle(racers)
  const remainingSec = Math.max(0, RACE_DURATION_SEC - elapsedSec)
  const ladyPresent = isLadyPresent(doorState)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-950 to-red-950 text-white flex flex-col justify-between p-4 md:p-6 pt-0 md:pt-0 select-none">
      <audio ref={musicRef} src={GROOVE_MUSIC_URL} loop preload="auto" />
      <Snowfall flakes={40} />
      <Garland
        bulbs={30}
        lit={!ladyPresent || phase !== 'racing'}
        className="shrink-0 z-10 -mx-4 md:-mx-6 mb-2"
      />

      {/* =====================================================================
          1. SALON D'ATTENTE (LOBBY)
      ===================================================================== */}
      {phase === 'lobby' && (
        <div className="relative z-10 max-w-6xl w-full mx-auto my-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-black uppercase tracking-widest">
              📺 PARTY-GAME TV • 10 DOWNING STREET GROOVE
            </div>
            <Link
              href="/host/dashboard"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition"
            >
              ← Retour au Studio
            </Link>
          </div>

          <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Colonne gauche : Pitch + Règles Lapins Crétins + Casting */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-start gap-5">
                <ChristmasTree className="hidden sm:block h-36 w-auto shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-1">
                    🎄 Épreuve Spéciale Love Actually • Zéro Culture G
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                    🕺 Downing Street Groove
                  </h1>
                  <p className="text-slate-300 text-sm md:text-base mt-2">
                    Le Premier Ministre se croit seul dans les couloirs du{' '}
                    <strong>10 Downing Street</strong>… Déhanchez-vous jusqu’au
                    sapin de Noël, en bas de l’escalier (100 m), sans vous faire
                    surprendre par la secrétaire !
                  </p>
                </div>
              </div>

              {/* Les 3 règles illustrées */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-3.5">
                  <div className="text-2xl mb-1">🕺💃</div>
                  <div className="font-black text-xs uppercase text-emerald-300">
                    1. Alternez G / D
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Tapotez <strong>GAUCHE</strong> puis <strong>DROITE</strong>{' '}
                    sur votre téléphone pour faire monter le combo et sprinter !
                  </p>
                </div>
                <div className="bg-amber-950/50 border border-amber-500/40 rounded-2xl p-3.5">
                  <div className="text-2xl mb-1">⚠️🚪</div>
                  <div className="font-black text-xs uppercase text-amber-300">
                    2. La poignée bouge
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Quand la porte du cabinet tremblote, préparez-vous à lever
                    les pouces immédiatement !
                  </p>
                </div>
                <div className="bg-rose-950/50 border border-rose-500/40 rounded-2xl p-3.5">
                  <div className="text-2xl mb-1">🧐🚨</div>
                  <div className="font-black text-xs uppercase text-rose-300">
                    3. Statue Ministérielle
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Porte ouverte = <strong>ZÉRO TOUCHE !</strong> Le moindre
                    pas vous fait reculer de 8 m sous la honte !
                  </p>
                </div>
              </div>

              {/* Liste des joueurs inscrits */}
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    🎬 Danseurs sur la ligne de départ ({participants.length}
                    /15)
                  </span>
                  <a
                    href={`/groove/${gameId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-300 hover:text-indigo-200 underline"
                  >
                    📱 Ouvrir une manette de test ↗
                  </a>
                </div>

                {participants.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-sm">
                    Scannez le QR code avec votre téléphone pour choisir votre
                    personnage de Love Actually et entrer sur le tapis rouge !
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {participants.map((p) => {
                      const id = getParticipantIdentity(p)
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-rose-400/30"
                        >
                          {id.avatar ? (
                            <img
                              src={id.avatar.imageUrl}
                              alt={id.avatar.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-rose-400 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg shrink-0">
                              🕺
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-black text-xs text-white truncate">
                              {id.displayName}
                            </div>
                            {id.characterName && (
                              <div className="text-[10px] text-rose-300 truncate">
                                {id.characterName}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={participants.length === 0}
                onClick={startRace}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600 hover:from-rose-500 hover:to-emerald-500 disabled:opacity-40 text-white font-black text-xl shadow-2xl transition"
              >
                {participants.length === 0
                  ? 'En attente d’au moins 1 danseur...'
                  : `🕺 Lancer la course (${participants.length} joueur${participants.length > 1 ? 's' : ''}) !`}
              </button>
            </div>

            {/* Colonne droite : QR Code + Code PIN */}
            <div className="lg:col-span-5 flex flex-col items-center bg-slate-950/90 border border-white/15 rounded-3xl p-6 text-center space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-rose-300">
                📱 Rejoindre avec votre téléphone
              </div>
              {joinUrl && (
                <div className="bg-white p-3.5 rounded-2xl shadow-xl">
                  <Canvas
                    text={joinUrl}
                    options={{
                      errorCorrectionLevel: 'M',
                      margin: 2,
                      scale: 4,
                      width: 220,
                    }}
                  />
                </div>
              )}
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold">
                  Ou code PIN sur l’accueil
                </div>
                <div className="text-4xl font-mono font-black tracking-widest text-amber-300 mt-1">
                  {pinCode || '------'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. COURSE EN DIRECT (COUNTDOWN & RACING)
      ===================================================================== */}
      {(phase === 'countdown' || phase === 'racing') && (
        <div className="relative z-10 max-w-7xl w-full mx-auto flex-1 flex flex-col justify-between gap-4">
          {/* Bandeau supérieur : État de la Porte de la Secrétaire + Chrono */}
          <div
            data-testid="groove-door-banner"
            data-door-state={doorState}
            className={`rounded-3xl p-4 md:p-5 border-2 transition-all duration-200 shadow-2xl flex flex-wrap items-center justify-between gap-4 ${
              doorState === 'lingering'
                ? 'bg-red-950/95 border-fuchsia-400 shadow-fuchsia-600/40'
                : doorState === 'watching'
                  ? 'bg-red-950/95 border-red-400 shadow-red-600/40'
                  : doorState === 'warning'
                    ? 'bg-amber-950/95 border-amber-400 animate-pulse shadow-amber-500/30'
                    : 'bg-gradient-to-r from-emerald-950/95 via-indigo-950/95 to-rose-950/95 border-emerald-400/60 shadow-emerald-500/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex justify-center text-4xl md:text-5xl border-2 shrink-0 overflow-hidden ${
                  ladyPresent
                    ? 'bg-[#f6e9b4] border-white items-start'
                    : doorState === 'warning'
                      ? 'bg-amber-500 border-amber-200 items-center'
                      : 'bg-emerald-600/40 border-emerald-300 items-center'
                }`}
              >
                {ladyPresent ? (
                  <StaffLady
                    judging={doorState === 'lingering'}
                    className="w-full h-auto mt-1 scale-[1.6] origin-top"
                  />
                ) : doorState === 'warning' ? (
                  '🔉'
                ) : (
                  '🪩'
                )}
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest opacity-90">
                  {doorState === 'lingering'
                    ? '🎵 LA MUSIQUE REPART… MAIS ELLE N’EST PAS PARTIE !'
                    : doorState === 'watching'
                      ? '🚨 LA SECRÉTAIRE EST DANS L’ENCADREMENT — ELLE VOUS OBSERVE'
                      : doorState === 'warning'
                        ? '🔉 LA MUSIQUE BAISSE… QUELQU’UN ARRIVE !'
                        : '🟢 PORTE FERMÉE — MUSIQUE À FOND DANS LE COULOIR !'}
                </div>
                <h2 className="text-2xl md:text-4xl font-black tracking-tight mt-0.5">
                  {doorState === 'lingering'
                    ? 'ELLE VOUS JUGE ENCORE : NE BOUGEZ PAS !'
                    : doorState === 'watching'
                      ? 'FIGEZ-VOUS ! PAS UN GESTE !'
                      : doorState === 'warning'
                        ? 'PRÉPAREZ-VOUS À VOUS FIGER…'
                        : 'DÉHANCHEZ-VOUS ! (GAUCHE ⇄ DROITE)'}
                </h2>
              </div>
            </div>

            {/* Chrono & Contrôles Hôte */}
            <div className="flex items-center gap-3">
              {finalSprintRemainingSec !== null ? (
                <div className="px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg animate-bounce">
                  🏁 SPRINT FINAL : {finalSprintRemainingSec}s
                </div>
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-white/15 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Chrono
                  </div>
                  <div className="text-2xl font-mono font-black text-amber-300">
                    {remainingSec}s
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const next = !soundEnabled
                  setSoundEnabled(next)
                  soundEnabledRef.current = next
                  syncMusicPlayback(
                    doorStateRef.current,
                    next && phase === 'racing',
                  )
                }}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
              >
                {soundEnabled ? '🔊 Son ON' : '🔇 Muet'}
              </button>

              <button
                type="button"
                onClick={finishRace}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300"
              >
                🏁 Terminer
              </button>
            </div>
          </div>

          {/* Alerte Flagrant Délit en direct */}
          {recentFlagText && (
            <div className="bg-red-600/90 border-2 border-red-300 text-white px-5 py-2.5 rounded-2xl text-center font-black text-sm md:text-base shadow-lg">
              {recentFlagText}
            </div>
          )}

          {/* Piste de course : Le Grand Couloir du 10 Downing Street */}
          <div className="flex-1 border-2 border-amber-400/60 rounded-3xl flex flex-col relative overflow-hidden shadow-2xl">
            {/* Le couloir de la scène : porte du bureau, tableaux, escalier aux portraits (D75) */}
            <div className="relative shrink-0 bg-[#efdd9f]">
              <Garland bulbs={24} lit={!ladyPresent} className="shrink-0" />
              <CorridorBackdrop
                doorState={doorState}
                className="block w-full h-[24vh] min-h-[140px] max-h-[260px]"
              />
              <ChristmasTree
                lit={!ladyPresent}
                className="absolute right-3 bottom-1 h-[78%] w-auto drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]"
              />
            </div>
            {/* Le parquet et les tapis rouges */}
            <div
              className="flex-1 flex gap-4 min-h-0 px-4 pb-4 pt-3 md:px-6 md:pb-6"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #6b3f19 0 54px, #5a3414 54px 108px)',
              }}
            >
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                {/* Repères de distance (0 m -> 25 m -> 50 m -> 75 m -> 100 m Sapin) */}
                <div className="grid grid-cols-5 text-xs font-black uppercase tracking-wider text-amber-100 border-b border-amber-200/20 pb-2 mb-3">
                  <div>🚪 0 m • Bureau</div>
                  <div className="text-center">🖼️ 25 m • Portraits</div>
                  <div className="text-center">🕯️ 50 m • Grand Couloir</div>
                  <div className="text-center">🪜 75 m • Rampe</div>
                  <div className="text-right">🎄 100 m • Sapin</div>
                </div>

                {/* Couloirs des joueurs */}
                <div className="space-y-3 my-auto">
                  {racers.map((r) => {
                    const id = getParticipantIdentity({
                      nickname: r.nickname,
                      avatar_id: r.avatarId,
                    })
                    const now = Date.now()
                    const isStunned = now < r.stunnedUntilMs
                    const pct = Math.min(
                      100,
                      Math.max(0, (r.distance / FINISH_DISTANCE) * 100),
                    )

                    return (
                      <div
                        key={r.participantId}
                        data-testid={`racer-lane-${r.participantId}`}
                        data-distance={r.distance}
                        className={`relative rounded-2xl p-2.5 border transition-colors ${
                          isStunned
                            ? 'bg-red-950/70 border-red-500/70'
                            : r.finishedAtMs !== null
                              ? 'bg-emerald-950/70 border-emerald-400/70'
                              : 'bg-gradient-to-r from-rose-950/50 via-red-950/40 to-amber-950/50 border-amber-500/25'
                        }`}
                      >
                        {/* Ligne d'arrivée en damier à droite */}
                        <div className="absolute right-3 top-2 bottom-2 w-2 rounded bg-gradient-to-b from-amber-300 via-white to-amber-300 opacity-60" />

                        {/* Infos coureur en surimpression gauche */}
                        <div className="flex items-center justify-between text-xs mb-1.5 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white">
                              {id.hasCustomName && id.characterName
                                ? `${id.displayName} (${id.characterName})`
                                : id.displayName}
                            </span>
                            {r.combo >= 4 && !isStunned && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-400 text-amber-200 text-[11px] font-black">
                                🔥 Groove x{r.combo}
                              </span>
                            )}
                            {isStunned && (
                              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black animate-pulse">
                                😱 PRIS EN FLAG ! (-8 m)
                              </span>
                            )}
                            {!isStunned &&
                              ladyPresent &&
                              r.finishedAtMs === null && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-500 text-slate-200 text-[11px] font-semibold">
                                  🧐 Pose sérieuse…
                                </span>
                              )}
                          </div>

                          <div className="flex items-center gap-3 font-mono font-bold">
                            {r.caughtCount > 0 && (
                              <span className="text-red-300 text-[11px]">
                                🚨 {r.caughtCount} flag
                                {r.caughtCount > 1 ? 's' : ''}
                              </span>
                            )}
                            <span className="text-amber-300">
                              {r.finishedAtMs !== null
                                ? `🏁 ${(r.finishedAtMs / 1000).toFixed(1)}s`
                                : `${Math.round(r.distance)} m`}
                            </span>
                          </div>
                        </div>

                        {/* Barre de progression Tapis Rouge + Pion Avatar */}
                        <div className="relative h-12 bg-red-950/90 rounded-xl border border-amber-300/30 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-150 ${
                              isStunned
                                ? 'bg-gradient-to-r from-red-800 to-red-600'
                                : 'bg-gradient-to-r from-rose-700 via-amber-500 to-emerald-400'
                            }`}
                            style={{ width: `${Math.max(4, pct)}%` }}
                          />

                          {/* Avatar positionné sur la piste */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all duration-150"
                            style={{
                              left: `calc(${Math.min(92, Math.max(2, pct))}% - 12px)`,
                            }}
                          >
                            {id.avatar ? (
                              <img
                                src={id.avatar.imageUrl}
                                alt={id.avatar.name}
                                className={`w-10 h-10 rounded-full object-cover border-2 shadow-lg ${
                                  isStunned
                                    ? 'border-red-400 grayscale'
                                    : 'border-amber-300'
                                }`}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
                                🕺
                              </div>
                            )}
                            <span className="text-xl drop-shadow">
                              {isStunned
                                ? '😱'
                                : ladyPresent && r.finishedAtMs === null
                                  ? '🧐'
                                  : r.lastPose}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Overlay Compte à Rebours 3, 2, 1 */}
            {phase === 'countdown' && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 text-center p-6">
                <div className="text-sm font-black uppercase tracking-widest text-amber-300 mb-2">
                  Préparez vos deux pouces sur GAUCHE et DROITE !
                </div>
                <div className="text-8xl md:text-9xl font-black text-white animate-bounce">
                  {countdownSec}
                </div>
                <div className="text-slate-300 text-sm mt-3">
                  Dès que la porte s’ouvre : on lâche tout !
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          3. PODIUM FINAL & TROPHÉES (RESULT)
      ===================================================================== */}
      {phase === 'result' && (
        <div className="relative z-10 max-w-6xl w-full mx-auto my-auto space-y-6 py-4">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={450}
          />

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-black uppercase tracking-widest">
              🏆 PALMARÈS OFFICIEL • 10 DOWNING STREET GROOVE
            </div>
            <h1 className="text-3xl md:text-5xl font-black flex items-center justify-center gap-4">
              <ChristmasTree
                className="h-16 md:h-20 w-auto"
                withPresents={false}
              />
              Le Podium du Déhanché Ministériel
              <ChristmasTree
                className="h-16 md:h-20 w-auto"
                withPresents={false}
              />
            </h1>
          </div>

          {/* Podium Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rankedRacers.slice(0, 3).map((r, idx) => {
              const id = getParticipantIdentity({
                nickname: r.nickname,
                avatar_id: r.avatarId,
              })
              const medals = ['🥇 1er', '🥈 2e', '🥉 3e']
              const borders = [
                'border-amber-400 bg-gradient-to-b from-amber-950/70 to-slate-900',
                'border-slate-300 bg-slate-900/90',
                'border-amber-700 bg-slate-900/90',
              ]
              return (
                <div
                  key={r.participantId}
                  className={`rounded-3xl p-6 border-2 ${borders[idx]} flex flex-col items-center text-center shadow-2xl space-y-3`}
                >
                  <div className="text-2xl font-black">{medals[idx]}</div>
                  {id.avatar ? (
                    <img
                      src={id.avatar.imageUrl}
                      alt={id.avatar.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl">
                      🕺
                    </div>
                  )}
                  <div>
                    <div className="text-xl font-black text-white">
                      {id.displayName}
                    </div>
                    {id.characterName && (
                      <div className="text-xs font-bold text-rose-300">
                        {id.characterName}
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-mono font-black text-amber-300">
                    {r.finishedAtMs !== null
                      ? `🏁 100 m en ${(r.finishedAtMs / 1000).toFixed(1)} s`
                      : `${Math.round(r.distance)} m parcourus`}
                  </div>
                  <div className="flex gap-2 text-xs text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10">
                      🔥 Combo max : {r.maxCombo}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10">
                      🚨 Flags : {r.caughtCount}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chronique du 10 Downing Street */}
          <div className="bg-slate-900/90 border border-rose-400/30 rounded-3xl p-6 shadow-xl space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-rose-300">
              🎬 Le Rapport du Chef de Cabinet
            </div>
            <p className="text-slate-100 text-sm md:text-base leading-relaxed">
              {chronicle}
            </p>
          </div>

          {/* Les 4 Trophées Spéciaux */}
          {trophies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trophies.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900/90 border border-white/15 rounded-2xl p-4 space-y-2 shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{t.icon}</span>
                    <div className="font-black text-sm text-amber-300 leading-tight">
                      {t.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {t.avatarImageUrl && (
                      <img
                        src={t.avatarImageUrl}
                        alt={t.winnerName}
                        className="w-8 h-8 rounded-full object-cover border border-rose-400"
                      />
                    )}
                    <span className="font-bold text-xs text-white">
                      {t.winnerName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{t.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions de fin de course */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={startRace}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-base shadow-xl transition"
            >
              🔄 Rejouer la course (Même salon)
            </button>
            <Link
              href="/host/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base transition"
            >
              🎛️ Retour au Studio Hôte
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
