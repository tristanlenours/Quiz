'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getParticipantIdentity, preloadAvatarImages } from '@/avatars'
import { FunPodiumAndAnalysis } from '@/components/FunPodiumAndAnalysis'
import {
  Game,
  GameResult,
  Participant,
  Question,
  preloadQuestionImages,
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
    preloadQuestionImages(data as unknown as Question[])
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
    preloadAvatarImages()

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
          } else {
            setCurrentScreen(Screens.lobby)
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
            participant={participant}
            gameId={gameId}
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
  const [gameResults, setGameResults] = useState<GameResult[]>([])
  const [allParticipants, setAllParticipants] = useState<Participant[]>([])
  const [myResult, setMyResult] = useState<GameResult | null>(null)
  const [rank, setRank] = useState<number | null>(null)

  const identity = getParticipantIdentity(participant)

  useEffect(() => {
    const fetchScore = async () => {
      const [{ data: resData }, { data: pData }] = await Promise.all([
        supabase
          .from('quiz_game_results')
          .select()
          .eq('game_id', gameId)
          .order('total_score', { ascending: false }),
        supabase.from('quiz_participants').select().eq('game_id', gameId),
      ])

      if (pData) setAllParticipants(pData)
      if (resData) {
        setGameResults(resData)
        const idx = resData.findIndex(
          (r) => r.participant_id === participant.id
        )
        if (idx !== -1) {
          setMyResult(resData[idx])
          setRank(idx + 1)
        }
      }
    }
    fetchScore()
  }, [gameId, participant.id])

  return (
    <div className="min-h-screen text-center p-4 md:p-8 bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 text-white space-y-6">
      {/* Carte Trophée Personnel du Joueur */}
      <div className="p-6 bg-slate-900/95 border-2 border-rose-400/40 text-white rounded-3xl max-w-lg mx-auto shadow-2xl space-y-3">
        <div className="flex flex-col items-center">
          {identity.avatar ? (
            <div className="relative">
              <img
                src={identity.avatar.imageUrl}
                alt={identity.avatar.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-400 shadow-2xl"
              />
              <span className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-slate-900 border-2 border-rose-400 flex items-center justify-center text-xl shadow">
                {rank === 1
                  ? '🥇'
                  : rank === 2
                  ? '🥈'
                  : rank === 3
                  ? '🥉'
                  : identity.avatar.emoji}
              </span>
            </div>
          ) : (
            <div className="text-5xl">
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🎉'}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-black">
            Bravo {identity.displayName} !
          </h2>
          {identity.characterName && (
            <div className="text-xs font-bold text-rose-300">
              alias {identity.characterName} ({identity.avatar?.actor})
            </div>
          )}
        </div>

        {myResult && (
          <div className="bg-slate-950 rounded-2xl p-4 border border-indigo-500/30 flex justify-around items-center">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-slate-400">
                Ton Rang
              </div>
              <div className="text-2xl font-black text-amber-400 mt-0.5">
                {rank ? `#${rank}` : '-'} / {gameResults.length}
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-[11px] uppercase tracking-widest text-slate-400">
                Score Final
              </div>
              <div className="text-3xl font-mono font-black text-indigo-400 mt-0.5">
                {myResult.total_score} pts
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Podium Top 3, Débrief IA / Déterministe & Classement complet */}
      <FunPodiumAndAnalysis
        gameId={gameId}
        gameResults={gameResults}
        participants={allParticipants}
        highlightParticipantId={participant.id}
        compact
      />
    </div>
  )
}
