'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center px-6 text-center"
      style={{ fontFamily: 'Manrope, sans-serif' }}
    >
      <span className="material-symbols-outlined text-5xl text-red-300 block mb-4">
        error
      </span>
      <h1
        className="text-3xl font-bold text-indigo-900 mb-3"
        style={{ fontFamily: 'Noto Serif, serif' }}
      >
        Нещо се обърка
      </h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm leading-relaxed">
        Възникна неочаквана грешка. Моля, опитайте отново.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Опитай отново
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-base">home</span>
          Начало
        </a>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-gray-300 font-mono">
          {error.digest}
        </p>
      )}
    </div>
  )
}
