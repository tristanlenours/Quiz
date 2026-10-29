import { DEFAULT_AVATAR_THEME, getThemeAvatars } from '@/avatars'
import type { AvatarCharacter } from '@/avatars'

export interface ThemeTrack {
  title: string
  url: string
}

/**
 * Habillage d'un univers (D29) : textes, musiques du Salon / Podium et fond d'écran,
 * sélectionnés à partir de `quiz_sets.avatar_theme`.
 */
export interface UniverseTheme {
  id: string
  universe: string
  avatars: AvatarCharacter[]
  pageBg: string
  hostLobbyBadge: string
  hostLobbyIntro: string
  hostLobbyEmpty: string
  hostLobbyQuote: string
  playerRegisterBadge: string
  playerRegisterMissing: string
  playerLobbyBadge: string
  lobbyPlaylist: ThemeTrack[]
  podiumTrack: ThemeTrack
  quizModeLabel: string
  debriefBadge: string
  deterministicChronicleLabel: string
}

const LOVE_ACTUALLY_THEME: UniverseTheme = {
  id: 'love_actually',
  universe: 'Love Actually',
  avatars: getThemeAvatars('love_actually'),
  pageBg: 'from-rose-950 via-slate-900 to-indigo-950',
  hostLobbyBadge: '📺 ÉCRAN HÔTE (TV) • CASTING LOVE ACTUALLY',
  hostLobbyIntro: 'choisissez votre personnage de Love Actually',
  hostLobbyEmpty:
    '🎄 En attente des premiers acteurs... Scannez le QR code avec votre téléphone pour choisir votre avatar Love Actually !',
  hostLobbyQuote:
    '« Let’s go get the shit kicked out of us by love. » — Daniel ❤️',
  playerRegisterBadge: '❤️ Thème Love Actually',
  playerRegisterMissing: 'Choisis ton personnage de Love Actually !',
  playerLobbyBadge: '🎄 En scène pour Love Actually',
  lobbyPlaylist: [
    {
      title: 'Glasgow Love Theme — Craig Armstrong',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4a/47/ca/4a47ca71-5932-8a7e-fe49-b22ee9b973cd/mzaf_15384950070654149640.plus.aac.p.m4a',
    },
    {
      title: 'Here With Me — Dido',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/ba/9e/ffba9e3f-266a-4360-3f6c-54992863d4c1/mzaf_16126666409101033333.plus.aac.p.m4a',
    },
    {
      title: 'Wherever You Will Go — The Calling',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/54/a8/ba/54a8bae5-9413-ea4a-563b-2cd122d53601/mzaf_2561284396060967938.plus.aac.p.m4a',
    },
    {
      title: 'White Christmas — Otis Redding',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4a/67/15/4a671528-6b4d-4932-f7ab-7212db98f0a4/mzaf_10429321169689904795.plus.aac.p.m4a',
    },
  ],
  podiumTrack: {
    title: 'God Only Knows',
    url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3b/17/e6/3b17e6c0-5a2a-2226-7c3f-6d0f57be6de9/mzaf_2188717033219073832.plus.aac.p.m4a',
  },
  quizModeLabel: '🎬 Mode Quiz Love Actually',
  debriefBadge: '🎬 Le Débrief du Réalisateur & Trophées',
  deterministicChronicleLabel: '🎄 Chronique Studio Love Actually',
}

const HARRY_POTTER_THEME: UniverseTheme = {
  id: 'harry_potter',
  universe: 'Harry Potter',
  avatars: getThemeAvatars('harry_potter'),
  pageBg: 'from-red-950 via-slate-950 to-emerald-950',
  hostLobbyBadge: '📺 ÉCRAN HÔTE (TV) • CÉRÉMONIE DE LA RÉPARTITION',
  hostLobbyIntro: 'enfilez le Choixpeau en choisissant votre sorcier',
  hostLobbyEmpty:
    '🦉 Les hiboux sont partis... Scannez le QR code avec votre téléphone pour choisir votre sorcier de Poudlard !',
  hostLobbyQuote:
    '« Il est important de faire preuve de courage face à ses ennemis, mais il en faut encore davantage face à ses amis. » — Albus Dumbledore ⚡',
  playerRegisterBadge: '⚡ Thème Harry Potter',
  playerRegisterMissing: 'Le Choixpeau attend : choisis ton sorcier !',
  playerLobbyBadge: '🎩 Réparti(e) à Poudlard',
  lobbyPlaylist: [
    {
      title: 'Hedwig’s Theme — John Williams',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/81/ee/ae/81eeae0a-da63-1fc7-42c1-21b498b85de8/mzaf_13621452881875123588.plus.aac.p.m4a',
    },
    {
      title: 'A Window to the Past — John Williams',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/79/79/a4/7979a47f-7ddb-9a70-14cc-f2f84631bed8/mzaf_16625283996673746061.plus.aac.p.m4a',
    },
    {
      title: 'Fawkes the Phoenix — John Williams',
      url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/96/77/eb/9677eb3c-b39d-098f-3684-f2d4fe996525/mzaf_5436813068284889731.plus.aac.p.m4a',
    },
  ],
  podiumTrack: {
    title: 'Harry’s Wondrous World',
    url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d8/73/68/d87368ab-4655-f990-58a8-f9b08c2d8e55/mzaf_10937637444601262414.plus.aac.p.m4a',
  },
  quizModeLabel: '⚡ Mode Quiz Harry Potter',
  debriefBadge: '🏰 Banquet de fin d’année & Coupe des Quatre Maisons',
  deterministicChronicleLabel: '🦉 Discours rédigé à la plume par Dumbledore',
}

const THEMES: Record<string, UniverseTheme> = {
  love_actually: LOVE_ACTUALLY_THEME,
  harry_potter: HARRY_POTTER_THEME,
}

export function getUniverseTheme(themeId?: string | null): UniverseTheme {
  return THEMES[themeId ?? ''] ?? THEMES[DEFAULT_AVATAR_THEME]
}
