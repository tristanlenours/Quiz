'use client'

import { Game, Participant, QuizSet, supabase } from '@/types/types'
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

  useEffect(() => {
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
      setQuizSet(data as unknown as QuizSet)
    }

    const fetchHostState = async () => {
      const { data: pData } = await supabase
        .from('quiz_participants')
        .select()
        .eq('game_id', gameId)
        .order('created_at')
      if (pData) setParticipants(pData)

      const { data: gData } = await supabase
        .from('quiz_games')
        .select()
        .eq('id', gameId)
        .single()
      if (gData) {
        setPinCode(gData.pin_code)
        setCurrentQuestionSequence(gData.current_question_sequence)
        setCurrentScreen(gData.phase as AdminScreens)
      }
    }

    getQuestions()
    fetchHostState()

    const channel = supabase
      .channel(`host_game_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quiz_participants',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          setParticipants((currentParticipants) => {
            const exists = currentParticipants.some(
              (p) => p.id === (payload.new as Participant).id
            )
            if (exists) return currentParticipants
            return [...currentParticipants, payload.new as Participant]
          })
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
      {currentScreen === AdminScreens.quiz &&
        quizSet &&
        quizSet.questions &&
        quizSet.questions[currentQuestionSequence] && (
          <Quiz
            question={quizSet.questions[currentQuestionSequence]}
            questionCount={quizSet.questions.length}
            gameId={gameId}
            participants={participants}
          />
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
