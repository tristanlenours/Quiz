export interface AvatarCharacter {
  id: string
  name: string
  actor: string
  tagline: string
  emoji: string
  accent: string
  imageUrl: string
  /** Maison de Poudlard (thème Harry Potter uniquement, utilisée pour la Coupe des Quatre Maisons) */
  house?: HouseId
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
    tagline: 'Rockstar déjantée en quête du numéro 1 de Noël',
    emoji: '🎸',
    accent: 'from-amber-500 to-red-700 border-amber-400',
    imageUrl: `${STORAGE_BASE}/billy_mack.png`,
  },
  {
    id: 'mark',
    name: 'Mark',
    actor: 'Andrew Lincoln',
    tagline: 'Témoin de mariage, caméscope toujours à la main',
    emoji: '🪧',
    accent: 'from-emerald-500 to-teal-700 border-emerald-400',
    imageUrl: `${STORAGE_BASE}/mark.png`,
  },
  {
    id: 'juliet',
    name: 'Juliet',
    actor: 'Keira Knightley',
    tagline: 'La mariée au chapeau gavroche & aux multiples dents',
    emoji: '😁',
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
    tagline: 'Mère de famille modèle & costume de homard',
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
    tagline: 'Amoureux transi de 11 ans, prêt à tout pour Joanna',
    emoji: '🥁',
    accent: 'from-sky-500 to-indigo-700 border-sky-400',
    imageUrl: `${STORAGE_BASE}/sam.png?v=2`,
  },
  {
    id: 'joanna',
    name: 'Joanna',
    actor: 'Olivia Olson',
    tagline: 'La diva du spectacle de Noël de l’école',
    emoji: '🎤',
    accent: 'from-fuchsia-500 to-purple-800 border-fuchsia-400',
    imageUrl: `${STORAGE_BASE}/joanna.png`,
  },
  {
    id: 'rufus',
    name: 'Rufus (Mr Bean)',
    actor: 'Rowan Atkinson',
    tagline: 'Maître suprême du paquet cadeau',
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

export type HouseId = 'gryffondor' | 'serpentard' | 'serdaigle' | 'poufsouffle' | 'aucune'

export const HOGWARTS_HOUSES: Record<
  HouseId,
  { label: string; crest: string; from: string; to: string }
> = {
  gryffondor: { label: 'Gryffondor', crest: '🦁', from: '#740001', to: '#d3a625' },
  serpentard: { label: 'Serpentard', crest: '🐍', from: '#0b3d1a', to: '#8d9a92' },
  serdaigle: { label: 'Serdaigle', crest: '🦅', from: '#0e1a40', to: '#946b2d' },
  poufsouffle: { label: 'Poufsouffle', crest: '🦡', from: '#3b2f1e', to: '#ecb939' },
  aucune: { label: 'Elfe libre', crest: '✨', from: '#3f3f46', to: '#a3e635' },
}

// Photos des personnages tirées des films (D34), recadrées en carré sur le visage
const HP_STORAGE_BASE =
  'https://ljtbtwaknnbdzbktxvfl.supabase.co/storage/v1/object/public/quiz-media/avatars/harry-potter'

function wizard(
  id: string,
  name: string,
  actor: string,
  tagline: string,
  house: HouseId
): AvatarCharacter {
  return {
    id,
    name,
    actor,
    tagline,
    emoji: HOGWARTS_HOUSES[house].crest,
    accent: house,
    imageUrl: `${HP_STORAGE_BASE}/${id}.jpg`,
    house,
  }
}

// Identifiants préfixés `hp_` : pas de collision avec Love Actually (ex. `harry`)
export const HARRY_POTTER_AVATARS: AvatarCharacter[] = [
  wizard('hp_harry', 'Harry Potter', 'Daniel Radcliffe', 'Le petit à lunettes. Il a un truc au front, un éclair ou une griffure', 'gryffondor'),
  wizard('hp_hermione', 'Hermione Granger', 'Emma Watson', 'Celle qui sait tout. Elle lève la main, ça c’est sûr', 'gryffondor'),
  wizard('hp_ron', 'Ron Weasley', 'Rupert Grint', 'Le copain. Il est dans tous les films, je crois, il mange', 'gryffondor'),
  wizard('hp_neville', 'Neville Londubat', 'Matthew Lewis', 'Au début il est nul, à la fin il est bien. Ou l’inverse', 'gryffondor'),
  wizard('hp_twins', 'Fred & George', 'James & Oliver Phelps', 'Deux frères, ou le même en deux fois. Ils font des blagues', 'gryffondor'),
  wizard('hp_hagrid', 'Rubeus Hagrid', 'Robbie Coltrane', 'Le grand barbu. Il est gentil, mais il a l’air sale', 'gryffondor'),
  wizard('hp_dumbledore', 'Albus Dumbledore', 'Michael Gambon', 'Le directeur. Il est vieux, à un moment il part, je crois', 'gryffondor'),
  wizard('hp_mcgonagall', 'Minerva McGonagall', 'Maggie Smith', 'La prof sévère avec le chapeau. Il paraît qu’elle est sympa', 'gryffondor'),
  wizard('hp_draco', 'Drago Malefoy', 'Tom Felton', 'Le blond pas sympa. Son père a un souci avec quelqu’un', 'serpentard'),
  wizard('hp_snape', 'Severus Rogue', 'Alan Rickman', 'Le prof qui fait la tête. À la fin on apprend un truc, j’ai pas suivi', 'serpentard'),
  wizard('hp_bellatrix', 'Bellatrix Lestrange', 'Helena Bonham Carter', 'La dame aux cheveux. Elle crie beaucoup, elle a l’air fatiguée', 'serpentard'),
  wizard('hp_voldemort', 'Lord Voldemort', 'Ralph Fiennes', 'Le méchant sans nez. C’est très bien expliqué dans le 2, ou le 4', 'serpentard'),
  wizard('hp_luna', 'Luna Lovegood', 'Evanna Lynch', 'La blonde un peu à côté. On l’aime bien, sans trop savoir pourquoi', 'serdaigle'),
  wizard('hp_cedric', 'Cedric Diggory', 'Robert Pattinson', 'Le beau gosse. C’est pas lui dans Twilight ?', 'poufsouffle'),
  wizard('hp_dobby', 'Dobby', 'Toby Jones', 'Le petit truc avec les oreilles. Il y a une histoire de chaussette', 'aucune'),
]

export const DEFAULT_AVATAR_THEME = 'love_actually'

export const AVATAR_THEMES: Record<
  string,
  { id: string; label: string; avatars: AvatarCharacter[] }
> = {
  love_actually: {
    id: 'love_actually',
    label: '❤️ Love Actually (15 personnages)',
    avatars: LOVE_ACTUALLY_AVATARS,
  },
  harry_potter: {
    id: 'harry_potter',
    label: '⚡ Harry Potter (15 sorciers)',
    avatars: HARRY_POTTER_AVATARS,
  },
}

/**
 * Thème d'un pack : colonne `quiz_sets.avatar_theme` si la migration D21 est jouée,
 * sinon déduit du nom du pack (même logique de repli que le préfixe `[#avatarId]`).
 */
export function resolveAvatarTheme(
  set?: { avatar_theme?: string | null; name?: string | null } | null
): string {
  if (set?.avatar_theme && AVATAR_THEMES[set.avatar_theme]) return set.avatar_theme
  if (/harry\s*potter|poudlard|hogwarts/i.test(set?.name ?? '')) return 'harry_potter'
  return DEFAULT_AVATAR_THEME
}

export function getThemeAvatars(themeId?: string | null): AvatarCharacter[] {
  return (AVATAR_THEMES[themeId ?? ''] ?? AVATAR_THEMES[DEFAULT_AVATAR_THEME]).avatars
}

const AVATAR_BY_ID = new Map<string, AvatarCharacter>(
  Object.values(AVATAR_THEMES).flatMap((t) => t.avatars.map((a) => [a.id, a] as const))
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

export function preloadAvatarImages(themeId?: string | null): void {
  if (typeof window === 'undefined') return
  for (const avatar of getThemeAvatars(themeId)) {
    const img = new window.Image()
    img.src = avatar.imageUrl
  }
}
