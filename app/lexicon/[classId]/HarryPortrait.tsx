'use client'

import { useRef, useState, useCallback } from 'react'

interface Props {
  src: string | null
  alt: string
  initials?: string
  variant?: 'portrait' | 'circle'
  className?: string
}

// Dust particles — scattered around the portrait
const PARTICLES = [
  { w: 3, h: 3, x:  8, y: 18, delay: 0.0, dur: 3.4, drift:  14, color: 'rgba(255,220,100,0.85)' },
  { w: 2, h: 2, x: 88, y: 30, delay: 0.7, dur: 2.9, drift: -10, color: 'rgba(255,255,255,0.7)'  },
  { w: 4, h: 4, x: 55, y: 78, delay: 1.4, dur: 3.9, drift:  16, color: 'rgba(180,160,255,0.8)'  },
  { w: 2, h: 2, x: 20, y: 62, delay: 0.2, dur: 2.6, drift: -12, color: 'rgba(255,220,100,0.7)'  },
  { w: 3, h: 3, x: 72, y: 12, delay: 1.0, dur: 3.1, drift:   9, color: 'rgba(255,255,255,0.6)'  },
  { w: 2, h: 2, x: 93, y: 58, delay: 1.9, dur: 2.7, drift: -14, color: 'rgba(180,160,255,0.75)' },
  { w: 3, h: 3, x: 38, y: 90, delay: 0.5, dur: 3.6, drift:  11, color: 'rgba(255,220,100,0.8)'  },
  { w: 2, h: 2, x:  5, y: 48, delay: 1.7, dur: 3.0, drift:  -8, color: 'rgba(255,255,255,0.65)' },
  { w: 3, h: 3, x: 65, y: 95, delay: 2.2, dur: 2.8, drift:  13, color: 'rgba(180,160,255,0.7)'  },
  { w: 2, h: 2, x: 45, y:  5, delay: 0.9, dur: 3.3, drift: -11, color: 'rgba(255,220,100,0.75)' },
]

const KEYFRAMES = `
@keyframes hp-float {
  0%,100% { transform: translateY(0px)   rotateZ(-0.4deg); }
  50%     { transform: translateY(-8px)  rotateZ(0.4deg);  }
}
@keyframes hp-dust {
  0%   { transform: translateY(0px)   translateX(0px)   scale(1);    opacity: 0;   }
  15%  { opacity: 1; }
  80%  { opacity: 0.9; }
  100% { transform: translateY(-28px) translateX(var(--drift)) scale(0.4); opacity: 0; }
}
@keyframes hp-iris {
  0%,100% { filter: hue-rotate(0deg)   brightness(1);    }
  25%     { filter: hue-rotate(20deg)  brightness(1.05); }
  50%     { filter: hue-rotate(-10deg) brightness(1.08); }
  75%     { filter: hue-rotate(15deg)  brightness(1.03); }
}
`

export default function HarryPortrait({ src, alt, initials = '?', variant = 'portrait', className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number | null>(null)
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 })
  const [shimmer, setShimmer] = useState({ x: 50, y: 50, opacity: 0 })
  const [active,  setActive]  = useState(false)

  const maxTilt = variant === 'circle' ? 14 : 20

  function applyMove(clientX: number, clientY: number) {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
    const dy = (clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ x: -dy * maxTilt, y: dx * maxTilt })
      setShimmer({
        x: ((clientX - rect.left) / rect.width)  * 100,
        y: ((clientY - rect.top)  / rect.height) * 100,
        opacity: 0.28,
      })
      setActive(true)
    })
  }

  function resetMove() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setTilt({ x: 0, y: 0 })
    setShimmer(s => ({ ...s, opacity: 0 }))
    setActive(false)
  }

  const handleMouseMove  = useCallback((e: React.MouseEvent<HTMLDivElement>)  => applyMove(e.clientX, e.clientY), [])
  const handleTouchMove  = useCallback((e: React.TouchEvent<HTMLDivElement>)  => {
    e.preventDefault()
    applyMove(e.touches[0].clientX, e.touches[0].clientY)
  }, [])
  const handleMouseLeave = useCallback(resetMove, [])
  const handleTouchEnd   = useCallback(resetMove,  [])

  const isCircle = variant === 'circle'
  const radius   = isCircle ? '9999px' : '1rem'

  // Holographic tilt-based colour shift
  const hueShift = tilt.y * 2.5
  const satBoost = active ? 1.15 : 1

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative select-none ${className}`}
      style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Float layer (animation isolated here, no conflict with tilt) ── */}
      <div style={{ animation: 'hp-float 6s ease-in-out infinite', transformStyle: 'preserve-3d' }}>

        {/* ── Tilt layer ─────────────────────────────────────────────── */}
        <div
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${active ? 1.05 : 1})`,
            transition: active
              ? 'transform 0.07s linear'
              : 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
            transformStyle: 'preserve-3d',
            borderRadius: radius,
            overflow: 'hidden',
          }}
        >
          {/* Photo or initials */}
          {src ? (
            <img
              src={src}
              alt={alt}
              draggable={false}
              style={{ filter: `hue-rotate(${hueShift}deg) saturate(${satBoost})`, transition: 'filter 0.1s' }}
              className={isCircle ? 'w-full h-full object-cover block' : 'w-full aspect-[3/4] object-cover block'}
            />
          ) : (
            <div
              className={`bg-[#e2dfff] flex items-center justify-center ${isCircle ? 'w-full h-full' : 'w-full aspect-[3/4]'}`}
              style={{ animation: 'hp-iris 8s ease-in-out infinite' }}
            >
              <span className="text-[#3632b7] font-bold" style={{ fontSize: isCircle ? '1.5rem' : '5rem', fontFamily: 'Noto Serif, serif' }}>
                {initials}
              </span>
            </div>
          )}

          {/* Shimmer — bright white glint */}
          <div
            aria-hidden
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: radius,
              background: `radial-gradient(circle at ${shimmer.x}% ${shimmer.y}%, rgba(255,255,255,0.9) 0%, rgba(255,240,180,0.4) 25%, transparent 55%)`,
              opacity: shimmer.opacity,
              transition: active ? 'opacity 0.05s' : 'opacity 0.4s ease',
              mixBlendMode: 'screen',
            }}
          />

          {/* Holographic rainbow layer */}
          <div
            aria-hidden
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: radius,
              background: `linear-gradient(${125 + tilt.y * 3}deg,
                rgba(255,100,100,0.0) 0%,
                rgba(255,180,50,0.12) 20%,
                rgba(100,255,150,0.10) 40%,
                rgba(80,160,255,0.12) 60%,
                rgba(200,100,255,0.10) 80%,
                rgba(255,100,150,0.0) 100%)`,
              opacity: active ? 0.85 : 0,
              transition: active ? 'opacity 0.1s' : 'opacity 0.5s ease',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Vignette depth */}
          {!isCircle && (
            <div
              aria-hidden
              style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)',
              }}
            />
          )}
        </div>
      </div>

      {/* ── Dust particles (outside the tilt layer) ──────────────────── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width:  p.w,
            height: p.h,
            borderRadius: '50%',
            background: p.color,
            pointerEvents: 'none',
            '--drift': `${p.drift}px`,
            animation: `hp-dust ${p.dur}s ${p.delay}s ease-in infinite`,
            boxShadow: `0 0 ${p.w * 2}px ${p.color}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
