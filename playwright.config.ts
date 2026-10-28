import { defineConfig } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT || 3100)

// Tests E2E navigateur (Décision D28) : 1 Écran Hôte + N manettes mobiles
// contre la vraie base Supabase partagée. Lancer avec `npm run test:e2e`.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 8 * 60 * 1000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || `http://localhost:${PORT}`,
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      // L'Écran Hôte (TV) est supposé avoir déjà reçu un geste utilisateur
      args: ['--autoplay-policy=no-user-gesture-required'],
    },
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next dev -p ${PORT}`,
        url: `http://localhost:${PORT}/api/host-auth`,
        reuseExistingServer: true,
        timeout: 180_000,
      },
})
