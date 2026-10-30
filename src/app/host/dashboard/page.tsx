'use client'

import { resolveAvatarTheme } from '@/avatars'
import { DEFAULT_QUESTION_DURATION_SEC } from '@/constants'
import {
  isSupabaseClientConfigured,
  QuizSet,
  setRuntimeSupabaseConfig,
  supabase,
} from '@/types/types'
import { useEffect, useState } from 'react'

interface MusicTrackResult {
  trackId: number
  title: string
  artist: string
  album: string
  previewUrl: string
  coverUrl: string
  releaseYear: string
}

interface DraftChoice {
  body: string
  is_correct: boolean
}

interface DraftQuestion {
  id?: string
  question_type: 'quiz' | 'blind_test'
  body: string
  image_url: string
  audio_url: string
  audio_start_sec: number
  audio_duration_sec: number
  reveal_title: string
  reveal_artist: string
  reveal_cover_url: string
  video_url?: string
  is_disabled?: boolean
  choices: DraftChoice[]
}

const EMPTY_QUESTION = (): DraftQuestion => ({
  question_type: 'blind_test',
  body: '🎵 Blind Test : Quel est ce morceau ?',
  image_url: '',
  audio_url: '',
  audio_start_sec: 0,
  audio_duration_sec: DEFAULT_QUESTION_DURATION_SEC,
  reveal_title: '',
  reveal_artist: '',
  reveal_cover_url: '',
  choices: [
    { body: '', is_correct: true },
    { body: '', is_correct: false },
    { body: '', is_correct: false },
    { body: '', is_correct: false },
  ],
})

export default function HostDashboardPage() {
  // Authentification Studio Hôte (Décision D09)
  const [authChecked, setAuthChecked] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  // Liste des packs et diagnostic DB
  const [quizSets, setQuizSets] = useState<QuizSet[]>([])
  const [dbMissingTableError, setDbMissingTableError] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(false)

  // Éditeur de Pack
  const [editingSetId, setEditingSetId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [packName, setPackName] = useState('')
  const [packDescription, setPackDescription] = useState('')
  const [packMode, setPackMode] = useState<'quiz' | 'blind_test' | 'mixed'>(
    'mixed'
  )
  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>([])
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0)

  // Recherche musicale iTunes (Décision D07)
  const [musicQuery, setMusicQuery] = useState('')
  const [musicResults, setMusicResults] = useState<MusicTrackResult[]>([])
  const [searchingMusic, setSearchingMusic] = useState(false)

  // Import JSON
  const [showImportModal, setShowImportModal] = useState(false)
  const [importJsonText, setImportJsonText] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/host-auth', { cache: 'no-store' })
        const data = await res.json()
        if (data.supabaseUrl && data.supabaseAnonKey) {
          setRuntimeSupabaseConfig(data.supabaseUrl, data.supabaseAnonKey)
        }
        if (
          typeof window !== 'undefined' &&
          window.sessionStorage.getItem('quiz_host_unlocked') === '1'
        ) {
          setIsUnlocked(true)
          return
        }
        if (!data.passwordRequired) {
          setIsUnlocked(true)
        }
      } catch {
        setIsUnlocked(true)
      } finally {
        setAuthChecked(true)
      }
    }
    checkAuth()
  }, [])

  const fetchQuizSets = async () => {
    setLoading(true)
    setDbMissingTableError(null)
    const { data, error } = await supabase
      .from('quiz_sets')
      .select(`*, questions:quiz_questions(*, choices:quiz_choices(*))`)
      .order('created_at', { ascending: false })

    setLoading(false)
    if (error) {
      setDbMissingTableError(error.message)
      return
    }
    const sorted = (data as unknown as QuizSet[]).map((s) => ({
      ...s,
      questions: [...(s.questions || [])].sort((a, b) => a.order - b.order),
    }))
    setQuizSets(sorted)
  }

  useEffect(() => {
    if (isUnlocked) {
      fetchQuizSets()
    }
  }, [isUnlocked])

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    const res = await fetch('/api/host-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput }),
    })
    if (res.ok) {
      window.sessionStorage.setItem('quiz_host_unlocked', '1')
      setIsUnlocked(true)
    } else {
      setAuthError('Mot de passe Hôte invalide.')
    }
  }

  const startGame = async (quizSetId: string) => {
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString()
    const { data, error } = await supabase
      .from('quiz_games')
      .insert({
        quiz_set_id: quizSetId,
        pin_code: pinCode,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      alert(`Impossible de lancer la partie : ${error.message}`)
      return
    }

    window.open(`/host/game/${data.id}`, '_blank', 'noopener,noreferrer')
  }

  const deleteQuizSet = async (quizSetId: string) => {
    if (!confirm('Supprimer définitivement ce pack de jeu ?')) return
    const { error } = await supabase
      .from('quiz_sets')
      .delete()
      .eq('id', quizSetId)
    if (error) {
      alert(error.message)
      return
    }
    fetchQuizSets()
  }

  const createDemoPack = async () => {
    setLoading(true)
    try {
      // Chercher quelques vrais extraits sur iTunes pour le Blind Test
      const res = await fetch('/api/music-search?q=Daft+Punk')
      const { tracks = [] }: { tracks: MusicTrackResult[] } = await res.json()
      const track1 = tracks[0]
      const track2 = tracks[1]

      const demoQuestions: DraftQuestion[] = [
        {
          question_type: 'quiz',
          body: 'Dans Magic: The Gathering, combien de cartes contient au minimum un deck de Draft (Format Limité) ?',
          image_url: '',
          audio_url: '',
          audio_start_sec: 0,
          audio_duration_sec: DEFAULT_QUESTION_DURATION_SEC,
          reveal_title: '',
          reveal_artist: '',
          reveal_cover_url: '',
          choices: [
            { body: '40 cartes', is_correct: true },
            { body: '60 cartes', is_correct: false },
            { body: '45 cartes', is_correct: false },
            { body: '100 cartes', is_correct: false },
          ],
        },
        ...(track1
          ? [
              {
                question_type: 'blind_test' as const,
                body: '🎵 Blind Test : Quel est ce titre de Daft Punk ?',
                image_url: '',
                audio_url: track1.previewUrl,
                audio_start_sec: 0,
                audio_duration_sec: DEFAULT_QUESTION_DURATION_SEC,
                reveal_title: track1.title,
                reveal_artist: track1.artist,
                reveal_cover_url: track1.coverUrl,
                choices: [
                  { body: track1.title, is_correct: true },
                  {
                    body: tracks[2]?.title || 'Around the World',
                    is_correct: false,
                  },
                  {
                    body: tracks[3]?.title || 'Digital Love',
                    is_correct: false,
                  },
                  {
                    body: tracks[4]?.title || 'Instant Crush',
                    is_correct: false,
                  },
                ],
              },
            ]
          : []),
        ...(track2
          ? [
              {
                question_type: 'blind_test' as const,
                body: '🎵 Blind Test : Reconnaissez-vous ce second extrait ?',
                image_url: '',
                audio_url: track2.previewUrl,
                audio_start_sec: 0,
                audio_duration_sec: DEFAULT_QUESTION_DURATION_SEC,
                reveal_title: track2.title,
                reveal_artist: track2.artist,
                reveal_cover_url: track2.coverUrl,
                choices: [
                  { body: track2.title, is_correct: true },
                  { body: track1?.title || 'One More Time', is_correct: false },
                  {
                    body: tracks[5]?.title || 'Harder, Better, Faster, Stronger',
                    is_correct: false,
                  },
                  { body: tracks[6]?.title || 'Veridis Quo', is_correct: false },
                ],
              },
            ]
          : []),
      ]

      await savePackToSupabase(
        null,
        '🎉 Pack Démo : Soirée Quiz & Blind Test',
        'Pack de démonstration mêlant culture pop/MTG et Blind Test musical avec extraits audio.',
        'mixed',
        demoQuestions
      )
      await fetchQuizSets()
    } catch (err: any) {
      alert(err?.message || 'Erreur création pack démo')
    } finally {
      setLoading(false)
    }
  }

  const savePackToSupabase = async (
    setId: string | null,
    name: string,
    description: string,
    mode: 'quiz' | 'blind_test' | 'mixed',
    questions: DraftQuestion[],
    avatarTheme?: string
  ) => {
    let targetSetId = setId
    // Thème d'avatars (D21) : uniquement transmis quand il est connu (import JSON), sinon défaut SQL.
    // Si la colonne n'existe pas encore (migration D21 non jouée), on réessaie sans : le thème
    // est alors déduit du nom du pack (resolveAvatarTheme, D29).
    const withTheme = avatarTheme
      ? { name, description, mode, avatar_theme: avatarTheme }
      : { name, description, mode }
    const isMissingThemeColumn = (message?: string) =>
      Boolean(avatarTheme && message?.includes('avatar_theme'))

    if (!targetSetId) {
      let created = await supabase.from('quiz_sets').insert(withTheme).select().single()
      if (isMissingThemeColumn(created.error?.message)) {
        created = await supabase
          .from('quiz_sets')
          .insert({ name, description, mode })
          .select()
          .single()
      }
      if (created.error) throw new Error(created.error.message)
      targetSetId = created.data.id
    } else {
      let updated = await supabase.from('quiz_sets').update(withTheme).eq('id', targetSetId)
      if (isMissingThemeColumn(updated.error?.message)) {
        updated = await supabase
          .from('quiz_sets')
          .update({ name, description, mode })
          .eq('id', targetSetId)
      }
      if (updated.error) throw new Error(updated.error.message)

      await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_set_id', targetSetId)
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const { data: insertedQ, error: qErr } = await supabase
        .from('quiz_questions')
        .insert({
          quiz_set_id: targetSetId,
          order: i,
          question_type: q.question_type,
          body: q.body,
          image_url: q.image_url || null,
          audio_url: q.audio_url || null,
          audio_start_sec: q.audio_start_sec || 0,
          audio_duration_sec: q.audio_duration_sec || DEFAULT_QUESTION_DURATION_SEC,
          reveal_title: q.reveal_title || null,
          reveal_artist: q.reveal_artist || null,
          reveal_cover_url: q.reveal_cover_url || null,
          video_url: q.video_url || null,
          ...(q.is_disabled ? { is_disabled: true } : {}),
        })
        .select()
        .single()

      if (qErr) throw new Error(qErr.message)

      const choicesPayload = q.choices.map((c) => ({
        question_id: insertedQ.id,
        body: c.body || 'Réponse',
        is_correct: Boolean(c.is_correct),
      }))

      const { error: cErr } = await supabase
        .from('quiz_choices')
        .insert(choicesPayload)
      if (cErr) throw new Error(cErr.message)
    }
  }

  // Écriture directe sur la ligne : l'éditeur recrée les questions et perdrait l'historique (D38)
  const toggleQuestionDisabled = async (questionId: string, isDisabled: boolean) => {
    const { error } = await supabase
      .from('quiz_questions')
      .update({ is_disabled: isDisabled })
      .eq('id', questionId)
    if (error) return alert(error.message)
    await fetchQuizSets()
  }

  const openCreateEditor = () => {
    setEditingSetId(null)
    setIsCreatingNew(true)
    setPackName('Nouveau Pack Quiz & Blind Test')
    setPackDescription('')
    setPackMode('mixed')
    setDraftQuestions([EMPTY_QUESTION()])
    setActiveQuestionIdx(0)
  }

  const openEditEditor = (set: QuizSet) => {
    setEditingSetId(set.id)
    setIsCreatingNew(true)
    setPackName(set.name)
    setPackDescription(set.description || '')
    setPackMode(set.mode || 'mixed')
    const mapped: DraftQuestion[] = (set.questions || []).map((q) => ({
      id: q.id,
      question_type: q.question_type || 'quiz',
      body: q.body,
      image_url: q.image_url || '',
      audio_url: q.audio_url || '',
      audio_start_sec: q.audio_start_sec || 0,
      audio_duration_sec: q.audio_duration_sec || DEFAULT_QUESTION_DURATION_SEC,
      reveal_title: q.reveal_title || '',
      reveal_artist: q.reveal_artist || '',
      reveal_cover_url: q.reveal_cover_url || '',
      video_url: q.video_url || '',
      is_disabled: q.is_disabled,
      choices:
        q.choices && q.choices.length > 0
          ? q.choices.map((c) => ({ body: c.body, is_correct: c.is_correct }))
          : EMPTY_QUESTION().choices,
    }))
    setDraftQuestions(mapped.length > 0 ? mapped : [EMPTY_QUESTION()])
    setActiveQuestionIdx(0)
  }

  const handleSaveEditor = async () => {
    if (!packName.trim()) return alert('Donnez un nom au pack.')
    setLoading(true)
    try {
      await savePackToSupabase(
        editingSetId,
        packName.trim(),
        packDescription.trim(),
        packMode,
        draftQuestions
      )
      setIsCreatingNew(false)
      setEditingSetId(null)
      await fetchQuizSets()
    } catch (err: any) {
      alert(err?.message || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleMusicSearch = async () => {
    if (!musicQuery.trim()) return
    setSearchingMusic(true)
    try {
      const res = await fetch(
        `/api/music-search?q=${encodeURIComponent(musicQuery.trim())}`
      )
      const data = await res.json()
      setMusicResults(data.tracks || [])
    } catch {
      alert('Erreur lors de la recherche iTunes')
    } finally {
      setSearchingMusic(false)
    }
  }

  const applyTrackToQuestion = (
    track: MusicTrackResult,
    mode: 'title' | 'artist'
  ) => {
    const otherTracks = musicResults.filter((t) => t.trackId !== track.trackId)
    const correctText =
      mode === 'title' ? `${track.title} — ${track.artist}` : track.artist

    const decoyPool =
      mode === 'title'
        ? otherTracks.map((t) => `${t.title} — ${t.artist}`)
        : Array.from(new Set(otherTracks.map((t) => t.artist))).filter(
            (a) => a !== track.artist
          )

    while (decoyPool.length < 3) {
      decoyPool.push(`Proposition ${decoyPool.length + 2}`)
    }

    const rawChoices: DraftChoice[] = [
      { body: correctText, is_correct: true },
      { body: decoyPool[0], is_correct: false },
      { body: decoyPool[1], is_correct: false },
      { body: decoyPool[2], is_correct: false },
    ].sort(() => Math.random() - 0.5)

    updateActiveQuestion({
      question_type: 'blind_test',
      body:
        mode === 'title'
          ? '🎵 Blind Test : Quel est ce morceau ?'
          : '🎵 Blind Test : Qui interprète ce titre ?',
      audio_url: track.previewUrl,
      reveal_title: track.title,
      reveal_artist: track.artist,
      reveal_cover_url: track.coverUrl,
      choices: rawChoices,
    })
  }

  const updateActiveQuestion = (patch: Partial<DraftQuestion>) => {
    setDraftQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIdx ? { ...q, ...patch } : q))
    )
  }

  const exportSetAsJson = (set: QuizSet) => {
    const payload = {
      name: set.name,
      description: set.description,
      mode: set.mode,
      avatar_theme: resolveAvatarTheme(set),
      questions: (set.questions || []).map((q) => ({
        question_type: q.question_type,
        body: q.body,
        image_url: q.image_url,
        audio_url: q.audio_url,
        audio_start_sec: q.audio_start_sec,
        audio_duration_sec: q.audio_duration_sec,
        reveal_title: q.reveal_title,
        reveal_artist: q.reveal_artist,
        reveal_cover_url: q.reveal_cover_url,
        video_url: q.video_url,
        ...(q.is_disabled ? { is_disabled: true } : {}),
        choices: (q.choices || []).map((c) => ({
          body: c.body,
          is_correct: c.is_correct,
        })),
      })),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${set.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`
    a.click()
  }

  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(importJsonText)
      if (!parsed.name || !Array.isArray(parsed.questions)) {
        return alert('Format JSON invalide : champs `name` et `questions` requis.')
      }
      setLoading(true)
      await savePackToSupabase(
        null,
        parsed.name,
        parsed.description || '',
        parsed.mode || 'mixed',
        parsed.questions,
        parsed.avatar_theme
      )
      setShowImportModal(false)
      setImportJsonText('')
      await fetchQuizSets()
    } catch (err: any) {
      alert(`Erreur d'import : ${err?.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) {
    return <div className="p-8 text-slate-400">Chargement du Studio...</div>
  }

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-slate-900 border border-white/15 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-black mb-2">🔒 Accès Studio Hôte</h2>
        <p className="text-slate-400 text-sm mb-6">
          Entrez le mot de passe Hôte (`SITE_PASSWORD` partagé avec DraftMaster)
          pour gérer vos packs et lancer une partie.
        </p>
        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Mot de passe..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
            autoFocus
          />
          {authError && (
            <div className="text-red-400 text-sm">{authError}</div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white"
          >
            Déverrouiller le Studio
          </button>
        </form>
      </div>
    )
  }

  const activeQ = draftQuestions[activeQuestionIdx]

  return (
    <div className="space-y-8">
      {/* Alerte si les variables Supabase ou les tables SQL sont absentes */}
      {dbMissingTableError && (
        <div className="p-6 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 space-y-2">
          {!isSupabaseClientConfigured() ? (
            <>
              <div className="font-black text-lg">
                ⚙️ Variables d&apos;environnement Supabase manquantes sur Railway
              </div>
              <p className="text-sm text-amber-100/90">
                Dans Railway, ouvrez votre service <strong>Quiz</strong> &rarr;
                onglet <strong>Variables</strong> et ajoutez les variables de
                votre projet Supabase (les mêmes que dans DraftMaster) :
              </p>
              <pre className="bg-black/50 p-3 rounded-xl font-mono text-xs text-amber-200 overflow-x-auto">
                {`NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_publique`}
              </pre>
              <p className="text-xs text-amber-200/80">
                (Les noms <code>SUPABASE_URL</code> et{' '}
                <code>SUPABASE_ANON_KEY</code> de DraftMaster sont aussi
                reconnus automatiquement au runtime !)
              </p>
            </>
          ) : (
            <>
              <div className="font-black text-lg">
                ⚠️ Tables `quiz_*` non trouvées sur votre base Supabase
              </div>
              <p className="text-sm text-amber-100/90">
                Pour activer les tables du Quiz &amp; Blind Test dans votre
                projet Supabase (sans toucher aux tables de DraftMaster), ouvrez
                le <strong>SQL Editor</strong> de Supabase et exécutez le
                fichier{' '}
                <code className="bg-black/40 px-2 py-0.5 rounded font-mono">
                  supabase/schema_shared_draftmaster.sql
                </code>
                , puis cliquez sur Rafraîchir.
              </p>
            </>
          )}
          <div className="text-xs font-mono text-amber-300/80">
            Détail : {dbMissingTableError}
          </div>
          <button
            onClick={fetchQuizSets}
            className="mt-2 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm"
          >
            🔄 Rafraîchir
          </button>
        </div>
      )}

      {!isCreatingNew ? (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Mes Packs de Quiz &amp; Blind Test
              </h1>
              <p className="text-slate-400 text-sm">
                Lancez une soirée sur grand écran ou préparez vos prochaines
                manches musicales.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={createDemoPack}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-sm transition"
              >
                🌱 Générer un Pack Démo (Quiz + Daft Punk)
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 font-bold text-sm transition"
              >
                📥 Importer JSON
              </button>
              <button
                onClick={openCreateEditor}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
              >
                ➕ Nouveau Pack
              </button>
            </div>
          </div>

          {quizSets.length === 0 && !dbMissingTableError && (
            <div className="p-12 text-center bg-slate-900/60 border border-white/10 rounded-3xl space-y-4">
              <div className="text-5xl">🎵</div>
              <div className="text-xl font-bold">
                Aucun pack de jeu pour le moment
              </div>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Cliquez sur &laquo;&nbsp;Générer un Pack Démo&nbsp;&raquo; pour
                tester immédiatement un Quiz + Blind Test, ou créez votre propre
                pack !
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizSets.map((set) => {
              const activeQuestions = (set.questions || []).filter(
                (q) => !q.is_disabled
              )
              const blindTestCount = activeQuestions.filter(
                (q) => q.question_type === 'blind_test'
              ).length
              const quizCount = activeQuestions.length - blindTestCount

              return (
                <div
                  key={set.id}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-indigo-500/40 transition"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h2 className="text-xl font-black text-white">
                        {set.name}
                      </h2>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                        {activeQuestions.length} manches
                      </span>
                    </div>
                    {set.description && (
                      <p className="text-slate-400 text-sm mb-4">
                        {set.description}
                      </p>
                    )}
                    <div className="flex gap-2 text-xs text-slate-300 mb-3">
                      {quizCount > 0 && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800">
                          ❓ {quizCount} Quiz
                        </span>
                      )}
                      {blindTestCount > 0 && (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-900/50 text-purple-200 border border-purple-500/30">
                          🎵 {blindTestCount} Blind Test
                        </span>
                      )}
                    </div>
                    <details className="mb-6 text-xs text-slate-300">
                      <summary className="cursor-pointer font-semibold text-slate-400 hover:text-white">
                        🎚️ Activer ou désactiver des manches
                      </summary>
                      <div className="mt-2 space-y-1.5">
                        {(set.questions || []).map((q, idx) => (
                          <label
                            key={q.id}
                            className={`flex items-start gap-2 cursor-pointer ${
                              q.is_disabled ? 'opacity-50 line-through' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!q.is_disabled}
                              onChange={(e) =>
                                toggleQuestionDisabled(q.id, !e.target.checked)
                              }
                              className="mt-0.5 shrink-0"
                            />
                            <span>
                              {idx + 1}. {q.body}
                            </span>
                          </label>
                        ))}
                      </div>
                    </details>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-2 pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditEditor(set)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        onClick={() => exportSetAsJson(set)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                      >
                        📤 JSON
                      </button>
                      <button
                        onClick={() => deleteQuizSet(set.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs font-semibold"
                      >
                        🗑️
                      </button>
                    </div>

                    <button
                      onClick={() => startGame(set.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/20 transition"
                    >
                      ▶ Lancer la partie
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        /* STUDIO D'ÉDITION DE PACK */
        <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="text-2xl font-black">
              {editingSetId ? '✏️ Éditer le Pack' : '✨ Nouveau Pack'}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEditor}
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-black shadow-lg"
              >
                {loading ? 'Sauvegarde...' : '💾 Enregistrer le Pack'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase text-slate-400 font-bold mb-1">
                Titre du Pack
              </label>
              <input
                type="text"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 font-bold mb-1">
                Description
              </label>
              <input
                type="text"
                value={packDescription}
                onChange={(e) => setPackDescription(e.target.value)}
                placeholder="Ex: Années 90, Rock, Pop Culture..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Barre d'onglets des manches */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {draftQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`px-4 py-2 rounded-xl text-sm font-bold shrink-0 transition ${
                  idx === activeQuestionIdx
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                #{idx + 1} {q.question_type === 'blind_test' ? '🎵' : '❓'}
              </button>
            ))}
            <button
              onClick={() => {
                setDraftQuestions((prev) => [...prev, EMPTY_QUESTION()])
                setActiveQuestionIdx(draftQuestions.length)
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold shrink-0"
            >
              + Ajouter une manche
            </button>
          </div>

          {activeQ && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Colonne gauche : Configuration de la manche */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveQuestion({
                          question_type: 'blind_test',
                          body:
                            activeQ.body ||
                            '🎵 Blind Test : Quel est ce morceau ?',
                        })
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                        activeQ.question_type === 'blind_test'
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      🎵 Manche Blind Test
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveQuestion({ question_type: 'quiz' })
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                        activeQ.question_type === 'quiz'
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      ❓ Manche Quiz Classique
                    </button>
                  </div>

                  {draftQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraftQuestions((prev) =>
                          prev.filter((_, i) => i !== activeQuestionIdx)
                        )
                        setActiveQuestionIdx(Math.max(0, activeQuestionIdx - 1))
                      }}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Supprimer cette manche
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase text-slate-400 font-bold mb-1">
                    Intitulé affiché pendant la manche (attention : sans spoiler
                    pour un Blind Test !)
                  </label>
                  <input
                    type="text"
                    value={activeQ.body}
                    onChange={(e) =>
                      updateActiveQuestion({ body: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>

                {activeQ.question_type === 'blind_test' ? (
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-3">
                    <div className="text-xs uppercase text-purple-300 font-bold">
                      Paramètres Audio &amp; Révélation (dévoilés à la fin du
                      chrono)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Titre réel (Révélation)
                        </label>
                        <input
                          type="text"
                          value={activeQ.reveal_title}
                          onChange={(e) =>
                            updateActiveQuestion({
                              reveal_title: e.target.value,
                            })
                          }
                          placeholder="Ex: One More Time"
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Artiste (Révélation)
                        </label>
                        <input
                          type="text"
                          value={activeQ.reveal_artist}
                          onChange={(e) =>
                            updateActiveQuestion({
                              reveal_artist: e.target.value,
                            })
                          }
                          placeholder="Ex: Daft Punk"
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">
                          URL Audio (MP3 / Aperçu iTunes)
                        </label>
                        <input
                          type="text"
                          value={activeQ.audio_url}
                          onChange={(e) =>
                            updateActiveQuestion({ audio_url: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Durée écoute (sec)
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={30}
                          value={activeQ.audio_duration_sec}
                          onChange={(e) =>
                            updateActiveQuestion({
                              audio_duration_sec: Number(e.target.value) || DEFAULT_QUESTION_DURATION_SEC,
                            })
                          }
                          className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                        />
                      </div>
                    </div>

                    {activeQ.audio_url && (
                      <div className="pt-2 flex items-center gap-3">
                        <audio
                          controls
                          src={activeQ.audio_url}
                          className="h-9 flex-grow"
                        />
                        {activeQ.reveal_cover_url && (
                          <img
                            src={activeQ.reveal_cover_url}
                            alt="Cover"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs uppercase text-slate-400 font-bold mb-1">
                        URL d&apos;image d&apos;illustration (Optionnel)
                      </label>
                      <input
                        type="text"
                        value={activeQ.image_url}
                        onChange={(e) =>
                          updateActiveQuestion({ image_url: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm"
                      />
                    </div>

                    {/* Extrait vidéo YouTube joué sur l'Écran Hôte (Décision D19) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs uppercase text-slate-400 font-bold mb-1">
                          Extrait vidéo YouTube (Optionnel)
                        </label>
                        <input
                          type="text"
                          value={activeQ.video_url || ''}
                          onChange={(e) =>
                            updateActiveQuestion({ video_url: e.target.value })
                          }
                          placeholder="https://youtu.be/..."
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Début (sec)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={activeQ.audio_start_sec}
                          onChange={(e) =>
                            updateActiveQuestion({
                              audio_start_sec: Math.max(
                                0,
                                Number(e.target.value) || 0
                              ),
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Durée extrait (sec)
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={60}
                          value={activeQ.audio_duration_sec}
                          onChange={(e) =>
                            updateActiveQuestion({
                              audio_duration_sec: Number(e.target.value) || DEFAULT_QUESTION_DURATION_SEC,
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Les 4 choix QCM */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs uppercase text-slate-400 font-bold">
                    Les 4 propositions (Cochez la bonne réponse)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeQ.choices.map((choice, cIdx) => (
                      <div
                        key={cIdx}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                          choice.is_correct
                            ? 'bg-emerald-950/40 border-emerald-500'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_choice_${activeQuestionIdx}`}
                          checked={choice.is_correct}
                          onChange={() => {
                            const updated = activeQ.choices.map((c, i) => ({
                              ...c,
                              is_correct: i === cIdx,
                            }))
                            updateActiveQuestion({ choices: updated })
                          }}
                          className="w-4 h-4 accent-emerald-500"
                        />
                        <input
                          type="text"
                          value={choice.body}
                          onChange={(e) => {
                            const updated = activeQ.choices.map((c, i) =>
                              i === cIdx ? { ...c, body: e.target.value } : c
                            )
                            updateActiveQuestion({ choices: updated })
                          }}
                          placeholder={`Réponse ${cIdx + 1}`}
                          className="bg-transparent text-white text-sm font-semibold w-full focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite : Recherche musicale iTunes en 1 clic (Décision D07) */}
              <div className="lg:col-span-5 bg-slate-950 border border-white/10 rounded-2xl p-4 space-y-4">
                <div>
                  <h3 className="font-black text-base flex items-center gap-2">
                    <span>🔎</span>
                    <span>Recherche Blind Test (iTunes 30s)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tapez un artiste, un titre ou un film pour remplir
                    automatiquement l&apos;extrait MP3, la pochette et 3 fausses
                    pistes !
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={musicQuery}
                    onChange={(e) => setMusicQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMusicSearch()}
                    placeholder="Ex: Queen, Stromae, Indochine..."
                    className="flex-grow p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={handleMusicSearch}
                    disabled={searchingMusic}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold shrink-0"
                  >
                    {searchingMusic ? '...' : 'Chercher'}
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {musicResults.map((track) => (
                    <div
                      key={track.trackId}
                      className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-3"
                    >
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-sm truncate">
                          {track.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {track.artist}{' '}
                          {track.releaseYear ? `(${track.releaseYear})` : ''}
                        </div>
                        <div className="flex gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={() => applyTrackToQuestion(track, 'title')}
                            className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold"
                          >
                            ✨ Choisir (Deviner Titre)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              applyTrackToQuestion(track, 'artist')
                            }
                            className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-[11px] font-bold"
                          >
                            🎤 (Deviner Artiste)
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Import JSON */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 max-w-xl w-full space-y-4">
            <h3 className="text-xl font-black">📥 Importer un Pack JSON</h3>
            <textarea
              rows={10}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"name": "Mon Pack", "questions": [...]}'
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-sm font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleImportJson}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold"
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
