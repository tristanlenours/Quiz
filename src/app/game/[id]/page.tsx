'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Game,
  GameResult,
  Participant,
  Question,
  supabase,
} from '@/types/types'
import Lobby from './lobby'
import Quiz from './quiz'

enum Screens {
  lobby = 'lobby',
  quiz = 'quiz',
  results = 'result',
}

export default function PlayerGamePage({
  params: { id: gameId },
}: {
  params: { id: string }
}) {
  const stateRef = useRef<Participant | null>()
  const [participant, setParticipant] = useState<Participant | null>()
  stateRef.current = participant

  const [currentScreen, setCurrentScreen] = useState(Screens.lobby)
  const [questions, setQuestions] = useState<Question[]>()
  const [currentQuestionSequence, setCurrentQuestionSequence] = useState(0)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)

  const getQuestions = useCallback(async (quizSetId: string) => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select(`*, choices:quiz_choices(*)`)
      .eq('quiz_set_id', quizSetId)
      .order('order', { ascending: true })
    if (error) {
      console.error(error.message)
      return
    }
    setQuestions(data as unknown as Question[])
  }, [])

  const syncGameState = useCallback(async () => {
    const { data: game } = await supabase
      .from('quiz_games')
      .select()
      .eq('id', gameId)
      .single()
    if (!game) return

    if (!questions) {
      getQuestions(game.quiz_set_id)
    }

    if (!stateRef.current) return

    if (game.phase === 'result') {
      setCurrentScreen(Screens.results)
    } else if (game.phase === 'quiz') {
      setCurrentScreen(Screens.quiz)
      setCurrentQuestionSequence(game.current_question_sequence)
      setIsAnswerRevealed(game.is_answer_revealed)
    } else {
      setCurrentScreen(Screens.lobby)
    }
  }, [gameId, getQuestions, questions])

  const onRegisterCompleted = useCallback(
    (registeredParticipant: Participant) => {
      setParticipant(registeredParticipant)
      stateRef.current = registeredParticipant
      syncGameState()
    },
    [syncGameState]
  )

  useEffect(() => {
    const gameChannel = supabase
      .channel(`game_participant_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quiz_games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (!stateRef.current) return
          const game = payload.new as Game

          if (game.phase === 'result') {
            setCurrentScreen(Screens.results)
          } else if (game.phase === 'quiz') {
            setCurrentScreen(Screens.quiz)
            setCurrentQuestionSequence(game.current_question_sequence)
            setIsAnswerRevealed(game.is_answer_revealed)
          }
        }
      )
      .subscribe()

    // Polling de secours toutes les 1.5s au cas où Realtime WebSocket est filtré (Décision D10)
    const pollInterval = setInterval(() => {
      if (stateRef.current) {
        syncGameState()
      }
    }, 1500)

    return () => {
      clearInterval(pollInterval)
      supabase.removeChannel(gameChannel)
    }
  }, [gameId, syncGameState])

  return (
    <main className="bg-slate-950 min-h-screen">
      {currentScreen === Screens.lobby && (
        <Lobby onRegisterCompleted={onRegisterCompleted} gameId={gameId} />
      )}
      {currentScreen === Screens.quiz &&
        questions &&
        questions[currentQuestionSequence] &&
        participant && (
          <Quiz
            question={questions[currentQuestionSequence]}
            questionCount={questions.length}
            participantId={participant.id}
            isAnswerRevealed={isAnswerRevealed}
          />
        )}
      {currentScreen === Screens.results && participant && (
        <Results participant={participant} gameId={gameId} />
      )}
    </main>
  )
}

function Results({
  participant,
  gameId,
}: {
  participant: Participant
  gameId: string
}) {
  const [myResult, setMyResult] = useState<GameResult | null>(null)
  const [rank, setRank] = useState<number | null>(null)

  useEffect(() => {
    const fetchScore = async () => {
      const { data } = await supabase
        .from('quiz_game_results')
        .select()
        .eq('game_id', gameId)
        .order('total_score', { ascending: false })
      if (data) {
        const idx = data.findIndex((r) => r.participant_id === participant.id)
        if (idx !== -1) {
          setMyResult(data[idx])
          setRank(idx + 1)
        }
      }
    }
    fetchScore()
  }, [gameId, participant.id])

  return (
    <div className="flex justify-center items-center min-h-screen text-center p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
      <div className="p-8 bg-slate-900 border border-white/15 text-white rounded-3xl max-w-sm w-full shadow-2xl space-y-4">
        <div className="text-5xl">
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🎉'}
        </div>
        <h2 className="text-2xl font-black">Bravo {participant.nickname} !</h2>
        {myResult && (
          <div className="bg-slate-950 rounded-2xl p-4 border border-indigo-500/30">
            <div className="text-xs uppercase tracking-widest text-slate-400">
              Score Final {rank ? `• #${rank}` : ''}
            </div>
            <div className="text-4xl font-mono font-black text-indigo-400 mt-1">
              {myResult.total_score} pts
            </div>
          </div>
        )}
        <p className="text-slate-400 text-sm">
          Regarde le podium sur l&apos;écran principal !
        </p>
      </div>
    </div>
  )
}
