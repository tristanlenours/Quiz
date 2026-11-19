import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'

// Load environment from .env.local or process.env
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim()
    }
  }
}

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

assert.ok(supabaseUrl, 'SUPABASE_URL doit être défini')
assert.ok(supabaseKey, 'SUPABASE_ANON_KEY / SERVICE_ROLE_KEY doit être défini')

const supabase = createClient(supabaseUrl, supabaseKey)

const EXPECTED_AVATARS = [
  'david',
  'natalie',
  'billy_mack',
  'mark',
  'juliet',
  'jamie',
  'aurelia',
  'karen',
  'harry',
  'sam',
  'joanna',
  'rufus',
  'colin',
  'mia',
  'john',
]

test('1. Catalogue des 15 Avatars Love Actually : fichier source et images Supabase Storage accessibles (HTTP 200)', async () => {
  const avatarsSrc = fs.readFileSync(
    path.resolve(process.cwd(), 'src/avatars.ts'),
    'utf8'
  )
  assert.equal(EXPECTED_AVATARS.length, 15)

  for (const id of EXPECTED_AVATARS) {
    assert.ok(
      avatarsSrc.includes(`id: '${id}'`),
      `L'avatar '${id}' doit être défini dans src/avatars.ts`
    )
    const imgUrl = `${supabaseUrl}/storage/v1/object/public/quiz-media/avatars/love-actually/${id}.png`
    const res = await fetch(imgUrl, { method: 'HEAD' })
    assert.equal(
      res.status,
      200,
      `Le portrait de '${id}' doit être accessible sur Supabase Storage (${imgUrl})`
    )
  }
})

test('1 bis. Catalogue des 15 sorciers Harry Potter : photos des films sur Supabase Storage (D34, D35)', async () => {
  const avatarsSrc = fs.readFileSync(
    path.resolve(process.cwd(), 'src/avatars.ts'),
    'utf8'
  )
  const ids = [...avatarsSrc.matchAll(/wizard\('(hp_[a-z]+)'/g)].map((m) => m[1])
  assert.equal(ids.length, 15, 'Le thème Harry Potter doit compter 15 sorciers (D35)')
  assert.ok(ids.includes('hp_dobby'), 'Dobby doit rester au casting (D35)')

  for (const id of ids) {
    const imgUrl = `${supabaseUrl}/storage/v1/object/public/quiz-media/avatars/harry-potter/${id}.jpg`
    const res = await fetch(imgUrl, { method: 'HEAD' })
    assert.equal(res.status, 200, `La photo de '${id}' doit être accessible (${imgUrl})`)
    assert.match(res.headers.get('content-type') ?? '', /^image\//, `'${id}' doit être une image`)
  }
})

test('1 ter. Catalogue des 15 personnalités Rétro 2026 : photos sur Supabase Storage (D46)', async () => {
  const avatarsSrc = fs.readFileSync(
    path.resolve(process.cwd(), 'src/avatars.ts'),
    'utf8'
  )
  const ids = [...avatarsSrc.matchAll(/star\('(r26_[a-z]+)'/g)].map((m) => m[1])
  assert.equal(ids.length, 15, 'Le thème Rétro 2026 doit compter 15 personnalités')

  for (const id of ids) {
    const imgUrl = `${supabaseUrl}/storage/v1/object/public/quiz-media/avatars/retro-2026/${id}.jpg`
    const res = await fetch(imgUrl, { method: 'HEAD' })
    assert.equal(res.status, 200, `La photo de '${id}' doit être accessible (${imgUrl})`)
  }
})

test('2. Pack « 🎄 Love Actually — Le Warm-Up (5 manches) » : présence en base, couverture multi-formats et médias valides', async () => {
  const { data: sets, error } = await supabase
    .from('quiz_sets')
    .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
    .ilike('name', '%Love Actually — Le Warm-Up%')

  assert.ifError(error)
  assert.ok(sets && sets.length >= 1, 'Le pack Warm-Up doit exister en base')

  const warmup = sets[0]
  const questions = [...warmup.questions].sort((a, b) => a.order - b.order)
  assert.equal(
    questions.length,
    5,
    'Le pack Warm-Up doit contenir exactement 5 questions'
  )

  // Vérifier la couverture des formats : Image, Blind Test audio, Vidéo YouTube, Bande-son
  const hasImageQuiz = questions.some(
    (q) => q.question_type === 'quiz' && q.image_url
  )
  const hasBlindTest = questions.some(
    (q) =>
      q.question_type === 'blind_test' &&
      q.audio_url &&
      q.reveal_title &&
      q.reveal_cover_url
  )
  const hasVideoClip = questions.some(
    (q) => q.question_type === 'quiz' && q.video_url
  )
  const hasQuizWithSoundtrack = questions.some(
    (q) => q.question_type === 'quiz' && q.image_url && q.audio_url
  )

  assert.ok(hasImageQuiz, 'Le Warm-Up doit inclure une question illustrée')
  assert.ok(hasBlindTest, 'Le Warm-Up doit inclure un Blind Test musical')
  assert.ok(hasVideoClip, 'Le Warm-Up doit inclure un extrait vidéo YouTube')
  assert.ok(
    hasQuizWithSoundtrack,
    'Le Warm-Up doit inclure une question Quiz avec bande-son'
  )

  for (const q of questions) {
    assert.equal(
      q.choices.length,
      4,
      `La question #${q.order + 1} doit avoir 4 choix`
    )
    const correctCount = q.choices.filter((c) => c.is_correct).length
    assert.equal(
      correctCount,
      1,
      `La question #${q.order + 1} doit avoir exactement 1 bonne réponse`
    )

    if (q.image_url) {
      const r = await fetch(q.image_url, { method: 'HEAD' })
      assert.equal(r.status, 200, `Image accessible : ${q.image_url}`)
    }
    if (q.audio_url) {
      const r = await fetch(q.audio_url, { method: 'HEAD' })
      assert.equal(r.status, 200, `Audio accessible : ${q.audio_url}`)
    }
  }
})

test('3. Grand Quiz « 🎄 Love Actually — Le Grand Quiz (20 manches) » : intégrité des questions, choix et médias en base', async () => {
  const { data: sets, error } = await supabase
    .from('quiz_sets')
    .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
    .ilike('name', '%Love Actually — Le Grand Quiz%')

  assert.ifError(error)
  assert.ok(sets && sets.length >= 1, 'Le pack Love actually principal doit exister')

  const mainPack = sets[0]
  const questions = mainPack.questions
    .filter((q) => !q.is_disabled)
    .sort((a, b) => a.order - b.order)
  assert.equal(questions.length, 20, 'Le grand quiz Love actually doit avoir 20 questions actives (D69)')
  assert.equal(mainPack.questions.length, 26, 'Les questions désactivées restent en base (D38)')

  // D30 : des blind tests et des extraits vidéo ponctuent le quiz
  assert.ok(
    questions.filter((q) => q.question_type === 'blind_test' && q.audio_url && q.reveal_title).length >= 2,
    'Le grand quiz doit inclure au moins 2 Blind Tests'
  )
  assert.ok(
    questions.filter((q) => q.video_url).length >= 5,
    'Le grand quiz doit inclure au moins 5 extraits vidéo'
  )

  for (const q of questions) {
    assert.equal(q.choices.length, 4, `Question "${q.body}" doit avoir 4 choix`)
    assert.equal(
      q.choices.filter((c) => c.is_correct).length,
      1,
      `Question "${q.body}" doit avoir exactement 1 bonne réponse`
    )
    for (const url of [q.image_url, q.audio_url, q.reveal_cover_url].filter(Boolean)) {
      const res = await fetch(url, { method: 'HEAD' })
      assert.equal(res.status, 200, `Le média de "${q.body}" doit répondre HTTP 200 (${url})`)
    }
  }
})

test('4. Simulation E2E d’une partie multijoueur : avatars exclusifs, réponses, podium et nettoyage propre', async () => {
  const { data: warmup } = await supabase
    .from('quiz_sets')
    .select('id, questions:quiz_questions(id, order, choices:quiz_choices(id, is_correct))')
    .ilike('name', '%Love Actually — Le Warm-Up%')
    .single()

  assert.ok(warmup, 'Warm-Up pack trouvé')

  // 1. Créer une session de jeu temporaire
  const { data: game, error: gErr } = await supabase
    .from('quiz_games')
    .insert({ quiz_set_id: warmup.id, is_training: true })
    .select()
    .single()

  assert.ifError(gErr)
  assert.ok(game?.id, 'Session quiz_games créée')
  assert.equal(game.play_mode, 'live', 'Une partie sans précision est live (D63)')

  try {
    // 2. Inscrire 3 joueurs avec des avatars Love Actually distincts
    const playersToJoin = [
      { nickname: '[#david]Tristan', session: 'test_session_1' },
      { nickname: '[#natalie]Chloé', session: 'test_session_2' },
      { nickname: '[#rufus]Max', session: 'test_session_3' },
    ]

    const insertedPlayers = []
    for (const p of playersToJoin) {
      const { data: pRow, error: pErr } = await supabase
        .from('quiz_participants')
        .upsert(
          {
            nickname: p.nickname,
            game_id: game.id,
            client_session_id: p.session,
          },
          { onConflict: 'game_id,client_session_id' }
        )
        .select()
        .single()
      assert.ifError(pErr)
      insertedPlayers.push(pRow)
    }

    assert.equal(insertedPlayers.length, 3, '3 joueurs inscrits')

    // 3. Simuler les réponses sur les 2 premières questions
    const sortedQuestions = [...warmup.questions].sort((a, b) => a.order - b.order)
    const q0 = sortedQuestions[0]
    const q1 = sortedQuestions[1]
    const q0Correct = q0.choices.find((c) => c.is_correct)
    const q0Wrong = q0.choices.find((c) => !c.is_correct)
    const q1Correct = q1.choices.find((c) => c.is_correct)

    await supabase.from('quiz_answers').insert([
      {
        participant_id: insertedPlayers[0].id,
        question_id: q0.id,
        choice_id: q0Correct.id,
        score: 960,
      },
      {
        participant_id: insertedPlayers[1].id,
        question_id: q0.id,
        choice_id: q0Correct.id,
        score: 810,
      },
      {
        participant_id: insertedPlayers[2].id,
        question_id: q0.id,
        choice_id: q0Wrong.id,
        score: 0,
      },
      {
        participant_id: insertedPlayers[0].id,
        question_id: q1.id,
        choice_id: q1Correct.id,
        score: 920,
      },
      {
        participant_id: insertedPlayers[2].id,
        question_id: q1.id,
        choice_id: q1Correct.id,
        score: 640,
      },
    ])

    // 4. Vérifier le podium via la vue quiz_game_results
    const { data: results, error: rErr } = await supabase
      .from('quiz_game_results')
      .select()
      .eq('game_id', game.id)
      .order('total_score', { ascending: false })

    assert.ifError(rErr)
    assert.equal(results.length, 3)
    assert.equal(results[0].nickname, '[#david]Tristan')
    assert.equal(results[0].total_score, 1880)
    assert.equal(results[1].nickname, '[#natalie]Chloé')
    assert.equal(results[1].total_score, 810)
    assert.equal(results[2].nickname, '[#rufus]Max')
    assert.equal(results[2].total_score, 640)
  } finally {
    // 5. Nettoyage en cascade de la partie de test
    await supabase.from('quiz_games').delete().eq('id', game.id)
  }
})

test('5. Moteur d’analyse fun des résultats (/api/game-analysis) : présence des trophées, clins d’œil Love Actually et fallback déterministe', async () => {
  const routeSrc = fs.readFileSync(
    path.resolve(process.cwd(), 'src/app/api/game-analysis/route.ts'),
    'utf8'
  )

  // Vérifier que les 15 personnages ont chacun une punchline de victoire dédiée
  for (const id of EXPECTED_AVATARS) {
    assert.ok(
      routeSrc.includes(`${id}:`),
      `Le personnage '${id}' doit avoir une punchline personnalisée dans CHARACTER_VICTORY_QUIPS`
    )
  }

  // Vérifier que les trophées spéciaux et l'intégration Gemini + fallback sont bien présents
  assert.ok(routeSrc.includes('Lucky Luke du Buzzer'))
  assert.ok(routeSrc.includes('Sniper de Downing Street'))
  assert.ok(routeSrc.includes("Prix Mr Bean de l'Emballage"))
  assert.ok(routeSrc.includes('Sprint Final à Heathrow'))
  assert.ok(routeSrc.includes('GEMINI_API_KEY'))
})

test('6. Non-régression D24 : isolation des réponses par partie en cours et verrou anti-révélation prématurée', async () => {
  const hostQuizSrc = fs.readFileSync(
    path.resolve(process.cwd(), 'src/app/host/game/[id]/quiz.tsx'),
    'utf8'
  )
  assert.ok(
    hostQuizSrc.includes(".in('participant_id', currentParticipantIds)"),
    'Le compteur de réponses Hôte doit filtrer quiz_answers par les participants de la partie en cours'
  )
  assert.ok(
    hostQuizSrc.includes('hasRevealedRef.current') &&
      hostQuizSrc.includes('isTransitioningRef.current'),
    'Les verrous synchrones hasRevealedRef et isTransitioningRef doivent protéger onTimeUp et getNextQuestion'
  )
})

test('8. Parties solo et training : colonnes play_mode / is_training en base (migration D63)', async () => {
  const { data: warmup } = await supabase
    .from('quiz_sets')
    .select('id')
    .ilike('name', '%Love Actually — Le Warm-Up%')
    .single()
  const { data: game, error } = await supabase
    .from('quiz_games')
    .insert({ quiz_set_id: warmup.id, play_mode: 'solo', is_training: true, phase: 'quiz' })
    .select('id, play_mode, is_training')
    .single()
  assert.ifError(error)
  try {
    assert.equal(game.play_mode, 'solo')
    assert.equal(game.is_training, true)
    const { error: badMode } = await supabase
      .from('quiz_games')
      .insert({ quiz_set_id: warmup.id, play_mode: 'duel', is_training: true })
    assert.ok(badMode, 'play_mode n’accepte que live ou solo')
  } finally {
    await supabase.from('quiz_games').delete().eq('id', game.id)
  }
})

test('9. Commentaire solo (D66) : statistiques individuelles, repli déterministe et zéro spoil', async () => {
  const { computeSoloStats, buildDeterministicSoloComment, buildSoloPrompt } = await import(
    '../src/soloAnalysis.ts'
  )

  const stats = computeSoloStats({ displayName: 'Testeur', characterName: null }, [1000, 750, 0, null, 500, 900])
  assert.equal(stats.correct, 4)
  assert.equal(stats.wrong, 1)
  assert.equal(stats.timeouts, 1)
  assert.equal(stats.totalScore, 3150)
  assert.equal(stats.maxStreak, 2)
  assert.equal(stats.avgTimeUsedPct, Math.round(((0 + 0.5 + 1 + 0.2) / 4) * 100))
  assert.deepEqual(stats.bestRound, { round: 1, score: 1000 })

  // Aucun texte ne doit contenir une bonne réponse d'un pack du même univers (AGENTS.md §4)
  const fold = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const { data: sets, error } = await supabase
    .from('quiz_sets')
    .select('name, avatar_theme, questions:quiz_questions(body, reveal_title, reveal_artist, choices:quiz_choices(body, is_correct))')
  assert.ifError(error)
  const profiles = [
    [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
    [900, 950, 980, 0, 990, 970, 960, 940],
    [600, 550, 520, 0, null, 0, 510, 505],
    [null, null, 0, 0, 800, 900, 950, 990],
    [990, 980, 970, 960, 0, null, null, 0],
    [0, null, 0, null, 0, null, 0, null],
  ]
  for (const themeId of ['love_actually', 'harry_potter', 'retro_2026', 'inconnu']) {
    const secrets = (sets ?? [])
      .filter((s) => s.avatar_theme === themeId && !/^E2E/.test(s.name))
      .flatMap((s) =>
        s.questions.flatMap((q) => [
          q.reveal_title,
          q.reveal_artist,
          ...q.choices.filter((c) => c.is_correct).map((c) => c.body),
        ])
      )
      .filter((t) => t && t.trim().length >= 5)
      .map(fold)
    for (const scores of profiles) {
      const s = computeSoloStats({ displayName: 'Testeur', characterName: null }, scores)
      const { headline, chronicle } = buildDeterministicSoloComment(themeId, s)
      assert.ok(headline.length > 5 && chronicle.length > 40, `Commentaire ${themeId} non vide`)
      const text = fold(`${headline} ${chronicle}`)
      for (const secret of secrets) {
        assert.ok(!text.includes(secret), `Le commentaire ${themeId} dévoile « ${secret} »`)
      }
      // Le prompt Gemini ne contient que des chiffres : aucune question ni réponse
      const prompt = fold(buildSoloPrompt(themeId, 'Quiz', s))
      for (const secret of secrets) {
        assert.ok(!prompt.includes(secret), `Le prompt ${themeId} dévoile « ${secret} »`)
      }
    }
  }
})

test('10. Scores effacés quand un pack change (D70) : synchro sans différence conservée, changement purgé', async () => {
  const name = '🧪 Purge des scores D70 (pack temporaire)'
  const file = path.join(os.tmpdir(), `quiz-purge-${process.pid}.json`)
  const pack = {
    name,
    description: 'Pack temporaire de test, supprimé à la fin',
    mode: 'quiz',
    avatar_theme: 'love_actually',
    questions: [
      {
        order: 0,
        question_type: 'quiz',
        body: 'Question temporaire ?',
        choices: [
          { body: 'A', is_correct: true },
          { body: 'B', is_correct: false },
          { body: 'C', is_correct: false },
          { body: 'D', is_correct: false },
        ],
      },
    ],
  }
  const sync = (...args) => {
    fs.writeFileSync(file, JSON.stringify(pack))
    return execFileSync(process.execPath, ['scripts/sync-pack.mjs', file, ...args], { encoding: 'utf8' })
  }
  const games = async (setId) =>
    (await supabase.from('quiz_games').select('*', { count: 'exact', head: true }).eq('quiz_set_id', setId)).count

  await supabase.from('quiz_sets').delete().eq('name', name)
  try {
    sync('--create', '--apply')
    const { data: set } = await supabase.from('quiz_sets').select('id').eq('name', name).single()
    const { error } = await supabase
      .from('quiz_games')
      .insert({ quiz_set_id: set.id, play_mode: 'solo', is_training: true, phase: 'result' })
    assert.ifError(error)

    assert.match(sync('--apply'), /Aucun changement de jeu/)
    assert.equal(await games(set.id), 1, 'Une synchro sans différence conserve les parties')

    pack.description = 'Description modifiée'
    sync('--apply')
    assert.equal(await games(set.id), 1, 'Le nom et la description ne sont pas du jeu : parties conservées')

    pack.questions[0].choices[1].body = 'B modifié'
    assert.match(sync(), /seront effacés/)
    assert.equal(await games(set.id), 1, 'La simulation n’efface rien')
    sync('--apply')
    assert.equal(await games(set.id), 0, 'Un choix modifié efface les parties du pack')

    // Le Studio efface aussi les scores : éditeur et interrupteur d'une manche
    const studio = fs.readFileSync(path.resolve(process.cwd(), 'src/app/host/dashboard/page.tsx'), 'utf8')
    assert.equal(studio.match(/await purgePackScores\(/g)?.length, 2, 'Éditeur et interrupteur doivent purger les scores')
  } finally {
    await supabase.from('quiz_sets').delete().eq('name', name)
    fs.rmSync(file, { force: true })
  }
})

test('7. AGENTS.md relu jusqu’à la dernière décision de DECISIONS.md (D33)', () => {
  const decisions = fs.readFileSync(path.resolve(process.cwd(), 'DECISIONS.md'), 'utf8')
  const agents = fs.readFileSync(path.resolve(process.cwd(), 'AGENTS.md'), 'utf8')
  const latest = Math.max(...[...decisions.matchAll(/^\| \*\*D(\d+)\*\* \|/gm)].map((m) => Number(m[1])))
  const marker = agents.match(/Dernière revue d'AGENTS\.md : D(\d+)/)
  assert.ok(marker, 'AGENTS.md doit porter le marqueur « Dernière revue d’AGENTS.md : Dxx »')
  assert.ok(
    Number(marker[1]) >= latest,
    `DECISIONS.md va jusqu’à D${latest} mais AGENTS.md n’a été relu que jusqu’à D${marker[1]} : ` +
      `vérifier si les décisions récentes changent une règle de travail, mettre AGENTS.md à jour si besoin, puis avancer le marqueur.`
  )
})

test('11. Downing Street Groove (D71) : moteur de course 1, 2, 3 Soleil, trophées et zéro spoil', async () => {
  const {
    createInitialRacer,
    applyRacerStep,
    applyDoorCloseComposureBonus,
    rankRacers,
    computeGrooveTrophies,
    buildGrooveChronicle,
    FINISH_DISTANCE,
    GRACE_PERIOD_MS,
    PENALTY_METERS,
    STUN_DURATION_MS,
  } = await import('../src/groove.ts')

  let david = createInitialRacer({ id: 'p1', nickname: '[#david]Tristan', avatar_id: 'david' })
  let natalie = createInitialRacer({ id: 'p2', nickname: '[#natalie]Chloé', avatar_id: 'natalie' })

  const startMs = 1_000_000
  // 1. Alternance G/D fait monter le combo et avancer
  let res = applyRacerStep(david, 'L', startMs + 100, startMs, 'dancing', 0)
  david = res.racer
  assert.equal(res.outcome, 'grooved')
  assert.equal(david.combo, 1)
  assert.equal(david.distance, 1.25)

  res = applyRacerStep(david, 'R', startMs + 200, startMs, 'dancing', 0)
  david = res.racer
  assert.equal(res.outcome, 'grooved')
  assert.equal(david.combo, 2)
  assert.equal(david.distance, 2.5)

  // 2. Même pied deux fois = trébuchement (+0.25 m et combo remis à 0)
  res = applyRacerStep(david, 'R', startMs + 300, startMs, 'dancing', 0)
  david = res.racer
  assert.equal(res.outcome, 'stumbled')
  assert.equal(david.combo, 0)
  assert.equal(david.distance, 2.75)

  // 3. Faire avancer Natalie à 20 m puis tester l'ouverture de la porte
  for (let i = 0; i < 16; i++) {
    natalie = applyRacerStep(
      natalie,
      i % 2 === 0 ? 'L' : 'R',
      startMs + 400 + i * 50,
      startMs,
      'dancing',
      0
    ).racer
  }
  assert.ok(natalie.distance >= 20)
  const distBeforeDoor = natalie.distance
  const doorOpenMs = startMs + 2000

  // Dans la fenêtre de grâce (250 ms), pas de pénalité
  res = applyRacerStep(natalie, 'L', doorOpenMs + GRACE_PERIOD_MS - 50, startMs, 'watching', doorOpenMs)
  natalie = res.racer
  assert.notEqual(res.outcome, 'caught')

  // Au-delà de 250 ms pendant `watching` : PRIS EN FLAG (-8 m + gel 2,5 s)
  res = applyRacerStep(natalie, 'R', doorOpenMs + GRACE_PERIOD_MS + 100, startMs, 'watching', doorOpenMs)
  natalie = res.racer
  assert.equal(res.outcome, 'caught')
  assert.equal(natalie.caughtCount, 1)
  assert.equal(natalie.combo, 0)
  assert.equal(natalie.distance, Number((distBeforeDoor + 1.75 - PENALTY_METERS).toFixed(2)))

  // Tant que le gel dure, impossible d'avancer
  const stunnedAttempt = applyRacerStep(
    natalie,
    'L',
    doorOpenMs + GRACE_PERIOD_MS + 100 + STUN_DURATION_MS - 100,
    startMs,
    'dancing',
    doorOpenMs
  )
  assert.equal(stunnedAttempt.outcome, 'stunned')

  // 4. David n'a pas bougé pendant `watching` après avoir dansé -> bonus de sang-froid (+2 m) à la fermeture
  const boosted = applyDoorCloseComposureBonus([david, natalie], doorOpenMs + 3000)
  assert.equal(boosted[0].composureCount, 1)
  assert.equal(boosted[0].distance, 4.75)
  assert.equal(boosted[1].composureCount, 0)

  // 5. Amener David jusqu'à la ligne d'arrivée (100 m)
  david = boosted[0]
  let t = startMs + 6000
  while (david.finishedAtMs === null) {
    const side = david.lastSide === 'L' ? 'R' : 'L'
    t += 80
    david = applyRacerStep(david, side, t, startMs, 'dancing', 0).racer
  }
  assert.equal(david.distance, FINISH_DISTANCE)
  assert.ok(david.finishedAtMs > 0)

  const ranked = rankRacers([natalie, david])
  assert.equal(ranked[0].participantId, 'p1')

  const trophies = computeGrooveTrophies(ranked)
  assert.ok(trophies.length >= 3)
  const chronicle = buildGrooveChronicle(ranked)
  assert.match(chronicle, /Tristan/)

  // 6. Zéro spoil du titre du Blind Test du Grand Quiz (« Jump (For My Love) » / « Pointer Sisters »)
  for (const relPath of [
    'src/groove.ts',
    'src/app/host/groove/[id]/page.tsx',
    'src/app/groove/[id]/page.tsx',
  ]) {
    const src = fs.readFileSync(path.resolve(process.cwd(), relPath), 'utf8').toLowerCase()
    assert.ok(!src.includes('jump (for my love)'), `${relPath} ne doit pas divulgâcher Jump (For My Love)`)
    assert.ok(!src.includes('pointer sisters'), `${relPath} ne doit pas divulgâcher The Pointer Sisters`)
  }
})
