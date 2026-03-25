'use client'

import { useState, useTransition } from 'react'
import { adminDeleteClass } from '../actions'

export default function DeleteClassButton({ classId, className }: { classId: string; className: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={() => startTransition(async () => {
            await adminDeleteClass(classId)
            setConfirming(false)
          })}
          disabled={isPending}
          className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {isPending ? 'Изтриване…' : 'Потвърди'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-400 hover:text-gray-600 ml-1">
          Отказ
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Изтрий ${className}`}
      className="text-gray-300 hover:text-red-500 transition-colors"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
    </button>
  )
}
