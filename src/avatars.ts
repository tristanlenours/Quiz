export interface AvatarCharacter {
  id: string
  name: string
  actor: string
  tagline: string
  emoji: string
  accent: string
  imageUrl: string
}

const STORAGE_BASE =
  'https://ljtbtwaknnbdzbktxvfl.supabase.co/storage/v1/object/public/quiz-media/avatars/love-actually'

export const LOVE_ACTUALLY_AVATARS: AvatarCharacter[] = [
  {
    id: 'david',
    name: 'Le Premier Ministre',
    actor: 'Hugh Grant',
    tagline: 'Danseur étoile du 10 Downing Street',
    emoji: '🕺',
    accent: 'from-blue-500 to-indigo-700 border-blue-400',
    imageUrl: `${STORAGE_BASE}/david.png`,
  },
  {
    id: 'natalie',
    name: 'Natalie',
    actor: 'Martine McCutcheon',
    tagline: '« Oh, et puis merde ! » (Quartier de Wandsworth)',
    emoji: '☕',
    accent: 'from-pink-500 to-rose-700 border-pink-400',
    imageUrl: `${STORAGE_BASE}/natalie.png`,
  },
  {
    id: 'billy_mack',
    name: 'Billy Mack',
    actor: 'Bill Nighy',
    tagline: 'Rockstar déjantée — Christmas Is All Around',
    emoji: '🎸',
    accent: 'from-amber-500 to-red-700 border-amber-400',
    imageUrl: `${STORAGE_BASE}/billy_mack.png`,
  },
  {
    id: 'mark',
    name: 'Mark',
    actor: 'Andrew Lincoln',
    tagline: '« To me, you are perfect » (Pancartes silencieuses)',
    emoji: '🪧',
    accent: 'from-emerald-500 to-teal-700 border-emerald-400',
    imageUrl: `${STORAGE_BASE}/mark.png`,
  },
  {
    id: 'juliet',
    name: 'Juliet',
    actor: 'Keira Knightley',
    tagline: 'La mariée au chapeau gavroche & Banoffee Pie',
    emoji: '🥧',
    accent: 'from-purple-500 to-fuchsia-700 border-purple-400',
    imageUrl: `${STORAGE_BASE}/juliet.png?v=2`,
  },
  {
    id: 'jamie',
    name: 'Jamie',
    actor: 'Colin Firth',
    tagline: 'Écrivain amoureux en portugais approximatif',
    emoji: 'TYPE',
    accent: 'from-amber-600 to-yellow-800 border-amber-400',
    imageUrl: `${STORAGE_BASE}/jamie.png`,
  },
  {
    id: 'aurelia',
    name: 'Aurélia',
    actor: 'Lúcia Moniz',
    tagline: 'Plongeuse d’élite pour sauver un manuscrit',
    emoji: '🇵🇹',
    accent: 'from-cyan-500 to-blue-700 border-cyan-400',
    imageUrl: `${STORAGE_BASE}/aurelia.png`,
  },
  {
    id: 'karen',
    name: 'Karen',
    actor: 'Emma Thompson',
    tagline: 'Fan absolue de Joni Mitchell & costume de homard',
    emoji: '💿',
    accent: 'from-red-500 to-rose-800 border-red-400',
    imageUrl: `${STORAGE_BASE}/karen.png`,
  },
  {
    id: 'harry',
    name: 'Harry',
    actor: 'Alan Rickman',
    tagline: 'Pressé à la bijouterie... très pressé !',
    emoji: '📿',
    accent: 'from-slate-500 to-zinc-800 border-slate-400',
    imageUrl: `${STORAGE_BASE}/harry.png`,
  },
  {
    id: 'sam',
    name: 'Sam',
    actor: 'Thomas Brodie-Sangster',
    tagline: 'Batteur par amour & sprinteur d’aéroport',
    emoji: '🥁',
    accent: 'from-sky-500 to-indigo-700 border-sky-400',
    imageUrl: `${STORAGE_BASE}/sam.png?v=2`,
  },
  {
    id: 'joanna',
    name: 'Joanna',
    actor: 'Olivia Olson',
    tagline: 'La diva d’All I Want for Christmas Is You',
    emoji: '🎤',
    accent: 'from-fuchsia-500 to-purple-800 border-fuchsia-400',
    imageUrl: `${STORAGE_BASE}/joanna.png`,
  },
  {
    id: 'rufus',
    name: 'Rufus (Mr Bean)',
    actor: 'Rowan Atkinson',
    tagline: 'Maître suprême du paquet cadeau (avec cannelle)',
    emoji: '🎁',
    accent: 'from-yellow-500 to-amber-700 border-yellow-400',
    imageUrl: `${STORAGE_BASE}/rufus.png`,
  },
  {
    id: 'colin',
    name: 'Colin Frissell',
    actor: 'Kris Marshall',
    tagline: 'Dieu du sexe en partance pour le Wisconsin',
    emoji: '🇺🇸',
    accent: 'from-orange-500 to-red-700 border-orange-400',
    imageUrl: `${STORAGE_BASE}/colin.png?v=2`,
  },
  {
    id: 'mia',
    name: 'Mia',
    actor: 'Heike Makatsch',
    tagline: 'Cornes de diable rouges à la soirée de Noël',
    emoji: '😈',
    accent: 'from-rose-600 to-red-900 border-rose-400',
    imageUrl: `${STORAGE_BASE}/mia.png`,
  },
  {
    id: 'john',
    name: 'John',
    actor: 'Martin Freeman',
    tagline: 'Doublure lumière très polie dans les embouteillages',
    emoji: '🎬',
    accent: 'from-teal-500 to-emerald-800 border-teal-400',
    imageUrl: `${STORAGE_BASE}/john.png`,
  },
]

// Fix Jamie's emoji cleanly
LOVE_ACTUALLY_AVATARS[5].emoji = '🖋️'

export const AVATAR_THEMES: Record<
  string,
  { id: string; label: string; avatars: AvatarCharacter[] }
> = {
  love_actually: {
    id: 'love_actually',
    label: '❤️ Love Actually (15 personnages)',
    avatars: LOVE_ACTUALLY_AVATARS,
  },
}

const AVATAR_BY_ID = new Map<string, AvatarCharacter>(
  LOVE_ACTUALLY_AVATARS.map((a) => [a.id, a])
)

export function getAvatarById(avatarId?: string | null): AvatarCharacter | null {
  if (!avatarId) return null
  return AVATAR_BY_ID.get(avatarId) ?? null
}

const PREFIX_REGEX = /^\[#([a-z0-9_]+)\]\s*(.*)$/i

/**
 * Encode l'avatar dans le pseudo sous la forme `[#avatarId]Prénom`
 * afin que l'avatar fonctionne immédiatement même si la migration SQL
 * (`quiz_participants.avatar_id` / `quiz_game_results.avatar_id`) n'a pas encore été jouée.
 */
export function encodeNicknameWithAvatar(
  customNickname: string,
  avatarId?: string | null
): string {
  const cleanInput = customNickname.replace(PREFIX_REGEX, '$2').trim()
  const avatar = getAvatarById(avatarId)
  const finalName = cleanInput || avatar?.name || 'Joueur'
  if (!avatar) return finalName
  return `[#${avatar.id}]${finalName}`
}

export interface ParticipantIdentity {
  displayName: string
  characterName: string | null
  hasCustomName: boolean
  avatarId: string | null
  avatar: AvatarCharacter | null
}

/**
 * Extrait l'identité propre d'un participant ou d'une ligne de `quiz_game_results`,
 * que l'avatar provienne de la colonne SQL `avatar_id` ou du préfixe `[#avatarId]` dans `nickname`.
 */
export function getParticipantIdentity(
  row?: { nickname?: string | null; avatar_id?: string | null } | null
): ParticipantIdentity {
  if (!row) {
    return {
      displayName: 'Joueur',
      characterName: null,
      hasCustomName: false,
      avatarId: null,
      avatar: null,
    }
  }

  const rawNickname = row.nickname ?? ''
  const match = rawNickname.match(PREFIX_REGEX)
  const parsedAvatarId = row.avatar_id || (match ? match[1].toLowerCase() : null)
  const cleanName = (match ? match[2] : rawNickname).trim()
  const avatar = getAvatarById(parsedAvatarId)

  const displayName = cleanName || avatar?.name || 'Joueur'
  const characterName = avatar?.name ?? null
  const hasCustomName = Boolean(
    characterName && displayName.toLowerCase() !== characterName.toLowerCase()
  )

  return {
    displayName,
    characterName,
    hasCustomName,
    avatarId: avatar?.id ?? null,
    avatar,
  }
}

export function preloadAvatarImages(): void {
  if (typeof window === 'undefined') return
  for (const avatar of LOVE_ACTUALLY_AVATARS) {
    const img = new window.Image()
    img.src = avatar.imageUrl
  }
}
