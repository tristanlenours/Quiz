/**
 * Commentaire humoristique de fin de partie solo (D66) : statistiques individuelles,
 * voix de chaque univers, prompt Gemini. Zéro spoil : aucune question ni réponse n'est lue ici.
 */

export interface SoloStats {
  displayName: string
  characterName: string | null
  questionCount: number
  correct: number
  wrong: number
  timeouts: number
  totalScore: number
  maxStreak: number
  /** Part moyenne du chrono utilisée sur les bonnes réponses (0 à 100), null sans bonne réponse */
  avgTimeUsedPct: number | null
  bestRound: { round: number; score: number } | null
  firstHalfCorrect: number
  secondHalfCorrect: number
}

type Tier = 'perfect' | 'great' | 'ok' | 'meh' | 'disaster'
type Trait = 'speedster' | 'slowpoke' | 'finisher' | 'fader' | 'ghost' | 'streak'


export function computeSoloStats(
  identity: { displayName: string; characterName: string | null },
  roundScores: Array<number | null>
): SoloStats {
  const n = roundScores.length
  let correct = 0
  let wrong = 0
  let timeouts = 0
  let streak = 0
  let maxStreak = 0
  const timeUsed: number[] = []
  let bestRound: SoloStats['bestRound'] = null
  const half = Math.ceil(n / 2)
  let firstHalfCorrect = 0
  let secondHalfCorrect = 0

  roundScores.forEach((score, i) => {
    if (score === null) {
      timeouts++
      streak = 0
      return
    }
    if (score > 0) {
      correct++
      streak++
      maxStreak = Math.max(maxStreak, streak)
      // Barème : 1000 instantané → 500 au bout du chrono (src/scoring.ts)
      timeUsed.push(Math.min(1, Math.max(0, (1000 - score) / 500)))
      if (!bestRound || score > bestRound.score) bestRound = { round: i + 1, score }
      if (i < half) firstHalfCorrect++
      else secondHalfCorrect++
    } else {
      wrong++
      streak = 0
    }
  })

  return {
    ...identity,
    questionCount: n,
    correct,
    wrong,
    timeouts,
    totalScore: roundScores.reduce<number>((s, v) => s + (v ?? 0), 0),
    maxStreak,
    avgTimeUsedPct:
      timeUsed.length > 0
        ? Math.round((timeUsed.reduce((s, v) => s + v, 0) / timeUsed.length) * 100)
        : null,
    bestRound,
    firstHalfCorrect,
    secondHalfCorrect,
  }
}

function tierOf(s: SoloStats): Tier {
  const ratio = s.questionCount ? s.correct / s.questionCount : 0
  if (ratio === 1) return 'perfect'
  if (ratio >= 0.75) return 'great'
  if (ratio >= 0.5) return 'ok'
  if (ratio >= 0.25) return 'meh'
  return 'disaster'
}

function traitsOf(s: SoloStats): Trait[] {
  const traits: Trait[] = []
  if (s.timeouts >= Math.max(2, Math.ceil(s.questionCount / 4))) traits.push('ghost')
  if (s.avgTimeUsedPct !== null && s.correct >= 2 && s.avgTimeUsedPct <= 25) traits.push('speedster')
  if (s.avgTimeUsedPct !== null && s.correct >= 2 && s.avgTimeUsedPct >= 70) traits.push('slowpoke')
  if (s.secondHalfCorrect >= s.firstHalfCorrect + 2) traits.push('finisher')
  if (s.firstHalfCorrect >= s.secondHalfCorrect + 2) traits.push('fader')
  if (s.maxStreak >= 4 && s.correct < s.questionCount) traits.push('streak')
  return traits
}

type Voice = {
  headline: Record<Tier, (s: SoloStats) => string>
  opener: Record<Tier, (s: SoloStats, who: string) => string>
  trait: Record<Trait, (s: SoloStats) => string>
  closer: Record<Tier, string>
}

const score = (s: SoloStats) => `${s.correct}/${s.questionCount}`

const LOVE_ACTUALLY_VOICE: Voice = {
  headline: {
    perfect: (s) => `💘 ${s.displayName} : un sans-faute, digne d'une déclaration en bonne et due forme`,
    great: (s) => `🎬 ${s.displayName} a presque tout bon, le réalisateur applaudit`,
    ok: (s) => `☕ ${s.displayName}, une moyenne honnête et une tasse de thé`,
    meh: (s) => `🌧️ ${s.displayName} a passé une soirée un peu pluvieuse`,
    disaster: (s) => `🫖 ${s.displayName} : le thé a refroidi avant la fin du quiz`,
  },
  opener: {
    perfect: (s, who) => `${who} boucle le quiz en ${score(s)} et ${s.totalScore} points : un sans-faute qui mériterait son propre film choral.`,
    great: (s, who) => `${who} termine à ${score(s)} pour ${s.totalScore} points, une prestation de premier rôle.`,
    ok: (s, who) => `${who} signe ${score(s)} et ${s.totalScore} points : ni le coup de foudre, ni la rupture.`,
    meh: (s, who) => `${who} s'arrête à ${score(s)} et ${s.totalScore} points, avec la mine de quelqu'un qui attendait un autre cadeau.`,
    disaster: (s, who) => `${who} repart avec ${score(s)} et ${s.totalScore} points : à ce stade, ce n'est plus un quiz, c'est une histoire d'amour compliquée.`,
  },
  trait: {
    speedster: (s) => `Les doigts ont été plus rapides que la pensée : ${s.avgTimeUsedPct} % du chrono en moyenne sur les bonnes réponses.`,
    slowpoke: (s) => `Chaque réponse a été mûrie comme une déclaration qu'on n'ose pas faire : ${s.avgTimeUsedPct} % du chrono en moyenne.`,
    finisher: () => `Démarrage timide, final en fanfare : la deuxième moitié a tout rattrapé.`,
    fader: () => `Un début de comédie romantique, puis le générique est arrivé un peu tôt.`,
    ghost: (s) => `${s.timeouts} manches laissées au chrono : la tête était visiblement ailleurs, sans doute amoureuse.`,
    streak: (s) => `Une série de ${s.maxStreak} bonnes réponses d'affilée, de quoi faire rougir un tube des fêtes.`,
  },
  closer: {
    perfect: 'Le générique peut défiler, il n’y a rien à couper au montage.',
    great: 'Encore un effort et c’est la fin heureuse.',
    ok: 'Un honnête second rôle, celui qu’on finit toujours par aimer.',
    meh: 'Pas de panique : dans ce genre de film, tout le monde finit par trouver quelqu’un.',
    disaster: 'Il reste l’essentiel : l’amour est partout, paraît-il.',
  },
}

const HARRY_POTTER_VOICE: Voice = {
  headline: {
    perfect: (s) => `⚡ ${s.displayName} a tout bon, je crois que ça fait des points pour une maison`,
    great: (s) => `🦉 ${s.displayName} presque parfait, le choixpeau est content, ou l'inverse`,
    ok: (s) => `🧹 ${s.displayName} fait une moyenne, comme au sport avec les balais`,
    meh: (s) => `🕯️ ${s.displayName} n'a pas tout compris, comme moi dans le 4`,
    disaster: (s) => `🧙 ${s.displayName} a fini aux cuisines, ou à l'infirmerie, enfin en bas`,
  },
  opener: {
    perfect: (s, who) => `${who} fait ${score(s)} et ${s.totalScore} points, c'est le score d'un sorcier, ou d'un très bon Moldu, je ne sais plus lequel est le meilleur.`,
    great: (s, who) => `${who} termine à ${score(s)} pour ${s.totalScore} points : on dirait la fille avec les cheveux, celle qui sait tout.`,
    ok: (s, who) => `${who} signe ${score(s)} et ${s.totalScore} points, ce qui est très bien pour quelqu'un qui n'a pas lu les livres, comme moi.`,
    meh: (s, who) => `${who} s'arrête à ${score(s)} et ${s.totalScore} points, il y a eu un sort mal lancé, peut-être le truc qui fait léviter.`,
    disaster: (s, who) => `${who} repart avec ${score(s)} et ${s.totalScore} points : c'est expliqué dans un des films, je crois, celui où il pleut.`,
  },
  trait: {
    speedster: (s) => `Réponses lancées plus vite qu'une petite balle dorée avec des ailes : ${s.avgTimeUsedPct} % du chrono en moyenne.`,
    slowpoke: (s) => `Chaque réponse a pris le temps d'un chaudron qui mijote : ${s.avgTimeUsedPct} % du chrono en moyenne.`,
    finisher: () => `La deuxième moitié a tout sauvé, comme quelqu'un à la fin d'un des films, je ne sais plus qui.`,
    fader: () => `Un début brillant, puis un détraqueur est passé, ces trucs qui aspirent la bonne humeur.`,
    ghost: (s) => `${s.timeouts} manches sans réponse : le téléphone a dû transplaner, ou un mot comme ça.`,
    streak: (s) => `${s.maxStreak} bonnes réponses d'affilée, c'est presque une prophétie.`,
  },
  closer: {
    perfect: 'Dix points pour, euh, la maison concernée.',
    great: 'Le château est fier, enfin les tableaux qui bougent.',
    ok: 'On se revoit à la gare, quai neuf et quelque chose.',
    meh: 'Retour à la bibliothèque pour réviser, le rayon interdit est par là, je crois.',
    disaster: 'Ce n’est pas grave, le grand barbu aussi a raté des examens, je crois.',
  },
}

const RETRO_2026_VOICE: Voice = {
  headline: {
    perfect: (s) => `🗞️ ${s.displayName} : un sans-faute, l'année 2026 n'a plus de secret`,
    great: (s) => `📈 ${s.displayName} a très bien suivi l'actualité, à la une ce soir`,
    ok: (s) => `📰 ${s.displayName} a lu les gros titres, pas toujours les articles`,
    meh: (s) => `📵 ${s.displayName} a passé une partie de 2026 en mode avion`,
    disaster: (s) => `🛰️ ${s.displayName} rentre d'une année entière hors réseau`,
  },
  opener: {
    perfect: (s, who) => `${who} signe ${score(s)} et ${s.totalScore} points : une revue de presse sans une seule coquille.`,
    great: (s, who) => `${who} termine à ${score(s)} pour ${s.totalScore} points, un niveau d'abonné premium.`,
    ok: (s, who) => `${who} réalise ${score(s)} et ${s.totalScore} points, le niveau de quelqu'un qui scrolle les titres au réveil.`,
    meh: (s, who) => `${who} s'arrête à ${score(s)} et ${s.totalScore} points : l'actualité de 2026 a été suivie de très loin.`,
    disaster: (s, who) => `${who} repart avec ${score(s)} et ${s.totalScore} points, à croire que 2026 a eu lieu sans prévenir.`,
  },
  trait: {
    speedster: (s) => `Réponses au réflexe de breaking news : ${s.avgTimeUsedPct} % du chrono en moyenne.`,
    slowpoke: (s) => `Chaque réponse a été vérifiée comme une dépêche sensible : ${s.avgTimeUsedPct} % du chrono en moyenne.`,
    finisher: () => `Le joueur s'est réveillé en deuxième partie de journal.`,
    fader: () => `Excellent à la une, nettement moins dans les pages suivantes.`,
    ghost: (s) => `${s.timeouts} manches laissées au chrono : le direct a coupé plusieurs fois.`,
    streak: (s) => `${s.maxStreak} bonnes réponses d'affilée, digne d'un fil d'info en continu.`,
  },
  closer: {
    perfect: 'Rendez-vous l’an prochain pour la rétro 2027.',
    great: 'Encore un peu de veille et c’est la une assurée.',
    ok: 'Un abonnement aux notifications ne ferait pas de mal.',
    meh: 'Le récap de l’année est disponible en replay.',
    disaster: 'Bonne nouvelle : 2027 commence bientôt, tout le monde repart de zéro.',
  },
}

const NEUTRAL_VOICE: Voice = {
  headline: {
    perfect: (s) => `🏆 ${s.displayName} : sans-faute`,
    great: (s) => `🎯 ${s.displayName} frôle la perfection`,
    ok: (s) => `👍 ${s.displayName} tient la moyenne`,
    meh: (s) => `😅 ${s.displayName} a connu des jours meilleurs`,
    disaster: (s) => `🫠 ${s.displayName} a joué pour le plaisir`,
  },
  opener: {
    perfect: (s, who) => `${who} réalise un ${score(s)} pour ${s.totalScore} points, rien à redire.`,
    great: (s, who) => `${who} termine à ${score(s)} pour ${s.totalScore} points, très belle partie.`,
    ok: (s, who) => `${who} signe ${score(s)} et ${s.totalScore} points, une partie honnête.`,
    meh: (s, who) => `${who} s'arrête à ${score(s)} et ${s.totalScore} points, le quiz a résisté.`,
    disaster: (s, who) => `${who} repart avec ${score(s)} et ${s.totalScore} points : le quiz a gagné cette manche.`,
  },
  trait: {
    speedster: (s) => `Des réflexes de buzzer : ${s.avgTimeUsedPct} % du chrono en moyenne sur les bonnes réponses.`,
    slowpoke: (s) => `Beaucoup de réflexion : ${s.avgTimeUsedPct} % du chrono en moyenne.`,
    finisher: () => `Une deuxième moitié bien meilleure que la première.`,
    fader: () => `Un départ canon, une fin plus laborieuse.`,
    ghost: (s) => `${s.timeouts} manches laissées au chrono.`,
    streak: (s) => `${s.maxStreak} bonnes réponses d'affilée.`,
  },
  closer: {
    perfect: 'Chapeau.',
    great: 'Presque parfait.',
    ok: 'Pas mal du tout.',
    meh: 'La prochaine sera la bonne.',
    disaster: 'L’important, c’est de participer.',
  },
}

const VOICES: Record<string, Voice> = {
  love_actually: LOVE_ACTUALLY_VOICE,
  harry_potter: HARRY_POTTER_VOICE,
  retro_2026: RETRO_2026_VOICE,
}

export function buildDeterministicSoloComment(themeId: string, s: SoloStats) {
  const voice = VOICES[themeId] ?? NEUTRAL_VOICE
  const tier = tierOf(s)
  const who = s.characterName && s.characterName !== s.displayName
    ? `${s.displayName}, dans la peau de ${s.characterName},`
    : s.displayName
  const sentences = [voice.opener[tier](s, who)]
  for (const t of traitsOf(s).slice(0, 2)) sentences.push(voice.trait[t](s))
  if (s.bestRound && tier !== 'perfect') {
    sentences.push(`Meilleur moment : la manche ${s.bestRound.round}, à ${s.bestRound.score} points.`)
  }
  sentences.push(voice.closer[tier])
  return { headline: voice.headline[tier](s), chronicle: sentences.join(' ') }
}

const TONES: Record<string, string> = {
  love_actually:
    "Tu es le présentateur drôle et chaleureux d'une soirée Love Actually. Fais des clins d'œil au film et au personnage incarné, sans jamais citer une chanson, un artiste, un lieu, une fête, un objet, un plat, un instrument ou une réplique précise du film, ni d'autre personnage que celui incarné par le joueur.",
  harry_potter:
    "Tu es le directeur barbu d'une école de sorciers, mais quelqu'un qui n'a vu les films que de loin : très sûr de toi et très approximatif (« je crois », « ou l'inverse », « c'est expliqué dans un des films »). Bienveillant. Ne cite aucun lieu, objet, créature, sort, potion, couleur de maison, musique ni personnage précis, à part le personnage incarné par le joueur.",
  retro_2026:
    "Tu es un chroniqueur de revue de presse drôle et bienveillant qui conclut la rétro de l'année 2026. Le personnage incarné est une personnalité réelle : ne dis rien sur elle, aucune affirmation ni accusation, mentionne-la seulement comme le rôle choisi par le joueur. Ne cite aucun événement de l'année.",
}

export function buildSoloPrompt(themeId: string, quizName: string, s: SoloStats) {
  const tone =
    TONES[themeId] ?? 'Tu es un présentateur de quiz drôle et bienveillant.'
  return `${tone}

Un joueur vient de finir seul, chez lui, le quiz "${quizName}". Commente UNIQUEMENT sa performance individuelle, sans le comparer à personne.

Joueur : ${s.displayName}${s.characterName ? ` (incarne ${s.characterName})` : ''}
- Bonnes réponses : ${s.correct}/${s.questionCount} ; mauvaises : ${s.wrong} ; manches laissées au chrono : ${s.timeouts}
- Score : ${s.totalScore} points (maximum théorique ${s.questionCount * 1000})
- Plus longue série de bonnes réponses : ${s.maxStreak}
- Part moyenne du chrono utilisée sur les bonnes réponses : ${s.avgTimeUsedPct === null ? 'aucune bonne réponse' : `${s.avgTimeUsedPct} %`}
- Bonnes réponses en première moitié : ${s.firstHalfCorrect}, en seconde moitié : ${s.secondHalfCorrect}
${s.bestRound ? `- Meilleure manche : n° ${s.bestRound.round} (${s.bestRound.score} points)` : ''}

Rédige en français un JSON strict avec 2 clés :
- "headline": un titre drôle avec un emoji (max 90 caractères).
- "chronicle": 3 à 4 phrases qui taquinent gentiment le joueur sur ces chiffres. On taquine, on n'humilie jamais.
N'invente aucun chiffre. Ne parle d'aucune question ni d'aucune réponse du quiz : tu ne les connais pas.

Réponds UNIQUEMENT avec l'objet JSON valide, sans balises markdown.`
}
