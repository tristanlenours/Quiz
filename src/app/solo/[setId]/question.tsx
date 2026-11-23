'use client'

import {
  DEFAULT_QUESTION_DURATION_SEC,
  TIME_TIL_CHOICE_REVEAL,
} from '@/constants'
import { computeAnswerScore } from '@/scoring'
import { Choice, Question, getYouTubeEmbedUrl } from '@/types/types'
import { useExtractEnded } from '@/useExtractEnded'
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { ColorFormat, CountdownCircleTimer } from 'react-countdown-circle-timer'

type Stage = 'reading' | 'answering' | 'revealed'

const CHOICE_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500']

/**
 * Une manche de l'Écran Solo (D62) : même cadencement que le live (5 s de lecture,
 * chrono = durée de l'extrait, barème 1000 → 500), mais l'écran diffuse lui-même
 * image, extrait YouTube et son, puisqu'il n'y a pas de TV. Comme sur la TV, son et
 * vidéo partent dès l'affichage de la question (D81).
 */
export default function SoloQuestion({
  question,
  questionCount,
  totalScore,
  audioRef,
  isLast,
  onAnswer,
  onNext,
}: {
  question: Question
  questionCount: number
  totalScore: number
  audioRef: MutableRefObject<HTMLAudioElement | null>
  isLast: boolean
  onAnswer: (choice: Choice | null, score: number) => void
  onNext: () => void
}) {
  const [stage, setStage] = useState<Stage>('reading')
  const [chosen, setChosen] = useState<Choice | null>(null)
  const [earned, setEarned] = useState(0)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const startedAtRef = useRef(0)
  const stageRef = useRef<Stage>('reading')
  // Rappel du parent gardé en ref : un nouveau rendu du parent ne doit pas relancer le chrono
  const onAnswerRef = useRef(onAnswer)
  onAnswerRef.current = onAnswer

  const isBlindTest = question.question_type === 'blind_test'
  const durationSec = question.audio_duration_sec || DEFAULT_QUESTION_DURATION_SEC
  const durationMs = durationSec * 1000
  const videoEmbedUrl = isBlindTest
    ? null
    : getYouTubeEmbedUrl(question.video_url, question.audio_start_sec || 0, durationSec)
  const hasAudioTrack = Boolean(question.audio_url && !videoEmbedUrl)
  const showImage = !isBlindTest && Boolean(question.image_url)
  const isPlaying = stage !== 'revealed'
  // Extrait vidéo retiré une fois terminé, avant la fin du chrono (D81)
  const isVideoEnded = useExtractEnded(question.id, Boolean(videoEmbedUrl) && isPlaying, durationSec)
  const showVideo = Boolean(videoEmbedUrl) && isPlaying && !isVideoEnded

  const stopAudio = useCallback(() => {
    audioRef.current?.pause()
  }, [audioRef])

  const reveal = useCallback(
    (choice: Choice | null) => {
      if (stageRef.current !== 'answering') return
      stageRef.current = 'revealed'
      const score = choice
        ? computeAnswerScore(choice.is_correct, Date.now() - startedAtRef.current, durationMs)
        : 0
      setChosen(choice)
      setEarned(score)
      setStage('revealed')
      stopAudio()
      onAnswerRef.current(choice, score)
    },
    [durationMs, stopAudio]
  )

  // Lecture de 5 s, puis choix et chrono (timers en setTimeout : D11)
  useEffect(() => {
    stopAudio()
    const readingTimer = setTimeout(() => {
      stageRef.current = 'answering'
      startedAtRef.current = Date.now()
      setStage('answering')
    }, TIME_TIL_CHOICE_REVEAL)
    return () => {
      clearTimeout(readingTimer)
      stopAudio()
    }
  }, [question.id, stopAudio])

  // Chrono écoulé sans réponse
  useEffect(() => {
    if (stage !== 'answering') return
    const timeUp = setTimeout(() => reveal(null), durationMs)
    return () => clearTimeout(timeUp)
  }, [stage, durationMs, reveal])

  // Son de la manche (Blind Test ou quiz sonorisé), lu sur cet écran dès l'affichage de la
  // question, sans attendre la fin de la lecture (D81). La manche est remontée à chaque question.
  useEffect(() => {
    if (!hasAudioTrack || !audioRef.current || !question.audio_url) return
    const audio = audioRef.current
    if (audio.getAttribute('src') !== question.audio_url) audio.src = question.audio_url
    audio.volume = isBlindTest ? 1.0 : 0.65
    const start = () => {
      audio.currentTime = question.audio_start_sec || 0
      audio
        .play()
        .then(() => setAudioBlocked(false))
        .catch(() => setAudioBlocked(true))
    }
    if (audio.readyState >= 1) start()
    else audio.addEventListener('loadedmetadata', start, { once: true })
    return () => audio.removeEventListener('loadedmetadata', start)
  }, [hasAudioTrack, audioRef, question.audio_url, question.audio_start_sec, isBlindTest])

  const retryAudio = () => {
    audioRef.current
      ?.play()
      .then(() => setAudioBlocked(false))
      .catch(() => setAudioBlocked(true))
  }

  const correctChoice = question.choices.find((c) => c.is_correct)

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-900 text-white">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
          {isBlindTest ? '🎵 Blind Test' : '🎬 Manche'} {question.order + 1}/{questionCount}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-black">
          {totalScore} pts
        </span>
      </div>

      <div className="px-4 pt-3">
        <h2 className="text-lg md:text-2xl bg-white text-slate-900 font-black p-3.5 rounded-2xl shadow">
          {question.body}
        </h2>
      </div>

      {/* Média : image, vidéo et son dès la lecture, comme sur la TV en live (D81) */}
      <div className="flex flex-col items-center justify-center px-4 py-3 gap-3">
        {showVideo && (
          // Zoom recadré : le titre incrusté par YouTube peut donner la réponse (D48)
          <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
            <iframe
              key={question.id}
              src={videoEmbedUrl!}
              title="Extrait vidéo"
              allow="autoplay; encrypted-media; picture-in-picture"
              className="w-full h-full border-0 scale-[1.35]"
            />
          </div>
        )}
        {showImage && !showVideo && (
          <img
            src={question.image_url!}
            alt="Illustration question"
            className="max-h-[38vh] max-w-full rounded-2xl shadow-lg object-contain"
          />
        )}
        {isPlaying && isBlindTest && (
          <div
            className={`w-28 h-28 rounded-full border-8 border-slate-700 bg-gradient-to-tr from-rose-900 via-slate-950 to-indigo-900 flex items-center justify-center shadow-2xl ${
              audioBlocked ? '' : 'animate-spin'
            }`}
            style={{ animationDuration: '4s' }}
          >
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-xl">🎵</div>
          </div>
        )}
        {isPlaying && hasAudioTrack && audioBlocked && (
          <button
            type="button"
            onClick={retryAudio}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-bold"
          >
            ▶️ Lancer le son
          </button>
        )}
        {showVideo && (
          <p className="text-[11px] text-slate-400">Si la vidéo ne démarre pas, touche-la.</p>
        )}
      </div>

      {stage === 'reading' && (
        <div className="flex flex-col items-center justify-center py-4 gap-2">
          <CountdownCircleTimer
            key={`solo_preview_${question.id}`}
            isPlaying
            duration={TIME_TIL_CHOICE_REVEAL / 1000}
            size={110}
            strokeWidth={8}
            colors={['#f43f5e', '#6366f1', '#F7B801', '#ef4444']}
            trailColor={'transparent' as ColorFormat}
            colorsTime={[4, 3, 2, 0]}
          >
            {({ remainingTime }) => <span className="text-3xl font-black">{remainingTime}</span>}
          </CountdownCircleTimer>
          <p className="text-slate-400 text-xs font-semibold animate-pulse">
            {isBlindTest ? '🎧 Écoute bien...' : '👀 Lis bien la question...'}
          </p>
        </div>
      )}

      {stage === 'answering' && (
        <div className="mt-auto">
          <div className="flex justify-center pb-1">
            <CountdownCircleTimer
              key={`solo_answer_${question.id}`}
              isPlaying
              duration={durationSec}
              size={64}
              strokeWidth={6}
              colors={['#f43f5e', '#6366f1', '#F7B801', '#ef4444']}
              colorsTime={[Math.round(durationSec * 0.6), Math.round(durationSec * 0.3), 3, 0]}
            >
              {({ remainingTime }) => <span className="text-xl font-black">{remainingTime}</span>}
            </CountdownCircleTimer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5">
            {question.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => reveal(choice)}
                className={`px-4 py-5 w-full text-lg rounded-2xl text-white font-black text-left leading-snug shadow-lg active:scale-95 transition ${CHOICE_COLORS[index] ?? 'bg-slate-600'}`}
              >
                {choice.body}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'revealed' && (
        <div className="mt-auto p-3.5 space-y-3">
          <div className="text-center">
            <div className="text-2xl font-black">
              {chosen?.is_correct ? `Exact ! +${earned} pts` : chosen ? 'Dommage !' : 'Temps écoulé !'}
            </div>
            {!chosen?.is_correct && correctChoice && (
              <div className="text-sm text-slate-300 mt-0.5">
                La bonne réponse : <span className="font-black text-emerald-300">{correctChoice.body}</span>
              </div>
            )}
          </div>

          {isBlindTest && (question.reveal_title || question.reveal_artist) && (
            <div className="flex items-center gap-3.5 bg-slate-800 border border-indigo-500/40 p-3 rounded-2xl">
              {question.reveal_cover_url && (
                <img
                  src={question.reveal_cover_url}
                  alt={question.reveal_title || 'Pochette'}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0">
                <div className="text-[10px] uppercase text-indigo-400 font-bold">🎵 Morceau mystère</div>
                <div className="font-black text-sm truncate">{question.reveal_title}</div>
                <div className="text-slate-300 text-xs truncate">{question.reveal_artist}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.choices.map((choice, index) => (
              <div
                key={choice.id}
                data-testid={`solo-choice-tile-${index}`}
                className={`px-4 py-3 rounded-xl font-bold flex justify-between items-center gap-2 ${
                  CHOICE_COLORS[index] ?? 'bg-slate-600'
                } ${choice.is_correct ? '' : 'opacity-40'} ${
                  chosen?.id === choice.id ? 'ring-4 ring-white' : ''
                }`}
              >
                <span>{choice.body}</span>
                <span>{choice.is_correct ? '✅' : '✖'}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 font-black text-lg shadow-xl active:scale-95 transition"
          >
            {isLast ? '🏆 Voir mon score' : 'Manche suivante →'}
          </button>
        </div>
      )}
    </div>
  )
}
