// E2E rapide du Grand Quiz sur un tirage de manches (Décision D45).
//
//   npm run test:e2e:light          → 5 manches tirées au hasard
//   npm run test:e2e:light -- 8     → 8 manches
//   E2E_SEED=<n> npm run test:e2e:light → rejoue le tirage affiché par un test en échec
import { spawnSync } from 'node:child_process'

const count = process.argv[2] || '5'
const { status } = spawnSync('npx', ['playwright', 'test', 'grand-quiz'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, E2E_LIGHT: count },
})
process.exit(status ?? 1)
