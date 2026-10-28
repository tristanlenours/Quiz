import { FunPodiumAndAnalysis } from '@/components/FunPodiumAndAnalysis'
import {
  GameResult,
  Participant,
  QuizSet,
  supabase,
} from '@/types/types'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

const PODIUM_FANFARE_URL =
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3b/17/e6/3b17e6c0-5a2a-2226-7c3f-6d0f57be6de9/mzaf_2188717033219073832.plus.aac.p.m4a'

export default function Results({
  participants,
  quizSet,
  gameId,
}: {
  participants: Participant[]
  quizSet: QuizSet
  gameId: string
}) {
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { width, height } = useWindowSize()

  useEffect(() => {
    const getResults = async () => {
      const { data, error } = await supabase
        .from('quiz_game_results')
        .select()
        .eq('game_id', gameId)
        .order('total_score', { ascending: false })
      if (error) {
        return alert(error.message)
      }
      if (data) setGameResults(data)
    }
    getResults()

    // Lancer la musique du final Love Actually (God Only Knows — The Beach Boys)
    if (audioRef.current) {
      audioRef.current.volume = 0.6
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false))
    }
  }, [gameId])

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsMusicPlaying(true))
    } else {
      audioRef.current.pause()
      setIsMusicPlaying(false)
    }
  }

  const handleReplayGame = async () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const participantIds = gameResults
      .map((r) => r.participant_id)
      .filter(Boolean) as string[]
    if (participantIds.length > 0) {
      await supabase
        .from('quiz_answers')
        .delete()
        .in('participant_id', participantIds)
    }
    await supabase
      .from('quiz_games')
      .update({
        phase: 'quiz',
        current_question_sequence: 0,
        is_answer_revealed: false,
      })
      .eq('id', gameId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 flex flex-col justify-between">
      <audio
        ref={audioRef}
        src={PODIUM_FANFARE_URL}
        loop
        preload="auto"
      />

      <div className="text-center pt-2 space-y-2">
        <div className="flex justify-center items-center gap-3 flex-wrap">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-bold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30">
            🏆 GRAND PODIUM & CÉRÉMONIE DES AWARDS
          </span>
          <button
            type="button"
            onClick={toggleMusic}
            className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition"
          >
            {isMusicPlaying
              ? '🔊 Final : God Only Knows (Pause)'
              : '🎵 Jouer la musique du Podium'}
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-black py-2.5 px-8 bg-white text-slate-900 inline-block rounded-2xl shadow-xl">
          {quizSet.name}
        </h1>
      </div>

      <div className="my-6">
        <FunPodiumAndAnalysis
          gameId={gameId}
          gameResults={gameResults}
          participants={participants}
        />
      </div>

      <div className="text-center pb-4 flex justify-center gap-4">
        <button
          onClick={handleReplayGame}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 font-bold text-white shadow-lg transition"
        >
          🔄 Rejouer ce Pack
        </button>
        <Link
          href="/host/dashboard"
          className="inline-block px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition"
        >
          ← Retour au Studio Hôte
        </Link>
      </div>

      <Confetti width={width} height={height} recycle={true} />
    </div>
  )
}
