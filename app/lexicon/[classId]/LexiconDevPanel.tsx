'use client'

import { useState, useTransition } from 'react'
import { seedDummyData, clearClassData } from '@/app/moderator/[classId]/seed/actions'

interface Props {
  classId: string
}

export default function LexiconDevPanel({ classId }: Props) {
  const [open, setOpen]             = useState(false)
  const [studentCount, setCount]    = useState(8)
  const [status, setStatus]         = useState<string | null>(null)
  const [isError, setIsError]       = useState(false)
  const [isPending, startTransition] = useTransition()

  function run(fn: () => Promise<{ error: string | null }>) {
    setStatus(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) { setStatus(res.error); setIsError(true) }
      else            { setStatus('Готово!');  setIsError(false) }
    })
  }

  function handleSeed()  { run(() => seedDummyData(classId, studentCount)) }
  function handleClear() {
    if (!confirm('Изтрива ВСИЧКИ данни от класа. Продължаваш?')) return
    run(() => clearClassData(classId))
  }

  return (
    <div className="fixed bottom-36 right-4 z-[9999] flex flex-col items-end gap-2">
      {/* Expanded panel */}
      {open && (
        <div
          className="bg-white border border-amber-200 rounded-2xl shadow-2xl p-4 w-64"
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Тест данни</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>

          {/* Student count */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 flex-1">Брой деца</span>
            <input
              type="number"
              min={1} max={20}
              value={studentCount}
              onChange={e => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Buttons */}
          <button
            onClick={handleSeed}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl mb-2 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">science</span>
            {isPending ? 'Работи...' : 'Генерирай данни'}
          </button>

          <button
            onClick={handleClear}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">delete_forever</span>
            Изчисти всичко
          </button>

          {/* Status */}
          {status && (
            <p className={`mt-3 text-xs rounded-lg px-3 py-2 ${isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {status}
            </p>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Тест данни"
        className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 text-white shadow-lg flex items-center justify-center transition-colors"
      >
        <span className="material-symbols-outlined text-lg">science</span>
      </button>
    </div>
  )
}
