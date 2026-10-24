import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quiz & Blind Test',
  description: 'Plateforme Quiz & Blind Test propulsée par Supabase Realtime',
}

function getRuntimeSupabaseConfig() {
  const env = process.env as Record<string, string | undefined>
  const rawUrl = (
    env['SUPABASE_URL'] ||
    env['NEXT_PUBLIC_SUPABASE_URL'] ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')

  const rawKey = (
    env['SUPABASE_ANON_KEY'] ||
    env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')

  return {
    url: rawUrl,
    anonKey: rawKey,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const runtimeConfig = getRuntimeSupabaseConfig()

  return (
    <html lang="fr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__QUIZ_SUPABASE__ = ${JSON.stringify(
              runtimeConfig
            )};`,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
