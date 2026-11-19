import { test, expect, devices } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { GROOVE_SEQUENCE_MARKER } from '../../src/groove'

/**
 * Test E2E navigateur de « 🕺 Downing Street Groove » (D71) :
 * 1 Écran Hôte TV (/host/groove/[id]) + 2 Manettes mobiles (/groove/[id])
 * avec redirection PIN depuis l'accueil (/), avatars exclusifs Love Actually,
 * prénom obligatoire gardé en cookie (D72), course en temps réel et podium + trophées.
 */

for (const file of ['.env.local', '.env']) {
  const envPath = path.resolve(process.cwd(), file)
  if (!fs.existsSync(envPath)) continue
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

const db = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
)

test('Downing Street Groove E2E : 1 TV + 2 manettes mobiles (salon, redirection PIN, course, podium)', async ({
  browser,
}) => {
  const { data: warmup, error: wErr } = await db
    .from('quiz_sets')
    .select('id')
    .ilike('name', '%Love Actually — Le Warm-Up%')
    .single()
  expect(wErr).toBeNull()

  const pinCode = String(Math.floor(100000 + Math.random() * 900000))
  const { data: game, error: gErr } = await db
    .from('quiz_games')
    .insert({
      quiz_set_id: warmup!.id,
      pin_code: pinCode,
      current_question_sequence: GROOVE_SEQUENCE_MARKER,
      is_training: true,
    })
    .select()
    .single()
  expect(gErr).toBeNull()

  let nextGameId: string | null = null
  const tvContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
  })
  const { defaultBrowserType: _ignored, ...pixel } = devices['Pixel 7']
  const p1Context = await browser.newContext({ ...pixel, locale: 'fr-FR' })
  const p2Context = await browser.newContext({ ...pixel, locale: 'fr-FR' })

  try {
    const tvPage = await tvContext.newPage()
    const p1Page = await p1Context.newPage()
    const p2Page = await p2Context.newPage()

    // 1. Ouvrir la TV sur /host/groove/[id]
    await tvPage.goto(`/host/groove/${game!.id}`)
    await expect(
      tvPage.getByRole('heading', { name: /Downing Street Groove/i })
    ).toBeVisible()
    await expect(tvPage.getByText(pinCode)).toBeVisible()

    // 2. Joueur 1 rejoint via le code PIN sur l'accueil `/` -> redirigé vers /groove/[id]
    await p1Page.goto('/')
    await p1Page.getByPlaceholder(/Code PIN/i).fill(pinCode)
    await p1Page.getByRole('button', { name: /Entrer dans le salon/i }).click()
    await expect(p1Page).toHaveURL(new RegExp(`/groove/${game!.id}$`))

    // Choisir l'avatar du Premier Ministre (David)
    await p1Page
      .locator('form button')
      .filter({ has: p1Page.locator('img[alt="Le Premier Ministre"]') })
      .click()
    // Sans prénom, impossible de rejoindre (D72)
    const p1Join = p1Page.getByRole('button', { name: /Écris ton prénom ou pseudo/ })
    await expect(p1Join).toBeDisabled()
    await p1Page.getByPlaceholder(/^Ex:/).fill('   ')
    await expect(p1Join).toBeDisabled()
    await p1Page.getByPlaceholder(/^Ex:/).fill('Hugh')
    await p1Page.getByRole('button', { name: /Rejoindre en tant que Hugh/ }).click()
    await expect(p1Page.getByRole('heading', { name: 'Hugh', exact: true })).toBeVisible()
    const nameCookie = (await p1Context.cookies()).find((c) => c.name === 'quiz_player_name')
    expect(nameCookie?.value, 'Prénom gardé en cookie').toBe('Hugh')

    // 3. Joueur 2 rejoint directement via l'URL QR Code /groove/[id] et choisit Natalie
    await p2Page.goto(`/groove/${game!.id}`)
    await p2Page
      .locator('form button')
      .filter({ has: p2Page.locator('img[alt="Natalie"]') })
      .click()
    await p2Page.getByPlaceholder(/^Ex:/).fill('Martine')
    await p2Page.getByRole('button', { name: /Rejoindre en tant que Martine/ }).click()
    await expect(p2Page.getByRole('heading', { name: 'Martine', exact: true })).toBeVisible()

    // 4. Vérifier que les 2 joueurs apparaissent sur la TV et lancer la course
    const startBtn = tvPage.getByRole('button', {
      name: /Lancer la course \(2 joueurs\)/i,
    })
    await expect(startBtn).toBeEnabled({ timeout: 10_000 })
    await startBtn.click()

    // 5. Attendre la fin du décompte 3, 2, 1 et le passage en course (`racing`)
    const leftBtn1 = p1Page.getByTestId('groove-btn-left')
    const rightBtn1 = p1Page.getByTestId('groove-btn-right')
    await expect(leftBtn1).toBeEnabled({ timeout: 10_000 })

    // 6. Joueur 1 alterne GAUCHE / DROITE quand la porte est en mode `dancing`
    for (let i = 0; i < 16; i++) {
      const doorState = await tvPage
        .getByTestId('groove-door-banner')
        .getAttribute('data-door-state')
      if (doorState === 'dancing') {
        if (i % 2 === 0) {
          await leftBtn1.click()
        } else {
          await rightBtn1.click()
        }
      }
      await p1Page.waitForTimeout(40)
    }

    // Joueur 2 fait quelques pas aussi
    await p2Page.getByTestId('groove-btn-left').click()
    await p2Page.getByTestId('groove-btn-right').click()

    // 7. Terminer la course et vérifier le Podium & les Trophées sur TV et Manette
    await tvPage.getByRole('button', { name: /🏁 Terminer/i }).click()

    await expect(
      tvPage.getByRole('heading', { name: /Le Podium du Déhanché Ministériel/i })
    ).toBeVisible()
    await expect(
      tvPage.getByText(/Le Rapport du Chef de Cabinet/i)
    ).toBeVisible()
    await expect(
      tvPage.getByText(/Roi du Déhanché Ministériel/i)
    ).toBeVisible()

    await expect(
      p1Page.getByText(/Course Terminée • 10 Downing Street/i)
    ).toBeVisible({ timeout: 10_000 })
    await expect(p1Page.getByText(/1re Place/i)).toBeVisible()

    // 8. On enchaîne sur un quiz live : le prénom est déjà rempli (cookie, D72)
    const { data: quizGame, error: qErr } = await db
      .from('quiz_games')
      .insert({ quiz_set_id: warmup!.id, is_training: true })
      .select()
      .single()
    expect(qErr).toBeNull()
    nextGameId = quizGame!.id
    const nextPage = await p1Context.newPage()
    await nextPage.goto(`/game/${nextGameId}`)
    await expect(nextPage.getByPlaceholder(/^Ex:/)).toHaveValue('Hugh', { timeout: 15_000 })
    await expect(nextPage.getByRole('button', { name: /Rejoindre en tant que Hugh/ })).toBeVisible()

    // 9. Le lien quiz d'un salon Groove renvoie vers la manette du mini-jeu
    await nextPage.goto(`/game/${game!.id}`)
    await expect(nextPage).toHaveURL(new RegExp(`/groove/${game!.id}$`), { timeout: 15_000 })
  } finally {
    await p1Context.close()
    await p2Context.close()
    await tvContext.close()
    await db.from('quiz_games').delete().eq('id', game!.id)
    if (nextGameId) await db.from('quiz_games').delete().eq('id', nextGameId)
  }
})
