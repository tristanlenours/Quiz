import { getParticipantIdentity } from '@/avatars'
import { Participant, supabase } from '@/types/types'
import { useQRCode } from 'next-qrcode'
import { useEffect, useRef, useState } from 'react'

const LOBBY_PLAYLIST = [
  {
    title: 'All You Need Is Love (Scène du mariage)',
    url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/87/93/1d/87931d5c-beda-7647-7b7c-5d89a88ad755/mzaf_16168889973628785460.plus.aac.p.m4a',
  },
  {
    title: 'God Only Knows — The Beach Boys',
    url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3b/17/e6/3b17e6c0-5a2a-2226-7c3f-6d0f57be6de9/mzaf_2188717033219073832.plus.aac.p.m4a',
  },
  {
    title: 'White Christmas — Otis Redding',
    url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4a/67/15/4a671528-6b4d-4932-f7ab-7212db98f0a4/mzaf_10429321169689904795.plus.aac.p.m4a',
  },
]

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
  const [trackIndex, setTrackIndex] = useState(0)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    setJoinUrl(`${origin}/game/${gameId}`)
  }, [gameId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.45
    audio
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false))
  }, [trackIndex])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = 0.45
      audio
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {})
    } else {
      audio.pause()
      setIsMusicPlaying(false)
    }
  }

  const onClickStartGame = async () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const { error } = await supabase
      .from('quiz_games')
      .update({ phase: 'quiz' })
      .eq('id', gameId)
    if (error) {
      return alert(error.message)
    }
  }

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8">
      <audio
        ref={audioRef}
        src={LOBBY_PLAYLIST[trackIndex].url}
        onEnded={() => setTrackIndex((i) => (i + 1) % LOBBY_PLAYLIST.length)}
        preload="auto"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 max-w-6xl w-full mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
          📺 ÉCRAN HÔTE (TV) • CASTING LOVE ACTUALLY
        </div>

        <button
          type="button"
          onClick={toggleMusic}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition ${
            isMusicPlaying
              ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
              : 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/20'
          }`}
        >
          {isMusicPlaying
            ? `🔊 Ambiance BO : ${LOBBY_PLAYLIST[trackIndex].title} (Pause)`
            : '🎵 Activer la musique d’ambiance Love Actually'}
        </button>
      </div>

      <div className="text-center my-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          {quizName || 'Prêts à jouer ?'}
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          Scannez le QR code sur votre téléphone et choisissez votre personnage
          de <strong>Love Actually</strong> avant qu&apos;on vous le pique !
        </p>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch my-4 bg-slate-900/90 border border-white/15 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {pinCode && (
              <div className="bg-slate-950 border border-rose-500/40 rounded-2xl px-6 py-3 text-center">
                <div className="text-[10px] uppercase tracking-widest text-slate-400">
                  Code PIN de la partie
                </div>
                <div className="text-3xl md:text-4xl font-mono font-black tracking-widest text-rose-400">
                  {pinCode}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Personnages en scène
              </span>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm">
                {participants.length} / 15 joueurs
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-h-[210px] p-4 rounded-2xl bg-slate-950/60 border border-white/10 content-start max-h-[340px] overflow-y-auto">
            {participants.length === 0 ? (
              <div className="col-span-full text-slate-400 text-sm m-auto text-center py-12">
                🎄 En attente des premiers acteurs... Scannez le QR code avec
                votre téléphone pour choisir votre avatar Love Actually !
              </div>
            ) : (
              participants.map((participant) => {
                const idInfo = getParticipantIdentity(participant)
                return (
                  <div
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/60 border border-rose-400/40 text-white shadow-lg"
                    key={participant.id}
                  >
                    {idInfo.avatar ? (
                      <div className="relative flex-shrink-0">
                        <img
                          src={idInfo.avatar.imageUrl}
                          alt={idInfo.avatar.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-rose-400 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center border border-rose-400/50">
                          {idInfo.avatar.emoji}
                        </span>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl flex-shrink-0">
                        🎮
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-black text-white truncate">
                        {idInfo.displayName}
                      </div>
                      {idInfo.characterName && (
                        <div className="text-xs font-bold text-rose-300 truncate">
                          {idInfo.characterName}
                        </div>
                      )}
                      {idInfo.avatar?.actor && (
                        <div className="text-[10px] text-slate-400 truncate">
                          {idInfo.avatar.actor}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-40 py-4 px-8 rounded-2xl font-black text-xl text-white shadow-lg shadow-rose-600/30 transition"
              onClick={onClickStartGame}
              disabled={participants.length === 0}
            >
              🎬 Action ! Démarrer la partie ({participants.length})
            </button>

            {joinUrl && (
              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition"
              >
                📱 Ouvrir une Manette Test ↗
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl text-slate-900 shadow-xl">
          {joinUrl && (
            <Canvas
              text={joinUrl}
              options={{
                errorCorrectionLevel: 'M',
                margin: 2,
                scale: 4,
                width: 280,
              }}
            />
          )}
          <div className="mt-3 text-xs font-mono text-slate-600 break-all text-center">
            {joinUrl}
          </div>
        </div>
      </div>

      <div className="text-center text-slate-400 text-xs">
        « Whenever I get gloomy with the state of the world, I think about the
        arrivals gate at Heathrow Airport... » ❤️
      </div>
    </div>
  )
}
