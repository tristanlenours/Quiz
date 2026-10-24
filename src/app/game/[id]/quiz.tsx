import { QUESTION_ANSWER_TIME, TIME_TIL_CHOICE_REVEAL } from '@/constants'
import { Choice, Question, supabase } from '@/types/types'
import { useState, useEffect, useRef } from 'react'
import { ColorFormat, CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function Quiz({
  question,
  questionCount,
  participantId: playerId,
  isAnswerRevealed,
}: {
  question: Question
  questionCount: number
  participantId: string
  isAnswerRevealed: boolean
}) {
  const [chosenChoice, setChosenChoice] = useState<Choice | null>(null)
  const [hasShownChoices, setHasShownChoices] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [earnedScore, setEarnedScore] = useState<number>(0)
  const [mobileAudioEnabled, setMobileAudioEnabled] = useState(false)

  const mobileAudioRef = useRef<HTMLAudioElement | null>(null)
  const isBlindTest = question.question_type === 'blind_test'
  const answerDurationMs =
    (question.audio_duration_sec ? question.audio_duration_sec * 1000 : null) ||
    QUESTION_ANSWER_TIME

  useEffect(() => {
    setChosenChoice(null)
    setHasShownChoices(false)
    setEarnedScore(0)
    if (mobileAudioRef.current) {
      mobileAudioRef.current.pause()
    }

    // Utiliser setTimeout plutôt que onComplete de CountdownCircleTimer pour fonctionner même si l'onglet est en arrière-plan (Décision D11)
    const timer = setTimeout(() => {
      setHasShownChoices(true)
      setQuestionStartTime(Date.now())
    }, TIME_TIL_CHOICE_REVEAL)

    return () => clearTimeout(timer)
  }, [question.id])

  // Si le joueur a activé l'écoute mobile à distance (Décision D08)
  useEffect(() => {
    if (
      mobileAudioEnabled &&
      hasShownChoices &&
      !isAnswerRevealed &&
      isBlindTest &&
      question.audio_url &&
      mobileAudioRef.current
    ) {
      mobileAudioRef.current.currentTime = question.audio_start_sec || 0
      mobileAudioRef.current.play().catch(() => {})
    }
    if (isAnswerRevealed && mobileAudioRef.current) {
      mobileAudioRef.current.pause()
    }
  }, [
    mobileAudioEnabled,
    hasShownChoices,
    isAnswerRevealed,
    isBlindTest,
    question.audio_url,
    question.audio_start_sec,
  ])

  const answer = async (choice: Choice) => {
    setChosenChoice(choice)

    const now = Date.now()
    const score = !choice.is_correct
      ? 0
      : 1000 -
        Math.round(
          Math.max(0, Math.min((now - questionStartTime) / answerDurationMs, 1)) *
            1000
        )

    setEarnedScore(score)

    const { error } = await supabase.from('quiz_answers').upsert(
      {
        participant_id: playerId,
        question_id: question.id,
        choice_id: choice.id,
        score,
      },
      { onConflict: 'participant_id,question_id' }
    )
    if (error) {
      setChosenChoice(null)
      alert(error.message)
    }
  }

  return (
    <div className="h-screen flex flex-col items-stretch bg-slate-900 relative">
      {isBlindTest && question.audio_url && (
        <audio ref={mobileAudioRef} src={question.audio_url} preload="none" />
      )}

      <div className="text-center pt-6 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          {isBlindTest ? '🎵 Blind Test' : '❓ Quiz'}
        </div>
        <h2 className="text-xl bg-white text-slate-900 font-black mx-auto p-4 rounded-2xl block md:text-2xl shadow">
          {question.body}
        </h2>

        {/* Bouton optionnel pour écouter sur son téléphone à distance (Décision D08) */}
        {isBlindTest && question.audio_url && !isAnswerRevealed && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setMobileAudioEnabled((v) => !v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${
                mobileAudioEnabled
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {mobileAudioEnabled
                ? '🔊 Son téléphone activé (Cliquer pour couper)'
                : '🎧 Écouter sur mon téléphone (Mode à distance)'}
            </button>
          </div>
        )}
      </div>

      {!isAnswerRevealed && chosenChoice && (
        <div className="flex-grow flex justify-center items-center">
          <div className="text-white text-xl font-bold text-center p-6 bg-slate-800/80 rounded-2xl border border-white/10 mx-6">
            ⏳ Réponse enregistrée ! En attente des autres joueurs...
          </div>
        </div>
      )}

      {!hasShownChoices && !isAnswerRevealed && (
        <div className="flex-grow text-white flex flex-col items-center justify-center">
          <CountdownCircleTimer
            isPlaying
            duration={TIME_TIL_CHOICE_REVEAL / 1000}
            colors={['#6366f1', '#6366f1', '#6366f1', '#6366f1']}
            trailColor={'transparent' as ColorFormat}
            colorsTime={[5, 3, 1, 0]}
          >
            {({ remainingTime }) => (
              <span className="text-4xl font-black">{remainingTime}</span>
            )}
          </CountdownCircleTimer>
          <p className="mt-4 text-slate-400 text-sm">Préparez-vous...</p>
        </div>
      )}

      {hasShownChoices && !isAnswerRevealed && !chosenChoice && (
        <div className="flex-grow flex flex-col items-stretch">
          <div className="flex-grow"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {question.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => answer(choice)}
                disabled={chosenChoice !== null || isAnswerRevealed}
                className={`px-5 py-6 w-full text-xl rounded-2xl text-white font-black flex justify-between items-center shadow-lg active:scale-95 transition
              ${
                index === 0
                  ? 'bg-red-500'
                  : index === 1
                  ? 'bg-blue-500'
                  : index === 2
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              >
                <div className="text-left">{choice.body}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isAnswerRevealed && (
        <div className="flex-grow flex justify-center items-center flex-col p-6 space-y-4">
          <div
            className={`text-white rounded-full w-20 h-20 flex items-center justify-center text-4xl shadow-xl ${
              chosenChoice?.is_correct ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {chosenChoice?.is_correct ? '✓' : '✕'}
          </div>
          <h2 className="text-white text-3xl font-black text-center">
            {chosenChoice?.is_correct
              ? `Exact ! +${earnedScore} pts`
              : 'Dommage !'}
          </h2>

          {/* Révélation du morceau sur mobile en mode Blind Test */}
          {isBlindTest && (question.reveal_title || question.reveal_artist) && (
            <div className="flex items-center gap-4 bg-slate-800 border border-indigo-500/40 p-4 rounded-2xl max-w-sm w-full">
              {question.reveal_cover_url && (
                <img
                  src={question.reveal_cover_url}
                  alt={question.reveal_title || 'Cover'}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <div className="text-left">
                <div className="text-xs uppercase text-indigo-400 font-bold">
                  Morceau mystère
                </div>
                <div className="text-white font-black">
                  {question.reveal_title}
                </div>
                <div className="text-slate-300 text-sm">
                  {question.reveal_artist}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between text-white py-3 px-4 items-center bg-slate-950 border-t border-white/10">
        <div className="text-lg font-bold">
          Manche {question.order + 1}/{questionCount}
        </div>
      </div>
    </div>
  )
}
