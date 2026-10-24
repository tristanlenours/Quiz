import { Participant, supabase } from '@/types/types'
import { useQRCode } from 'next-qrcode'
import { useEffect, useState } from 'react'

export default function Lobby({
  participants,
  gameId,
  pinCode,
  quizName,
}: {
  participants: Participant[]
  gameId: string
  pinCode?: string
  quizName?: string
}) {
  const { Canvas } = useQRCode()
  const [joinUrl, setJoinUrl] = useState('')

  useEffect(() => {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    setJoinUrl(`${origin}/game/${gameId}`)
  }, [gameId])

  const onClickStartGame = async () => {
    const { error } = await supabase
      .from('quiz_games')
      .update({ phase: 'quiz' })
      .eq('id', gameId)
    if (error) {
      return alert(error.message)
    }
  }

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-8">
      <div className="text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-2">
          📺 ÉCRAN HÔTE (TV) • SALON D&apos;ATTENTE
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          {quizName || 'Prêts à jouer ?'}
        </h1>
      </div>

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-8 bg-slate-900/90 border border-white/15 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col justify-between h-full space-y-6">
          {pinCode && (
            <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-5 text-center">
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                Code PIN de la partie
              </div>
              <div className="text-5xl font-mono font-black tracking-widest text-indigo-400">
                {pinCode}
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Joueurs connectés
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm">
                {participants.length} joueur{participants.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[120px] p-4 rounded-2xl bg-slate-950/60 border border-white/10 content-start">
              {participants.length === 0 ? (
                <div className="text-slate-500 text-sm m-auto text-center">
                  En attente des joueurs... Scannez le QR code avec votre
                  téléphone ou ouvrez une manette de test !
                </div>
              ) : (
                participants.map((participant) => (
                  <div
                    className="text-lg font-bold px-4 py-2 rounded-xl bg-emerald-600 text-white shadow"
                    key={participant.id}
                  >
                    🎮 {participant.nickname}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 py-4 px-8 rounded-2xl font-black text-xl text-white shadow-lg shadow-indigo-600/40 transition"
              onClick={onClickStartGame}
              disabled={participants.length === 0}
            >
              🚀 Démarrer la partie ({participants.length})
            </button>

            {joinUrl && (
              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition"
              >
                📱 Ouvrir une Manette Joueur dans un nouvel onglet ↗
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl text-slate-900">
          {joinUrl && (
            <Canvas
              text={joinUrl}
              options={{
                errorCorrectionLevel: 'M',
                margin: 2,
                scale: 4,
                width: 320,
              }}
            />
          )}
          <div className="mt-3 text-xs font-mono text-slate-600 break-all text-center">
            {joinUrl}
          </div>
        </div>
      </div>

      <div className="text-center text-slate-400 text-sm">
        Gardez cet onglet Hôte ouvert pour piloter la partie et diffuser la
        musique du 🎵 Blind Test !
      </div>
    </div>
  )
}
