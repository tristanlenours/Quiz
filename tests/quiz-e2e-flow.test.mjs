import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
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

test('3. Grand Quiz « 🎄 Love Actually — Le Grand Quiz (18 manches) » : intégrité des questions, choix et médias en base', async () => {
  const { data: sets, error } = await supabase
    .from('quiz_sets')
    .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
    .ilike('name', '%Love Actually — Le Grand Quiz%')

  assert.ifError(error)
  assert.ok(sets && sets.length >= 1, 'Le pack Love actually principal doit exister')

  const mainPack = sets[0]
  const questions = [...mainPack.questions].sort((a, b) => a.order - b.order)
  assert.equal(questions.length, 18, 'Le grand quiz Love actually doit avoir 18 questions')

  // D30 : des blind tests et des extraits vidéo ponctuent le quiz
  assert.ok(
    questions.filter((q) => q.question_type === 'blind_test' && q.audio_url && q.reveal_title).length >= 3,
    'Le grand quiz doit inclure au moins 3 Blind Tests'
  )
  assert.ok(
    questions.filter((q) => q.video_url).length >= 2,
    'Le grand quiz doit inclure au moins 2 extraits vidéo'
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
    .insert({ quiz_set_id: warmup.id })
    .select()
    .single()

  assert.ifError(gErr)
  assert.ok(game?.id, 'Session quiz_games créée')

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
