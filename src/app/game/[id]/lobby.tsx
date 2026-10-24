import { getClientSessionId, Participant, supabase } from '@/types/types'
import { FormEvent, useEffect, useState } from 'react'

export default function Lobby({
  gameId,
  onRegisterCompleted,
}: {
  gameId: string
  onRegisterCompleted: (participant: Participant) => void
}) {
  const [participant, setParticipant] = useState<Participant | null>(null)

  useEffect(() => {
    const fetchParticipant = async () => {
      const clientSessionId = getClientSessionId()

      const { data: participantData, error } = await supabase
        .from('quiz_participants')
        .select()
        .eq('game_id', gameId)
        .eq('client_session_id', clientSessionId)
        .maybeSingle()

      if (error) {
        console.error(error.message)
        return
      }

      if (participantData) {
        setParticipant(participantData)
        onRegisterCompleted(participantData)
      }
    }

    fetchParticipant()
  }, [gameId, onRegisterCompleted])

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex justify-center items-center min-h-screen p-6">
      <div className="bg-slate-900/90 border border-white/15 p-8 rounded-3xl max-w-md w-full shadow-2xl">
        {!participant && (
          <Register
            gameId={gameId}
            onRegisterCompleted={(registered) => {
              onRegisterCompleted(registered)
              setParticipant(registered)
            }}
          />
        )}

        {participant && (
          <div className="text-white text-center space-y-5">
            <div className="text-5xl animate-bounce">🎮</div>
            <h1 className="text-2xl font-black">
              Bienvenue {participant.nickname} !
            </h1>
            <p className="text-slate-300 text-sm">
              Ton pseudo est affiché sur l&apos;écran principal (TV / Hôte).
              Prépare-toi, la partie démarre dès que l&apos;Hôte clique sur{' '}
              <strong>&laquo;&nbsp;Démarrer la partie&nbsp;&raquo;</strong> !
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-slate-400 mb-2">
                Tu testes depuis un seul PC et tu as fermé l&apos;onglet Hôte ?
              </p>
              <a
                href={`/host/game/${gameId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-indigo-300 transition"
              >
                📺 Ouvrir l&apos;écran Hôte (TV) dans un nouvel onglet ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Register({
  onRegisterCompleted,
  gameId,
}: {
  onRegisterCompleted: (player: Participant) => void
  gameId: string
}) {
  const [nickname, setNickname] = useState('')
  const [sending, setSending] = useState(false)

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!nickname.trim()) return
    setSending(true)

    const clientSessionId = getClientSessionId()
    const { data: participant, error } = await supabase
      .from('quiz_participants')
      .upsert(
        {
          nickname: nickname.trim(),
          game_id: gameId,
          client_session_id: clientSessionId,
        },
        { onConflict: 'game_id,client_session_id' }
      )
      .select()
      .single()

    if (error) {
      setSending(false)
      return alert(error.message)
    }

    onRegisterCompleted(participant)
  }

  return (
    <form onSubmit={onFormSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-white">Choisis ton pseudo</h2>
        <p className="text-xs text-slate-400 mt-1">
          Il apparaîtra sur le classement de la TV
        </p>
      </div>
      <input
        className="p-4 w-full rounded-xl bg-slate-950 border border-slate-700 text-white text-lg font-bold text-center focus:outline-none focus:border-indigo-500"
        type="text"
        value={nickname}
        onChange={(val) => setNickname(val.currentTarget.value)}
        placeholder="Ton pseudo..."
        maxLength={20}
        autoFocus
      />
      <button
        disabled={sending || !nickname.trim()}
        className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-lg transition shadow-lg"
      >
        {sending ? 'Inscription...' : 'Rejoindre la partie →'}
      </button>
    </form>
  )
}
