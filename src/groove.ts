/**
 * Moteur pur du mini-jeu Party-Game TV « 🕺 Downing Street Groove » (D71).
 *
 * Principe (esprit Lapins Crétins / 1, 2, 3 Soleil) :
 * - Course de 100 m dans le couloir du 10 Downing Street jusqu'au bas de l'escalier (max 60 s).
 * - Les joueurs alternent GAUCHE (L) et DROITE (R) sur leur téléphone pour faire danser leur avatar.
 * - La musique baisse (`warning`), puis la secrétaire apparaît dans l'encadrement de la porte
 *   (`watching`) : tout joueur qui tape encore après 250 ms de grâce se fait prendre en flagrant
 *   délit, recul de 8 m + gel de honte pendant 2,5 s.
 * - Une fois sur deux, la musique repart alors qu'elle est toujours là à juger (`lingering`, D75) :
 *   repartir danser avant qu'elle ne s'en aille est sanctionné de la même façon, sans grâce.
 */

const CHARACTER_META: Record<string, { name: string; emoji: string }> = {
  david: { name: 'Le Premier Ministre', emoji: '🕺' },
  natalie: { name: 'Natalie', emoji: '☕' },
  billy_mack: { name: 'Billy Mack', emoji: '🎸' },
  mark: { name: 'Mark', emoji: '🪧' },
  juliet: { name: 'Juliet', emoji: '😁' },
  jamie: { name: 'Jamie', emoji: '📖' },
  aurelia: { name: 'Aurélia', emoji: '🇵🇹' },
  karen: { name: 'Karen', emoji: '💿' },
  harry: { name: 'Harry', emoji: '📿' },
  sam: { name: 'Sam', emoji: '🥁' },
  joanna: { name: 'Joanna', emoji: '🎤' },
  rufus: { name: 'Rufus', emoji: '🎁' },
  colin: { name: 'Colin', emoji: '🍕' },
  mia: { name: 'Mia', emoji: '😈' },
  john: { name: 'John', emoji: '🎬' },
}

function formatRacerIdentity(r: RacerState): {
  name: string
  emoji: string
  imageUrl?: string
} {
  const m = r.nickname.match(/^\[#([a-z0-9_]+)\](.*)$/i)
  const avatarId = r.avatarId || (m ? m[1].toLowerCase() : null)
  const custom = (m ? m[2] : r.nickname).trim()
  const meta = avatarId ? CHARACTER_META[avatarId] : undefined
  if (meta) {
    const label =
      custom && custom.toLowerCase() !== meta.name.toLowerCase()
        ? `${custom} (${meta.name})`
        : meta.name
    return {
      name: label,
      emoji: meta.emoji,
      imageUrl: `https://ljtbtwaknnbdzbktxvfl.supabase.co/storage/v1/object/public/quiz-media/avatars/love-actually/${avatarId}.png`,
    }
  }
  return { name: custom || 'Danseur', emoji: '🕺' }
}

/** Marqueur dans `quiz_games.current_question_sequence` identifiant une session Downing Street Groove */
export const GROOVE_SEQUENCE_MARKER = -1

export const FINISH_DISTANCE = 100
export const RACE_DURATION_SEC = 60
export const COUNTDOWN_DURATION_SEC = 3
export const FINAL_SPRINT_SEC = 5

export const WARNING_DURATION_MS = 1100
export const GRACE_PERIOD_MS = 250
export const STUN_DURATION_MS = 2500
export const PENALTY_METERS = 8
export const COMPOSURE_BONUS_METERS = 2

export type DoorState = 'dancing' | 'warning' | 'watching' | 'lingering'

/** Probabilité que la secrétaire s'attarde alors que la musique repart (D75) */
export const LINGER_CHANCE = 0.5
export const LINGER_MIN_MS = 900
export const LINGER_MAX_MS = 1700

/** La secrétaire est dans l'encadrement de la porte : il faut rester figé */
export function isLadyPresent(state: DoorState): boolean {
  return state === 'watching' || state === 'lingering'
}
export type GroovePhase = 'lobby' | 'countdown' | 'racing' | 'result'
export type StepSide = 'L' | 'R'

export interface RacerState {
  participantId: string
  nickname: string
  avatarId: string | null
  distance: number
  lastSide: StepSide | null
  combo: number
  maxCombo: number
  totalSteps: number
  caughtCount: number
  composureCount: number
  dancedInCurrentPhase: boolean
  caughtInCurrentPhase: boolean
  stunnedUntilMs: number
  finishedAtMs: number | null
  lastPose: string
}

export type StepOutcome =
  | 'grooved'
  | 'stumbled'
  | 'caught'
  | 'stunned'
  | 'finished'

export interface GrooveTrophy {
  id: string
  icon: string
  title: string
  winnerName: string
  avatarEmoji: string
  avatarImageUrl?: string
  description: string
}

const DANCE_POSES = ['🕺', '💃', '🪩', '✨', '🎷', '🔥']

export function createInitialRacer(participant: {
  id: string
  nickname: string
  avatar_id?: string | null
}): RacerState {
  return {
    participantId: participant.id,
    nickname: participant.nickname,
    avatarId: participant.avatar_id ?? null,
    distance: 0,
    lastSide: null,
    combo: 0,
    maxCombo: 0,
    totalSteps: 0,
    caughtCount: 0,
    composureCount: 0,
    dancedInCurrentPhase: false,
    caughtInCurrentPhase: false,
    stunnedUntilMs: 0,
    finishedAtMs: null,
    lastPose: '🕺',
  }
}

/** Gain en mètres d'un pas selon l'alternance G/D et le combo de groove */
export function computeStepGain(combo: number, alternated: boolean): number {
  if (!alternated) return 0.25
  if (combo >= 14) return 1.75
  if (combo >= 6) return 1.5
  return 1.25
}

/** Applique un pas (L ou R) d'un joueur selon l'état actuel de la porte de la secrétaire */
export function applyRacerStep(
  racer: RacerState,
  side: StepSide,
  nowMs: number,
  raceStartMs: number,
  doorState: DoorState,
  doorOpenedAtMs: number
): { racer: RacerState; outcome: StepOutcome } {
  if (racer.finishedAtMs !== null) {
    return { racer, outcome: 'finished' }
  }

  if (nowMs < racer.stunnedUntilMs) {
    return { racer, outcome: 'stunned' }
  }

  // Porte ouverte au-delà de la fenêtre de grâce, ou reparti trop tôt alors qu'elle
  // est toujours là : PRIS EN FLAGRANT DÉLIT !
  if (
    (doorState === 'watching' && nowMs - doorOpenedAtMs > GRACE_PERIOD_MS) ||
    doorState === 'lingering'
  ) {
    const updated: RacerState = {
      ...racer,
      distance: Math.max(
        0,
        Number((racer.distance - PENALTY_METERS).toFixed(2))
      ),
      lastSide: null,
      combo: 0,
      caughtCount: racer.caughtCount + 1,
      caughtInCurrentPhase: true,
      stunnedUntilMs: nowMs + STUN_DURATION_MS,
      lastPose: '😱',
    }
    return { racer: updated, outcome: 'caught' }
  }

  const alternated = racer.lastSide === null || racer.lastSide !== side
  const nextCombo = alternated ? racer.combo + 1 : 0
  const gain = computeStepGain(nextCombo, alternated)
  const nextDistance = Math.min(
    FINISH_DISTANCE,
    Number((racer.distance + gain).toFixed(2))
  )
  const reachedFinish = nextDistance >= FINISH_DISTANCE
  const elapsedMs = Math.max(100, nowMs - raceStartMs)

  const pose = reachedFinish
    ? '🏆'
    : alternated
      ? DANCE_POSES[nextCombo % DANCE_POSES.length]
      : '🤪'

  const updated: RacerState = {
    ...racer,
    distance: nextDistance,
    lastSide: side,
    combo: nextCombo,
    maxCombo: Math.max(racer.maxCombo, nextCombo),
    totalSteps: racer.totalSteps + 1,
    dancedInCurrentPhase: true,
    finishedAtMs: reachedFinish ? elapsedMs : null,
    lastPose: pose,
  }

  return {
    racer: updated,
    outcome: reachedFinish
      ? 'finished'
      : alternated
        ? 'grooved'
        : 'stumbled',
  }
}

/**
 * Quand la secrétaire referme la porte (`watching` -> `dancing`), récompense les joueurs
 * qui ont dansé puis gardé un sang-froid exemplaire sans se faire griller (+2 m).
 */
export function applyDoorCloseComposureBonus(
  racers: RacerState[],
  nowMs: number
): RacerState[] {
  return racers.map((r) => {
    if (r.finishedAtMs !== null) return r
    const earnedBonus =
      r.dancedInCurrentPhase &&
      !r.caughtInCurrentPhase &&
      nowMs >= r.stunnedUntilMs
    const nextDistance = earnedBonus
      ? Math.min(
          FINISH_DISTANCE - 0.5,
          Number((r.distance + COMPOSURE_BONUS_METERS).toFixed(2))
        )
      : r.distance
    return {
      ...r,
      distance: Math.max(r.distance, nextDistance),
      composureCount: earnedBonus ? r.composureCount + 1 : r.composureCount,
      dancedInCurrentPhase: false,
      caughtInCurrentPhase: false,
      lastPose: earnedBonus ? '🧐' : r.lastPose,
    }
  })
}

/** Classe les coureurs : arrivés d'abord (par temps), puis par distance, puis moins de flags */
export function rankRacers(racers: RacerState[]): RacerState[] {
  return [...racers].sort((a, b) => {
    if (a.finishedAtMs !== null && b.finishedAtMs !== null) {
      return a.finishedAtMs - b.finishedAtMs
    }
    if (a.finishedAtMs !== null) return -1
    if (b.finishedAtMs !== null) return 1
    if (b.distance !== a.distance) return b.distance - a.distance
    if (a.caughtCount !== b.caughtCount) return a.caughtCount - b.caughtCount
    return b.maxCombo - a.maxCombo
  })
}

/** Calcule les 4 trophées spéciaux de fin de course Downing Street Groove */
export function computeGrooveTrophies(racers: RacerState[]): GrooveTrophy[] {
  if (racers.length === 0) return []
  const trophies: GrooveTrophy[] = []

  const labelOf = (r: RacerState) => formatRacerIdentity(r)

  // 1. Roi / Reine du Déhanché (meilleur combo)
  const bestCombo = [...racers].sort((a, b) => b.maxCombo - a.maxCombo)[0]
  if (bestCombo && bestCombo.maxCombo > 0) {
    const info = labelOf(bestCombo)
    trophies.push({
      id: 'groove_king',
      icon: '🪩',
      title: 'Roi du Déhanché Ministériel',
      winnerName: info.name,
      avatarEmoji: info.emoji,
      avatarImageUrl: info.imageUrl,
      description: `Un enchaînement hypnotique de ${bestCombo.maxCombo} pas alternés sans trébucher dans le couloir !`,
    })
  }

  // 2. Grillé par la Secrétaire (le plus de flags)
  const mostCaught = [...racers].sort(
    (a, b) => b.caughtCount - a.caughtCount
  )[0]
  if (mostCaught && mostCaught.caughtCount > 0) {
    const info = labelOf(mostCaught)
    trophies.push({
      id: 'caught_red_handed',
      icon: '🚨',
      title: 'Pris la Main dans le Dossier',
      winnerName: info.name,
      avatarEmoji: info.emoji,
      avatarImageUrl: info.imageUrl,
      description: `Surpris ${mostCaught.caughtCount} fois en plein déhanché alors que la porte du bureau était grande ouverte !`,
    })
  }

  // 3. Sang-Froid Britannique (le plus de bonus de sang-froid ou 0 flag avec distance > 20 m)
  const coolest = [...racers]
    .filter((r) => r.distance > 10 || r.totalSteps > 5)
    .sort((a, b) => {
      if (a.caughtCount !== b.caughtCount) return a.caughtCount - b.caughtCount
      if (b.composureCount !== a.composureCount)
        return b.composureCount - a.composureCount
      return b.distance - a.distance
    })[0]
  if (coolest) {
    const info = labelOf(coolest)
    trophies.push({
      id: 'british_composure',
      icon: '🧐',
      title: 'Flegme de Downing Street',
      winnerName: info.name,
      avatarEmoji: info.emoji,
      avatarImageUrl: info.imageUrl,
      description:
        coolest.caughtCount === 0
          ? `Zéro flagrant délit sur toute la course (${coolest.composureCount} poses sérieuses impeccables) !`
          : `A su reprendre un air ministériel ${coolest.composureCount} fois pile au moment où la porte s'ouvrait.`,
    })
  }

  // 4. Turbo des Pouces (le plus grand nombre de pas tapotés)
  const mostSteps = [...racers].sort((a, b) => b.totalSteps - a.totalSteps)[0]
  if (mostSteps && mostSteps.totalSteps > 0) {
    const info = labelOf(mostSteps)
    trophies.push({
      id: 'thumb_turbo',
      icon: '⚡',
      title: 'Turbo des Pouces en Feu',
      winnerName: info.name,
      avatarEmoji: info.emoji,
      avatarImageUrl: info.imageUrl,
      description: `${mostSteps.totalSteps} pas frénétiques envoyés sur le tapis rouge de la résidence officielle !`,
    })
  }

  return trophies
}

/** Génère la chronique humoristique déterministe de fin de course (100 % sans spoil des quiz) */
export function buildGrooveChronicle(racers: RacerState[]): string {
  const ranked = rankRacers(racers)
  if (ranked.length === 0) {
    return 'Le couloir officiel est resté étrangement calme ce soir.'
  }

  const winner = ranked[0]
  const winnerIdentity = formatRacerIdentity(winner)
  const timeLabel =
    winner.finishedAtMs !== null
      ? `en ${(winner.finishedAtMs / 1000).toFixed(1)} s`
      : `avec ${Math.round(winner.distance)} m parcourus`

  const totalCaught = racers.reduce((acc, r) => acc + r.caughtCount, 0)
  const runnerUp = ranked[1]
  const runnerUpText = runnerUp
    ? ` Juste derrière, ${formatRacerIdentity(runnerUp).name} termine à ${Math.round(runnerUp.distance)} m.`
    : ''

  const caughtText =
    totalCaught === 0
      ? 'Miracle diplomatique : personne ne s’est fait surprendre par l’ouverture de la porte !'
      : `Au total, le secrétariat a surpris ${totalCaught} déhanché${totalCaught > 1 ? 's' : ''} illicite${totalCaught > 1 ? 's' : ''} entre deux réunions d’État.`

  return `Quel spectacle dans les couloirs officiels ! ${winnerIdentity.name} décroche la victoire ${timeLabel} grâce à un combo maximal de ${winner.maxCombo} pas.${runnerUpText} ${caughtText}`
}
