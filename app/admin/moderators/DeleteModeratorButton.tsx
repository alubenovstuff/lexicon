'use client'

import { useState, useTransition } from 'react'
import { adminDeleteModerator } from '../actions'

export default function DeleteModeratorButton({ userId, email }: { userId: string; email: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-red-600 font-semibold">Изтрий заедно с всички класове?</span>
        <button
          onClick={() => startTransition(async () => {
            await adminDeleteModerator(userId)
            setConfirming(false)
          })}
          disabled={isPending}
          className="font-bold text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {isPending ? 'Изтриване…' : 'Потвърди'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-gray-400 hover:text-gray-600">
          Отказ
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Изтрий ${email}`}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
      Изтрий
    </button>
  )
}
