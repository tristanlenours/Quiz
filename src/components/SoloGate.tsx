'use client'

import { FormEvent, ReactNode, useEffect, useState } from 'react'

const SOLO_UNLOCK_KEY = 'quiz_solo_unlocked'

export function isHostUnlocked(): boolean {
  try {
    return window.sessionStorage.getItem('quiz_host_unlocked') === '1'
  } catch {
    return false
  }
}

function isSoloUnlocked(): boolean {
  try {
    return (
      window.localStorage.getItem(SOLO_UNLOCK_KEY) === '1' || isHostUnlocked()
    )
  } catch {
    return false
  }
}

/** Écran de mot de passe des parties solo et du tableau des scores (D65). */
export function SoloGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setUnlocked(isSoloUnlocked())
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/solo-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        try {
          window.localStorage.setItem(SOLO_UNLOCK_KEY, '1')
        } catch {
          // navigation privée : le déverrouillage ne durera que cette page
        }
        setUnlocked(true)
      } else {
        setError('Mot de passe incorrect.')
      }
    } catch {
      setError('Connexion impossible, réessaie.')
    } finally {
      setSending(false)
    }
  }

  if (unlocked === null) return <div className="min-h-screen bg-slate-950" />
  if (unlocked) return <>{children}</>

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-slate-900/90 border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 text-center"
      >
        <div className="text-4xl">🔐</div>
        <h1 className="text-2xl font-black">Quiz sur invitation</h1>
        <p className="text-sm text-slate-400">
          Entre le mot de passe que t&apos;a donné l&apos;organisateur.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          autoComplete="current-password"
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-center font-bold focus:outline-none focus:border-indigo-400"
        />
        {error && (
          <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-400/40 text-red-200 text-sm font-bold">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={sending || !password.trim()}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-black"
        >
          {sending ? 'Vérification...' : 'Entrer'}
        </button>
      </form>
    </main>
  )
}
