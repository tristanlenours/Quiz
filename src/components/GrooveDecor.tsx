/**
 * Décor de Noël de « Downing Street Groove » (D73) : sapin illuminé, guirlande lumineuse et neige.
 * Purement décoratif (aria-hidden), positions déterministes pour ne pas casser l'hydratation.
 * Les lumières s'éteignent quand la secrétaire ouvre la porte (`lit = false`).
 */

const BULB_COLORS = ['#f43f5e', '#fbbf24', '#22c55e', '#38bdf8', '#e879f9']

const ORNAMENTS: Array<{ x: number; y: number; r: number; c: string }> = [
  { x: 52, y: 52, r: 3.6, c: '#f43f5e' },
  { x: 70, y: 62, r: 3.2, c: '#fbbf24' },
  { x: 40, y: 86, r: 4, c: '#38bdf8' },
  { x: 62, y: 80, r: 3.4, c: '#f43f5e' },
  { x: 84, y: 94, r: 4, c: '#fbbf24' },
  { x: 28, y: 122, r: 4.2, c: '#fbbf24' },
  { x: 50, y: 112, r: 3.6, c: '#e879f9' },
  { x: 74, y: 120, r: 4.2, c: '#f43f5e' },
  { x: 96, y: 130, r: 3.8, c: '#38bdf8' },
  { x: 60, y: 132, r: 3.4, c: '#22c55e' },
]

export function ChristmasTree({
  className = '',
  lit = true,
  withPresents = true,
}: {
  className?: string
  lit?: boolean
  withPresents?: boolean
}) {
  return (
    <svg
      viewBox="0 0 120 175"
      className={className}
      aria-hidden="true"
      data-testid="groove-christmas-tree"
    >
      <defs>
        <radialGradient id="groove-tree-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity={lit ? 0.35 : 0} />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="95" rx="60" ry="80" fill="url(#groove-tree-glow)" />
      <rect x="52" y="138" width="16" height="18" rx="2" fill="#78350f" />
      <polygon points="60,16 22,68 98,68" fill="#166534" />
      <polygon points="60,40 14,104 106,104" fill="#15803d" />
      <polygon points="60,72 4,142 116,142" fill="#16a34a" />
      {/* Ombres des étages */}
      <polygon points="60,16 60,68 98,68" fill="#14532d" opacity="0.35" />
      <polygon points="60,40 60,104 106,104" fill="#14532d" opacity="0.35" />
      <polygon points="60,72 60,142 116,142" fill="#14532d" opacity="0.35" />
      {/* Guirlande dorée */}
      <path
        d="M34 60 Q60 72 86 56 M24 96 Q62 112 98 90 M14 132 Q60 150 108 124"
        stroke="#fcd34d"
        strokeWidth="2.2"
        fill="none"
        opacity="0.9"
      />
      {ORNAMENTS.map((o, i) => (
        <circle
          key={i}
          cx={o.x}
          cy={o.y}
          r={o.r}
          fill={lit ? o.c : '#334155'}
          className={lit ? 'groove-twinkle' : undefined}
          style={{ animationDelay: `${(i % 5) * 0.35}s` }}
        />
      ))}
      {/* Étoile */}
      <polygon
        points="60,2 64,12 75,12 66,18 69,29 60,22 51,29 54,18 45,12 56,12"
        fill={lit ? '#facc15' : '#64748b'}
        className={lit ? 'groove-twinkle' : undefined}
      />
      {withPresents && (
        <>
          <rect x="16" y="146" width="26" height="22" rx="2" fill="#dc2626" />
          <rect x="27" y="146" width="4" height="22" fill="#fde68a" />
          <rect x="16" y="154" width="26" height="4" fill="#fde68a" />
          <rect x="78" y="150" width="24" height="18" rx="2" fill="#2563eb" />
          <rect x="88" y="150" width="4" height="18" fill="#f8fafc" />
          <rect x="78" y="157" width="24" height="4" fill="#f8fafc" />
          <rect x="46" y="156" width="28" height="14" rx="2" fill="#16a34a" />
          <rect x="58" y="156" width="4" height="14" fill="#fca5a5" />
        </>
      )}
    </svg>
  )
}

/** Guirlande lumineuse horizontale, à poser en haut d'un bloc `relative`. */
export function Garland({
  bulbs = 18,
  lit = true,
  className = '',
}: {
  bulbs?: number
  lit?: boolean
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-7 ${className}`}
    >
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 w-full h-5"
      >
        <path
          d="M0 1 Q12.5 9 25 1 Q37.5 9 50 1 Q62.5 9 75 1 Q87.5 9 100 1"
          stroke="#14532d"
          strokeWidth="1.2"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute inset-x-0 top-0 flex justify-between px-1">
        {Array.from({ length: bulbs }, (_, i) => {
          // Suit la courbe du fil : 4 festons sur toute la largeur
          const t = (i + 0.5) / bulbs
          const sag = Math.abs(Math.sin(t * Math.PI * 4))
          const color = BULB_COLORS[i % BULB_COLORS.length]
          return (
            <span
              key={i}
              className={`block w-2.5 h-3.5 rounded-full ${lit ? 'groove-twinkle' : ''}`}
              style={{
                marginTop: `${(2 + sag * 9) / 16}rem`,
                background: lit ? color : '#334155',
                boxShadow: lit ? `0 0 8px 2px ${color}` : 'none',
                animationDelay: `${(i % 4) * 0.4}s`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

/** Neige qui tombe derrière le contenu (à placer dans un parent `relative overflow-hidden`). */
export function Snowfall({ flakes = 26 }: { flakes?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {Array.from({ length: flakes }, (_, i) => {
        const size = 3 + (i % 4)
        return (
          <span
            key={i}
            className="groove-snowflake absolute rounded-full bg-white"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              width: size,
              height: size,
              opacity: 0.35 + (i % 3) * 0.2,
              animationDuration: `${7 + (i % 5) * 1.7}s`,
              animationDelay: `${-((i * 1.3) % 9)}s`,
            }}
          />
        )
      })}
    </div>
  )
}
