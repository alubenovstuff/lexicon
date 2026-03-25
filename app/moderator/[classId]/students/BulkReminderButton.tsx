'use client'

import { useState } from 'react'
import { sendBulkReminders } from '../actions'

export default function BulkReminderButton({ classId }: { classId: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    const res = await sendBulkReminders(classId)
    setLoading(false)
    if (res.error) setError(res.error)
    else setResult({ sent: res.sent })
  }

  if (result) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
        {result.sent > 0 ? `Изпратени ${result.sent} напомняния` : 'Всички са попълнили'}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 border border-amber-200 text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-base">notifications_active</span>
        {loading ? 'Изпращане...' : 'Напомни на всички'}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
