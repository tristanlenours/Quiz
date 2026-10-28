import { getParticipantIdentity } from '@/avatars'
import { QUESTION_ANSWER_TIME, TIME_TIL_CHOICE_REVEAL } from '@/constants'
import {
  Choice,
  GameResult,
  Participant,
  Question,
  supabase,
} from '@/types/types'
import { useState, useEffect, useRef, useCallback } from 'react'
import { ColorFormat, CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function Quiz({
  question,
  questionCount,
  participant,
  gameId,
  isAnswerRevealed,
}: {
  question: Question
  questionCount: number
  participant: Participant
  gameId: string
  isAnswerRevealed: boolean
}) {
  const playerId = participant.id
  const myIdentity = getParticipantIdentity(participant)

  const [chosenChoice, setChosenChoice] = useState<Choice | null>(null)
  const [hasShownChoices, setHasShownChoices] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [earnedScore, setEarnedScore] = useState<number>(0)
  const [mobileAudioEnabled, setMobileAudioEnabled] = useState(false)
  const [leaderboard, setLeaderboard] = useState<GameResult[]>([])

  const mobileAudioRef = useRef<HTMLAudioElement | null>(null)
  const isBlindTest = question.question_type === 'blind_test'
  const answerDurationMs =
    (question.audio_duration_sec ? question.audio_duration_sec * 1000 : null) ||
    QUESTION_ANSWER_TIME

  const fetchLiveStandings = useCallback(async () => {
    const { data } = await supabase
      .from('quiz_game_results')
      .select()
      .eq('game_id', gameId)
      .order('total_score', { ascending: false })
    if (data) {
      setLeaderboard(data)
    }
  }, [gameId])

  useEffect(() => {
    fetchLiveStandings()
  }, [question.id, isAnswerRevealed, fetchLiveStandings])

  const myRankIndex = leaderboard.findIndex(
    (r) => r.participant_id === playerId
  )
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : null
  const myTotalScore =
    myRankIndex !== -1 ? leaderboard[myRankIndex]?.total_score ?? 0 : 0

  // Illustration affichée dès l'apparition de la question, en grand dans l'espace libre (Décision D17)
  const questionImage =
    !isBlindTest && question.image_url ? (
      <div className="flex-grow min-h-0 w-full flex items-center justify-center px-4 pt-3">
        <img
          src={question.image_url}
          alt="Illustration question"
          className="max-h-full max-w-full rounded-2xl shadow-lg object-contain"
        />
      </div>
    ) : !isBlindTest && question.video_url ? (
      // L'extrait vidéo n'est joué que sur l'Écran Hôte (Décision D19)
      <div className="flex-grow min-h-0 w-full flex items-center justify-center px-4 pt-3">
        <div className="text-white text-lg font-bold text-center p-5 bg-slate-800/80 rounded-2xl border border-white/10">
          📺 Regardez l&apos;extrait vidéo sur l&apos;écran principal !
        </div>
      </div>
    ) : null

  useEffect(() => {
    setChosenChoice(null)
    setHasShownChoices(false)
    setEarnedScore(0)
    if (mobileAudioRef.current) {
      mobileAudioRef.current.pause()
    }

    // Restaurer la réponse si le joueur a rafraîchi sa page en cours de manche
    supabase
      .from('quiz_answers')
      .select()
      .eq('participant_id', playerId)
      .eq('question_id', question.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data && data.choice_id) {
          const found = question.choices.find((c) => c.id === data.choice_id)
          if (found) {
            setChosenChoice(found)
            setEarnedScore(data.score ?? 0)
          }
        }
      })

    // Délai court (2.5s) côté mobile pour garantir que les boutons sont toujours prêts dès que le chrono TV démarre (Décision D24)
    const mobileRevealMs = Math.min(TIME_TIL_CHOICE_REVEAL, 2500)
    const timer = setTimeout(() => {
      setHasShownChoices(true)
      setQuestionStartTime(Date.now())
    }, mobileRevealMs)

    return () => clearTimeout(timer)
  }, [question.id, question.choices, playerId])

  // Si le joueur a activé l'écoute mobile à distance (Décision D08)
  useEffect(() => {
    if (
      mobileAudioEnabled &&
      hasShownChoices &&
      !isAnswerRevealed &&
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
            500
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
      return
    }
    fetchLiveStandings()
  }

  return (
    <div className="h-screen flex flex-col items-stretch bg-slate-900 relative overflow-hidden">
      {question.audio_url && (
        <audio ref={mobileAudioRef} src={question.audio_url} preload="none" />
      )}

      {/* Bandeau Avatar & Rang permanent en haut de la manette (Décision D21) */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/90 border-b border-white/10 text-white flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {myIdentity.avatar ? (
            <div className="relative flex-shrink-0">
              <img
                src={myIdentity.avatar.imageUrl}
                alt={myIdentity.avatar.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-rose-400"
              />
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-slate-900 rounded-full w-4 h-4 flex items-center justify-center">
                {myIdentity.avatar.emoji}
              </span>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-base">
              🎮
            </div>
          )}
          <div className="min-w-0">
            <div className="text-xs font-black truncate">
              {myIdentity.displayName}
            </div>
            {myIdentity.characterName && (
              <div className="text-[10px] text-rose-300 truncate">
                {myIdentity.characterName}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {myRank && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
              {myRank === 1
                ? '🥇 1er'
                : myRank === 2
                ? '🥈 2e'
                : myRank === 3
                ? '🥉 3e'
                : `#${myRank}`}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-black">
            {myTotalScore} pts
          </span>
        </div>
      </div>

      <div className="text-center pt-3 px-4 flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
          {isBlindTest ? '🎵 Blind Test' : '🎬 Manche'} {question.order + 1}/
          {questionCount}
        </div>
        <h2 className="text-lg md:text-xl bg-white text-slate-900 font-black mx-auto p-3.5 rounded-2xl block shadow">
          {question.body}
        </h2>

        {/* Bouton optionnel pour écouter sur son téléphone à distance (Décision D08) */}
        {question.audio_url && !isAnswerRevealed && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setMobileAudioEnabled((v) => !v)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition border ${
                mobileAudioEnabled
                  ? 'bg-rose-600 border-rose-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {mobileAudioEnabled
                ? '🔊 Son téléphone activé (Couper)'
                : '🎧 Écouter la musique sur mon téléphone'}
            </button>
          </div>
        )}
      </div>

      {!isAnswerRevealed && chosenChoice && (
        <div className="flex-grow flex flex-col justify-center items-center px-6 gap-4">
          {myIdentity.avatar && (
            <img
              src={myIdentity.avatar.imageUrl}
              alt={myIdentity.avatar.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-rose-400 shadow-xl animate-pulse"
            />
          )}
          <div className="text-white text-lg font-bold text-center p-5 bg-slate-800/90 rounded-2xl border border-white/10 max-w-sm">
            ⏳ Réponse verrouillée pour{' '}
            <span className="text-rose-300">{myIdentity.displayName}</span> !
            <div className="text-xs text-slate-400 font-normal mt-1">
              Suspense jusqu&apos;à la révélation...
            </div>
          </div>
        </div>
      )}

      {!hasShownChoices && !isAnswerRevealed && (
        <div className="flex-grow min-h-0 text-white flex flex-col items-center justify-center">
          {questionImage}
          <CountdownCircleTimer
            isPlaying
            duration={TIME_TIL_CHOICE_REVEAL / 1000}
            size={questionImage ? 68 : 150}
            strokeWidth={questionImage ? 6 : 10}
            colors={['#f43f5e', '#6366f1', '#f43f5e', '#6366f1']}
            trailColor={'transparent' as ColorFormat}
            colorsTime={[5, 3, 1, 0]}
          >
            {({ remainingTime }) => (
              <span className="text-3xl font-black">{remainingTime}</span>
            )}
          </CountdownCircleTimer>
          <p className="mt-2 mb-2 text-slate-400 text-xs">Préparez-vous...</p>
        </div>
      )}

      {hasShownChoices && !isAnswerRevealed && !chosenChoice && (
        <div className="flex-grow min-h-0 flex flex-col items-stretch">
          {questionImage || <div className="flex-grow"></div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5">
            {question.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => answer(choice)}
                disabled={chosenChoice !== null || isAnswerRevealed}
                className={`px-4 py-5 w-full text-lg rounded-2xl text-white font-black flex justify-between items-center shadow-lg active:scale-95 transition
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
                <div className="text-left leading-snug">{choice.body}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isAnswerRevealed && (
        <div className="flex-grow overflow-y-auto flex flex-col items-center justify-center p-4 space-y-3">
          {/* Résultat de la manche avec l'avatar du joueur */}
          <div className="flex items-center gap-3.5 bg-slate-800/90 border border-white/15 px-5 py-3.5 rounded-2xl shadow-xl max-w-sm w-full">
            <div className="relative flex-shrink-0">
              {myIdentity.avatar ? (
                <img
                  src={myIdentity.avatar.imageUrl}
                  alt={myIdentity.avatar.name}
                  className={`w-16 h-16 rounded-full object-cover border-4 ${
                    chosenChoice?.is_correct
                      ? 'border-emerald-400'
                      : 'border-red-400'
                  }`}
                />
              ) : null}
              <div
                className={`text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-black shadow-lg ${
                  myIdentity.avatar ? 'absolute -bottom-1 -right-1' : ''
                } ${
                  chosenChoice?.is_correct ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              >
                {chosenChoice?.is_correct ? '✓' : '✕'}
              </div>
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-white">
                {chosenChoice?.is_correct
                  ? `Exact ! +${earnedScore} pts`
                  : 'Dommage !'}
              </div>
              <div className="text-xs text-slate-300">
                {myRank
                  ? `Tu es actuellement #${myRank} avec ${myTotalScore} pts`
                  : `Score cumulé : ${myTotalScore} pts`}
              </div>
            </div>
          </div>

          {/* Révélation du morceau sur mobile en mode Blind Test */}
          {isBlindTest && (question.reveal_title || question.reveal_artist) && (
            <div className="flex items-center gap-3.5 bg-slate-800 border border-indigo-500/40 p-3.5 rounded-2xl max-w-sm w-full">
              {question.reveal_cover_url && (
                <img
                  src={question.reveal_cover_url}
                  alt={question.reveal_title || 'Cover'}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              )}
              <div className="text-left min-w-0">
                <div className="text-[10px] uppercase text-indigo-400 font-bold">
                  🎵 Morceau mystère
                </div>
                <div className="text-white font-black text-sm truncate">
                  {question.reveal_title}
                </div>
                <div className="text-slate-300 text-xs truncate">
                  {question.reveal_artist}
                </div>
              </div>
            </div>
          )}

          {/* Mini-Podium Fun en direct à chaque révélation (Décision D21) */}
          {leaderboard.length > 0 && (
            <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-3.5 max-w-sm w-full">
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300 text-center mb-2.5">
                🏆 Podium Provisoire en Direct
              </div>
              <div className="flex justify-center items-end gap-3">
                {[1, 0, 2].map((podiumIdx) => {
                  const row = leaderboard[podiumIdx]
                  if (!row) return null
                  const idInfo = getParticipantIdentity(row)
                  const isFirst = podiumIdx === 0
                  const medal =
                    podiumIdx === 0 ? '🥇' : podiumIdx === 1 ? '🥈' : '🥉'
                  return (
                    <div
                      key={row.participant_id}
                      className={`flex flex-col items-center flex-1 p-2 rounded-xl border ${
                        isFirst
                          ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400/60 scale-105'
                          : 'bg-slate-900/80 border-white/10'
                      }`}
                    >
                      <div className="text-sm">{medal}</div>
                      {idInfo.avatar ? (
                        <img
                          src={idInfo.avatar.imageUrl}
                          alt={idInfo.avatar.name}
                          className={`${
                            isFirst ? 'w-12 h-12' : 'w-10 h-10'
                          } rounded-full object-cover border-2 ${
                            isFirst ? 'border-amber-400' : 'border-slate-500'
                          } my-1`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center my-1">
                          🎮
                        </div>
                      )}
                      <div className="text-[11px] font-black text-white truncate max-w-full">
                        {idInfo.displayName}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-indigo-300">
                        {row.total_score} pts
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
