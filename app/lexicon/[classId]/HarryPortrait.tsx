'use client'

import { useRef, useState, useCallback } from 'react'

interface Props {
  src: string | null
  alt: string
  initials?: string
  /** 'portrait' = 3/4 aspect ratio card  |  'circle' = round avatar */
  variant?: 'portrait' | 'circle'
  className?: string
}

export default function HarryPortrait({ src, alt, initials = '?', variant = 'portrait', className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [shimmer, setShimmer] = useState({ x: 50, y: 50, opacity: 0 })
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)   // -1 … 1
    const dy = (e.clientY - cy) / (rect.height / 2)  // -1 … 1

    const maxTilt = variant === 'circle' ? 10 : 14

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ x: -dy * maxTilt, y: dx * maxTilt })
      setShimmer({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
        opacity: 0.18,
      })
    })
  }, [variant])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setTilt({ x: 0, y: 0 })
    setShimmer(s => ({ ...s, opacity: 0 }))
  }, [])

  const isCircle = variant === 'circle'

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${className}`}
      style={{
        perspective: '700px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* The tilting card */}
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x === 0 && tilt.y === 0 ? 1 : 1.03})`,
          transition: tilt.x === 0 && tilt.y === 0
            ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
            : 'transform 0.08s linear',
          transformStyle: 'preserve-3d',
          borderRadius: isCircle ? '9999px' : '1rem',
          overflow: 'hidden',
          animation: 'hp-float 6s ease-in-out infinite',
        }}
      >
        {/* Photo or initials */}
        {src ? (
          <img
            src={src}
            alt={alt}
            draggable={false}
            className={isCircle
              ? 'w-full h-full object-cover block'
              : 'w-full aspect-[3/4] object-cover block'
            }
          />
        ) : (
          <div className={`bg-[#e2dfff] flex items-center justify-center ${
            isCircle ? 'w-full h-full' : 'w-full aspect-[3/4]'
          }`}>
            <span className="text-[#3632b7] font-bold" style={{
              fontSize: isCircle ? '1.5rem' : '5rem',
              fontFamily: 'Noto Serif, serif',
            }}>
              {initials}
            </span>
          </div>
        )}

        {/* Shimmer glint */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: isCircle ? '9999px' : '1rem',
            background: `radial-gradient(circle at ${shimmer.x}% ${shimmer.y}%, rgba(255,255,255,0.75) 0%, transparent 60%)`,
            opacity: shimmer.opacity,
            transition: 'opacity 0.3s ease',
            mixBlendMode: 'screen',
          }}
        />

        {/* Vignette — gives portrait depth */}
        {!isCircle && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)',
            }}
          />
        )}
      </div>

      {/* CSS keyframe injected inline once */}
      <style>{`
        @keyframes hp-float {
          0%,100% { transform: translateY(0px) rotateZ(-0.3deg); }
          50%      { transform: translateY(-5px) rotateZ(0.3deg); }
        }
      `}</style>
    </div>
  )
}
