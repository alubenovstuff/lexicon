/**
 * Repeating background wallpaper for the "teens" (Горен курс) lexicon theme.
 * Academic and tech motifs — graduation cap, diploma, formulas, laptop,
 * calculator, smartphone, basketball, headphones — in a cool, mature palette.
 */
export default function TeensPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: 0.1 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <pattern id="teens-bg" x="0" y="0" width="560" height="560" patternUnits="userSpaceOnUse">

            {/* ── GRADUATION CAP — top-left ── */}
            <g transform="translate(76, 82)">
              {/* Board (rhombus seen at angle) */}
              <polygon points="0,-42 58,-20 0,4 -58,-20" fill="#1A1B2E" />
              <polygon points="0,-42 58,-20 0,4 -58,-20" fill="none" stroke="#4C6EF5" strokeWidth="1.5" />
              {/* Cap body */}
              <rect x="-20" y="4" width="40" height="14" rx="2" fill="#263238" />
              <ellipse cx="0" cy="18" rx="20" ry="5" fill="#1A1B2E" />
              {/* Tassel button */}
              <circle cx="58" cy="-20" r="7" fill="#FCC419" />
              {/* Tassel string */}
              <line x1="58" y1="-13" x2="58" y2="15" stroke="#FCC419" strokeWidth="3" strokeLinecap="round" />
              <line x1="58" y1="15" x2="43" y2="15" stroke="#FCC419" strokeWidth="3" strokeLinecap="round" />
              {/* Tassel fringe */}
              <line x1="37" y1="15" x2="33" y2="30" stroke="#FCC419" strokeWidth="2" strokeLinecap="round" />
              <line x1="39" y1="15" x2="37" y2="32" stroke="#FCC419" strokeWidth="2" strokeLinecap="round" />
              <line x1="41" y1="15" x2="41" y2="33" stroke="#FCC419" strokeWidth="2" strokeLinecap="round" />
              <line x1="43" y1="15" x2="45" y2="32" stroke="#FCC419" strokeWidth="2" strokeLinecap="round" />
              <line x1="45" y1="15" x2="49" y2="30" stroke="#FCC419" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* ── LAPTOP — top-right ── */}
            <g transform="translate(378, 46)">
              {/* Screen frame */}
              <rect x="4" y="0" width="96" height="70" rx="6" fill="#1A1B2E" />
              {/* Screen */}
              <rect x="9" y="5" width="86" height="60" rx="3" fill="#4C6EF5" />
              {/* Code lines */}
              <rect x="16" y="14" width="46" height="4"   rx="2" fill="rgba(255,255,255,0.85)" />
              <rect x="21" y="22" width="62" height="3.5" rx="2" fill="rgba(255,255,255,0.5)"  />
              <rect x="21" y="29" width="38" height="3.5" rx="2" fill="rgba(255,255,255,0.75)" />
              <rect x="21" y="36" width="54" height="3.5" rx="2" fill="rgba(255,255,255,0.5)"  />
              <rect x="21" y="43" width="28" height="3.5" rx="2" fill="rgba(255,255,255,0.85)" />
              <rect x="21" y="50" width="48" height="3.5" rx="2" fill="rgba(255,255,255,0.4)"  />
              {/* Camera dot */}
              <circle cx="52" cy="3" r="2.5" fill="rgba(255,255,255,0.4)" />
              {/* Base/keyboard */}
              <rect x="0" y="70" width="104" height="13" rx="5" fill="#263238" />
              <rect x="32" y="76" width="40" height="5"  rx="3" fill="#37474F" />
            </g>

            {/* ── MATH FORMULAS — scattered as text ── */}
            <text x="210" y="87"  fontSize="21" fontWeight="bold" fontStyle="italic" fill="#1A1B2E" fontFamily="Georgia, serif">E = mc²</text>
            <text x="35"  y="198" fontSize="16" fontWeight="bold" fontStyle="italic" fill="#1A1B2E" fontFamily="Georgia, serif">a² + b² = c²</text>
            <text x="508" y="158" fontSize="30" fill="#4C6EF5" fontFamily="Georgia, serif">∞</text>
            <text x="242" y="318" fontSize="19" fontStyle="italic" fill="#1A1B2E" fontFamily="Georgia, serif">∫ f(x)dx</text>
            <text x="142" y="370" fontSize="17" fontWeight="bold" fontStyle="italic" fill="#1A1B2E" fontFamily="Georgia, serif">F = ma</text>
            <text x="488" y="385" fontSize="28" fill="#12B886" fontFamily="Georgia, serif">π</text>
            <text x="362" y="415" fontSize="16" fill="#1A1B2E" fontFamily="Georgia, serif">Σ xᵢ / n</text>

            {/* ── DIPLOMA SCROLL — left-center ── */}
            <g transform="translate(32, 272)">
              {/* Scroll body */}
              <rect x="14" y="0" width="88" height="65" fill="#FFF8E1" />
              {/* Left roll */}
              <ellipse cx="14" cy="32" rx="12" ry="32" fill="#FFE082" />
              <ellipse cx="14" cy="32" rx="6"  ry="32" fill="#FFD740" />
              {/* Right roll */}
              <ellipse cx="102" cy="32" rx="12" ry="32" fill="#FFE082" />
              <ellipse cx="102" cy="32" rx="6"  ry="32" fill="#FFD740" />
              {/* Header rule */}
              <line x1="24" y1="12" x2="92" y2="12" stroke="#8D6E63" strokeWidth="3" />
              {/* Text lines */}
              <line x1="24" y1="24" x2="92" y2="24" stroke="#BDBDBD" strokeWidth="2" />
              <line x1="24" y1="33" x2="92" y2="33" stroke="#BDBDBD" strokeWidth="2" />
              <line x1="24" y1="42" x2="74" y2="42" stroke="#BDBDBD" strokeWidth="2" />
              {/* Wax seal */}
              <circle cx="58" cy="55" r="11" fill="#B71C1C" />
              <polygon
                points="58,45 60.5,51 67,51 62,55.5 64,62 58,58 52,62 54,55.5 49,51 55.5,51"
                fill="#FFD740"
              />
            </g>

            {/* ── DRAFTING COMPASS — center ── */}
            <g transform="translate(210, 188)">
              {/* Left leg */}
              <line x1="0" y1="0" x2="-20" y2="58" stroke="#455A64" strokeWidth="4.5" strokeLinecap="round" />
              {/* Right leg */}
              <line x1="0" y1="0" x2="20" y2="58" stroke="#455A64" strokeWidth="4.5" strokeLinecap="round" />
              {/* Hinge */}
              <circle cx="0" cy="0" r="8" fill="#FCC419" />
              <circle cx="0" cy="0" r="4" fill="#E6A800" />
              {/* Left spike */}
              <line x1="-20" y1="58" x2="-22" y2="68" stroke="#9E9E9E" strokeWidth="3" strokeLinecap="round" />
              {/* Right pencil tip */}
              <rect x="17" y="57" width="6" height="14" rx="1" fill="#7986CB" />
              <polygon points="17,71 23,71 20,79" fill="#1A1B2E" />
              {/* Arc drawn by compass */}
              <path d="M-22,68 A72,72 0 0,1 20,72" fill="none" stroke="#4C6EF5" strokeWidth="1.8" strokeDasharray="5,4" />
            </g>

            {/* ── CALCULATOR — right-center ── */}
            <g transform="translate(392, 200)">
              {/* Body */}
              <rect x="0" y="0" width="70" height="98" rx="9" fill="#1A1B2E" />
              {/* Display */}
              <rect x="6" y="8" width="58" height="22" rx="4" fill="#B2DFDB" />
              <text x="58" y="25" fontSize="12" fill="#004D40" textAnchor="end" fontFamily="monospace" fontWeight="bold">3.14159</text>
              {/* Button grid: rows 0-3, cols 0-3 */}
              {[0, 1, 2, 3].flatMap(row =>
                [0, 1, 2, 3].map(col => (
                  <rect
                    key={`calc-${row}-${col}`}
                    x={7 + col * 15} y={36 + row * 15}
                    width="11" height="11" rx="2.5"
                    fill={row === 0 ? '#4C6EF5' : col === 3 ? '#c62828' : '#37474F'}
                  />
                ))
              )}
            </g>

            {/* ── SMARTPHONE — right side ── */}
            <g transform="translate(464, 292)">
              {/* Body */}
              <rect x="0" y="0" width="52" height="95" rx="11" fill="#212121" />
              {/* Screen */}
              <rect x="3" y="5" width="46" height="80" rx="9" fill="#4C6EF5" />
              {/* Dynamic island */}
              <rect x="16" y="7" width="20" height="5" rx="2.5" fill="#212121" />
              {/* App icon grid */}
              {[0, 1, 2, 3].flatMap(row =>
                [0, 1, 2].map(col => (
                  <rect
                    key={`app-${row}-${col}`}
                    x={9 + col * 14} y={22 + row * 14}
                    width="10" height="10" rx="2.5"
                    fill="rgba(255,255,255,0.3)"
                  />
                ))
              )}
              {/* Home indicator */}
              <rect x="17" y="88" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.5)" />
            </g>

            {/* ── BASKETBALL — bottom-left ── */}
            <g transform="translate(82, 434)">
              <circle cx="0" cy="0" r="38" fill="#EF6C00" stroke="#4E342E" strokeWidth="2.5" />
              <path d="M-38,0 Q-20,-34 0,-38 Q20,-34 38,0"  fill="none" stroke="#4E342E" strokeWidth="2.5" />
              <path d="M-38,0 Q-20,34 0,38 Q20,34 38,0"    fill="none" stroke="#4E342E" strokeWidth="2.5" />
              <line x1="0" y1="-38" x2="0" y2="38"         stroke="#4E342E" strokeWidth="2.5" />
              <path d="M-26,-28 Q0,-40 26,-28" fill="none" stroke="#4E342E" strokeWidth="2" />
              <path d="M-26,28 Q0,40 26,28"   fill="none" stroke="#4E342E" strokeWidth="2" />
            </g>

            {/* ── HEADPHONES — bottom-center ── */}
            <g transform="translate(274, 440)">
              {/* Headband arc */}
              <path d="M-44,0 Q-46,-70 0,-73 Q46,-70 44,0" fill="none" stroke="#37474F" strokeWidth="9" strokeLinecap="round" />
              {/* Pad on band */}
              <ellipse cx="0" cy="-71" rx="13" ry="6" fill="#455A64" />
              {/* Left ear cup */}
              <ellipse cx="-44" cy="0" rx="20" ry="24" fill="#4C6EF5" />
              <ellipse cx="-44" cy="0" rx="11" ry="14" fill="#3B5BDB" />
              {/* Right ear cup */}
              <ellipse cx="44" cy="0" rx="20" ry="24" fill="#4C6EF5" />
              <ellipse cx="44" cy="0" rx="11" ry="14" fill="#3B5BDB" />
              {/* Cable from left cup */}
              <path d="M-44,24 Q-44,42 -32,48" fill="none" stroke="#37474F" strokeWidth="3" strokeLinecap="round" />
              <circle cx="-30" cy="50" r="5" fill="#FCC419" />
            </g>

            {/* ── LIGHTNING BOLTS ── */}
            <g transform="translate(178, 450)">
              <polygon points="10,0 3,18 9,18 2,36 20,14 14,14 21,0" fill="#FCC419" />
            </g>
            <g transform="translate(418, 460)">
              <polygon points="9,0 3,16 8,16 1,32 18,12 12,12 18,0" fill="#FCC419" />
            </g>
            <g transform="translate(352, 88)" opacity="0.75">
              <polygon points="7,0 2,12 6,12 1,24 14,9 9,9 14,0" fill="#FCC419" />
            </g>

            {/* ── STARS ── */}
            <g transform="translate(192, 152)">
              <polygon points="0,-13 3.5,-5 12,-5 5.5,1 8,10 0,4.5 -8,10 -5.5,1 -12,-5 -3.5,-5" fill="#FCC419" />
            </g>
            <g transform="translate(48, 150)">
              <polygon points="0,-11 3,-4 10,-4 4.5,0.5 7,9 0,4 -7,9 -4.5,0.5 -10,-4 -3,-4" fill="#FCC419" />
            </g>
            <g transform="translate(492, 50)">
              <polygon points="0,-12 3.5,-4.5 11,-4.5 5,0.5 8,10 0,4.5 -8,10 -5,0.5 -11,-4.5 -3.5,-4.5" fill="#FCC419" />
            </g>
            <g transform="translate(50, 378)" opacity="0.8">
              <polygon points="0,-10 2.5,-3.5 9,-3.5 4,0.5 6,8 0,3.5 -6,8 -4,0.5 -9,-3.5 -2.5,-3.5" fill="#4C6EF5" />
            </g>
            <g transform="translate(342, 256)">
              <polygon points="0,-9 2,-3 8,-3 3.5,0.5 5.5,7.5 0,3.5 -5.5,7.5 -3.5,0.5 -8,-3 -2,-3" fill="#12B886" />
            </g>
            <g transform="translate(160, 255)" opacity="0.7">
              <polygon points="0,-8 2,-2.5 7.5,-2.5 3,0.5 5,7 0,3 -5,7 -3,0.5 -7.5,-2.5 -2,-2.5" fill="#FCC419" />
            </g>

          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#teens-bg)" />
      </svg>
    </div>
  )
}
