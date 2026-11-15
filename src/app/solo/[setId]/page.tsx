'use client'

import {
  encodeNicknameWithAvatar,
  getParticipantIdentity,
  preloadAvatarImages,
  resolveAvatarTheme,
} from '@/avatars'
import { PackLeaderboard } from '@/components/PackLeaderboard'
import { SoloGate, isHostUnlocked } from '@/components/SoloGate'
import { ScoreEntry, fetchPackScores } from '@/leaderboard'
import { getUniverseTheme } from '@/themes'
import {
  Choice,
  Participant,
  Question,
  getClientSessionId,
  preloadQuestionImages,
  supabase,
} from '@/types/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import SoloQuestion from './question'

type PackInfo = { id: string; name: string; themeId: string; questions: Question[] }
type RoundResult = { questionId: string; choiceId: string | null; score: number; correct: boolean }
type Analysis = { headline: string; chronicle: string; source: string }

export default function SoloPage({ params: { setId } }: { params: { setId: string } }) {
  return (
    <SoloGate>
      <SoloGame setId={setId} />
    </SoloGate>
  )
}

/**
 * Partie solo à distance (D62) : un seul écran, sans Realtime, qui enchaîne les manches.
 * Le score est enregistré dans quiz_games / quiz_participants / quiz_answers avec
 * `play_mode = 'solo'`. `?training=1` (Studio déverrouillé) joue sans rien classer (D64).
 */
function SoloGame({ setId }: { setId: string }) {
  const [pack, setPack] = useState<PackInfo | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingRefused, setTrainingRefused] = useState(false)
  const [previousAttempt, setPreviousAttempt] = useState<ScoreEntry | null>(null)
  const [stage, setStage] = useState<'loading' | 'intro' | 'playing' | 'finished'>('loading')
  const [gameId, setGameId] = useState<string | null>(null)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [writeError, setWriteError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const answerWritesRef = useRef<PromiseLike<unknown>[]>([])

  useEffect(() => {
    const wantsTraining = new URLSearchParams(window.location.search).get('training') === '1'
    const training = wantsTraining && isHostUnlocked()
    setIsTraining(training)
    setTrainingRefused(wantsTraining && !training)

    const load = async () => {
      const { data, error } = await supabase
        .from('quiz_sets')
        .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
        .eq('id', setId)
        .single()
      if (error || !data) {
        setLoadError('Ce quiz est introuvable.')
        return
      }
      const raw = ((data as any).questions || []) as Question[]
      const questions = raw
        .filter((q) => !q.is_disabled)
        .sort((a, b) => a.order - b.order)
        // `order` devient la position jouée : les manches désactivées laissent des trous (D38, D45)
        .map((q, i) => ({ ...q, order: i }))
      if (questions.length === 0) {
        setLoadError('Ce quiz ne contient aucune manche active.')
        return
      }
      const themeId = resolveAvatarTheme(data)
      preloadQuestionImages(questions)
      preloadAvatarImages(themeId)

      if (!training) {
        try {
          const scores = await fetchPackScores(setId)
          const mySession = getClientSessionId()
          setPreviousAttempt(
            scores.find((e) => e.playMode === 'solo' && e.clientSessionId === mySession) ?? null
          )
        } catch (e) {
          setLoadError(
            `Le mode solo n'est pas encore prêt (${(e as Error).message}). Préviens l'organisateur.`
          )
          return
        }
      }
      setPack({ id: data.id, name: data.name, themeId, questions })
      setStage('intro')
    }
    load()
  }, [setId])

  const start = async (nickname: string, avatarId: string) => {
    if (!pack) return
    setWriteError(null)

    // Débloque le son sur mobile : le même élément <audio> servira à toutes les manches
    const audio = audioRef.current
    const firstTrack = pack.questions.find((q) => q.audio_url)?.audio_url
    if (audio && firstTrack) {
      audio.src = firstTrack
      audio.muted = true
      audio
        .play()
        .then(() => {
          audio.pause()
          audio.muted = false
        })
        .catch(() => {
          audio.muted = false
        })
    }

    const { data: game, error: gErr } = await supabase
      .from('quiz_games')
      .insert({ quiz_set_id: pack.id, play_mode: 'solo', is_training: isTraining, phase: 'quiz' })
      .select()
      .single()
    if (gErr || !game) {
      setWriteError(`Impossible de démarrer la partie : ${gErr?.message}`)
      return
    }
    const { data: player, error: pErr } = await supabase
      .from('quiz_participants')
      .insert({
        nickname: encodeNicknameWithAvatar(nickname, avatarId),
        avatar_id: avatarId,
        game_id: game.id,
        client_session_id: getClientSessionId(),
      })
      .select()
      .single()
    if (pErr || !player) {
      await supabase.from('quiz_games').delete().eq('id', game.id)
      setWriteError(`Impossible de démarrer la partie : ${pErr?.message}`)
      return
    }
    setGameId(game.id)
    setParticipant(player)
    setResults([])
    setIndex(0)
    setStage('playing')
  }

  const onAnswer = useCallback(
    (question: Question, choice: Choice | null, score: number) => {
      setResults((prev) => [
        ...prev,
        { questionId: question.id, choiceId: choice?.id ?? null, score, correct: Boolean(choice?.is_correct) },
      ])
      // Chrono écoulé : aucune ligne, comme en live
      if (!choice || !participant) return
      const write = supabase
        .from('quiz_answers')
        .insert({ participant_id: participant.id, question_id: question.id, choice_id: choice.id, score })
        .then(({ error }) => {
          if (error) setWriteError(`Réponse non enregistrée : ${error.message}`)
        })
      answerWritesRef.current.push(write)
    },
    [participant]
  )

  const onNext = async () => {
    if (!pack || !gameId) return
    if (index + 1 < pack.questions.length) {
      setIndex(index + 1)
      return
    }
    audioRef.current?.pause()
    await Promise.all(answerWritesRef.current)
    await supabase.from('quiz_games').update({ phase: 'result', is_answer_revealed: true }).eq('id', gameId)
    setStage('finished')
  }

  const theme = getUniverseTheme(pack?.themeId)
  const totalScore = results.reduce((s, r) => s + r.score, 0)

  return (
    <main className="bg-slate-950 min-h-[100dvh]">
      <audio ref={audioRef} preload="auto" />
      {isTraining && (
        <div className="fixed bottom-3 left-3 z-50 pointer-events-none px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-black shadow-lg">
          🧪 Training — scores non enregistrés
        </div>
      )}

      {loadError && (
        <div className="min-h-[100dvh] flex items-center justify-center p-6 text-center text-white">
          <p className="max-w-sm text-lg font-bold">{loadError}</p>
        </div>
      )}

      {/* Écran neutre tant que l'univers du pack n'est pas connu (D34) */}
      {!loadError && stage === 'loading' && <div className="min-h-[100dvh] bg-slate-950" />}

      {!loadError && stage === 'intro' && pack && (
        <Intro
          pack={pack}
          isTraining={isTraining}
          trainingRefused={trainingRefused}
          previousAttempt={previousAttempt}
          error={writeError}
          onStart={start}
        />
      )}

      {stage === 'playing' && pack && pack.questions[index] && (
        <>
          {writeError && (
            <div className="px-4 py-2 bg-red-600 text-white text-xs font-bold text-center">{writeError}</div>
          )}
          <SoloQuestion
            key={pack.questions[index].id}
            question={pack.questions[index]}
            questionCount={pack.questions.length}
            totalScore={totalScore}
            audioRef={audioRef}
            isLast={index + 1 === pack.questions.length}
            onAnswer={(choice, score) => onAnswer(pack.questions[index], choice, score)}
            onNext={onNext}
          />
        </>
      )}

      {stage === 'finished' && pack && gameId && participant && (
        <SoloResults
          pack={pack}
          gameId={gameId}
          participant={participant}
          results={results}
          isTraining={isTraining}
          pageBg={theme.pageBg}
        />
      )}
    </main>
  )
}

function Intro({
  pack,
  isTraining,
  trainingRefused,
  previousAttempt,
  error,
  onStart,
}: {
  pack: PackInfo
  isTraining: boolean
  trainingRefused: boolean
  previousAttempt: ScoreEntry | null
  error: string | null
  onStart: (nickname: string, avatarId: string) => Promise<void>
}) {
  const theme = getUniverseTheme(pack.themeId)
  const [avatarId, setAvatarId] = useState(theme.avatars[0]?.id ?? '')
  const [nickname, setNickname] = useState('')
  const [sending, setSending] = useState(false)
  const selected = theme.avatars.find((a) => a.id === avatarId)

  if (trainingRefused) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 text-center text-white">
        <p className="max-w-sm text-lg font-bold">
          🧪 Le training est réservé à l&apos;organisateur : ouvre ce lien depuis le Studio déverrouillé.
        </p>
      </div>
    )
  }

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-br ${theme.pageBg} p-4 flex justify-center`}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!avatarId) return
          setSending(true)
          await onStart(nickname, avatarId)
          setSending(false)
        }}
        className="bg-slate-900/95 border border-white/15 p-5 rounded-3xl max-w-2xl w-full shadow-2xl space-y-4 text-white my-auto"
      >
        <div className="text-center space-y-1">
          <div className="inline-block px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-[11px] font-bold uppercase tracking-widest">
            🏠 Partie solo
          </div>
          <h1 className="text-2xl font-black">{pack.name}</h1>
          <p className="text-xs text-slate-300">
            {pack.questions.length} manches. 5 secondes pour lire, puis le chrono : plus tu réponds vite, plus tu
            marques. Mets le son !
          </p>
        </div>

        {isTraining ? (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs font-bold text-center">
            🧪 Training : cette partie ne sera ni classée ni conservée.
          </div>
        ) : previousAttempt ? (
          <div
            data-testid="solo-previous-attempt"
            className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs font-bold text-center"
          >
            Tu as déjà tenté ce quiz
            {previousAttempt.counted ? ` (${previousAttempt.totalScore} pts)` : ''}. Seule la première partie
            compte : tu peux rejouer pour le plaisir, ce score-là ne sera pas classé.
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-200 text-xs font-bold text-center">
            Une seule partie compte : la première. Va jusqu&apos;au bout, une partie abandonnée n&apos;est pas classée.
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {theme.avatars.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setAvatarId(avatar.id)}
              className={`flex flex-col items-center p-2 rounded-2xl border text-center transition ${
                avatar.id === avatarId
                  ? 'bg-gradient-to-b from-rose-600/40 to-indigo-900/60 border-2 border-rose-400'
                  : 'bg-slate-950/80 border-white/10'
              }`}
            >
              <img
                src={avatar.imageUrl}
                alt={avatar.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-700"
              />
              <div className="mt-1.5 text-[11px] font-black leading-tight line-clamp-2">{avatar.name}</div>
            </button>
          ))}
        </div>

        <input
          className="p-3.5 w-full rounded-xl bg-slate-950 border border-slate-700 text-white text-base font-bold text-center focus:outline-none focus:border-rose-400"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.currentTarget.value)}
          placeholder={`Ton prénom (sinon « ${selected?.name ?? 'Joueur'} »)`}
          maxLength={18}
        />

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !selected}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 disabled:opacity-40 font-black text-lg shadow-lg"
        >
          {sending ? 'Entrée en scène...' : '🎬 Commencer'}
        </button>
      </form>
    </div>
  )
}

function SoloResults({
  pack,
  gameId,
  participant,
  results,
  isTraining,
  pageBg,
}: {
  pack: PackInfo
  gameId: string
  participant: Participant
  results: RoundResult[]
  isTraining: boolean
  pageBg: string
}) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [analysisFailed, setAnalysisFailed] = useState(false)
  const [scores, setScores] = useState<ScoreEntry[] | null>(null)
  const identity = getParticipantIdentity(participant)
  const total = results.reduce((s, r) => s + r.score, 0)
  const correct = results.filter((r) => r.correct).length
  const mine = scores?.find((e) => e.gameId === gameId)
  const rank = mine?.counted ? scores!.filter((e) => e.counted).indexOf(mine) + 1 : null

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      // Le commentaire lit la partie en base : en training, on ne la supprime qu'après (D64, D66)
      try {
        const res = await fetch('/api/solo-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId }),
        })
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        if (!cancelled) setAnalysis(data)
      } catch {
        if (!cancelled) setAnalysisFailed(true)
      }
      if (isTraining) {
        await supabase.from('quiz_games').delete().eq('id', gameId)
      } else {
        try {
          const list = await fetchPackScores(pack.id)
          if (!cancelled) setScores(list)
        } catch {
          if (!cancelled) setScores([])
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [gameId, isTraining, pack.id])

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-br ${pageBg} p-4 text-white`}>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="p-6 bg-slate-900/95 border-2 border-rose-400/40 rounded-3xl shadow-2xl text-center space-y-3">
          {identity.avatar && (
            <img
              src={identity.avatar.imageUrl}
              alt={identity.avatar.name}
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-rose-400 shadow-2xl"
            />
          )}
          <h1 className="text-2xl font-black">Bravo {identity.displayName} !</h1>
          <div className="bg-slate-950 rounded-2xl p-4 border border-indigo-500/30 flex justify-around items-center">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-slate-400">Bonnes réponses</div>
              <div data-testid="solo-correct-count" className="text-2xl font-black text-emerald-300 mt-0.5">
                {correct} / {pack.questions.length}
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-[11px] uppercase tracking-widest text-slate-400">Score final</div>
              <div data-testid="solo-total-score" className="text-3xl font-mono font-black text-indigo-400 mt-0.5">
                {total} pts
              </div>
            </div>
          </div>
          {!isTraining && mine && (
            <p data-testid="solo-ranking-status" className="text-sm font-bold text-amber-200">
              {mine.counted
                ? `Score enregistré : ${rank === 1 ? '1ᵉʳ' : `${rank}ᵉ`} du classement.`
                : 'Partie rejouée : ce score n’est pas classé, seule ta première partie compte.'}
            </p>
          )}
          {isTraining && (
            <p className="text-sm font-bold text-amber-200">🧪 Training : rien n&apos;a été enregistré.</p>
          )}
        </div>

        <div data-testid="solo-analysis" className="p-5 bg-slate-900/95 border border-white/15 rounded-3xl shadow-xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-rose-300">🎙️ Le commentaire</div>
          {analysis ? (
            <>
              <h3 className="text-lg font-black">{analysis.headline}</h3>
              <p className="text-sm text-slate-200 leading-relaxed">{analysis.chronicle}</p>
            </>
          ) : analysisFailed ? (
            <p className="text-sm text-slate-400">Le commentateur a perdu sa voix. Ton score, lui, est bien là.</p>
          ) : (
            <p className="text-sm text-slate-400 animate-pulse">Le commentateur relit tes réponses...</p>
          )}
        </div>

        {!isTraining && scores && (
          <PackLeaderboard entries={scores} highlightGameId={gameId} showUncounted={isHostUnlocked()} />
        )}
      </div>
    </div>
  )
}
