/**
 * Conversion unique des réponses déjà enregistrées vers le barème D82 (src/scoring.ts).
 *
 * Ancien barème : bonne réponse = 1000 (instantanée) → 500 (fin du chrono).
 * Nouveau barème : bonne réponse = 1000 + bonus de vitesse 25 → 0.
 * La part du chrono utilisée se retrouve depuis l'ancien score, donc chaque joueur garde sa vitesse.
 *
 * Seuls les scores 500 à 999 sont convertis : le script peut être relancé sans effet
 * sur des scores déjà au nouveau barème (1000 à 1025). Un ancien 1000 (réponse en moins de
 * 1/500 du chrono) serait ambigu ; il est signalé et laissé tel quel.
 *
 * Usage : node scripts/rescale-scores.mjs            (simulation)
 *         node scripts/rescale-scores.mjs --apply    (écriture)
 * À lancer juste après le déploiement du nouveau barème, pour ne pas mélanger les échelles.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

for (const file of ['.env.local', '.env']) {
  const envPath = path.resolve(process.cwd(), file)
  if (!fs.existsSync(envPath)) continue
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, '')
  }
}

const apply = process.argv.includes('--apply')
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (.env.local).')
  process.exit(1)
}
const supabase = createClient(url, key)

const rescale = (old) => 1000 + Math.round((1 - (1000 - old) / 500) * 25)

const { data: answers, error } = await supabase
  .from('quiz_answers')
  .select('id, score')
  .gt('score', 0)
  .limit(100_000)
if (error) throw error

const todo = answers.filter((a) => a.score >= 500 && a.score <= 999)
const ambiguous = answers.filter((a) => a.score === 1000).length
const odd = answers.filter((a) => a.score < 500 || a.score > 1025).length
console.log(`${answers.length} bonnes réponses, ${todo.length} à convertir (500–999 → 1000–1025).`)
if (ambiguous) console.log(`⚠️ ${ambiguous} score(s) à exactement 1000 laissés tels quels (ancien instantané ou nouveau fin de chrono).`)
if (odd) console.log(`⚠️ ${odd} score(s) hors des deux barèmes laissés tels quels.`)
for (const a of todo.slice(0, 10)) console.log(`  ${a.score} → ${rescale(a.score)}`)
if (todo.length > 10) console.log(`  … et ${todo.length - 10} autres`)

if (!apply) {
  console.log('\nSimulation : relancer avec --apply pour écrire.')
  process.exit(0)
}
for (const a of todo) {
  const { error: uErr } = await supabase.from('quiz_answers').update({ score: rescale(a.score) }).eq('id', a.id)
  if (uErr) throw uErr
}
console.log(`✅ ${todo.length} réponse(s) converties.`)
