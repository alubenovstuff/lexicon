'use client'

import { useState, useTransition } from 'react'
import type { Answer } from './AnswersTable'
import { approveAnswer, returnAnswer } from '../actions'

interface Props {
  answer: Answer
  classId: string
}

export default function AnswerActions({ answer, classId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [currentStatus, setCurrentStatus] = useState(answer.status)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (currentStatus === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
        <span className="material-symbols-outlined text-sm">check_circle</span>
        Одобрен
      </span>
    )
  }

  if (currentStatus === 'draft') {
    return (
      <span className="text-xs text-gray-400">Чернова</span>
    )
  }

  function handleApprove() {
    setError(null)
    startTransition(async () => {
      const result = await approveAnswer(answer.id, classId)
      if (result.error) setError(result.error)
      else setCurrentStatus('approved')
    })
  }

  function handleSendNote() {
    if (!note.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await returnAnswer(answer.id, note.trim(), classId)
      if (result.error) {
        setError(result.error)
      } else {
        setCurrentStatus('draft')
        setShowReturnForm(false)
        setNote('')
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">check</span>
          Одобри
        </button>
        <button
          onClick={() => { setShowReturnForm((p) => !p); setError(null) }}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">undo</span>
          Върни
        </button>
      </div>

      {showReturnForm && (
        <div className="flex flex-col gap-2 w-56">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Бележка до родителя…"
            rows={2}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
          />
          <button
            onClick={handleSendNote}
            disabled={isPending || !note.trim()}
            className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 self-end"
          >
            Изпрати бележка
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}
