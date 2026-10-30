import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Salon Manette du pack Rétro 2026 (Décision D46) : les 15 personnalités
 * s'affichent, photos chargées, sans aucun avatar d'un autre univers.
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

test('Rétro 2026 : le Salon propose les 15 personnalités de l’année', async ({ page }) => {
  const { data: set } = await db.from('quiz_sets').select('id').eq('name', 'Rétro 2026').single()
  expect(set?.id, 'Le pack Rétro 2026 doit exister en base').toBeTruthy()
  const { data: game, error } = await db
    .from('quiz_games')
    .insert({ quiz_set_id: set!.id })
    .select('id')
    .single()
  expect(error).toBeNull()

  try {
    await page.goto(`/game/${game!.id}`)
    await expect(page.getByText('Thème Rétro 2026')).toBeVisible({ timeout: 30_000 })

    const portraits = page.locator('form button img')
    await expect(portraits).toHaveCount(15)
    await expect(page.locator('form img[src*="/avatars/love-actually/"]')).toHaveCount(0)
    await expect(page.locator('form img[src*="/avatars/harry-potter/"]')).toHaveCount(0)
    await expect
      .poll(
        () =>
          portraits.evaluateAll((imgs) =>
            imgs.every((img) => (img as HTMLImageElement).naturalWidth > 0)
          ),
        { message: 'Toutes les photos sont chargées', timeout: 20_000 }
      )
      .toBe(true)
  } finally {
    await db.from('quiz_games').delete().eq('id', game!.id)
  }
})
