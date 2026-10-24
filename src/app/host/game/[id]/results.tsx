import {
  GameResult,
  Participant,
  QuizSet,
  supabase,
} from '@/types/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

export default function Results({
  quizSet,
  gameId,
}: {
  participants: Participant[]
  quizSet: QuizSet
  gameId: string
}) {
  const [gameResults, setGameResults] = useState<GameResult[]>([])
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
  }, [gameId])

  const handleReplayGame = async () => {
    // Supprimer les anciennes réponses des participants de cette session et relancer à la question 0
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-8 flex flex-col justify-between">
      <div className="text-center pt-4">
        <div className="text-sm uppercase tracking-widest text-indigo-400 font-bold mb-2">
          🏆 CLASSEMENT FINAL
        </div>
        <h1 className="text-4xl font-black py-3 px-10 bg-white text-slate-900 inline-block rounded-2xl shadow-xl">
          {quizSet.name}
        </h1>
      </div>

      <div className="max-w-2xl w-full mx-auto my-8 space-y-4">
        {gameResults.map((gameResult, index) => (
          <div
            key={gameResult.participant_id}
            className={`flex justify-between items-center bg-slate-900/90 border py-4 px-6 rounded-2xl w-full transition ${
              index === 0
                ? 'border-yellow-400 shadow-xl shadow-yellow-500/20 scale-105'
                : index === 1
                ? 'border-slate-300 shadow-lg'
                : index === 2
                ? 'border-amber-600 shadow-lg'
                : 'border-white/10'
            }`}
          >
            <div className="pr-4 text-3xl font-black w-14">
              {index === 0
                ? '🥇'
                : index === 1
                ? '🥈'
                : index === 2
                ? '🥉'
                : `#${index + 1}`}
            </div>
            <div
              className={`flex-grow font-black ${
                index < 3 ? 'text-3xl text-white' : 'text-xl text-slate-200'
              }`}
            >
              {gameResult.nickname}
            </div>
            <div className="pl-4 text-right">
              <span className="text-2xl font-mono font-black text-indigo-400">
                {gameResult.total_score}
              </span>
              <span className="text-sm text-slate-400 ml-1">pts</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pb-4 flex justify-center gap-4">
        <button
          onClick={handleReplayGame}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg transition"
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
