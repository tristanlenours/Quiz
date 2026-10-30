import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Chaque extrait YouTube des packs doit se lancer dans un lecteur intégré (Décision D47).
 * oEmbed et `playableInEmbed` ne suffisent pas : un ayant droit peut bloquer la
 * diffusion hors de YouTube, ce que seul le lecteur signale (erreurs 101 et 150).
 * Le Chromium de Playwright ne lit pas le H.264 : seul le blocage est contrôlé ici.
 */

const packsDir = path.resolve(process.cwd(), 'packs')
const videos = new Map<string, string>()
for (const file of fs.readdirSync(packsDir)) {
  const pack = JSON.parse(fs.readFileSync(path.join(packsDir, file), 'utf8'))
  for (const q of pack.questions) {
    const id = q.video_url?.match(/(?:v=|youtu\.be\/)([\w-]{11})/)?.[1]
    if (id) videos.set(id, `${file} : ${q.body}`)
  }
}

test('Les extraits YouTube des packs ne sont pas bloqués à l’intégration', async ({ page }) => {
  test.setTimeout(3 * 60 * 1000)
  await page.goto('/')

  const blocked: string[] = []
  for (const [id, label] of Array.from(videos)) {
    const error = await page.evaluate(
      (videoId) =>
        new Promise<number | null>((resolve) => {
          const iframe = document.createElement('iframe')
          iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(location.origin)}`
          const listen = () =>
            iframe.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onError'], id: 1, channel: 'widget' }),
              '*'
            )
          const onMessage = (e: MessageEvent) => {
            if (e.source !== iframe.contentWindow) return
            try {
              const data = JSON.parse(e.data)
              if (data.event === 'onError') finish(data.info)
            } catch {
              // message d'un autre format : ignoré
            }
          }
          const finish = (code: number | null) => {
            window.removeEventListener('message', onMessage)
            iframe.remove()
            resolve(code)
          }
          window.addEventListener('message', onMessage)
          iframe.addEventListener('load', () => {
            listen()
            setTimeout(listen, 1500)
          })
          document.body.appendChild(iframe)
          setTimeout(() => finish(null), 6000)
        }),
      id
    )
    if (error === 100 || error === 101 || error === 150) blocked.push(`${id} (erreur ${error}) — ${label}`)
  }
  expect(blocked, 'Vidéos bloquées ou supprimées').toEqual([])
})
