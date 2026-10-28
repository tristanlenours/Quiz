import { getParticipantIdentity } from '@/avatars'
import {
  DEFAULT_QUESTION_DURATION_SEC,
  TIME_TIL_CHOICE_REVEAL,
} from '@/constants'
import {
  Answer,
  GameResult,
  Participant,
  Question,
  getYouTubeEmbedUrl,
  supabase,
} from '@/types/types'
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
  const [liveStandings, setLiveStandings] = useState<GameResult[]>([])

  // Verrous synchrones pour éviter toute race condition entre le polling 1.5s et le passage à la manche suivante (Décision D24)
  const hasRevealedRef = useRef(false)
  const hasShownChoicesRef = useRef(false)
  const isTransitioningRef = useRef(false)
  const currentQuestionIdRef = useRef(question.id)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isBlindTest = question.question_type === 'blind_test'
  const answerDurationSec =
    question.audio_duration_sec || DEFAULT_QUESTION_DURATION_SEC
  const videoEmbedUrl = isBlindTest
    ? null
    : getYouTubeEmbedUrl(
        question.video_url,
        question.audio_start_sec || 0,
        answerDurationSec
      )
  const hasAudioTrack = Boolean(question.audio_url && !videoEmbedUrl)
  // Zone image / vidéo agrandie : elle occupe toute la hauteur disponible (Décision D20)
  const hasMedia = !isBlindTest && Boolean(videoEmbedUrl || question.image_url)

  const fetchStandings = useCallback(async () => {
    const { data } = await supabase
      .from('quiz_game_results')
      .select()
      .eq('game_id', gameId)
      .order('total_score', { ascending: false })
    if (data) setLiveStandings(data)
  }, [gameId])

  const onTimeUp = useCallback(async () => {
    if (hasRevealedRef.current || isTransitioningRef.current) return
    hasRevealedRef.current = true
    setIsAnswerRevealed(true)

    const targetQuestionId = currentQuestionIdRef.current
    await supabase
      .from('quiz_games')
      .update({
        is_answer_revealed: true,
      })
      .eq('id', gameId)

    if (currentQuestionIdRef.current === targetQuestionId) {
      fetchStandings()
    }
  }, [gameId, fetchStandings])

  const getNextQuestion = async () => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    hasRevealedRef.current = true

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
      isTransitioningRef.current = false
      return alert(error.message)
    }
  }

  const fetchAnswers = useCallback(async () => {
    const targetQuestionId = question.id
    if (
      currentQuestionIdRef.current !== targetQuestionId ||
      isTransitioningRef.current
    ) {
      return
    }

    const currentParticipantIds = participants.map((p) => p.id)
    if (currentParticipantIds.length === 0) {
      setAnswers([])
      return
    }

    // IMPORTANT (Décision D24) : Filtrer strictement par les participants de la partie en cours (`gameId`)
    // pour ne jamais compter les réponses d'anciennes parties sur cette même question !
    const { data } = await supabase
      .from('quiz_answers')
      .select()
      .eq('question_id', targetQuestionId)
      .in('participant_id', currentParticipantIds)

    if (
      !data ||
      currentQuestionIdRef.current !== targetQuestionId ||
      isTransitioningRef.current
    ) {
      return
    }

    // Dédupliquer par participant_id au cas où
    const uniqueParticipantAnswers = new Map<string, Answer>()
    for (const ans of data) {
      uniqueParticipantAnswers.set(ans.participant_id, ans)
    }
    const validAnswers = Array.from(uniqueParticipantAnswers.values())
    setAnswers(validAnswers)

    if (
      !hasRevealedRef.current &&
      hasShownChoicesRef.current &&
       currentParticipantIds.length > 0 &&
      validAnswers.length >= currentParticipantIds.length
    ) {
      onTimeUp()
    }
  }, [question.id, participants, onTimeUp])

  useEffect(() => {
    currentQuestionIdRef.current = question.id
    hasRevealedRef.current = false
    hasShownChoicesRef.current = false
    isTransitioningRef.current = false

    setIsAnswerRevealed(false)
    setHasShownChoices(false)
    setAnswers([])
    setIsAudioPlaying(false)

    const revealTimer = setTimeout(() => {
      if (currentQuestionIdRef.current === question.id) {
        hasShownChoicesRef.current = true
        setHasShownChoices(true)
      }
    }, TIME_TIL_CHOICE_REVEAL)

    const channel = supabase
      .channel(`host_answers_${gameId}_${question.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_answers',
          filter: `question_id=eq.${question.id}`,
        },
        () => {
          fetchAnswers()
        }
      )
      .subscribe()

    const pollInterval = setInterval(() => {
      if (!hasRevealedRef.current && !isTransitioningRef.current) {
        fetchAnswers()
      }
    }, 1500)

    return () => {
      clearTimeout(revealTimer)
      clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [gameId, question.id, fetchAnswers])

  // Déclencher la lecture audio sur l'Écran Hôte dès que les choix s'affichent (Blind Test ET Quiz sonorisé — Décisions D08 & D23)
  useEffect(() => {
    if (hasShownChoices && hasAudioTrack && audioRef.current) {
      const audio = audioRef.current
      audio.volume = isBlindTest ? 1.0 : 0.65
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
    hasAudioTrack,
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

  const participantById = new Map(participants.map((p) => [p.id, p]))

  return (
    <div className="h-screen flex flex-col items-stretch bg-slate-900 relative overflow-hidden">
      {hasAudioTrack && question.audio_url && (
        <audio
          ref={audioRef}
          src={question.audio_url}
          onEnded={() => setIsAudioPlaying(false)}
          preload="auto"
        />
      )}

      <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
        {hasAudioTrack && hasShownChoices && (
          <button
            type="button"
            onClick={toggleAudio}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition"
          >
            {isAudioPlaying ? '🔊 Son actif (Pause)' : '▶️ Relancer la musique'}
          </button>
        )}
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
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
            onClick={getNextQuestion}
          >
            {questionCount === question.order + 1
              ? '🏆 Voir le Podium Final'
              : 'Manche suivante →'}
          </button>
        )}
      </div>

      <div className="text-center pt-6 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold uppercase tracking-widest mb-2">
          {isBlindTest
            ? '🎵 Blind Test Musical'
            : videoEmbedUrl
            ? '🎬 Extrait Vidéo Culte'
            : hasAudioTrack
            ? '🎶 Question Quiz & Bande-Son'
            : '❓ Question Quiz'}
        </div>
        <h2 className="text-2xl md:text-4xl bg-white text-slate-900 font-black mx-auto max-w-4xl p-4 md:p-5 rounded-2xl shadow-xl block">
          {question.body}
        </h2>
      </div>

      <div className="flex-grow min-h-0 text-white px-8 flex flex-col justify-center">
        {!hasShownChoices && !isAnswerRevealed && (
          <div className="flex flex-col items-center justify-center gap-6 flex-grow min-h-0 py-4">
            {/* Illustration visible dès l'affichage de la question (Décision D17) */}
            {!isBlindTest && question.image_url && (
              <img
                src={question.image_url}
                alt="Illustration question"
                className="min-h-0 max-h-full max-w-full rounded-2xl shadow-lg object-contain"
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
          <div
            className={`flex justify-between items-center gap-6 w-full mx-auto ${
              hasMedia ? 'flex-grow min-h-0 py-4' : 'max-w-5xl'
            }`}
          >
            <div className="text-5xl font-black">
              <CountdownCircleTimer
                key={question.id}
                onComplete={() => {
                  onTimeUp()
                }}
                isPlaying
                duration={answerDurationSec}
                colors={['#f43f5e', '#6366f1', '#F7B801', '#ef4444']}
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
            <div className="flex flex-col items-center justify-center mx-6 flex-grow min-h-0 h-full">
              {isBlindTest ? (
                <div className="flex flex-col items-center gap-4">
                  <div
                    onClick={toggleAudio}
                    className={`cursor-pointer w-36 h-36 rounded-full border-8 border-slate-700 bg-gradient-to-tr from-rose-900 via-slate-950 to-indigo-900 flex items-center justify-center shadow-2xl ${
                      isAudioPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '4s' }}
                    title="Cliquer pour lecture/pause"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-2xl">
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
              ) : videoEmbedUrl ? (
                // Extrait vidéo YouTube lu sur l'Écran Hôte pendant le chrono (Décision D19)
                <iframe
                  key={question.id}
                  src={videoEmbedUrl}
                  title="Extrait vidéo"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="h-full max-w-full aspect-video rounded-2xl shadow-lg border-0"
                />
              ) : (
                question.image_url && (
                  <img
                    src={question.image_url}
                    alt="Illustration question"
                    className="max-h-full max-w-full rounded-2xl shadow-lg object-contain"
                  />
                )
              )}
            </div>

            <div className="text-center bg-slate-800/80 px-8 py-5 rounded-2xl border border-white/10">
              <div className="text-6xl font-black pb-1 text-rose-400">
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
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl w-full mx-auto">
            {/* Carte de révélation Blind Test (Décision D04) */}
            {isBlindTest &&
              (question.reveal_title || question.reveal_artist) && (
                <div className="flex items-center gap-5 bg-slate-800/90 border border-rose-500/40 p-5 rounded-2xl shadow-2xl max-w-md">
                  {question.reveal_cover_url ? (
                    <img
                      src={question.reveal_cover_url}
                      alt={question.reveal_title || 'Pochette'}
                      className="w-24 h-24 rounded-xl object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-rose-600/30 flex items-center justify-center text-4xl">
                      💿
                    </div>
                  )}
                  <div>
                    <div className="text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">
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
                  className="mx-2 h-40 w-16 md:w-20 flex flex-col items-stretch justify-end"
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
                    className={`mt-1 text-white text-lg font-bold text-center py-1.5 rounded-b ${
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

            {/* Mini-Podium Top 3 en direct sur l'Écran Hôte (Décision D21) */}
            {liveStandings.length > 0 && (
              <div className="bg-slate-950/90 border border-white/15 rounded-2xl p-4 min-w-[290px] shadow-xl">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-300 text-center mb-3">
                  🏆 Top 3 Provisoire
                </div>
                <div className="space-y-2">
                  {liveStandings.slice(0, 3).map((row, idx) => {
                    const pRow = row.participant_id
                      ? participantById.get(row.participant_id)
                      : null
                    const idInfo = getParticipantIdentity({
                      nickname: row.nickname ?? pRow?.nickname,
                      avatar_id:
                        (row as any).avatar_id ?? (pRow as any)?.avatar_id,
                    })
                    return (
                      <div
                        key={row.participant_id}
                        className="flex items-center justify-between gap-3 bg-slate-900/90 border border-white/10 px-3 py-2 rounded-xl"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                          </span>
                          {idInfo.avatar ? (
                            <img
                              src={idInfo.avatar.imageUrl}
                              alt={idInfo.avatar.name}
                              className="w-9 h-9 rounded-full object-cover border border-rose-400"
                            />
                          ) : null}
                          <div className="min-w-0">
                            <div className="text-sm font-black text-white truncate">
                              {idInfo.displayName}
                            </div>
                            {idInfo.characterName && (
                              <div className="text-[10px] text-rose-300 truncate">
                                {idInfo.characterName}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-mono font-black text-indigo-400 flex-shrink-0">
                          {row.total_score} pts
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Affichage non-cliquable des choix sur l'écran Hôte (TV) — Décision D13 */}
      {hasShownChoices && (
        <div className="flex justify-between flex-wrap p-4">
          {question.choices.map((choice, index) => (
            <div
              key={choice.id}
              className={`${hasMedia ? 'w-1/4' : 'w-1/2'} p-1.5`}
            >
              <div
                className={`px-6 ${
                  hasMedia ? 'py-4 text-xl' : 'py-5 text-2xl'
                } w-full h-full rounded-xl font-bold text-white flex justify-between items-center shadow-lg
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
          {isBlindTest ? '🎵 Mode Blind Test' : '🎬 Mode Quiz Love Actually'}
        </div>
      </div>
    </div>
  )
}
