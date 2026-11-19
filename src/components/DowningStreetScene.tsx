/**
 * Décor de la scène de danse de Downing Street Groove (D75) : couloir aux murs crème et cadres
 * dorés, double porte blanche où apparaît la secrétaire, escalier aux portraits noir et blanc
 * avec rampe en fer forgé. Dessins originaux en SVG, purement décoratifs (aria-hidden).
 */
import { DoorState, isLadyPresent } from '@/groove'

/** La secrétaire, dossiers serrés contre elle, qui observe et juge. */
export function StaffLady({
  className = '',
  judging = false,
  box,
}: {
  className?: string
  /** Elle s'attarde : un sourcil levé, la moue encore plus pincée */
  judging?: boolean
  /** Position quand elle est dessinée à l'intérieur d'un autre SVG */
  box?: { x: number; y: number; width: number; height: number }
}) {
  return (
    <svg
      viewBox="0 0 100 230"
      className={className}
      {...box}
      aria-hidden="true"
      data-testid="groove-staff-lady"
      data-judging={judging ? 'true' : 'false'}
    >
      {/* Cheveux (carré cendré) */}
      <ellipse cx="50" cy="36" rx="23" ry="25" fill="#c8b68f" />
      <rect x="27" y="36" width="46" height="24" rx="8" fill="#c8b68f" />
      {/* Visage */}
      <ellipse cx="50" cy="44" rx="15.5" ry="18.5" fill="#f2d5c0" />
      <path
        d="M34 34 Q50 18 66 34 Q58 26 50 28 Q42 26 34 34 Z"
        fill="#b9a67c"
      />
      {/* Sourcils froncés */}
      <line
        x1="39"
        y1="37"
        x2="47"
        y2="39.5"
        stroke="#6b5a3e"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {judging ? (
        <line
          x1="53"
          y1="37.5"
          x2="61"
          y2="33"
          stroke="#6b5a3e"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : (
        <line
          x1="61"
          y1="37"
          x2="53"
          y2="39.5"
          stroke="#6b5a3e"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
      {/* Regard fixe */}
      <ellipse cx="43.5" cy="43.5" rx="2" ry="1.7" fill="#1f2937" />
      <ellipse cx="56.5" cy="43.5" rx="2" ry="1.7" fill="#1f2937" />
      <path
        d="M49 46 L48 51 L51 51"
        stroke="#d4a98f"
        strokeWidth="1.3"
        fill="none"
      />
      {/* Bouche pincée */}
      <path
        d={judging ? 'M44 56 Q50 53.5 56 56' : 'M45 55.5 L55 55.5'}
        stroke="#9b4d55"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Cou */}
      <rect x="45" y="61" width="10" height="9" fill="#ecc9b2" />
      {/* Chemisier violine */}
      <path
        d="M22 76 Q26 68 45 68 L50 76 L55 68 Q74 68 78 76 L74 132 L26 132 Z"
        fill="#9d2a6c"
      />
      <path d="M45 68 L50 80 L55 68" fill="#f2d5c0" />
      {/* Bras croisés sur les dossiers */}
      <path d="M24 78 L20 118 Q22 124 30 122 L36 96" fill="#8a2160" />
      <path d="M76 78 L80 118 Q78 124 70 122 L64 96" fill="#8a2160" />
      <g transform="rotate(-7 50 104)">
        <rect x="30" y="86" width="40" height="34" rx="2" fill="#111827" />
        <rect x="32" y="90" width="40" height="33" rx="2" fill="#1f2937" />
        <line
          x1="36"
          y1="98"
          x2="66"
          y2="98"
          stroke="#374151"
          strokeWidth="1.5"
        />
      </g>
      <ellipse cx="31" cy="118" rx="5" ry="4" fill="#f2d5c0" />
      <ellipse cx="69" cy="116" rx="5" ry="4" fill="#f2d5c0" />
      {/* Jupe noire, collants foncés */}
      <path d="M27 130 L73 130 L77 188 L23 188 Z" fill="#0f172a" />
      <rect x="35" y="187" width="9" height="32" fill="#334155" />
      <rect x="56" y="187" width="9" height="32" fill="#334155" />
      <ellipse cx="39" cy="222" rx="8" ry="4" fill="#0b0b0f" />
      <ellipse cx="61" cy="222" rx="8" ry="4" fill="#0b0b0f" />
    </svg>
  )
}

const WALL_FRAMES = [
  { x: 290, y: 46, w: 110, h: 80, sky: '#9cc3d5', land: '#5b7f4a' },
  { x: 450, y: 56, w: 64, h: 82, sky: '#d9c7a1', land: '#7a5a3a' },
  { x: 560, y: 46, w: 110, h: 80, sky: '#c7d7c4', land: '#6d8b55' },
]

/** Main courante de l'escalier qui descend vers l'arrivée (à droite) */
const RAIL_START = { x: 760, y: 112 }
const RAIL_END = { x: 1170, y: 222 }
const railY = (x: number) =>
  RAIL_START.y +
  ((x - RAIL_START.x) * (RAIL_END.y - RAIL_START.y)) /
    (RAIL_END.x - RAIL_START.x)

const PORTRAITS: Array<{ x: number; y: number }> = []
for (let col = 0; col < 7; col++) {
  for (let row = 0; row < 3; row++) {
    const x = 770 + col * 56
    const y = 14 + col * 13 + row * 50
    if (y + 44 < railY(x + 20) - 10) PORTRAITS.push({ x, y })
  }
}

/** Le couloir du 10 Downing Street, porte du bureau à gauche, escalier à droite. */
export function CorridorBackdrop({
  doorState,
  className = '',
}: {
  doorState: DoorState
  className?: string
}) {
  const ladyThere = isLadyPresent(doorState)
  return (
    <svg
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden="true"
      data-testid="groove-corridor"
      data-door-state={doorState}
    >
      <defs>
        <linearGradient id="groove-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e9b4" />
          <stop offset="100%" stopColor="#e9d48f" />
        </linearGradient>
        <linearGradient id="groove-gilt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d77a" />
          <stop offset="50%" stopColor="#b8862b" />
          <stop offset="100%" stopColor="#f1cf6a" />
        </linearGradient>
        <radialGradient id="groove-room-glow" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#c9b27a" />
        </radialGradient>
      </defs>

      {/* Murs, corniche, lambris */}
      <rect x="0" y="0" width="1200" height="240" fill="url(#groove-wall)" />
      <rect x="0" y="0" width="1200" height="9" fill="#fbf6e2" />
      <rect x="0" y="9" width="1200" height="3" fill="#e2cf93" />
      <rect x="0" y="176" width="1200" height="64" fill="#f8f3e2" />
      <rect x="0" y="176" width="1200" height="3" fill="#e5d8b2" />
      {[250, 380, 510, 640].map((x) => (
        <rect
          key={x}
          x={x}
          y="188"
          width="110"
          height="40"
          fill="none"
          stroke="#e3d6ae"
          strokeWidth="2"
        />
      ))}
      <rect x="0" y="232" width="1200" height="8" fill="#d8c897" />

      {/* Double porte blanche du bureau */}
      <rect
        x="58"
        y="26"
        width="164"
        height="210"
        fill="#fbf8ee"
        stroke="#d9cdaa"
        strokeWidth="3"
      />
      <rect x="66" y="22" width="148" height="8" fill="#f3ecd6" />
      {ladyThere ? (
        <g>
          <rect
            x="74"
            y="42"
            width="132"
            height="192"
            fill="url(#groove-room-glow)"
          />
          <rect
            x="74"
            y="200"
            width="132"
            height="34"
            fill="#a68a55"
            opacity="0.6"
          />
          {/* Battants ouverts vers l'intérieur */}
          <polygon
            points="74,42 92,50 92,226 74,234"
            fill="#fffdf6"
            stroke="#e1d6b8"
            strokeWidth="2"
          />
          <polygon
            points="206,42 188,50 188,226 206,234"
            fill="#fffdf6"
            stroke="#e1d6b8"
            strokeWidth="2"
          />
          <g className="groove-appear">
            <StaffLady
              judging={doorState === 'lingering'}
              box={{ x: 102, y: 56, width: 76, height: 176 }}
            />
          </g>
        </g>
      ) : (
        <g className={doorState === 'warning' ? 'groove-rattle' : undefined}>
          <rect
            x="74"
            y="42"
            width="66"
            height="192"
            fill="#fffdf6"
            stroke="#e1d6b8"
            strokeWidth="2"
          />
          <rect
            x={doorState === 'warning' ? 143 : 140}
            y="42"
            width={doorState === 'warning' ? 63 : 66}
            height="192"
            fill="#fffdf6"
            stroke="#e1d6b8"
            strokeWidth="2"
          />
          {doorState === 'warning' && (
            <rect x="140" y="44" width="3" height="188" fill="#fff3c4" />
          )}
          {[74, 140].map((x) => (
            <g key={x}>
              <rect
                x={x + 10}
                y="56"
                width="46"
                height="70"
                fill="none"
                stroke="#e6dcc0"
                strokeWidth="2"
              />
              <rect
                x={x + 10}
                y="140"
                width="46"
                height="80"
                fill="none"
                stroke="#e6dcc0"
                strokeWidth="2"
              />
            </g>
          ))}
          <ellipse cx="134" cy="140" rx="3.5" ry="5" fill="#d4a62a" />
          <ellipse cx="148" cy="140" rx="3.5" ry="5" fill="#d4a62a" />
        </g>
      )}

      {/* Appliques et tableaux aux cadres dorés */}
      {[250, 720].map((x) => (
        <g key={x}>
          <rect x={x - 2} y="70" width="4" height="26" fill="#c79a3a" />
          <path
            d={`M${x - 10} 70 L${x + 10} 70 L${x + 6} 56 L${x - 6} 56 Z`}
            fill="#fff7dc"
            stroke="#d6c08a"
          />
        </g>
      ))}
      {WALL_FRAMES.map((f) => (
        <g key={f.x}>
          <rect
            x={f.x - 7}
            y={f.y - 7}
            width={f.w + 14}
            height={f.h + 14}
            fill="url(#groove-gilt)"
          />
          <rect x={f.x} y={f.y} width={f.w} height={f.h * 0.6} fill={f.sky} />
          <rect
            x={f.x}
            y={f.y + f.h * 0.6}
            width={f.w}
            height={f.h * 0.4}
            fill={f.land}
          />
        </g>
      ))}
      {/* Console et lampe */}
      <rect x="480" y="150" width="120" height="7" fill="#b8862b" />
      <rect x="488" y="157" width="5" height="19" fill="#8a6420" />
      <rect x="587" y="157" width="5" height="19" fill="#8a6420" />
      <rect x="536" y="132" width="8" height="18" fill="#d4c4a0" />
      <path
        d="M522 132 L558 132 L552 112 L528 112 Z"
        fill="#fff5d6"
        stroke="#dcc999"
      />

      {/* Portraits noir et blanc le long de l'escalier */}
      {PORTRAITS.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x}
            y={p.y}
            width="40"
            height="44"
            fill="#f3f4f6"
            stroke="#111827"
            strokeWidth="3"
          />
          <circle
            cx={p.x + 20}
            cy={p.y + 17}
            r="7"
            fill={i % 2 ? '#6b7280' : '#4b5563'}
          />
          <path
            d={`M${p.x + 8} ${p.y + 40} Q${p.x + 20} ${p.y + 22} ${p.x + 32} ${p.y + 40} Z`}
            fill="#374151"
          />
        </g>
      ))}

      {/* Escalier, rampe en fer forgé */}
      <polygon
        points={`${RAIL_START.x},${RAIL_START.y + 34} ${RAIL_END.x},${RAIL_END.y + 34} 1200,240 ${RAIL_START.x},240`}
        fill="#f8f3e2"
      />
      {Array.from({ length: 19 }, (_, i) => {
        const x = RAIL_START.x + 10 + i * 22
        const y = railY(x)
        return (
          <g key={i}>
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={y + 34}
              stroke="#1f2937"
              strokeWidth="2"
            />
            {i % 2 === 0 && (
              <path
                d={`M${x} ${y + 10} q 9 4 0 10 q -9 4 0 10`}
                stroke="#1f2937"
                strokeWidth="1.6"
                fill="none"
              />
            )}
          </g>
        )
      })}
      <line
        x1={RAIL_START.x}
        y1={RAIL_START.y}
        x2={RAIL_END.x}
        y2={RAIL_END.y}
        stroke="#3f2a14"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  )
}
