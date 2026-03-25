'use client'

import { useState, useTransition } from 'react'
import { createQuestion, updateQuestion, deleteQuestion, reorderQuestions } from './actions'

type QuestionType = 'personal' | 'class_voice' | 'better_together' | 'superhero' | 'video'

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
  video: 'Видео въпрос',
}

// Video questions require video, all others are text-only
function mediaFlagsForType(type: QuestionType) {
  return type === 'video'
    ? { allows_text: false, allows_media: true }
    : { allows_text: true, allows_media: false }
}

const EMPTY_FORM = {
  text: '',
  type: 'personal' as QuestionType,
  max_length: '',
}

// ─── Form ─────────────────────────────────────────────────────────────────────

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
    <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Текст на въпроса
        </label>
        <textarea
          value={form.text}
          onChange={(e) => set('text', e.target.value)}
          rows={2}
          placeholder="Напишете въпроса..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Раздел
          </label>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value as QuestionType)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Макс. знаци <span className="text-gray-400 font-normal normal-case">(по желание)</span>
          </label>
          <input
            type="number"
            min={10}
            max={2000}
            value={form.max_length}
            onChange={(e) => set('max_length', e.target.value)}
            placeholder="без ограничение"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Format indicator (derived from type, not editable) */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
        <span className="material-symbols-outlined text-sm text-gray-400" style={{ fontVariationSettings: "'FILL' 1" }}>
          {form.type === 'video' ? 'videocam' : 'article'}
        </span>
        <span>
          Формат на отговора:&nbsp;
          <strong className="text-gray-700">
            {form.type === 'video' ? 'само видео' : 'само текст'}
          </strong>
        </span>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(form)}
          disabled={isPending || !form.text.trim()}
          className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Запазване...' : 'Запази'}
        </button>
        <button
          onClick={onCancel}
          disabled={isPending}
          className="text-gray-400 hover:text-gray-600 text-sm px-4 py-2.5"
        >
          Отказ
        </button>
      </div>
    </div>
  )
}

// ─── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({
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
        ...mediaFlagsForType(form.type),
        max_length: form.max_length ? parseInt(form.max_length as unknown as string) : null,
        order_index: question.order_index,
      })
      if (result.error) setError(result.error)
      else { setEditing(false); setError(null) }
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
        {error && <p className="text-red-500 text-xs px-1">{error}</p>}
        <QuestionForm
          initial={{
            text: question.text,
            type: question.type,
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
    <div className="group bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <div className="flex items-start gap-4">

        {/* Drag / reorder handle */}
        <div className="flex-shrink-0 pt-1 flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst || isPending}
            className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none text-xs"
          >▲</button>
          <button
            onClick={onMoveDown}
            disabled={isLast || isPending}
            className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none text-xs"
          >▼</button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              {TYPE_LABELS[question.type]}
            </span>
            {question.type === 'video' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>videocam</span>
                Само видео
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>article</span>
                Само текст
              </span>
            )}
          </div>

          {/* Question text */}
          <p
            className="text-xl text-indigo-700 leading-snug"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            {question.text}
          </p>

        </div>

        {/* Actions — appear on hover */}
        <div className="flex-shrink-0 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium"
          >
            Редактирай
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
          >
            Изтрий
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main editor ───────────────────────────────────────────────────────────────

export default function QuestionsEditor({ classId, systemQuestions, customQuestions: initialCustom }: Props) {
  const [customQuestions, setCustomQuestions] = useState(initialCustom)
  const [adding, setAdding] = useState(false)
  const [addTab, setAddTab] = useState<'write' | 'archive'>('write')
  const [isPending, startTransition] = useTransition()
  const [addError, setAddError] = useState<string | null>(null)

  function handleAdd(form: typeof EMPTY_FORM) {
    startTransition(async () => {
      const nextIndex =
        customQuestions.length > 0
          ? Math.max(...customQuestions.map((q) => q.order_index)) + 1
          : 1

      const result = await createQuestion(classId, {
        text: form.text,
        type: form.type,
        ...mediaFlagsForType(form.type),
        max_length: form.max_length ? parseInt(form.max_length as unknown as string) : null,
        order_index: nextIndex,
      })

      if (result.error) {
        setAddError(result.error)
      } else {
        setAdding(false)
        setAddError(null)
        setCustomQuestions((prev) => [
          ...prev,
          {
            id: 'pending-' + Date.now(),
            text: form.text,
            type: form.type,
            ...mediaFlagsForType(form.type),
            max_length: form.max_length ? parseInt(form.max_length as unknown as string) : null,
            order_index: nextIndex,
          },
        ])
      }
    })
  }

  function handleAddFromArchive(q: Question) {
    const nextIndex =
      customQuestions.length > 0
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
    <div>
      {/* ── Page header ────────────────────────────────────────────── */}
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">
            Настройки на албума
          </p>
          <h1
            className="text-4xl font-bold text-gray-900 leading-tight"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Редактор на въпросника
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-lg">
            Определете въпросите, на които всеки ученик трябва да отговори, за да
            създадем заедно живия архив на Вашия випуск.
          </p>
        </div>

        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-indigo-300 hover:text-indigo-700 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Нов въпрос
          </button>
        )}
      </div>

      {/* ── Question count info ────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3">
          <span className="material-symbols-outlined text-indigo-400 text-lg">quiz</span>
          <span className="text-sm text-indigo-700">
            Въпросникът се състои от{' '}
            <strong className="font-bold">{customQuestions.length}</strong>{' '}
            {customQuestions.length === 1 ? 'въпрос' : 'въпроса'}
          </span>
        </div>
        {systemQuestions.length > 0 && (
          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3">
            <span className="material-symbols-outlined text-gray-400 text-lg">auto_awesome</span>
            <span className="text-sm text-gray-500">
              <strong className="font-bold">{systemQuestions.length}</strong> в архива
            </span>
          </div>
        )}
      </div>

      {/* ── Add / Archive panel ────────────────────────────────────── */}
      {adding && (
        <div className="mb-6">
          {/* Tab switcher */}
          <div className="flex gap-1 mb-4 bg-gray-100 rounded-2xl p-1 w-fit">
            <button
              onClick={() => setAddTab('write')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                addTab === 'write' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Напиши въпрос
            </button>
            <button
              onClick={() => setAddTab('archive')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                addTab === 'archive' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Идеи от архива
            </button>
          </div>

          {addTab === 'write' ? (
            <>
              {addError && <p className="text-red-500 text-xs mb-2 px-1">{addError}</p>}
              <QuestionForm
                initial={EMPTY_FORM}
                onSave={handleAdd}
                onCancel={() => { setAdding(false); setAddError(null); setAddTab('write') }}
                isPending={isPending}
              />
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Избери въпрос от архива</p>
                <button
                  onClick={() => { setAdding(false); setAddTab('write') }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕ Затвори
                </button>
              </div>
              {systemQuestions.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">Архивът е празен.</p>
              ) : (
                systemQuestions.map((q) => {
                  const added = customQuestions.some((c) => c.text === q.text)
                  return (
                    <div
                      key={q.id}
                      className={`bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-3 border transition-colors ${
                        added ? 'border-gray-100 opacity-50' : 'border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <p className="flex-1 text-sm text-gray-700 leading-snug" style={{ fontFamily: 'Noto Serif, serif' }}>
                        {q.text}
                      </p>
                      <button
                        disabled={added || isPending}
                        onClick={() => handleAddFromArchive(q)}
                        className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={added ? 'Вече добавен' : 'Добави'}
                      >
                        {added ? '✓' : '+'}
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Questions list ─────────────────────────────────────────── */}
      {customQuestions.length === 0 && !adding ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center mb-8">
          <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">quiz</span>
          <p className="text-gray-500 text-sm font-medium">Нямате добавени въпроси</p>
          <p className="text-gray-400 text-xs mt-1">
            Натиснете „Нов въпрос" или изберете от архива по-долу.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {customQuestions.map((q, i) => (
            <QuestionCard
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
  )
}
