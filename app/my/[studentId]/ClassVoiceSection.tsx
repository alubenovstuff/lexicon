'use client'

import { useEffect, useState } from 'react'
import { submitClassVoiceAnswer } from './actions'

interface Question {
  id: string
  text: string
  order_index: number
}

interface Props {
  classId: string
  questions: Question[]
  onFinalize?: () => void
}

function VoiceQuestionCard({
  classId,
  question,
  submitted,
  onSubmitted,
}: {
  classId: string
  question: Question
  submitted: boolean
  onSubmitted: () => void
}) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)
    const result = await submitClassVoiceAnswer(classId, question.id, text)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`class_voice_${classId}_${question.id}`, '1')
      }
      onSubmitted()
    }
  }

  return (
    <div className="bg-[#faf9f8] rounded-2xl p-5 space-y-3">
      <p className="font-semibold text-gray-900" style={{ fontFamily: 'Noto Serif, serif' }}>
        {question.text}
      </p>

      {submitted ? (
        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium py-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
          Изпратено анонимно ✓
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Вашият анонимен отговор…"
            maxLength={400}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{text.length}/400</span>
            <div className="flex items-center gap-3">
              {error && <span className="text-xs text-red-500">{error}</span>}
              <button
                onClick={handleSubmit}
                disabled={submitting || !text.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Изпращане...' : 'Изпрати'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ClassVoiceSection({ classId, questions, onFinalize }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const initial = new Set<string>()
    for (const q of questions) {
      if (localStorage.getItem(`class_voice_${classId}_${q.id}`)) {
        initial.add(q.id)
      }
    }
    setSubmittedIds(initial)
  }, [classId, questions])

  if (questions.length === 0) return null

  const question = questions[currentIndex]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{currentIndex + 1} от {questions.length}</span>
        {submittedIds.size > 0 && (
          <span className="text-emerald-600 font-medium">{submittedIds.size} / {questions.length} изпратени</span>
        )}
      </div>

      <VoiceQuestionCard
        key={question.id}
        classId={classId}
        question={question}
        submitted={submittedIds.has(question.id)}
        onSubmitted={() => setSubmittedIds(prev => new Set([...prev, question.id]))}
      />

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex-none px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          ← Назад
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(i => i + 1)}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Напред →
          </button>
        ) : (
          <button
            onClick={onFinalize}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Финализирай секцията ✓
          </button>
        )}
      </div>
    </div>
  )
}
