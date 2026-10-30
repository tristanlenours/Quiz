import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  resolveAvatarTheme,
  HOGWARTS_HOUSES,
  HouseId,
  getParticipantIdentity,
} from '@/avatars'

export const dynamic = 'force-dynamic'

export interface GameAward {
  id: string
  emoji: string
  title: string
  winnerName: string
  winnerCharacter: string | null
  winnerAvatarUrl: string | null
  description: string
}

export interface HouseCupEntry {
  house: HouseId
  label: string
  crest: string
  points: number
  members: string[]
}

export interface GameAnalysisPayload {
  themeId: string
  houseCup?: HouseCupEntry[]
  headline: string
  chronicle: string
  awards: GameAward[]
  hardestQuestionText: string | null
  hardestQuestionSuccessPct: number | null
  source: 'gemini' | 'deterministic'
}

const analysisCache = new Map<string, GameAnalysisPayload>()

const CHARACTER_VICTORY_QUIPS: Record<string, string> = {
  david:
    'a littéralement dansé sur la concurrence dans les couloirs du 10 Downing Street',
  natalie:
    'a conquis tout le quartier de Wandsworth avec un naturel désarmant (« Oh, et puis merde ! »)',
  billy_mack:
    'décroche la place de numéro 1 de Noël devant tous les boys bands du royaume et gagne le droit de fêter ça avec son manager Joe',
  mark: 'n’a même pas eu besoin de sortir ses pancartes pour mettre tout le monde d’accord',
  juliet:
    'repart avec la cassette du mariage, son chapeau gavroche et un sourire aux dents si nombreuses que ses amies jalouses ont renoncé à les compter',
  jamie:
    'a tapé un sans-faute digne de son meilleur roman avant de plonger dans le lac pour célébrer son triomphe',
  aurelia:
    'a traversé toute la brasserie portugaise sous les applaudissements pour s’emparer de la couronne',
  karen:
    'prend une revanche éclatante, bien loin des larmes de Noël et avec la grâce d’un homard de crèche',
  harry:
    'a validé ses réponses en cachette au comptoir de la bijouterie avant même que sa femme ne revienne',
  sam: 'a sprinté à travers tout l’aéroport d’Heathrow pour arracher la victoire à la dernière seconde',
  joanna:
    'a électrisé toute la salle du spectacle de Noël avec une voix (et un score) de diva absolue',
  rufus:
    'a pris le temps d’emballer la première place avec du papier transparent et un ruban noué à la perfection',
  colin:
    'prouve qu’il n’avait même pas besoin d’aller dans le Wisconsin pour régner sans partage sur la soirée',
  mia: 'a sorti ses cornes de diable rouges de la soirée de Noël pour chiper le trophée sous le nez des favoris',
  john: 'a géré la pression avec une politesse toute britannique au milieu des embouteillages de Londres',
}

interface PlayerComputedStats {
  participantId: string
  displayName: string
  characterName: string | null
  avatarId: string | null
  avatarUrl: string | null
  house: HouseId | null
  totalScore: number
  rank: number
  answeredCount: number
  correctCount: number
  accuracyPct: number
  bestSingleScore: number
  avgSpeedScore: number
  maxStreak: number
  lateGameScore: number
}

function buildDeterministicAnalysis(
  quizName: string,
  players: PlayerComputedStats[],
  hardestQ: { body: string; pct: number } | null,
  totalQuestions: number
): GameAnalysisPayload {
  if (players.length === 0) {
    return {
      headline: '🎬 Clap de fin sur le plateau !',
      chronicle:
        'Aucune réponse enregistrée sur cette session, mais les projecteurs de Noël restent allumés pour la prochaine manche !',
      awards: [],
      hardestQuestionText: null,
      hardestQuestionSuccessPct: null,
      source: 'deterministic',
      themeId: 'love_actually',
    }
  }

  const winner = players[0]
  const second = players[1] ?? null
  const third = players[2] ?? null

  const winnerQuip =
    (winner.avatarId && CHARACTER_VICTORY_QUIPS[winner.avatarId]) ||
    'a survolé les débats avec un sang-froid magistral du début à la fin'

  const winnerIdentityLabel = winner.characterName
    ? `${winner.displayName} (alias ${winner.characterName})`
    : winner.displayName

  const headline =
    players.length > 1 && second && winner.totalScore - second.totalScore <= 400
      ? `🎄 Photo-finish haletante : ${winner.displayName} l'emporte sur le fil !`
      : `👑 Triomphe de Noël : ${winner.displayName} règne sur « ${quizName} » !`

  const parts: string[] = []
  parts.push(
    `Quel spectacle digne d’un final à l’aéroport d’Heathrow ! Avec ${winner.totalScore} points (${winner.correctCount}/${totalQuestions} bonnes réponses), ${winnerIdentityLabel} ${winnerQuip}.`
  )

  if (second) {
    const gap = winner.totalScore - second.totalScore
    const secondLabel = second.characterName
      ? `${second.displayName} (${second.characterName})`
      : second.displayName
    if (gap === 0) {
      parts.push(
        `Égalité parfaite au sommet avec ${secondLabel} qui affiche exactement le même score : il va falloir partager la dinde de Noël !`
      )
    } else if (gap <= 450) {
      parts.push(
        `Le suspense a duré jusqu'au bout : ${secondLabel} échoue à seulement ${gap} petits points du sommet après une lutte acharnée${third ? `, tandis que ${third.displayName} complète ce podium de rêve avec ${third.totalScore} pts` : ''}.`
      )
    } else {
      parts.push(
        `Derrière cette démonstration, ${secondLabel} décroche une belle médaille d'argent (${second.totalScore} pts)${third ? ` juste devant ${third.displayName} (${third.totalScore} pts) qui s'invite sur la boîte` : ''}.`
      )
    }
  }

  if (hardestQ) {
    parts.push(
      `Le moment le plus impitoyable de la soirée ? La question « ${hardestQ.body} », qui n’a laissé passer que ${hardestQ.pct}% de bonnes réponses !`
    )
  }

  // Compute fun deterministic awards
  const awards: GameAward[] = []

  // 1. Lucky Luke du Buzzer (highest single question score or avgSpeedScore)
  const fastest = [...players]
    .filter((p) => p.correctCount > 0)
    .sort((a, b) => b.bestSingleScore - a.bestSingleScore || b.avgSpeedScore - a.avgSpeedScore)[0]
  if (fastest) {
    awards.push({
      id: 'speed',
      emoji: '⚡',
      title: 'Lucky Luke du Buzzer',
      winnerName: fastest.displayName,
      winnerCharacter: fastest.characterName,
      winnerAvatarUrl: fastest.avatarUrl,
      description: `Réflexes supersoniques avec une pointe à ${fastest.bestSingleScore} pts sur une seule question (moyenne de ${fastest.avgSpeedScore} pts/bonne réponse) !`,
    })
  }

  // 2. Sniper sans pitié (longest streak or highest accuracy)
  const sniper = [...players]
    .filter((p) => p.correctCount > 0)
    .sort((a, b) => b.maxStreak - a.maxStreak || b.accuracyPct - a.accuracyPct)[0]
  if (sniper && (sniper.maxStreak >= 2 || players.length === 1)) {
    awards.push({
      id: 'sniper',
      emoji: '🎯',
      title: 'Sniper de Downing Street',
      winnerName: sniper.displayName,
      winnerCharacter: sniper.characterName,
      winnerAvatarUrl: sniper.avatarUrl,
      description: `Une série insolente de ${sniper.maxStreak} bonnes réponses consécutives (${sniper.accuracyPct}% de réussite globale).`,
    })
  }

  // 3. Prix Rufus / Mr Bean de l'emballage (player who took the most time on correct answers)
  if (players.length >= 2) {
    const carefulCandidates = [...players].filter(
      (p) => p.correctCount > 0 && p.participantId !== fastest?.participantId
    )
    const careful = carefulCandidates.sort((a, b) => a.avgSpeedScore - b.avgSpeedScore)[0]
    if (careful) {
      awards.push({
        id: 'rufus',
        emoji: '🎁',
        title: "Prix Mr Bean de l'Emballage",
        winnerName: careful.displayName,
        winnerCharacter: careful.characterName,
        winnerAvatarUrl: careful.avatarUrl,
        description: `Peaufine son paquet cadeau avant de buzzer (${careful.avgSpeedScore} pts de moyenne par bonne réponse) : lentement mais sûrement !`,
      })
    }
  }

  // 4. Remontada de Noël (strong finish on the last 3 questions)
  const finisher = [...players]
    .filter((p) => p.lateGameScore > 0)
    .sort((a, b) => b.lateGameScore - a.lateGameScore)[0]
  if (finisher && finisher.lateGameScore >= 600) {
    awards.push({
      id: 'finisher',
      emoji: '🔥',
      title: 'Sprint Final à Heathrow',
      winnerName: finisher.displayName,
      winnerCharacter: finisher.characterName,
      winnerAvatarUrl: finisher.avatarUrl,
      description: `A tout donné dans le money-time avec ${finisher.lateGameScore} pts engrangés sur les 3 dernières manches !`,
    })
  }

  // 5. Cœur Vaillant de Karen (encouragement award for a player outside top 1)
  if (players.length >= 3) {
    const brave = players[players.length - 1]
    if (brave) {
      awards.push({
        id: 'brave',
        emoji: '💝',
        title: 'Cœur Vaillant de Noël',
        winnerName: brave.displayName,
        winnerCharacter: brave.characterName,
        winnerAvatarUrl: brave.avatarUrl,
        description: `N'a jamais lâché sa manette malgré les pièges (${brave.answeredCount} manches jouées) : la revanche sera terrible !`,
      })
    }
  }

  return {
    headline,
    chronicle: parts.join(' '),
    awards: awards.slice(0, 4),
    hardestQuestionText: hardestQ?.body ?? null,
    hardestQuestionSuccessPct: hardestQ?.pct ?? null,
    source: 'deterministic',
    themeId: 'love_actually',
  }
}

// ==============================================================================
// Thème Harry Potter (D29) : banquet de fin d'année, discours de Dumbledore
// et Coupe des Quatre Maisons
// ==============================================================================

const WIZARD_VICTORY_QUIPS: Record<string, string> = {
  hp_harry:
    'a gagné, comme d’habitude dans les films, il me semble, sans que personne ne comprenne vraiment comment',
  hp_hermione:
    'levait la main tout le temps, et il paraît que c’est un personnage qui fait ça, donc c’est cohérent',
  hp_ron:
    'était là du début à la fin, comme dans les films, et cette fois il a même servi à quelque chose',
  hp_neville:
    'était nul au début et bien à la fin, ou l’inverse, on ne regardait pas à ce moment-là',
  hp_twins:
    'a gagné à deux, ou tout seul, personne n’a su dire lequel c’était',
  hp_hagrid:
    'a tout raflé, ce qui est bien pour quelqu’un de cette taille, peu importe laquelle',
  hp_dumbledore:
    'l’emporte, ce qui est gênant vu que c’est moi qui parle, enfin je crois que c’est moi',
  hp_mcgonagall:
    'a dominé la soirée avec le chapeau, et il paraît qu’elle est sympa, on attend toujours',
  hp_draco:
    'triomphe, et son père est au courant, il y a un truc avec son père',
  hp_snape:
    'a gagné en faisant la tête, et à la fin on apprendra un truc, je n’ai pas suivi',
  hp_bellatrix:
    'a beaucoup crié, et on lui souhaite de se reposer un peu maintenant',
  hp_voldemort:
    'a conquis la première place sans nez, ce qui force le respect, je crois que c’est expliqué dans le 2',
  hp_luna:
    'a trouvé les bonnes réponses par hasard, ou pas, avec elle on n’a jamais su',
  hp_cedric:
    'a gagné avec sa belle tête, et je maintiens que c’est lui dans Twilight',
  hp_dobby:
    'gagne, et je n’ai toujours pas compris ce que c’était comme animal',
}

function computeHouseCup(players: PlayerComputedStats[]): HouseCupEntry[] {
  const byHouse = new Map<HouseId, PlayerComputedStats[]>()
  for (const p of players) {
    if (!p.house || p.house === 'aucune') continue
    byHouse.set(p.house, [...(byHouse.get(p.house) ?? []), p])
  }
  // Moyenne par membre présent : une maison nombreuse n'est pas avantagée
  return Array.from(byHouse.entries())
    .map(([house, members]) => ({
      house,
      label: HOGWARTS_HOUSES[house].label,
      crest: HOGWARTS_HOUSES[house].crest,
      points: Math.round(
        members.reduce((sum, m) => sum + m.totalScore, 0) / members.length
      ),
      members: members.map((m) => m.displayName),
    }))
    .sort((a, b) => b.points - a.points)
}

function buildHarryPotterAnalysis(
  quizName: string,
  players: PlayerComputedStats[],
  hardestQ: { body: string; pct: number } | null,
  totalQuestions: number
): GameAnalysisPayload {
  if (players.length === 0) {
    return {
      headline: '🦉 Pigeon perdu : personne n’a répondu, à la cantine non plus',
      chronicle:
        'Aucun sorcier n’a répondu. C’est dommage, ou c’est normal, je ne sais pas trop comment ça marche. On retentera à la rentrée, si elle a lieu.',
      awards: [],
      hardestQuestionText: null,
      hardestQuestionSuccessPct: null,
      source: 'deterministic',
      themeId: 'harry_potter',
      houseCup: [],
    }
  }

  const houseCup = computeHouseCup(players)
  const winner = players[0]
  const second = players[1] ?? null
  const third = players[2] ?? null
  const labelOf = (p: PlayerComputedStats) =>
    p.characterName ? `${p.displayName} (alias ${p.characterName})` : p.displayName

  const headline =
    second && winner.totalScore - second.totalScore <= 400
      ? `🦉 Le journal qui bouge : ${winner.displayName} gagne « ${quizName} » de peu, avec la petite balle dorée, je crois !`
      : `🦉 Le journal qui bouge : ${winner.displayName} écrase « ${quizName} », la cantine applaudit !`

  const parts: string[] = [
    'Bon. C’est fini, je crois. Avant le dessert, je dois lire un truc, on m’a dit que c’était la tradition, à moins que ce soit dans un autre film.',
  ]

  if (houseCup.length >= 2) {
    const ascending = [...houseCup].reverse()
    const leader = houseCup[0]
    const standings = ascending
      .slice(0, -1)
      .map(
        (h, i) =>
          `${i === 0 ? 'en dernière place' : 'puis'} ${h.label} avec ${h.points} points`
      )
      .join(', ')
    parts.push(
      `La Coupe des Maisons, là : ${standings}… et devant, avec ${leader.points} points, ${leader.label} ${leader.crest} ! J’ai bien aimé, enfin, j’ai essayé.`
    )
  } else if (houseCup.length === 1) {
    parts.push(
      `${houseCup[0].label} ${houseCup[0].crest} gagne la Coupe des Maisons tout seul. Je ne sais pas si c’est autorisé.`
    )
  }

  const quip =
    (winner.avatarId && WIZARD_VICTORY_QUIPS[winner.avatarId]) ||
    'a gagné, et je ne saurais pas expliquer pourquoi, mais bravo'
  parts.push(
    `Le gagnant, c’est ${labelOf(winner)}, qui ${quip} : ${winner.totalScore} points et ${winner.correctCount}/${totalQuestions} bonnes réponses.`
  )

  if (second) {
    const gap = winner.totalScore - second.totalScore
    parts.push(
      gap === 0
        ? `${labelOf(second)} termine à égalité : qu’ils se battent avec les bâtons, là, mais gentiment.`
        : gap <= 450
        ? `${labelOf(second)} rate le coche de ${gap} points, ce qui est peu, ou beaucoup, je ne connais pas le barème${third ? `, devant ${third.displayName} qui complète le podium avec ${third.totalScore} points` : ''}.`
        : `${labelOf(second)} est deuxième (${second.totalScore} points)${third ? `, et ${third.displayName} est troisième avec ${third.totalScore} points, comme quoi` : ''}.`
    )
  }

  if (hardestQ) {
    parts.push(
      `Quant à la question « ${hardestQ.body} », seuls ${hardestQ.pct}% d’entre vous ont trouvé. Moi non plus, je ne savais pas.`
    )
  }
  parts.push(
    'Voilà. Bonne nuit, et faites attention aux escaliers, il y a un truc avec les escaliers.'
  )

  const awards: GameAward[] = []
  const giveAward = (
    id: string,
    emoji: string,
    title: string,
    p: PlayerComputedStats,
    description: string
  ) =>
    awards.push({
      id,
      emoji,
      title,
      winnerName: p.displayName,
      winnerCharacter: p.characterName,
      winnerAvatarUrl: p.avatarUrl,
      description,
    })

  const scorers = players.filter((p) => p.correctCount > 0)
  const fastest = [...scorers].sort(
    (a, b) => b.bestSingleScore - a.bestSingleScore || b.avgSpeedScore - a.avgSpeedScore
  )[0]
  if (fastest) {
    giveAward(
      'speed',
      '🧹',
      'Le Balai Rapide, là',
      fastest,
      `Très rapide, comme le balai, celui qui est bien : une pointe à ${fastest.bestSingleScore} pts sur une seule question !`
    )
  }

  const sniper = [...scorers].sort(
    (a, b) => b.maxStreak - a.maxStreak || b.accuracyPct - a.accuracyPct
  )[0]
  if (sniper && (sniper.maxStreak >= 2 || players.length === 1)) {
    giveAward(
      'sniper',
      '⏳',
      'Le Collier du Temps d’Hermione',
      sniper,
      `${sniper.maxStreak} bonnes réponses d’affilée (${sniper.accuracyPct}% de réussite) : il y a un film où ça s’explique, je crois.`
    )
  }

  if (players.length >= 2) {
    const careful = scorers
      .filter((p) => p.participantId !== fastest?.participantId)
      .sort((a, b) => a.avgSpeedScore - b.avgSpeedScore)[0]
    if (careful) {
      giveAward(
        'careful',
        '👻',
        'Prix du Prof Fantôme',
        careful,
        `Prend son temps, comme un fantôme, à supposer qu’ils en aient un (${careful.avgSpeedScore} pts de moyenne par bonne réponse).`
      )
    }
  }

  const finisher = players
    .filter((p) => p.lateGameScore > 0)
    .sort((a, b) => b.lateGameScore - a.lateGameScore)[0]
  if (finisher && finisher.lateGameScore >= 600) {
    giveAward(
      'finisher',
      '🦁',
      'Dix points pour Neville, je crois',
      finisher,
      `Nul au début, bien à la fin : ${finisher.lateGameScore} pts sur les 3 dernières manches.`
    )
  }

  if (players.length >= 3) {
    const brave = players[players.length - 1]
    giveAward(
      'brave',
      '🧦',
      'Chaussette de Dobby',
      brave,
      `${brave.answeredCount} manches jouées sans lâcher son bâton : personne ne sait pourquoi, mais il a une chaussette.`
    )
  }

  return {
    headline,
    chronicle: parts.join(' '),
    awards: awards.slice(0, 4),
    hardestQuestionText: hardestQ?.body ?? null,
    hardestQuestionSuccessPct: hardestQ?.pct ?? null,
    source: 'deterministic',
    themeId: 'harry_potter',
    houseCup,
  }
}

// ==============================================================================
// Thème Rétro 2026 (D46) : revue de presse de la soirée, sans Love Actually
// ==============================================================================

const RETRO_VICTORY_QUIPS: Record<string, string> = {
  r26_shakira: 'a fait bouger tout le classement, et les hanches n’ont toujours pas menti',
  r26_mbappe: 'a pris la profondeur dès la première question et n’a plus jamais été rattrapé',
  r26_wemby: 'a dominé tout le monde de très haut, sans même lever les bras',
  r26_trump: 'annonce une victoire historique, la plus belle de tous les temps, de très loin',
  r26_lecornu: 'a tenu jusqu’au bout, ce qui à Matignon relève déjà de l’exploit',
  r26_yunglean: 'a gagné avec la mine de celui qui aurait préféré rester chez lui',
  r26_leon: 'l’emporte, et on n’ose pas contester',
  r26_cuillandre: 'prend sa revanche, rentré d’Ouessant pour l’occasion',
  r26_roudaut: 'confirme la tendance : décidément, on ne l’arrête plus à Brest',
  r26_ophelie: 'gagne, et le podium devient une zone interdite',
  r26_burnaboy: 'a gagné sans enlever son chapeau',
  r26_sansal: 'a gagné avec une plume plus rapide que les buzzers',
  r26_bruel: 'gagne avec un carré d’as, sans jamais montrer ses cartes',
  r26_lula: 'revient au sommet, on commence à avoir l’habitude',
  r26_kane: 'a enfin soulevé quelque chose, et c’est ce classement',
}

function buildRetroAnalysis(
  quizName: string,
  players: PlayerComputedStats[],
  hardestQ: { body: string; pct: number } | null,
  totalQuestions: number
): GameAnalysisPayload {
  if (players.length === 0) {
    return {
      headline: '🗓️ Année blanche : personne n’a répondu',
      chronicle: 'Aucune réponse enregistrée. On retentera en 2027, si tout le monde survit à l’année.',
      awards: [],
      hardestQuestionText: null,
      hardestQuestionSuccessPct: null,
      source: 'deterministic',
      themeId: 'retro_2026',
    }
  }

  const winner = players[0]
  const second = players[1] ?? null
  const third = players[2] ?? null
  const labelOf = (p: PlayerComputedStats) =>
    p.characterName ? `${p.displayName} (alias ${p.characterName})` : p.displayName

  const headline =
    second && winner.totalScore - second.totalScore <= 400
      ? `🗓️ Coup de théâtre : ${winner.displayName} arrache « ${quizName} » sur le fil !`
      : `📰 Fait marquant de l’année : ${winner.displayName} écrase « ${quizName} » !`

  const quip =
    (winner.avatarId && RETRO_VICTORY_QUIPS[winner.avatarId]) ||
    'a survolé l’année avec une mémoire d’éléphant'
  const parts: string[] = [
    `Personnalité de l’année : ${labelOf(winner)}, qui ${quip}, avec ${winner.totalScore} points et ${winner.correctCount}/${totalQuestions} bonnes réponses.`,
  ]

  if (second) {
    const gap = winner.totalScore - second.totalScore
    parts.push(
      gap === 0
        ? `${labelOf(second)} finit à égalité parfaite : il faudra un recomptage.`
        : `${labelOf(second)} termine à ${gap} points${third ? `, devant ${third.displayName} (${third.totalScore} points)` : ''}.`
    )
  }
  if (hardestQ) {
    parts.push(
      `Le sujet qui a le plus divisé : « ${hardestQ.body} », avec ${hardestQ.pct}% de bonnes réponses.`
    )
  }

  const awards: GameAward[] = []
  const giveAward = (
    id: string,
    emoji: string,
    title: string,
    p: PlayerComputedStats,
    description: string
  ) =>
    awards.push({
      id,
      emoji,
      title,
      winnerName: p.displayName,
      winnerCharacter: p.characterName,
      winnerAvatarUrl: p.avatarUrl,
      description,
    })

  const scorers = players.filter((p) => p.correctCount > 0)
  const fastest = [...scorers].sort(
    (a, b) => b.bestSingleScore - a.bestSingleScore || b.avgSpeedScore - a.avgSpeedScore
  )[0]
  if (fastest) {
    giveAward('speed', '⚡', 'Alerte Info', fastest, `Le plus rapide sur l’actu : une pointe à ${fastest.bestSingleScore} pts.`)
  }
  const sniper = [...scorers].sort(
    (a, b) => b.maxStreak - a.maxStreak || b.accuracyPct - a.accuracyPct
  )[0]
  if (sniper && (sniper.maxStreak >= 2 || players.length === 1)) {
    giveAward('sniper', '📰', 'Abonné au Journal de 20 h', sniper, `${sniper.maxStreak} bonnes réponses d’affilée (${sniper.accuracyPct}% de réussite).`)
  }
  const finisher = players
    .filter((p) => p.lateGameScore > 0)
    .sort((a, b) => b.lateGameScore - a.lateGameScore)[0]
  if (finisher && finisher.lateGameScore >= 600) {
    giveAward('finisher', '🔥', 'Sprint de fin d’année', finisher, `${finisher.lateGameScore} pts sur les 3 dernières manches.`)
  }
  if (players.length >= 3) {
    const brave = players[players.length - 1]
    giveAward('brave', '🏝️', 'Exil à Ouessant', brave, `${brave.answeredCount} manches jouées : une retraite bien méritée.`)
  }

  return {
    headline,
    chronicle: parts.join(' '),
    awards: awards.slice(0, 4),
    hardestQuestionText: hardestQ?.body ?? null,
    hardestQuestionSuccessPct: hardestQ?.pct ?? null,
    source: 'deterministic',
    themeId: 'retro_2026',
  }
}

interface ChronicleContext {
  quizName: string
  players: PlayerComputedStats[]
  awards: GameAward[]
  hardestQ: { body: string; pct: number } | null
  totalQuestions: number
  houseCup?: HouseCupEntry[]
}

function buildHarryPotterPrompt({
  quizName,
  players,
  awards,
  hardestQ,
  totalQuestions,
  houseCup,
}: ChronicleContext): string {
  const summaryLines = players.map(
    (p) =>
      `- #${p.rank} ${p.displayName} (incarne ${p.characterName || 'un Moldu sans avatar'}, maison ${p.house ? HOGWARTS_HOUSES[p.house].label : 'aucune'}) : ${p.totalScore} pts, ${p.correctCount}/${totalQuestions} bonnes réponses, série max ${p.maxStreak}, pic vitesse ${p.bestSingleScore} pts`
  )
  const houseLines = (houseCup ?? []).map(
    (h, i) => `- ${i + 1}. ${h.label} : ${h.points} pts (moyenne de ${h.members.join(', ')})`
  )
  const awardsLines = awards.map(
    (a) => `- ${a.emoji} ${a.title} : ${a.winnerName} (${a.description})`
  )

  return `Tu incarnes Albus Dumbledore prononçant le discours du banquet de fin d'année dans la Grande Salle de Poudlard, après une soirée Quiz & Blind Test Harry Potter entre amis (pack "${quizName}", ${totalQuestions} questions).
Ton ton : celui de quelqu'un qui n'a vu les films que de loin, qui aimerait aimer ça mais à qui ça ne prend pas. Très sûr de toi et très approximatif : « je crois », « il y a un truc avec… », « ou l'inverse », « c'est expliqué dans le 2 ». Tu gardes les vrais noms des personnages, mais tu décris tout de travers. Tu restes bienveillant : on taquine, on n'humilie jamais.

Classement individuel :
${summaryLines.join('\n')}

Coupe des Quatre Maisons (moyenne des scores des membres présents) :
${houseLines.length > 0 ? houseLines.join('\n') : '- Aucune maison représentée'}

Points spéciaux déjà attribués :
${awardsLines.join('\n')}
${hardestQ ? `Question la plus meurtrière : "${hardestQ.body}" (${hardestQ.pct}% de réussite).` : ''}

Rédige en français un JSON strict avec 2 clés :
- "headline": Une manchette du « journal qui bouge » (tu ne sais plus son nom), sensationnaliste et drôle, avec un emoji (max 100 caractères).
- "chronicle": Le discours de Dumbledore en 5 à 6 phrases, à la première personne, qui (1) annonce la Coupe des Quatre Maisons de la dernière à la première place avec suspense, (2) accorde les « derniers points » au vainqueur en jouant sur le personnage qu'il incarne, (3) taquine 2 ou 3 autres joueurs via leur personnage, (4) évoque la question la plus meurtrière, (5) se termine par une formule de clôture hésitante, qui se perd un peu.
N'invente aucun score : utilise uniquement les chiffres fournis.

Réponds UNIQUEMENT avec l'objet JSON valide, sans balises markdown.`
}

function buildRetroPrompt({
  quizName,
  players,
  awards,
  hardestQ,
  totalQuestions,
}: ChronicleContext): string {
  const summaryLines = players.map(
    (p) =>
      `- #${p.rank} ${p.displayName} (incarne ${p.characterName || 'personne'}) : ${p.totalScore} pts, ${p.correctCount}/${totalQuestions} bonnes réponses`
  )
  const awardsLines = awards.map((a) => `- ${a.emoji} ${a.title} : ${a.winnerName} (${a.description})`)

  return `Tu es un chroniqueur de revue de presse, drôle et bienveillant, qui conclut une soirée Quiz « Rétro 2026 » entre amis (pack "${quizName}", ${totalQuestions} questions). Les joueurs incarnent des personnalités de l'année.
On taquine les joueurs, pas les personnalités : aucune accusation ni affirmation sur des personnes réelles, et aucune mention de maladie ou de décès.

Classement :
${summaryLines.join('\n')}

Trophées :
${awardsLines.join('\n')}
${hardestQ ? `Question la plus difficile : "${hardestQ.body}" (${hardestQ.pct}% de réussite).` : ''}

Rédige en français un JSON strict avec 2 clés :
- "headline": Un gros titre de presse drôle, avec un emoji (max 100 caractères).
- "chronicle": Une chronique de 4 à 5 phrases qui annonce le vainqueur et taquine 2 autres joueurs.
N'invente aucun score : utilise uniquement les chiffres fournis.

Réponds UNIQUEMENT avec l'objet JSON valide, sans balises markdown.`
}

function buildLoveActuallyPrompt({
  quizName,
  players,
  awards,
  hardestQ,
  totalQuestions,
}: ChronicleContext): string {
  const summaryLines = players.map(
    (p) =>
      `- #${p.rank} ${p.displayName} (Avatar Love Actually: ${p.characterName || 'Aucun'}) : ${p.totalScore} pts, ${p.correctCount}/${totalQuestions} bonnes réponses, série max ${p.maxStreak}, pic vitesse ${p.bestSingleScore} pts`
  )

  const awardsLines = awards.map(
    (a) => `- ${a.emoji} ${a.title} attribué à ${a.winnerName} (${a.description})`
  )

  return `Tu es le présentateur survolté, drôle et bienveillant d'une soirée Quiz & Blind Test entre amis sur le thème de "Love Actually".
Voici les résultats réels de la partie sur le pack "${quizName}" (${totalQuestions} questions) :

Classement :
${summaryLines.join('\n')}

Trophées spéciaux :
${awardsLines.join('\n')}
${hardestQ ? `Question la plus difficile : "${hardestQ.body}" (${hardestQ.pct}% de réussite).` : ''}

Rédige en français un JSON strict avec 2 clés :
- "headline": Un titre accrocheur et fun avec un emoji (max 90 caractères).
- "chronicle": Un débrief humoristique, chaleureux et rythmé de 3 à 4 phrases maximum qui commente le podium, taquine gentiment les joueurs en faisant des clins d'œil aux personnages de Love Actually qu'ils ont choisis comme avatars, et mentionne un fait marquant de la partie.
Ne dévoile aucune réponse du grand quiz (le débrief du Warm-Up passe avant lui) : ne cite jamais de chanson ou d'artiste, de dessert, de texte des pancartes de Mark, de groupe rival de Billy Mack, de nom de rue, de pays ou de ville, ni le contenu du paquet cadeau de Rufus.

Réponds UNIQUEMENT avec l'objet JSON valide, sans balises markdown.`
}

async function tryGenerateGeminiChronicle(
  prompt: string,
  maxOutputTokens: number
): Promise<{ headline: string; chronicle: string } | null> {
  const env = process.env
  const apiKey = (
    env['GEMINI_API_KEY'] ||
    env['GOOGLE_API_KEY'] ||
    env['NEXT_PUBLIC_GEMINI_API_KEY'] ||
    ''
  ).trim()

  if (!apiKey) return null

  const models = [
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash',
  ]
  for (const model of models) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 6500)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens,
              responseMimeType: 'application/json',
            },
          }),
          signal: controller.signal,
        }
      )
      clearTimeout(timer)
      if (!res.ok) continue
      const data = await res.json()
      const rawText: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!rawText) continue
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/```$/i, '')
        .trim()
      const parsed = JSON.parse(cleaned)
      if (
        typeof parsed?.headline === 'string' &&
        typeof parsed?.chronicle === 'string' &&
        parsed.chronicle.length > 20
      ) {
        return {
          headline: parsed.headline.trim(),
          chronicle: parsed.chronicle.trim(),
        }
      }
    } catch {
      // Continue to fallback model or deterministic fallback
    }
  }
  return null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const gameId: string | undefined = body?.gameId
    if (!gameId) {
      return NextResponse.json({ error: 'Missing gameId' }, { status: 400 })
    }

    const env = process.env
    const supabaseUrl = (
      env['SUPABASE_URL'] ||
      env['NEXT_PUBLIC_SUPABASE_URL'] ||
      ''
    ).trim()
    const supabaseKey = (
      env['SUPABASE_SERVICE_ROLE_KEY'] ||
      env['SUPABASE_ANON_KEY'] ||
      env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
      ''
    ).trim()

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const [gameRes, participantsRes, resultsRes] = await Promise.all([
      supabase.from('quiz_games').select('*, quiz_sets(*)').eq('id', gameId).single(),
      supabase.from('quiz_participants').select('*').eq('game_id', gameId),
      supabase
        .from('quiz_game_results')
        .select('*')
        .eq('game_id', gameId)
        .order('total_score', { ascending: false }),
    ])

    const quizSetId = gameRes.data?.quiz_set_id
    const quizSetRow = (gameRes.data as any)?.quiz_sets
    const themeId = resolveAvatarTheme(quizSetRow)
    const isHarryPotter = themeId === 'harry_potter'
    const quizName =
      quizSetRow?.name || (isHarryPotter ? 'Quiz Harry Potter' : 'Quiz Love Actually')

    let questions: { id: string; body: string; order: number }[] = []
    if (quizSetId) {
      const { data: qData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_set_id', quizSetId)
        .order('order', { ascending: true })
      questions = (qData ?? []).filter((q: any) => !q.is_disabled)
    }

    const participants = participantsRes.data ?? []
    const participantMap = new Map(participants.map((p: any) => [p.id, p]))
    const results = resultsRes.data ?? []

    const cacheKey = `${gameId}_${results.length}_${results.reduce((s: number, r: any) => s + (r.total_score || 0), 0)}`
    const cached = analysisCache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const participantIdsList = participants.map((p: any) => p.id)
    let gameAnswers: any[] = []
    if (participantIdsList.length > 0) {
      const { data: ansData } = await supabase
        .from('quiz_answers')
        .select('*')
        .in('participant_id', participantIdsList)
      gameAnswers = ansData ?? []
    }

    const totalQuestions = Math.max(questions.length, 1)
    const lastThreeQuestionIds = new Set(questions.slice(-3).map((q) => q.id))

    const playerStats: PlayerComputedStats[] = results.map((r: any, idx: number) => {
      const pRow = participantMap.get(r.participant_id)
      const identity = getParticipantIdentity({
        nickname: r.nickname ?? pRow?.nickname,
        avatar_id: r.avatar_id ?? pRow?.avatar_id,
      })

      const myAnswers = gameAnswers.filter(
        (a: any) => a.participant_id === r.participant_id
      )
      const correctAnswers = myAnswers.filter((a: any) => (a.score ?? 0) > 0)
      const bestSingleScore = correctAnswers.reduce(
        (max: number, a: any) => Math.max(max, a.score ?? 0),
        0
      )
      const avgSpeedScore =
        correctAnswers.length > 0
          ? Math.round(
              correctAnswers.reduce((s: number, a: any) => s + (a.score ?? 0), 0) /
                correctAnswers.length
            )
          : 0

      // Compute max streak across ordered questions
      const answerByQ = new Map(myAnswers.map((a: any) => [a.question_id, a]))
      let currentStreak = 0
      let maxStreak = 0
      for (const q of questions) {
        const ans = answerByQ.get(q.id)
        if (ans && (ans.score ?? 0) > 0) {
          currentStreak += 1
          if (currentStreak > maxStreak) maxStreak = currentStreak
        } else {
          currentStreak = 0
        }
      }

      const lateGameScore = myAnswers
        .filter((a: any) => lastThreeQuestionIds.has(a.question_id))
        .reduce((s: number, a: any) => s + (a.score ?? 0), 0)

      return {
        participantId: r.participant_id,
        displayName: identity.displayName,
        characterName: identity.characterName,
        avatarId: identity.avatarId,
        avatarUrl: identity.avatar?.imageUrl ?? null,
        house: identity.avatar?.house ?? null,
        totalScore: r.total_score ?? 0,
        rank: idx + 1,
        answeredCount: myAnswers.length,
        correctCount: correctAnswers.length,
        accuracyPct: Math.round((correctAnswers.length / totalQuestions) * 100),
        bestSingleScore,
        avgSpeedScore,
        maxStreak,
        lateGameScore,
      }
    })

    // Find hardest question
    let hardestQ: { body: string; pct: number } | null = null
    if (questions.length > 0 && participants.length > 0) {
      let minPct = 101
      for (const q of questions) {
        const qAnswers = gameAnswers.filter((a: any) => a.question_id === q.id)
        if (qAnswers.length === 0) continue
        const qCorrect = qAnswers.filter((a: any) => (a.score ?? 0) > 0).length
        const pct = Math.round((qCorrect / Math.max(participants.length, 1)) * 100)
        if (pct < minPct) {
          minPct = pct
          hardestQ = { body: q.body, pct }
        }
      }
    }

    const isRetro = themeId === 'retro_2026'
    const baseAnalysis = (
      isHarryPotter
        ? buildHarryPotterAnalysis
        : isRetro
        ? buildRetroAnalysis
        : buildDeterministicAnalysis
    )(quizName, playerStats, hardestQ, totalQuestions)

    const promptContext: ChronicleContext = {
      quizName,
      players: playerStats,
      awards: baseAnalysis.awards,
      hardestQ,
      totalQuestions,
      houseCup: baseAnalysis.houseCup,
    }
    // Le discours de Dumbledore est plus long (et les modèles "thinking" consomment des tokens)
    const geminiOut = await tryGenerateGeminiChronicle(
      isHarryPotter
        ? buildHarryPotterPrompt(promptContext)
        : isRetro
        ? buildRetroPrompt(promptContext)
        : buildLoveActuallyPrompt(promptContext),
      isHarryPotter ? 1500 : 450
    )

    const finalPayload: GameAnalysisPayload = geminiOut
      ? {
          ...baseAnalysis,
          headline: geminiOut.headline,
          chronicle: geminiOut.chronicle,
          source: 'gemini',
        }
      : baseAnalysis

    analysisCache.set(cacheKey, finalPayload)
    return NextResponse.json(finalPayload)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal error' },
      { status: 500 }
    )
  }
}
