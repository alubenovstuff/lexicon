'use client'

import { useState, useTransition } from 'react'
import { createQuestion, updateQuestion, deleteQuestion, reorderQuestions } from './actions'

type QuestionType = 'personal' | 'class_voice' | 'better_together' | 'superhero'

interface Question {
  id: string
  text: string
  type: QuestionType
  allows_text: boolean
  allows_media: boolean
  max_length: number | null
  order_index: number
}

interface Props {
  classId: string
  systemQuestions: Question[]
  customQuestions: Question[]
}

const TYPE_LABELS: Record<QuestionType, string> = {
  personal: 'Личен',
  class_voice: 'Гласът на класа',
  better_together: 'По-добри заедно',
  superhero: 'Супергерой',
}

const TYPE_COLORS: Record<QuestionType, string> = {
  personal: 'bg-indigo-50 text-indigo-600',
  class_voice: 'bg-purple-50 text-purple-600',
  better_together: 'bg-green-50 text-green-600',
  superhero: 'bg-amber-50 text-amber-600',
}

const EMPTY_FORM = {
  text: '',
  type: 'personal' as QuestionType,
  allows_text: true,
  allows_media: true,
  max_length: '',
}

// ─── Question form (shared for add + edit) ─────────────────────────────────

function QuestionForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial: typeof EMPTY_FORM
  onSave: (data: typeof EMPTY_FORM) => void
  onCancel: () => void
  isPending: boolean
}) {
  const [form, setForm] = useState(initial)

  function set<K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-4">
      {/* Text */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Текст на въпроса</label>
        <textarea
          value={form.text}
          onChange={(e) => set('text', e.target.value)}
          rows={2}
          placeholder="Напишете въпроса..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Раздел</label>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value as QuestionType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Max length */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Макс. дължина <span className="text-gray-400 font-normal">(знаци, по желание)</span>
          </label>
          <input
            type="number"
            min={10}
            max={2000}
            value={form.max_length}
            onChange={(e) => set('max_length', e.target.value)}
            placeholder="без ограничение"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Media toggles */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Разрешена медия</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.allows_text}
              onChange={(e) => set('allows_text', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Текст</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.allows_media}
              onChange={(e) => set('allows_media', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Видео / аудио / снимка</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(form)}
          disabled={isPending || !form.text.trim() || (!form.allows_text && !form.allows_media)}
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Запазване...' : 'Запази'}
        </button>
        <button
          onClick={onCancel}
          disabled={isPending}
          className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2"
        >
          Отказ
        </button>
      </div>
    </div>
  )
}

// ─── Single custom question row ────────────────────────────────────────────

function CustomQuestionRow({
  question,
  classId,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  question: Question
  classId: string
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSave(form: typeof EMPTY_FORM) {
    startTransition(async () => {
      const result = await updateQuestion(classId, question.id, {
        text: form.text,
        type: form.type,
        allows_text: form.allows_text,
        allows_media: form.allows_media,
        max_length: form.max_length ? parseInt(form.max_length as unknown as string) : null,
        order_index: question.order_index,
      })
      if (result.error) {
        setError(result.error)
      } else {
        setEditing(false)
        setError(null)
      }
    })
  }

  function handleDelete() {
    if (!confirm('Изтриване на въпроса?')) return
    startTransition(async () => {
      const result = await deleteQuestion(classId, question.id)
      if (result.error) setError(result.error)
    })
  }

  if (editing) {
    return (
      <div className="space-y-2">
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <QuestionForm
          initial={{
            text: question.text,
            type: question.type,
            allows_text: question.allows_text,
            allows_media: question.allows_media,
            max_length: question.max_length?.toString() ?? '',
          }}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          isPending={isPending}
        />
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
      <div className="flex items-start gap-3">
        {/* Reorder buttons */}
        <div className="flex flex-col gap-0.5 pt-0.5 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={isFirst || isPending}
            className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none"
            title="Нагоре"
          >
            ▲
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast || isPending}
            className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none"
            title="Надолу"
          >
            ▼
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-snug">{question.text}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[question.type]}`}>
              {TYPE_LABELS[question.type]}
            </span>
            {question.allows_text && (
              <span className="text-xs text-gray-400">📝 Текст</span>
            )}
            {question.allows_media && (
              <span className="text-xs text-gray-400">🎥 Медия</span>
            )}
            {question.max_length && (
              <span className="text-xs text-gray-400">max {question.max_length} зн.</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-400 hover:text-indigo-600 transition-colors"
          >
            Редактирай
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Изтрий
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main editor ───────────────────────────────────────────────────────────

export default function QuestionsEditor({ classId, systemQuestions, customQuestions: initialCustom }: Props) {
  const [customQuestions, setCustomQuestions] = useState(initialCustom)
  const [adding, setAdding] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [addError, setAddError] = useState<string | null>(null)

  function handleAdd(form: typeof EMPTY_FORM) {
    startTransition(async () => {
      const nextIndex = customQuestions.length > 0
        ? Math.max(...customQuestions.map((q) => q.order_index)) + 1
        : 1

      const result = await createQuestion(classId, {
        text: form.text,
        type: form.type,
        allows_text: form.allows_text,
        allows_media: form.allows_media,
        max_length: form.max_length ? parseInt(form.max_length as unknown as string) : null,
        order_index: nextIndex,
      })

      if (result.error) {
        setAddError(result.error)
      } else {
        setAdding(false)
        setAddError(null)
        // Optimistically add — page will revalidate
        setCustomQuestions((prev) => [
          ...prev,
          {
            id: 'pending',
            text: form.text,
            type: form.type,
            allows_text: form.allows_text,
            allows_media: form.allows_media,
            max_length: form.max_length ? parseInt(form.max_length as unknown as string) : null,
            order_index: nextIndex,
          },
        ])
      }
    })
  }

  function handleMove(index: number, direction: 'up' | 'down') {
    const newList = [...customQuestions]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]]
    const reindexed = newList.map((q, i) => ({ ...q, order_index: i + 1 }))
    setCustomQuestions(reindexed)

    startTransition(async () => {
      await reorderQuestions(
        classId,
        reindexed.map((q) => ({ id: q.id, order_index: q.order_index }))
      )
    })
  }

  return (
    <div className="space-y-10">
      {/* Custom questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Собствени въпроси</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Добавете въпроси специфични за вашия клас.
            </p>
          </div>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Добави въпрос
            </button>
          )}
        </div>

        {adding && (
          <div className="mb-4">
            {addError && <p className="text-red-600 text-xs mb-2">{addError}</p>}
            <QuestionForm
              initial={EMPTY_FORM}
              onSave={handleAdd}
              onCancel={() => { setAdding(false); setAddError(null) }}
              isPending={isPending}
            />
          </div>
        )}

        {customQuestions.length === 0 && !adding ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-sm">Нямате собствени въпроси.</p>
            <p className="text-gray-400 text-xs mt-1">Натиснете „+ Добави въпрос", за да започнете.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {customQuestions.map((q, i) => (
              <CustomQuestionRow
                key={q.id}
                question={q}
                classId={classId}
                onMoveUp={() => handleMove(i, 'up')}
                onMoveDown={() => handleMove(i, 'down')}
                isFirst={i === 0}
                isLast={i === customQuestions.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* System questions — selectable */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Системни въпроси</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Натиснете „+" до въпрос, за да го добавите към собствените и да го редактирате.
          </p>
        </div>

        <div className="space-y-2">
          {systemQuestions.map((q) => {
            const alreadyAdded = customQuestions.some((c) => c.text === q.text)
            return (
              <div
                key={q.id}
                className={`border rounded-xl px-4 py-3 flex items-start gap-3 transition-colors ${
                  alreadyAdded
                    ? 'bg-gray-50 border-gray-200 opacity-50'
                    : 'bg-white border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{q.text}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[q.type]}`}>
                      {TYPE_LABELS[q.type]}
                    </span>
                    {q.allows_text && <span className="text-xs text-gray-400">📝 Текст</span>}
                    {q.allows_media && <span className="text-xs text-gray-400">🎥 Медия</span>}
                  </div>
                </div>
                <button
                  disabled={alreadyAdded || isPending}
                  onClick={() => {
                    const nextIndex = customQuestions.length > 0
                      ? Math.max(...customQuestions.map((c) => c.order_index)) + 1
                      : 1
                    startTransition(async () => {
                      const result = await createQuestion(classId, {
                        text: q.text,
                        type: q.type,
                        allows_text: q.allows_text,
                        allows_media: q.allows_media,
                        max_length: q.max_length,
                        order_index: nextIndex,
                      })
                      if (!result.error) {
                        setCustomQuestions((prev) => [
                          ...prev,
                          { ...q, id: 'pending-' + q.id, order_index: nextIndex },
                        ])
                      }
                    })
                  }}
                  className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={alreadyAdded ? 'Вече добавен' : 'Добави към собствените'}
                >
                  {alreadyAdded ? '✓' : '+'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
