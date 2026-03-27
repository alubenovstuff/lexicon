/**
 * Repeating background wallpaper for the "primary" (1–4 клас) lexicon theme.
 * Renders absolutely behind all content at very low opacity.
 */
export default function SchoolPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: 0.11 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <pattern id="school-bg" x="0" y="0" width="560" height="560" patternUnits="userSpaceOnUse">

            {/* ── YELLOW PENCIL — top-left, tilted ── */}
            <g transform="rotate(-28, 88, 155)">
              <rect x="74" y="42" width="28" height="16" rx="3" fill="#FFAACC" />
              <rect x="74" y="57" width="28" height="7" fill="#C0C0C0" />
              <rect x="74" y="64" width="28" height="130" fill="#FFD740" />
              <line x1="88" y1="64" x2="88" y2="194" stroke="#E8B800" strokeWidth="1.5" opacity="0.4" />
              <polygon points="74,194 102,194 88,222" fill="#D4A870" />
              <polygon points="82,212 94,212 88,222" fill="#444" />
            </g>

            {/* ── RULER — center, slight tilt ── */}
            <g transform="rotate(6, 285, 215)">
              <rect x="155" y="203" width="260" height="30" rx="4" fill="#B3E5FC" stroke="#4FC3F7" strokeWidth="1.5" />
              {[175,195,215,235,255,275,295,315,335,355,375,395].map((x, i) => (
                <line key={x} x1={x} y1="203" x2={x} y2={i % 2 === 0 ? 215 : 211} stroke="#29B6F6" strokeWidth="1.2" />
              ))}
              {[175,215,255,295,335,375].map((x, i) => (
                <text key={x} x={x - 2} y="228" fontSize="8" fill="#29B6F6" fontFamily="sans-serif">{i + 1}</text>
              ))}
            </g>

            {/* ── SET SQUARE / TRIANGLE — top-right ── */}
            <g transform="rotate(-10, 420, 108)">
              <polygon
                points="390,55 470,185 310,185"
                fill="rgba(255,152,0,0.12)"
                stroke="#FFA726"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <polyline points="317,177 317,163 331,163" fill="none" stroke="#FFA726" strokeWidth="1.5" />
            </g>

            {/* ── RED CRAYON — right side ── */}
            <g transform="rotate(18, 440, 355)">
              <rect x="428" y="282" width="22" height="8" rx="2" fill="#E0E0E0" />
              <rect x="430" y="290" width="18" height="5" rx="1" fill="#B71C1C" />
              <rect x="430" y="295" width="18" height="90" fill="#EF5350" />
              <rect x="428" y="330" width="22" height="35" rx="1" fill="#C62828" />
              <rect x="430" y="385" width="18" height="25" fill="#EF5350" />
              <polygon points="430,410 448,410 439,430" fill="#FF8A65" />
            </g>

            {/* ── BLUE/INDIGO PENCIL — bottom-left ── */}
            <g transform="rotate(16, 130, 400)">
              <rect x="118" y="325" width="24" height="14" rx="3" fill="#CE93D8" />
              <rect x="118" y="339" width="24" height="6" fill="#9E9E9E" />
              <rect x="118" y="345" width="24" height="110" fill="#7986CB" />
              <line x1="130" y1="345" x2="130" y2="455" stroke="#5C6BC0" strokeWidth="1.5" opacity="0.4" />
              <polygon points="118,455 142,455 130,480" fill="#BCAAA4" />
              <polygon points="125,470 135,470 130,480" fill="#333" />
            </g>

            {/* ── GREEN CRAYON — bottom-center ── */}
            <g transform="rotate(-22, 285, 420)">
              <rect x="273" y="370" width="22" height="8" rx="2" fill="#E0E0E0" />
              <rect x="275" y="378" width="18" height="5" rx="1" fill="#1B5E20" />
              <rect x="275" y="383" width="18" height="80" fill="#4CAF50" />
              <rect x="273" y="415" width="22" height="28" rx="1" fill="#388E3C" />
              <polygon points="275,463 293,463 284,482" fill="#81C784" />
            </g>

            {/* ── ERASER — lower-right area ── */}
            <g transform="rotate(-14, 360, 455)">
              <rect x="305" y="442" width="80" height="34" rx="6" fill="#F48FB1" />
              <rect x="305" y="442" width="80" height="9" rx="4" fill="#E91E8C" />
            </g>

            {/* ── STARS ── */}
            <g transform="translate(252, 65)">
              <polygon points="0,-15 4,-6 13,-6 6,0 9,11 0,5.5 -9,11 -6,0 -13,-6 -4,-6" fill="#FFD740" />
            </g>
            <g transform="translate(490, 285) rotate(12)">
              <polygon points="0,-12 3,-5 11,-5 5,0.5 7.5,9 0,4.5 -7.5,9 -5,0.5 -11,-5 -3,-5" fill="#FFD740" />
            </g>
            <g transform="translate(55, 295) rotate(-8)">
              <polygon points="0,-11 3,-4 10,-4 4.5,0.5 7,8.5 0,4 -7,8.5 -4.5,0.5 -10,-4 -3,-4" fill="#FFEE58" />
            </g>
            <g transform="translate(390, 510) rotate(5)">
              <polygon points="0,-10 2.5,-3.5 9,-3.5 4,0.5 6,8 0,3.5 -6,8 -4,0.5 -9,-3.5 -2.5,-3.5" fill="#FFD740" />
            </g>

            {/* ── PAINT BLOBS (small circles) ── */}
            <circle cx="230" cy="345" r="9" fill="#66BB6A" />
            <circle cx="248" cy="356" r="6" fill="#EF5350" />
            <circle cx="217" cy="358" r="7" fill="#42A5F5" />
            <circle cx="238" cy="367" r="5" fill="#FFA726" />

            {/* ── SMALL TRIANGLE (set square 2) — top-center ── */}
            <g transform="rotate(5, 310, 90)">
              <polygon
                points="310,45 360,135 260,135"
                fill="rgba(130,200,255,0.15)"
                stroke="#81D4FA"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>

            {/* ── PENCIL SHAVINGS — decorative spiral ── */}
            <g transform="translate(475, 100) rotate(-20)" opacity="0.6">
              <path d="M 0,0 Q 10,8 0,16 Q -8,24 0,32" fill="none" stroke="#FFD740" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 6,0 Q 16,8 6,16 Q -2,24 6,32" fill="none" stroke="#D4A870" strokeWidth="1.5" strokeLinecap="round" />
            </g>

          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#school-bg)" />
      </svg>
    </div>
  )
}
