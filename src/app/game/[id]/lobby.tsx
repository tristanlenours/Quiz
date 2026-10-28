import {
  encodeNicknameWithAvatar,
  getAvatarById,
  getParticipantIdentity,
} from '@/avatars'
import { UniverseTheme, getUniverseTheme } from '@/themes'
import { getClientSessionId, Participant, supabase } from '@/types/types'
import { FormEvent, useCallback, useEffect, useState } from 'react'

export default function Lobby({
  gameId,
  onRegisterCompleted,
  themeId,
}: {
  gameId: string
  onRegisterCompleted: (participant: Participant) => void
  themeId?: string | null
}) {
  const theme = getUniverseTheme(themeId)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [allParticipants, setAllParticipants] = useState<Participant[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const fetchLobbyParticipants = useCallback(async () => {
    const clientSessionId = getClientSessionId()
    const { data, error } = await supabase
      .from('quiz_participants')
      .select()
      .eq('game_id', gameId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error(error.message)
      return
    }

    const list = data ?? []
    setAllParticipants(list)

    const mine = list.find((p) => p.client_session_id === clientSessionId)
    if (mine && !participant) {
      setParticipant(mine)
      onRegisterCompleted(mine)
    } else if (mine && participant && mine.nickname !== participant.nickname) {
      setParticipant(mine)
      onRegisterCompleted(mine)
    }
  }, [gameId, onRegisterCompleted, participant])

  useEffect(() => {
    fetchLobbyParticipants()

    const channel = supabase
      .channel(`lobby_participants_${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_participants',
          filter: `game_id=eq.${gameId}`,
        },
        () => {
          fetchLobbyParticipants()
        }
      )
      .subscribe()

    const pollInterval = setInterval(fetchLobbyParticipants, 1500)

    return () => {
      clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [gameId, fetchLobbyParticipants])

  const identity = getParticipantIdentity(participant)

  return (
    <div
      className={`bg-gradient-to-br ${theme.pageBg} flex justify-center items-start min-h-screen p-4 md:p-6`}
    >
      <div className="bg-slate-900/95 border border-white/15 p-5 md:p-7 rounded-3xl max-w-2xl w-full shadow-2xl my-auto">
        {(!participant || isEditing) && (
          <Register
            theme={theme}
            gameId={gameId}
            existingParticipant={participant}
            allParticipants={allParticipants}
            onCancelEdit={participant ? () => setIsEditing(false) : undefined}
            onRegisterCompleted={(registered) => {
              setParticipant(registered)
              setIsEditing(false)
              onRegisterCompleted(registered)
              fetchLobbyParticipants()
            }}
          />
        )}

        {participant && !isEditing && (
          <div className="text-white text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
              {theme.playerLobbyBadge}
            </div>

            {/* Carte Héros du Joueur */}
            <div className="bg-gradient-to-br from-slate-800/90 via-slate-900 to-rose-950/60 border-2 border-rose-400/40 rounded-3xl p-6 shadow-xl flex flex-col items-center space-y-3">
              {identity.avatar ? (
                <div className="relative">
                  <img
                    src={identity.avatar.imageUrl}
                    alt={identity.avatar.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-rose-400 shadow-2xl"
                  />
                  <span className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-slate-900 border-2 border-rose-400 flex items-center justify-center text-lg shadow">
                    {identity.avatar.emoji}
                  </span>
                </div>
              ) : (
                <div className="text-5xl animate-bounce">🎮</div>
              )}

              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {identity.displayName}
                </h1>
                {identity.characterName && (
                  <div className="text-sm font-bold text-rose-300 mt-0.5">
                    alias {identity.characterName}{' '}
                    <span className="text-slate-400 font-normal">
                      ({identity.avatar?.actor})
                    </span>
                  </div>
                )}
              </div>

              {identity.avatar?.tagline && (
                <p className="text-xs italic text-slate-300 bg-slate-950/60 px-4 py-2 rounded-xl border border-white/10 max-w-md">
                  « {identity.avatar.tagline} »
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
              >
                ✏️ Changer de personnage ou de prénom
              </button>
            </div>

            {/* Galerie Live des joueurs présents dans le salon */}
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  🎬 Casting dans le salon
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  {allParticipants.length} joueur
                  {allParticipants.length > 1 ? 's' : ''} prêt
                  {allParticipants.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {allParticipants.map((p) => {
                  const pId = getParticipantIdentity(p)
                  const isMe = p.id === participant.id
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border ${
                        isMe
                          ? 'bg-rose-500/20 border-rose-400/50'
                          : 'bg-slate-900/90 border-white/10'
                      }`}
                    >
                      {pId.avatar ? (
                        <img
                          src={pId.avatar.imageUrl}
                          alt={pId.avatar.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-rose-400/60 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
                          🎮
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-white truncate">
                          {pId.displayName} {isMe && ' (Toi)'}
                        </div>
                        {pId.characterName && (
                          <div className="text-[10px] text-rose-300 truncate">
                            {pId.characterName}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <p className="text-slate-300 text-xs">
              Prépare-toi ! La séance démarre dès que l&apos;Hôte lance la
              partie sur l&apos;écran principal 🍿
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Register({
  theme,
  onRegisterCompleted,
  onCancelEdit,
  gameId,
  existingParticipant,
  allParticipants,
}: {
  theme: UniverseTheme
  onRegisterCompleted: (player: Participant) => void
  onCancelEdit?: () => void
  gameId: string
  existingParticipant: Participant | null
  allParticipants: Participant[]
}) {
  const existingIdentity = getParticipantIdentity(existingParticipant)
  const [nickname, setNickname] = useState(
    existingParticipant && existingIdentity.hasCustomName
      ? existingIdentity.displayName
      : ''
  )
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(
    existingIdentity.avatarId
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const mySessionId = getClientSessionId()

  // Map avatarId -> owner displayName (excluding current player)
  const takenAvatars = new Map<string, string>()
  for (const p of allParticipants) {
    if (p.client_session_id === mySessionId) continue
    const idInfo = getParticipantIdentity(p)
    if (idInfo.avatarId) {
      takenAvatars.set(idInfo.avatarId, idInfo.displayName)
    }
  }

  // Auto-select first free avatar if none selected or if selected was just taken
  useEffect(() => {
    const isInTheme = theme.avatars.some((a) => a.id === selectedAvatarId)
    if (selectedAvatarId && isInTheme && !takenAvatars.has(selectedAvatarId)) return
    const firstAvailable = theme.avatars.find(
      (a) => !takenAvatars.has(a.id)
    )
    if (firstAvailable) {
      setSelectedAvatarId(firstAvailable.id)
    }
  }, [allParticipants, selectedAvatarId, theme]) // eslint-disable-line react-hooks/exhaustive-deps

  // Un avatar d'un autre univers (thème pas encore chargé) n'est jamais conservé
  const selectedAvatar = theme.avatars.some((a) => a.id === selectedAvatarId)
    ? getAvatarById(selectedAvatarId)
    : null

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!selectedAvatarId || !selectedAvatar) {
      setErrorMsg(theme.playerRegisterMissing)
      return
    }

    // Re-check latest participants in DB to prevent race condition on same avatar
    setSending(true)
    const { data: latestParticipants } = await supabase
      .from('quiz_participants')
      .select()
      .eq('game_id', gameId)

    const conflictOwner = (latestParticipants ?? []).find((p) => {
      if (p.client_session_id === mySessionId) return false
      const info = getParticipantIdentity(p)
      return info.avatarId === selectedAvatarId
    })

    if (conflictOwner) {
      const ownerInfo = getParticipantIdentity(conflictOwner)
      setSending(false)
      setErrorMsg(
        `Oups ! ${selectedAvatar?.name} vient tout juste d'être pris par ${ownerInfo.displayName}. Choisis un autre personnage !`
      )
      return
    }

    const encodedNickname = encodeNicknameWithAvatar(nickname, selectedAvatarId)

    // Try upserting with `avatar_id` column first; fallback cleanly if SQL migration hasn't been run yet
    let result = await supabase
      .from('quiz_participants')
      .upsert(
        {
          nickname: encodedNickname,
          avatar_id: selectedAvatarId,
          game_id: gameId,
          client_session_id: mySessionId,
        },
        { onConflict: 'game_id,client_session_id' }
      )
      .select()
      .single()

    if (result.error && result.error.message.includes('avatar_id')) {
      result = await supabase
        .from('quiz_participants')
        .upsert(
          {
            nickname: encodedNickname,
            game_id: gameId,
            client_session_id: mySessionId,
          },
          { onConflict: 'game_id,client_session_id' }
        )
        .select()
        .single()
    }

    if (result.error) {
      setSending(false)
      setErrorMsg(result.error.message)
      return
    }

    if (result.data) {
      onRegisterCompleted(result.data)
    }
  }

  return (
    <form onSubmit={onFormSubmit} className="space-y-4">
      <div className="text-center">
        <div className="inline-block px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-[11px] font-bold uppercase tracking-widest mb-1">
          {theme.playerRegisterBadge}
        </div>
        <h2 className="text-2xl font-black text-white">
          Incarne ton personnage !
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Chaque personnage est unique : une fois choisi, personne d&apos;autre
          ne peut le prendre !
        </p>
      </div>

      {/* Aperçu du personnage sélectionné */}
      {selectedAvatar && (
        <div className="flex items-center gap-3.5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-400/40 p-3.5 rounded-2xl shadow-lg">
          <img
            src={selectedAvatar.imageUrl}
            alt={selectedAvatar.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-rose-400 flex-shrink-0 shadow-md"
          />
          <div className="min-w-0 flex-1 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
              {selectedAvatar.emoji} Ton rôle sélectionné
            </div>
            <div className="text-base font-black text-white truncate">
              {selectedAvatar.name}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({selectedAvatar.actor})
              </span>
            </div>
            <div className="text-xs text-slate-300 italic line-clamp-1">
              {selectedAvatar.tagline}
            </div>
          </div>
        </div>
      )}

      {/* Grille des avatars de l'univers du pack */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-[340px] overflow-y-auto p-1">
        {theme.avatars.map((avatar) => {
          const takenBy = takenAvatars.get(avatar.id)
          const isSelected = selectedAvatarId === avatar.id
          return (
            <button
              key={avatar.id}
              type="button"
              disabled={Boolean(takenBy)}
              onClick={() => {
                setSelectedAvatarId(avatar.id)
                setErrorMsg(null)
              }}
              className={`relative flex flex-col items-center p-2 rounded-2xl border text-center transition ${
                takenBy
                  ? 'opacity-40 bg-slate-950 border-slate-800 cursor-not-allowed grayscale'
                  : isSelected
                  ? 'bg-gradient-to-b from-rose-600/40 to-indigo-900/60 border-2 border-rose-400 scale-[1.03] shadow-lg shadow-rose-500/20'
                  : 'bg-slate-950/80 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="relative">
                <img
                  src={avatar.imageUrl}
                  alt={avatar.name}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 ${
                    isSelected ? 'border-rose-300' : 'border-slate-700'
                  }`}
                />
                <span className="absolute -bottom-1 -right-1 text-xs bg-slate-900 rounded-full w-5 h-5 flex items-center justify-center border border-white/20">
                  {takenBy ? '🔒' : isSelected ? '✅' : avatar.emoji}
                </span>
              </div>
              <div className="mt-1.5 text-[11px] font-black text-white leading-tight line-clamp-2">
                {avatar.name}
              </div>
              {takenBy ? (
                <div className="mt-0.5 text-[9px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded-full truncate max-w-full">
                  Pris par {takenBy}
                </div>
              ) : (
                <div className="mt-0.5 text-[9px] text-slate-400 truncate max-w-full">
                  {avatar.actor}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Champ Prénom / Surnom */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5 text-center">
          Ton prénom ou surnom{' '}
          <span className="text-slate-400 font-normal">
            (ou laisse vide pour utiliser « {selectedAvatar?.name} »)
          </span>
        </label>
        <input
          className="p-3.5 w-full rounded-xl bg-slate-950 border border-slate-700 text-white text-base font-bold text-center focus:outline-none focus:border-rose-400"
          type="text"
          value={nickname}
          onChange={(val) => setNickname(val.currentTarget.value)}
          placeholder={`Ex: Titou (${selectedAvatar?.name || 'Ton rôle'})`}
          maxLength={18}
        />
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-bold text-center">
          {errorMsg}
        </div>
      )}

      <div className="flex gap-2">
        {onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-1/3 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={sending || !selectedAvatar}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black text-base transition shadow-lg"
        >
          {sending
            ? 'Entrée en scène...'
            : `🎬 Rejoindre en tant que ${
                nickname.trim()
                  ? `${nickname.trim()} (${selectedAvatar?.name})`
                  : selectedAvatar?.name || 'Joueur'
              }`}
        </button>
      </div>
    </form>
  )
}
