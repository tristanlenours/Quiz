'use client'

import { preloadAvatarImages } from '@/avatars'
import {
  Game,
  Participant,
  QuizSet,
  preloadQuestionImages,
  supabase,
} from '@/types/types'
import { useEffect, useState } from 'react'
import Lobby from './lobby'
import Quiz from './quiz'
import Results from './results'

enum AdminScreens {
  lobby = 'lobby',
  quiz = 'quiz',
  result = 'result',
}

export default function HostGamePage({
  params: { id: gameId },
}: {
  params: { id: string }
}) {
  const [currentScreen, setCurrentScreen] = useState<AdminScreens>(
    AdminScreens.lobby
  )
  const [participants, setParticipants] = useState<Participant[]>([])
  const [quizSet, setQuizSet] = useState<QuizSet>()
  const [pinCode, setPinCode] = useState<string>('')
  const [currentQuestionSequence, setCurrentQuestionSequence] = useState(0)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)

  useEffect(() => {
    preloadAvatarImages()

    const getQuestions = async () => {
      const { data: gameData, error: gameError } = await supabase
        .from('quiz_games')
        .select()
        .eq('id', gameId)
        .single()
      if (gameError) {
        console.error(gameError.message)
        return
      }
      setPinCode(gameData.pin_code)

      const { data, error } = await supabase
        .from('quiz_sets')
        .select(`*, questions:quiz_questions(*, choices:quiz_choices(*))`)
        .eq('id', gameData.quiz_set_id)
        .order('order', {
          ascending: true,
          referencedTable: 'quiz_questions',
        })
        .single()
      if (error) {
        console.error(error.message)
        return
      }
      const rawQuestions = ((data as any)?.questions || []) as any[]
      const sortedQuestions = [...rawQuestions].sort((a, b) => a.order - b.order)
      const sortedSet = { ...data, questions: sortedQuestions } as unknown as QuizSet
      setQuizSet(sortedSet)
      preloadQuestionImages(sortedQuestions)
    }

    const fetchHostState = async () => {
      const { data: pData } = await supabase
        .from('quiz_participants')
        .select()
        .eq('game_id', gameId)
        .order('created_at')
      if (pData) {
        setParticipants((prev) => {
          if (
            prev.length === pData.length &&
            prev.every((p, i) => p.id === pData[i]?.id)
          ) {
            return prev
          }
          return pData
        })
      }

      const { data: gData } = await supabase
        .from('quiz_games')
        .select()
        .eq('id', gameId)
        .single()
      if (gData) {
        setPinCode(gData.pin_code)
        setCurrentQuestionSequence(gData.current_question_sequence)
        setCurrentScreen(gData.phase as AdminScreens)
        setIsAnswerRevealed(Boolean(gData.is_answer_revealed))
      }
    }

    getQuestions()
    fetchHostState()

    const channel = supabase
      .channel(`host_game_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_participants',
          filter: `game_id=eq.${gameId}`,
        },
        () => {
          fetchHostState()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quiz_games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const game = payload.new as Game
          setCurrentQuestionSequence(game.current_question_sequence)
          setCurrentScreen(game.phase as AdminScreens)
          setIsAnswerRevealed(Boolean(game.is_answer_revealed))
        }
      )
      .subscribe()

    const pollInterval = setInterval(fetchHostState, 1500)

    return () => {
      clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [gameId])

  return (
    <main className="bg-slate-950 min-h-screen">
      {currentScreen === AdminScreens.lobby && (
        <Lobby
          participants={participants}
          gameId={gameId}
          pinCode={pinCode}
          quizName={quizSet?.name}
        />
      )}
      {currentScreen === AdminScreens.quiz && quizSet && quizSet.questions && (
        quizSet.questions[currentQuestionSequence] ? (
          <Quiz
            key={quizSet.questions[currentQuestionSequence].id}
            question={quizSet.questions[currentQuestionSequence]}
            questionCount={quizSet.questions.length}
            gameId={gameId}
            participants={participants}
            isAnswerRevealedProp={isAnswerRevealed}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen text-white gap-4">
            <div className="text-xl font-bold animate-pulse">Chargement de la manche...</div>
            <button
              onClick={() => setCurrentScreen(AdminScreens.result)}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 rounded-xl font-bold text-white shadow-xl transition"
            >
              🏆 Voir le Podium Final
            </button>
          </div>
        )
      )}
      {currentScreen === AdminScreens.result && quizSet && (
        <Results
          participants={participants}
          quizSet={quizSet}
          gameId={gameId}
        />
      )}
    </main>
  )
}
