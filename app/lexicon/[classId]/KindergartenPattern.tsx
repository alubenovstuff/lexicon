/**
 * Repeating background wallpaper for the "kindergarten" lexicon theme.
 * Warm, cheerful toys and nature motifs for children aged 3–6.
 * Renders absolutely behind all content at very low opacity.
 */
export default function KindergartenPattern() {
  const sunRays = [0, 45, 90, 135, 180, 225, 270, 315]
  const flowerAngles = [0, 60, 120, 180, 240, 300]

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: 0.13 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <pattern id="kinder-bg" x="0" y="0" width="560" height="560" patternUnits="userSpaceOnUse">

            {/* ── SUN with smiley — top-left ── */}
            <g transform="translate(75, 75)">
              {sunRays.map((angle) => {
                const rad = (angle * Math.PI) / 180
                return (
                  <line
                    key={angle}
                    x1={Math.cos(rad) * 38} y1={Math.sin(rad) * 38}
                    x2={Math.cos(rad) * 56} y2={Math.sin(rad) * 56}
                    stroke="#FFD740" strokeWidth="5" strokeLinecap="round"
                  />
                )
              })}
              <circle cx="0" cy="0" r="32" fill="#FFD740" />
              {/* Eyes */}
              <circle cx="-10" cy="-6" r="4.5" fill="#FF8F00" />
              <circle cx="10" cy="-6" r="4.5" fill="#FF8F00" />
              {/* Smile */}
              <path d="M -10,8 Q 0,18 10,8" fill="none" stroke="#FF8F00" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* ── PUFFY CLOUD 1 — top-right ── */}
            <g transform="translate(390, 55)">
              <circle cx="0" cy="16" r="16" fill="#FFFFFF" />
              <circle cx="22" cy="6"  r="22" fill="#FFFFFF" />
              <circle cx="50" cy="10" r="20" fill="#FFFFFF" />
              <circle cx="74" cy="16" r="16" fill="#FFFFFF" />
              <circle cx="-14" cy="20" r="13" fill="#FFFFFF" />
              <rect x="-14" y="18" width="102" height="20" fill="#FFFFFF" />
            </g>

            {/* ── SMALL CLOUD — top-center ── */}
            <g transform="translate(220, 90)">
              <circle cx="0" cy="10" r="12" fill="#FFFFFF" />
              <circle cx="17" cy="2"  r="16" fill="#FFFFFF" />
              <circle cx="37" cy="8"  r="13" fill="#FFFFFF" />
              <circle cx="52" cy="13" r="10" fill="#FFFFFF" />
              <rect x="0" y="12" width="62" height="14" fill="#FFFFFF" />
            </g>

            {/* ── TOY CAR — left side ── */}
            <g transform="translate(25, 355)">
              {/* Body */}
              <rect x="0" y="32" width="135" height="52" rx="14" fill="#FF7043" />
              {/* Cab */}
              <rect x="28" y="6"  width="78" height="38" rx="10" fill="#FF8A65" />
              {/* Windshield */}
              <rect x="35" y="12" width="64" height="26" rx="7"  fill="#B3E5FC" />
              {/* Door */}
              <rect x="38" y="40" width="44" height="28" rx="6" fill="#FF6E40" />
              {/* Door handle */}
              <circle cx="76" cy="55" r="3.5" fill="#FFD740" />
              {/* Headlight */}
              <ellipse cx="129" cy="52" rx="8" ry="6" fill="#FFF9C4" />
              {/* Wheels */}
              <circle cx="32" cy="84" r="22" fill="#37474F" />
              <circle cx="32" cy="84" r="11" fill="#78909C" />
              <circle cx="32" cy="84" r="4"  fill="#B0BEC5" />
              <circle cx="106" cy="84" r="22" fill="#37474F" />
              <circle cx="106" cy="84" r="11" fill="#78909C" />
              <circle cx="106" cy="84" r="4"  fill="#B0BEC5" />
            </g>

            {/* ── TEDDY BEAR — center ── */}
            <g transform="translate(272, 230)">
              {/* Ears */}
              <circle cx="-30" cy="-10" r="18" fill="#BCAAA4" />
              <circle cx="-30" cy="-10" r="10" fill="#A1887F" />
              <circle cx="30" cy="-10"  r="18" fill="#BCAAA4" />
              <circle cx="30" cy="-10"  r="10" fill="#A1887F" />
              {/* Head */}
              <circle cx="0" cy="0" r="38" fill="#BCAAA4" />
              {/* Eyes */}
              <circle cx="-13" cy="-9" r="7"  fill="#4E342E" />
              <circle cx="13"  cy="-9" r="7"  fill="#4E342E" />
              <circle cx="-11" cy="-11" r="2.5" fill="#FFFFFF" />
              <circle cx="15"  cy="-11" r="2.5" fill="#FFFFFF" />
              {/* Snout */}
              <ellipse cx="0" cy="14" rx="15" ry="10" fill="#A1887F" />
              {/* Nose */}
              <ellipse cx="0" cy="9" rx="7" ry="5" fill="#4E342E" />
              {/* Smile */}
              <path d="M -6,16 Q 0,23 6,16" fill="none" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round" />
              {/* Body */}
              <ellipse cx="0" cy="74" rx="33" ry="42" fill="#BCAAA4" />
              {/* Tummy */}
              <ellipse cx="0" cy="74" rx="18" ry="24" fill="#A1887F" />
              {/* Arms */}
              <ellipse cx="-40" cy="62" rx="12" ry="27" fill="#BCAAA4" transform="rotate(-18,-40,62)" />
              <ellipse cx="40"  cy="62" rx="12" ry="27" fill="#BCAAA4" transform="rotate(18,40,62)" />
              {/* Legs */}
              <ellipse cx="-18" cy="108" rx="14" ry="20" fill="#BCAAA4" />
              <ellipse cx="18"  cy="108" rx="14" ry="20" fill="#BCAAA4" />
              {/* Bow tie */}
              <polygon points="-16,36 -2,43 -16,50" fill="#FF8A80" />
              <polygon points="16,36 2,43 16,50"   fill="#FF8A80" />
              <circle cx="0" cy="43" r="6" fill="#FF5252" />
            </g>

            {/* ── RAINBOW — right area ── */}
            <g>
              <path d="M 372,482 A 78,78 0 0,0 528,482" fill="none" stroke="#9C27B0" strokeWidth="9" strokeLinecap="round" />
              <path d="M 380,482 A 70,70 0 0,0 520,482" fill="none" stroke="#2196F3" strokeWidth="9" strokeLinecap="round" />
              <path d="M 388,482 A 62,62 0 0,0 512,482" fill="none" stroke="#4CAF50" strokeWidth="9" strokeLinecap="round" />
              <path d="M 396,482 A 54,54 0 0,0 504,482" fill="none" stroke="#FFEB3B" strokeWidth="9" strokeLinecap="round" />
              <path d="M 404,482 A 46,46 0 0,0 496,482" fill="none" stroke="#FF9800" strokeWidth="9" strokeLinecap="round" />
              <path d="M 412,482 A 38,38 0 0,0 488,482" fill="none" stroke="#F44336" strokeWidth="9" strokeLinecap="round" />
            </g>

            {/* ── BALLOON 1 — right side ── */}
            <g transform="translate(425, 295)">
              <ellipse cx="0" cy="0" rx="24" ry="29" fill="#FF80AB" />
              <polygon points="-5,29 5,29 0,38" fill="#FF4081" />
              <path d="M 0,38 Q 8,55 -4,72 Q 6,89 0,105" fill="none" stroke="#FF4081" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="-7" cy="-11" rx="7" ry="5" fill="rgba(255,255,255,0.45)" transform="rotate(-25,-7,-11)" />
            </g>

            {/* ── BALLOON 2 ── */}
            <g transform="translate(462, 272)">
              <ellipse cx="0" cy="0" rx="21" ry="25" fill="#FFAB40" />
              <polygon points="-4,25 4,25 0,33" fill="#FF6D00" />
              <path d="M 0,33 Q -6,50 4,66 Q -4,82 0,98" fill="none" stroke="#FF6D00" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="-6" cy="-9" rx="6" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-25,-6,-9)" />
            </g>

            {/* ── FLOWER with stem — bottom-left ── */}
            <g transform="translate(82, 492)">
              {/* Stem */}
              <line x1="0" y1="0" x2="0" y2="38" stroke="#66BB6A" strokeWidth="5" strokeLinecap="round" />
              {/* Leaves */}
              <ellipse cx="-12" cy="22" rx="12" ry="6" fill="#81C784" transform="rotate(-35,-12,22)" />
              <ellipse cx="12"  cy="28" rx="12" ry="6" fill="#81C784" transform="rotate(35,12,28)" />
              {/* Petals */}
              {flowerAngles.map((angle) => {
                const rad = (angle * Math.PI) / 180
                const cx = Math.cos(rad) * 19
                const cy = Math.sin(rad) * 19 - 14
                return (
                  <ellipse
                    key={angle}
                    cx={cx} cy={cy}
                    rx="9" ry="15"
                    fill="#FF7043"
                    transform={`rotate(${angle},${cx},${cy})`}
                  />
                )
              })}
              {/* Flower center */}
              <circle cx="0" cy="-14" r="13" fill="#FFD740" />
              <circle cx="0" cy="-14" r="5.5" fill="#FF8F00" />
            </g>

            {/* ── RUBBER DUCK — bottom-center ── */}
            <g transform="translate(260, 472)">
              {/* Body */}
              <ellipse cx="0" cy="14" rx="34" ry="26" fill="#FFD740" />
              {/* Head */}
              <circle cx="26" cy="-10" r="21" fill="#FFD740" />
              {/* Beak */}
              <polygon points="43,-12 58,-7 43,-2" fill="#FF8F00" />
              {/* Eye */}
              <circle cx="32" cy="-16" r="5.5" fill="#37474F" />
              <circle cx="33" cy="-17" r="2"   fill="#FFFFFF" />
              {/* Wing */}
              <ellipse cx="-4" cy="8" rx="16" ry="10" fill="#FFC107" transform="rotate(-12,-4,8)" />
              {/* Tuft on head */}
              <path d="M 16,-28 Q 20,-40 25,-28 Q 29,-42 33,-28" fill="none" stroke="#FF8F00" strokeWidth="3.5" strokeLinecap="round" />
            </g>

            {/* ── BUILDING BLOCK — bottom-right ── */}
            <g transform="translate(452, 456)">
              {/* Front face */}
              <rect x="0" y="22" width="58" height="58" rx="7" fill="#42A5F5" />
              {/* Top face */}
              <polygon points="0,22 16,6 74,6 58,22" fill="#64B5F6" />
              {/* Right face */}
              <polygon points="58,22 74,6 74,64 58,80" fill="#1E88E5" />
              {/* Letter */}
              <text x="29" y="63" fontSize="30" fontWeight="bold" fill="#FFFFFF" fontFamily="Arial, sans-serif" textAnchor="middle">A</text>
            </g>

            {/* ── HEARTS scattered ── */}
            <g transform="translate(188, 52)">
              <path d="M 0,-9 C -12,-20 -24,0 0,16 C 24,0 12,-20 0,-9 Z" fill="#FF8A80" />
            </g>
            <g transform="translate(152, 198)" opacity="0.85">
              <path d="M 0,-7 C -10,-16 -19,0 0,13 C 19,0 10,-16 0,-7 Z" fill="#F48FB1" />
            </g>
            <g transform="translate(356, 178)">
              <path d="M 0,-7 C -10,-16 -19,0 0,13 C 19,0 10,-16 0,-7 Z" fill="#FF80AB" />
            </g>
            <g transform="translate(48, 302)" opacity="0.8">
              <path d="M 0,-6 C -8,-13 -16,0 0,11 C 16,0 8,-13 0,-6 Z" fill="#FF8A80" />
            </g>
            <g transform="translate(200, 410)">
              <path d="M 0,-6 C -8,-13 -16,0 0,11 C 16,0 8,-13 0,-6 Z" fill="#F48FB1" />
            </g>

            {/* ── STARS ── */}
            <g transform="translate(192, 162)">
              <polygon points="0,-13 3.5,-5 12,-5 5.5,1 8,10.5 0,5 -8,10.5 -5.5,1 -12,-5 -3.5,-5" fill="#FFD740" />
            </g>
            <g transform="translate(405, 132)" opacity="0.9">
              <polygon points="0,-11 3,-4 10,-4 4.5,0.5 7,9 0,4.5 -7,9 -4.5,0.5 -10,-4 -3,-4" fill="#FFEE58" />
            </g>
            <g transform="translate(52, 158)">
              <polygon points="0,-10 2.5,-3.5 9.5,-3.5 4,0.5 6.5,8.5 0,4 -6.5,8.5 -4,0.5 -9.5,-3.5 -2.5,-3.5" fill="#FFD740" />
            </g>
            <g transform="translate(383, 52)">
              <polygon points="0,-11 3,-4 10,-4 4.5,0.5 7,9 0,4.5 -7,9 -4.5,0.5 -10,-4 -3,-4" fill="#FFEE58" />
            </g>
            <g transform="translate(490, 200)" opacity="0.8">
              <polygon points="0,-9 2,-3 8,-3 3.5,0.5 5.5,7.5 0,3.5 -5.5,7.5 -3.5,0.5 -8,-3 -2,-3" fill="#FFD740" />
            </g>

            {/* ── PAINT BLOBS — scattered ── */}
            <circle cx="340" cy="350" r="9"  fill="#FF80AB" />
            <circle cx="356" cy="362" r="6"  fill="#80DEEA" />
            <circle cx="326" cy="364" r="7"  fill="#A5D6A7" />
            <circle cx="345" cy="374" r="5"  fill="#FFD740" />

          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kinder-bg)" />
      </svg>
    </div>
  )
}
