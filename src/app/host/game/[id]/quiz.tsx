import { TIME_TIL_CHOICE_REVEAL } from '@/constants'
import { Answer, Participant, Question, supabase } from '@/types/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function Quiz({
  question,
  questionCount,
  gameId,
  participants,
}: {
  question: Question
  questionCount: number
  gameId: string
  participants: Participant[]
}) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)
  const [hasShownChoices, setHasShownChoices] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const answerStateRef = useRef<Answer[]>()
  answerStateRef.current = answers

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isBlindTest = question.question_type === 'blind_test'
  const answerDurationSec = question.audio_duration_sec || 20

  const getNextQuestion = async () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const updateData =
      questionCount === question.order + 1
        ? { phase: 'result' }
        : {
            current_question_sequence: question.order + 1,
            is_answer_revealed: false,
          }

    const { error } = await supabase
      .from('quiz_games')
      .update(updateData)
      .eq('id', gameId)
    if (error) {
      return alert(error.message)
    }
  }

  const onTimeUp = useCallback(async () => {
    setIsAnswerRevealed(true)
    await supabase
      .from('quiz_games')
      .update({
        is_answer_revealed: true,
      })
      .eq('id', gameId)
  }, [gameId])

  const fetchAnswers = useCallback(async () => {
    const { data } = await supabase
      .from('quiz_answers')
      .select()
      .eq('question_id', question.id)
    if (data) {
      setAnswers(data)
      if (participants.length > 0 && data.length >= participants.length) {
        onTimeUp()
      }
    }
  }, [question.id, participants.length, onTimeUp])

  useEffect(() => {
    setIsAnswerRevealed(false)
    setHasShownChoices(false)
    setAnswers([])
    setIsAudioPlaying(false)

    const revealTimer = setTimeout(() => {
      setHasShownChoices(true)
    }, TIME_TIL_CHOICE_REVEAL)

    const channel = supabase
      .channel(`host_answers_${question.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quiz_answers',
          filter: `question_id=eq.${question.id}`,
        },
        () => {
          fetchAnswers()
        }
      )
      .subscribe()

    const pollInterval = setInterval(fetchAnswers, 1500)

    return () => {
      clearTimeout(revealTimer)
      clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [question.id, fetchAnswers])

  // Déclencher la lecture audio sur l'Écran Hôte dès que les choix s'affichent (Décision D08)
  useEffect(() => {
    if (
      hasShownChoices &&
      isBlindTest &&
      question.audio_url &&
      audioRef.current
    ) {
      const audio = audioRef.current
      audio.currentTime = question.audio_start_sec || 0
      audio
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => {
          console.warn('Autoplay audio bloqué par le navigateur :', err)
          setIsAudioPlaying(false)
        })
    }
  }, [
    hasShownChoices,
    isBlindTest,
    question.audio_url,
    question.audio_start_sec,
  ])

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsAudioPlaying(true))
    } else {
      audioRef.current.pause()
      setIsAudioPlaying(false)
    }
  }

  return (
    <div className="h-screen flex flex-col items-stretch bg-slate-900 relative overflow-hidden">
      {isBlindTest && question.audio_url && (
        <audio
          ref={audioRef}
          src={question.audio_url}
          onEnded={() => setIsAudioPlaying(false)}
          preload="auto"
        />
      )}

      <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
        {!isAnswerRevealed && hasShownChoices && (
          <button
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition"
            onClick={onTimeUp}
          >
            ⏭️ Révéler maintenant
          </button>
        )}
        {isAnswerRevealed && (
          <button
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
            onClick={getNextQuestion}
          >
            {questionCount === question.order + 1
              ? '🏆 Voir le Podium'
              : 'Manche suivante →'}
          </button>
        )}
      </div>

      <div className="text-center pt-8 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3">
          {isBlindTest ? '🎵 Blind Test Musical' : '❓ Question Quiz'}
        </div>
        <h2 className="text-3xl md:text-4xl bg-white text-slate-900 font-black mx-auto max-w-4xl p-5 rounded-2xl shadow-xl block">
          {question.body}
        </h2>
      </div>

      <div className="flex-grow text-white px-8 flex flex-col justify-center">
        {!hasShownChoices && !isAnswerRevealed && (
          <div className="flex flex-col items-center gap-6">
            {/* Illustration visible dès l'affichage de la question (Décision D16) */}
            {!isBlindTest && question.image_url && (
              <img
                src={question.image_url}
                alt="Illustration question"
                className="max-h-[50vh] max-w-full rounded-2xl shadow-lg object-contain"
              />
            )}
            <div className="text-center text-2xl text-slate-300 animate-pulse font-semibold">
              {isBlindTest
                ? '🎧 Préparez vos oreilles...'
                : '👀 Lisez bien la question...'}
            </div>
          </div>
        )}

        {hasShownChoices && !isAnswerRevealed && (
          <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
            <div className="text-5xl font-black">
              <CountdownCircleTimer
                onComplete={() => {
                  onTimeUp()
                }}
                isPlaying
                duration={answerDurationSec}
                colors={['#6366f1', '#F7B801', '#ef4444', '#ef4444']}
                colorsTime={[
                  Math.round(answerDurationSec * 0.6),
                  Math.round(answerDurationSec * 0.3),
                  3,
                  0,
                ]}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>

            {/* Zone centrale : Image Quiz ou Vinyle Blind Test */}
            <div className="flex flex-col items-center justify-center mx-6">
              {isBlindTest ? (
                <div className="flex flex-col items-center gap-4">
                  <div
                    onClick={toggleAudio}
                    className={`cursor-pointer w-36 h-36 rounded-full border-8 border-slate-700 bg-gradient-to-tr from-indigo-900 via-slate-950 to-purple-900 flex items-center justify-center shadow-2xl ${
                      isAudioPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '4s' }}
                    title="Cliquer pour lecture/pause"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-2xl">
                      🎵
                    </div>
                  </div>
                  <button
                    onClick={toggleAudio}
                    className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold"
                  >
                    {isAudioPlaying
                      ? '🔊 Lecture en cours (Pause)'
                      : '▶️ Relancer le son'}
                  </button>
                </div>
              ) : (
                question.image_url && (
                  <img
                    src={question.image_url}
                    alt="Illustration question"
                    className="max-h-[50vh] max-w-full rounded-2xl shadow-lg object-contain"
                  />
                )
              )}
            </div>

            <div className="text-center bg-slate-800/80 px-8 py-5 rounded-2xl border border-white/10">
              <div className="text-6xl font-black pb-1 text-indigo-400">
                {answers.length}
                <span className="text-2xl text-slate-400">
                  /{participants.length}
                </span>
              </div>
              <div className="text-lg uppercase tracking-wider text-slate-300 font-semibold">
                Réponses
              </div>
            </div>
          </div>
        )}

        {isAnswerRevealed && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl w-full mx-auto">
            {/* Carte de révélation Blind Test (Décision D04) */}
            {isBlindTest &&
              (question.reveal_title || question.reveal_artist) && (
                <div className="flex items-center gap-5 bg-slate-800/90 border border-indigo-500/40 p-5 rounded-2xl shadow-2xl max-w-md">
                  {question.reveal_cover_url ? (
                    <img
                      src={question.reveal_cover_url}
                      alt={question.reveal_title || 'Pochette'}
                      className="w-28 h-28 rounded-xl object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-xl bg-indigo-600/30 flex items-center justify-center text-4xl">
                      💿
                    </div>
                  )}
                  <div>
                    <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-1">
                      Révélation Musicale
                    </div>
                    <div className="text-2xl font-black text-white leading-tight">
                      {question.reveal_title}
                    </div>
                    {question.reveal_artist && (
                      <div className="text-lg text-slate-300 font-semibold mt-1">
                        {question.reveal_artist}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Histogramme des réponses */}
            <div className="flex justify-center">
              {question.choices.map((choice, index) => (
                <div
                  key={choice.id}
                  className="mx-2 h-44 w-20 flex flex-col items-stretch justify-end"
                >
                  <div className="flex-grow relative">
                    <div
                      style={{
                        height: `${
                          (answers.filter(
                            (answer) => answer.choice_id === choice.id
                          ).length *
                            100) /
                          (answers.length || 1)
                        }%`,
                      }}
                      className={`absolute bottom-0 left-0 right-0 mb-1 rounded-t transition-all ${
                        index === 0
                          ? 'bg-red-500'
                          : index === 1
                          ? 'bg-blue-500'
                          : index === 2
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <div
                    className={`mt-1 text-white text-lg font-bold text-center py-2 rounded-b ${
                      index === 0
                        ? 'bg-red-500'
                        : index === 1
                        ? 'bg-blue-500'
                        : index === 2
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {
                      answers.filter((answer) => answer.choice_id === choice.id)
                        .length
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Affichage non-cliquable des choix sur l'écran Hôte (TV) — Décision D13 */}
      {hasShownChoices && (
        <div className="flex justify-between flex-wrap p-4">
          {question.choices.map((choice, index) => (
            <div key={choice.id} className="w-1/2 p-1.5">
              <div
                className={`px-6 py-5 w-full text-2xl rounded-xl font-bold text-white flex justify-between items-center shadow-lg
                ${
                  index === 0
                    ? 'bg-red-500'
                    : index === 1
                    ? 'bg-blue-500'
                    : index === 2
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }
                ${isAnswerRevealed && !choice.is_correct ? 'opacity-40' : ''}
               `}
              >
                <div>{choice.body}</div>
                {isAnswerRevealed && (
                  <div>
                    {choice.is_correct ? (
                      <span className="text-3xl">✅</span>
                    ) : (
                      <span className="text-2xl opacity-75">✖</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between text-white py-3 px-6 items-center bg-slate-950 border-t border-white/10">
        <div className="text-xl font-bold">
          Manche {question.order + 1} / {questionCount}
        </div>
        <div className="text-sm text-slate-400">
          {isBlindTest ? '🎵 Mode Blind Test' : '❓ Mode Quiz'}
        </div>
      </div>
    </div>
  )
}
