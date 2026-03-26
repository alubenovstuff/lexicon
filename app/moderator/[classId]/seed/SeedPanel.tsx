'use client'

import { useState, useTransition } from 'react'
import { seedDummyData, clearClassData } from './actions'

interface Props {
  classId: string
}

export default function SeedPanel({ classId }: Props) {
  const [studentCount, setStudentCount] = useState(8)
  const [status, setStatus] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSeed() {
    setStatus(null)
    startTransition(async () => {
      const res = await seedDummyData(classId, studentCount)
      if (res.error) {
        setStatus(res.error)
        setIsError(true)
      } else {
        setStatus(`Готово! Генерирани ${studentCount} деца с въпроси, отговори, анкети, спомени и послания.`)
        setIsError(false)
      }
    })
  }

  function handleClear() {
    if (!confirm('Ще бъдат изтрити ВСИЧКИ деца, въпроси, отговори, анкети, спомени и послания от класа. Продължаваш?')) return
    setStatus(null)
    startTransition(async () => {
      const res = await clearClassData(classId)
      if (res.error) {
        setStatus(res.error)
        setIsError(true)
      } else {
        setStatus('Всички данни от класа бяха изтрити.')
        setIsError(false)
      }
    })
  }

  return (
    <div className="max-w-xl space-y-6">

      {/* Warning banner */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
        <span className="material-symbols-outlined text-amber-500 text-xl flex-shrink-0 mt-0.5">warning</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          Инструментът е само за тестване. Генерираните данни изглеждат като реални, но са фиктивни.
          <strong className="block mt-1">"Изчисти всичко" изтрива ВСИЧКИ данни от класа — включително реални.</strong>
        </p>
      </div>

      {/* Generate card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">Генерирай данни</p>

        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Попълва класа с деца и пълни профили. Използва съществуващите въпроси и анкети — всяко дете получава уникален отговор на всеки въпрос, гласове в анкетите, 10 спомена и по 3 послания.
        </p>

        <div className="flex items-center gap-4 mb-5">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Брой деца</label>
          <input
            type="number"
            min={1}
            max={20}
            value={studentCount}
            onChange={e => setStudentCount(Math.min(20, Math.max(1, Number(e.target.value))))}
            className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <span className="text-xs text-gray-400">(максимум 20)</span>
        </div>

        {/* What gets created */}
        <ul className="text-xs text-gray-500 space-y-1 mb-6 pl-1">
          {[
            `${studentCount} деца с уникални отговори на всеки въпрос`,
            'Попълва всички class_voice въпроси с разнообразни отговори',
            'Гласове за всички анкети на класа',
            '10 спомена с дати и описания',
            'По 3 одобрени послания за всяко дете',
            'Автоматично свързва layout блоковете с въпросите',
          ].map(line => (
            <li key={line} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-300 text-sm">check_circle</span>
              {line}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSeed}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">science</span>
          {isPending ? 'Генерира се...' : 'Генерирай тестови данни'}
        </button>
      </div>

      {/* Clear card */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Опасна зона</p>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Изтрива абсолютно всичко от класа — деца, въпроси, отговори, анкети, спомени и послания. Необратимо.
        </p>
        <button
          onClick={handleClear}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-5 py-2.5 rounded-xl border border-red-200 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">delete_forever</span>
          {isPending ? 'Изтрива се...' : 'Изчисти всички данни'}
        </button>
      </div>

      {/* Result */}
      {status && (
        <div className={`flex gap-3 rounded-2xl px-5 py-4 text-sm ${isError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">
            {isError ? 'error' : 'check_circle'}
          </span>
          {status}
        </div>
      )}
    </div>
  )
}
