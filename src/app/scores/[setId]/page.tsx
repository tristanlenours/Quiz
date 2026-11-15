'use client'

import { resolveAvatarTheme } from '@/avatars'
import { PackLeaderboard } from '@/components/PackLeaderboard'
import { SoloGate, isHostUnlocked } from '@/components/SoloGate'
import { ScoreEntry, fetchPackScores } from '@/leaderboard'
import { getUniverseTheme } from '@/themes'
import { supabase } from '@/types/types'
import { useEffect, useState } from 'react'

export default function ScoresPage({ params: { setId } }: { params: { setId: string } }) {
  return (
    <SoloGate>
      <Scores setId={setId} />
    </SoloGate>
  )
}

/** Tableau des scores d'un pack, live et solo confondus (D63), derrière le mot de passe solo (D65). */
function Scores({ setId }: { setId: string }) {
  const [name, setName] = useState<string | null>(null)
  const [themeId, setThemeId] = useState<string | null>(null)
  const [entries, setEntries] = useState<ScoreEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUncounted, setShowUncounted] = useState(false)

  useEffect(() => {
    setShowUncounted(isHostUnlocked())
    const load = async () => {
      const { data: set } = await supabase.from('quiz_sets').select('*').eq('id', setId).single()
      if (!set) {
        setError('Ce quiz est introuvable.')
        return
      }
      setName(set.name)
      setThemeId(resolveAvatarTheme(set))
      try {
        setEntries(await fetchPackScores(setId))
      } catch (e) {
        setError((e as Error).message)
      }
    }
    load()
  }, [setId])

  // Écran neutre tant que l'univers du pack n'est pas connu (D34)
  if (!themeId && !error) return <div className="min-h-[100dvh] bg-slate-950" />

  return (
    <main
      className={`min-h-[100dvh] bg-gradient-to-br ${getUniverseTheme(themeId).pageBg} p-4 text-white`}
    >
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-black text-center py-2.5 px-4 bg-white text-slate-900 rounded-2xl shadow-xl">
          {name ?? 'Tableau des scores'}
        </h1>
        {error && <p className="text-center font-bold text-red-200">{error}</p>}
        {entries && <PackLeaderboard entries={entries} showUncounted={showUncounted} />}
      </div>
    </main>
  )
}
