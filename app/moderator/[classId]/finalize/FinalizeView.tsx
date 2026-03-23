'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { publishClass } from '../actions'

interface Props {
  classId: string
  className: string
  classStatus: string
  totalStudents: number
  acceptedStudents: number
  approvedAnswers: number
  pendingAnswers: number
  pendingMessages: number
  hasSuperheroImage: boolean
}

export default function FinalizeView({
  classId,
  className,
  classStatus,
  totalStudents,
  acceptedStudents,
  approvedAnswers,
  pendingAnswers,
  pendingMessages,
  hasSuperheroImage,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPublished = classStatus === 'published'

  const checks = [
    {
      label: 'Всички деца са приели поканата',
      ok: acceptedStudents === totalStudents && totalStudents > 0,
      detail: `${acceptedStudents} от ${totalStudents}`,
    },
    {
      label: 'Няма чакащи отговори за одобрение',
      ok: pendingAnswers === 0,
      detail: pendingAnswers > 0 ? `${pendingAnswers} чакат` : 'OK',
    },
    {
      label: 'Няма чакащи послания за одобрение',
      ok: pendingMessages === 0,
      detail: pendingMessages > 0 ? `${pendingMessages} чакат` : 'OK',
    },
    {
      label: 'Супергерой образът е генериран',
      ok: hasSuperheroImage,
      detail: hasSuperheroImage ? 'OK' : 'Не е генериран',
    },
  ]

  async function handlePublish() {
    setLoading(true)
    setError(null)
    const result = await publishClass(classId)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(`/lexicon/${classId}`)
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Published banner */}
      {isPublished && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-green-500 block mb-2">celebration</span>
          <p className="text-green-800 font-bold text-lg mb-1">Лексиконът е публикуван!</p>
          <p className="text-green-700 text-sm mb-4">Родителите вече могат да го разгледат.</p>
          <Link
            href={`/lexicon/${classId}`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            Виж публикувания
          </Link>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Резюме — {className}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#faf9f8] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">{totalStudents}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Деца в класа</p>
          </div>
          <div className="bg-[#faf9f8] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">{approvedAnswers}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Одобрени отговора</p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
          Проверка преди публикуване
        </p>
        <div className="space-y-1">
          {checks.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    check.ok ? 'bg-green-100' : 'bg-amber-100'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-sm ${
                      check.ok ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    {check.ok ? 'check' : 'warning'}
                  </span>
                </div>
                <span className="text-sm text-gray-700">{check.label}</span>
              </div>
              <span
                className={`text-xs font-semibold ${check.ok ? 'text-green-600' : 'text-amber-600'}`}
              >
                {check.detail}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Предупрежденията не блокират публикуването. Можеш да публикуваш по всяко време.
        </p>
      </div>

      {/* Publish */}
      {!isPublished && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <button
            onClick={handlePublish}
            disabled={loading}
            className="w-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow text-sm"
          >
            {loading ? 'Публикуване...' : 'Публикувай лексикона'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            След публикуване лексиконът ще бъде достъпен за всички родители.
          </p>
        </div>
      )}
    </div>
  )
}
