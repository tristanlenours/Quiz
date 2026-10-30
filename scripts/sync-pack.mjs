// Synchronise un pack JSON (`packs/*.json`) vers Supabase, SUR PLACE (Décision D30).
//
//   npm run pack:sync -- packs/love-actually.json             → simulation (rien n'est écrit)
//   npm run pack:sync -- packs/love-actually.json --apply     → écriture en base
//   ... --set-id <uuid>                                       → cible explicite (pack renommé)
//   ... --create                                              → crée le pack s'il n'existe pas (D36)
//
// Les lignes quiz_questions / quiz_choices existantes sont mises à jour par position
// (ordre des questions, puis ordre de création des choix) afin de conserver leurs
// identifiants et l'historique quiz_answers. Questions et choix manquants sont insérés.
// Le script refuse de supprimer : s'il y a plus de lignes en base que dans le JSON,
// il s'arrête avant toute écriture.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

for (const file of ['.env.local', '.env']) {
  const envPath = path.resolve(process.cwd(), file)
  if (!fs.existsSync(envPath)) continue
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, '')
  }
}

const args = process.argv.slice(2)
const packPath = args.find((a) => a.endsWith('.json'))
const apply = args.includes('--apply')
const create = args.includes('--create')
const setIdArg = args.includes('--set-id') ? args[args.indexOf('--set-id') + 1] : null
if (!packPath) {
  console.error('Usage : npm run pack:sync -- packs/<pack>.json [--set-id <uuid>] [--create] [--apply]')
  process.exit(1)
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (.env.local)')
  process.exit(1)
}
const db = createClient(url, key)
const check = (res) => {
  if (res.error) throw new Error(res.error.message)
  return res.data
}

const pack = JSON.parse(fs.readFileSync(packPath, 'utf8'))
for (const [i, q] of pack.questions.entries()) {
  const correct = q.choices.filter((c) => c.is_correct).length
  if (q.choices.length !== 4 || correct !== 1) {
    throw new Error(`Question ${i} (« ${q.body} ») : 4 choix et 1 seule bonne réponse attendus`)
  }
}

const sets = check(
  setIdArg
    ? await db.from('quiz_sets').select('id, name').eq('id', setIdArg)
    : await db.from('quiz_sets').select('id, name').eq('name', pack.name)
)
if (sets.length === 0 && create && !setIdArg) {
  if (!apply) {
    console.log(`Nouveau pack « ${pack.name} » : ${pack.questions.length} questions à créer`)
    console.log('Simulation uniquement : relancer avec --apply pour écrire en base.')
    process.exit(0)
  }
  sets.push(
    check(
      await db
        .from('quiz_sets')
        .insert({ name: pack.name, description: pack.description, mode: pack.mode, avatar_theme: pack.avatar_theme })
        .select('id, name')
        .single()
    )
  )
}
if (sets.length !== 1) {
  throw new Error(
    `${sets.length} pack(s) trouvé(s) pour ${setIdArg ? `l'id ${setIdArg}` : `le nom « ${pack.name} »`}. ` +
      'Utiliser --set-id pour un pack renommé ; un nouveau pack s’importe depuis le Studio.'
  )
}
const setId = sets[0].id
const existing = check(
  await db
    .from('quiz_questions')
    .select('id, order, choices:quiz_choices(id, created_at)')
    .eq('quiz_set_id', setId)
    .order('order', { ascending: true })
)
const sortedChoices = (q) =>
  [...q.choices].sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id))

if (existing.length > pack.questions.length) {
  throw new Error(`${existing.length} questions en base pour ${pack.questions.length} dans le JSON : suppression refusée`)
}
for (const [i, q] of existing.entries()) {
  if (q.choices.length > pack.questions[i].choices.length) {
    throw new Error(`Question ${i} : plus de choix en base que dans le JSON, suppression refusée`)
  }
}

const history = existing.length
  ? (await db.from('quiz_answers').select('*', { count: 'exact', head: true }).in('question_id', existing.map((q) => q.id))).count
  : 0
console.log(`« ${sets[0].name} » → « ${pack.name} »`)
console.log(`${existing.length} → ${pack.questions.length} questions, ${history} réponses historiques conservées`)
if (!apply) {
  console.log('Simulation uniquement : relancer avec --apply pour écrire en base.')
  process.exit(0)
}

check(
  await db
    .from('quiz_sets')
    .update({ name: pack.name, description: pack.description, mode: pack.mode, avatar_theme: pack.avatar_theme })
    .eq('id', setId)
)
const usesDisabled = pack.questions.some((q) => 'is_disabled' in q)
for (const [i, q] of pack.questions.entries()) {
  const row = {
    quiz_set_id: setId,
    order: i,
    question_type: q.question_type,
    body: q.body,
    image_url: q.image_url ?? null,
    audio_url: q.audio_url ?? null,
    audio_start_sec: q.audio_start_sec ?? 0,
    audio_duration_sec: q.audio_duration_sec ?? 30,
    video_url: q.video_url ?? null,
    reveal_title: q.reveal_title ?? null,
    reveal_artist: q.reveal_artist ?? null,
    reveal_cover_url: q.reveal_cover_url ?? null,
    // Écrit seulement pour un pack qui s'en sert : les autres passent sans la migration D38
    ...(usesDisabled ? { is_disabled: Boolean(q.is_disabled) } : {}),
  }
  let questionId
  let oldChoices = []
  if (existing[i]) {
    questionId = existing[i].id
    oldChoices = sortedChoices(existing[i])
    check(await db.from('quiz_questions').update(row).eq('id', questionId))
  } else {
    questionId = check(await db.from('quiz_questions').insert(row).select('id').single()).id
  }
  for (const [j, c] of q.choices.entries()) {
    const choice = { body: c.body, is_correct: c.is_correct }
    if (oldChoices[j]) check(await db.from('quiz_choices').update(choice).eq('id', oldChoices[j].id))
    else check(await db.from('quiz_choices').insert({ ...choice, question_id: questionId }))
  }
}

// Vérification : la base reflète exactement le JSON
const after = check(
  await db
    .from('quiz_questions')
    .select('order, body, choices:quiz_choices(body, is_correct)')
    .eq('quiz_set_id', setId)
    .order('order', { ascending: true })
)
let ko = 0
for (const q of after) {
  const expected = pack.questions[q.order]
  const good = q.choices.filter((c) => c.is_correct)
  const ok =
    q.body === expected.body &&
    q.choices.length === 4 &&
    good.length === 1 &&
    good[0].body === expected.choices.find((c) => c.is_correct).body
  if (!ok) ko++
  console.log(`${ok ? 'OK' : 'KO'} ${q.order} ${q.body.slice(0, 70)}`)
}
if (ko) {
  console.error(`${ko} question(s) en écart avec le JSON`)
  process.exit(1)
}
