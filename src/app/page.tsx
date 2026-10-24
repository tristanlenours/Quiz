'use client'

import { supabase } from '@/types/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [pinCode, setPinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleJoinByPin = async (e: FormEvent) => {
    e.preventDefault()
    const cleanPin = pinCode.trim()
    if (!cleanPin) return

    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase
      .from('quiz_games')
      .select('id, phase')
      .eq('pin_code', cleanPin)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setLoading(false)

    if (error) {
      setErrorMsg(`Erreur Supabase : ${error.message}`)
      return
    }

    if (!data) {
      setErrorMsg('Aucune partie trouvée avec ce code PIN.')
      return
    }

    router.push(`/game/${data.id}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white flex flex-col justify-between p-6">
      <header className="flex justify-between items-center max-w-5xl w-full mx-auto pt-2">
        <div className="flex items-center gap-2 font-black text-xl tracking-tight">
          <span className="text-2xl">🎵</span>
          <span>Quiz &amp; Blind Test</span>
        </div>
        <Link
          href="/host/dashboard"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition border border-white/15"
        >
          🎛️ Studio Hôte
        </Link>
      </header>

      <div className="my-auto max-w-md w-full mx-auto bg-slate-900/90 border border-white/15 rounded-2xl p-8 shadow-2xl backdrop-blur">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-3xl mb-3">
            🕹️
          </div>
          <h1 className="text-3xl font-black tracking-tight">Rejoindre une partie</h1>
          <p className="text-slate-400 text-sm mt-1">
            Scannez le QR Code sur la TV ou entrez le code PIN à 6 chiffres
          </p>
        </div>

        <form onSubmit={handleJoinByPin} className="space-y-4">
          <div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              placeholder="Code PIN (ex: 482910)"
              className="w-full text-center text-2xl font-mono font-bold tracking-widest py-4 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || pinCode.length < 4}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-bold text-lg shadow-lg shadow-indigo-600/30 transition"
          >
            {loading ? 'Connexion...' : 'Entrer dans le salon →'}
          </button>
        </form>
      </div>

      <footer className="text-center text-xs text-slate-500 pb-2">
        Propulsé par Supabase Realtime &amp; Railway • Base partagée avec DraftMaster
      </footer>
    </main>
  )
}
