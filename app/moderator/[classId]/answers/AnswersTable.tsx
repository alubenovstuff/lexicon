'use client'

import { useState, useTransition } from 'react'
import AnswerActions from './AnswerActions'
import { bulkApproveAnswers } from '../actions'

export interface Answer {
  id: string
  status: string
  text_content: string | null
  media_url: string | null
  media_type: string | null
  updated_at: string
  student_id: string
  question_id: string
  students: { first_name: string; last_name: string }
  questions: { text: string; order_index: number }
}

interface Props {
  answers: Answer[]
  classId: string
}

type FilterTab = 'all' | 'submitted' | 'approved'

function StatusBadge({ status }: { status: string }) {
  if (status === 'submitted') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-700">
        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
        Чакащ
      </span>
    )
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-100 text-green-700">
        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span>
        Одобрен
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-500">
      Чернова
    </span>
  )
}

function ContentPreview({ answer }: { answer: Answer }) {
  if (answer.media_url) {
    return (
      <a
        href={answer.media_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
      >
        <span className="material-symbols-outlined text-base">play_circle</span>
        Виж медия
      </a>
    )
  }
  if (answer.text_content) {
    const preview =
      answer.text_content.length > 120
        ? answer.text_content.slice(0, 120) + '…'
        : answer.text_content
    return (
      <p className="text-gray-600 text-sm leading-relaxed italic" style={{ fontFamily: 'Noto Serif, serif' }}>
        „{preview}"
      </p>
    )
  }
  return <span className="text-gray-300 text-sm">—</span>
}

export default function AnswersTable({ answers, classId }: Props) {
  const [filter, setFilter] = useState<FilterTab>('submitted')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  function handleBulkApprove(e: React.MouseEvent, submittedIds: string[]) {
    e.stopPropagation()
    startTransition(async () => {
      await bulkApproveAnswers(submittedIds, classId)
    })
  }

  function toggleExpand(studentId: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(studentId)) next.delete(studentId)
      else next.add(studentId)
      return next
    })
  }

  const filtered = answers.filter((a) => {
    if (filter === 'all') return true
    if (filter === 'submitted') return a.status === 'submitted'
    if (filter === 'approved') return a.status === 'approved'
    return true
  })

  const studentMap = new Map<string, { name: string; answers: Answer[] }>()
  for (const a of filtered) {
    const key = a.student_id
    if (!studentMap.has(key)) {
      studentMap.set(key, {
        name: `${a.students.first_name} ${a.students.last_name}`,
        answers: [],
      })
    }
    studentMap.get(key)!.answers.push(a)
  }
  const studentGroups = Array.from(studentMap.entries()).sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  )

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'Всички', count: answers.length },
    { key: 'submitted', label: 'Чакащи', count: answers.filter((a) => a.status === 'submitted').length },
    { key: 'approved', label: 'Одобрени', count: answers.filter((a) => a.status === 'approved').length },
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-6 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  filter === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {studentGroups.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">
            volunteer_activism
          </span>
          <p className="text-gray-500 text-sm font-medium">
            {filter === 'submitted' ? 'Няма чакащи отговори' : 'Няма отговори'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {studentGroups.map(([studentId, group]) => {
            const submittedIds = group.answers
              .filter((a) => a.status === 'submitted')
              .map((a) => a.id)
            const isOpen = expanded.has(studentId)

            return (
              <div
                key={studentId}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Student header row */}
                <div
                  role="button"
                  onClick={() => toggleExpand(studentId)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold flex-shrink-0">
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{group.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {group.answers.length}{' '}
                        {group.answers.length === 1 ? 'отговор' : 'отговора'}
                        {submittedIds.length > 0 && (
                          <span className="ml-2 text-amber-500 font-medium">
                            · {submittedIds.length} чакащи
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {submittedIds.length > 0 && (
                      <button
                        onClick={(e) => handleBulkApprove(e, submittedIds)}
                        disabled={isPending}
                        className="text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      >
                        Одобри всички ({submittedIds.length})
                      </button>
                    )}
                    <span
                      className={`material-symbols-outlined text-gray-300 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Expanded answers */}
                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {group.answers
                      .sort((a, b) => a.questions.order_index - b.questions.order_index)
                      .map((answer) => (
                        <div key={answer.id} className="px-6 py-5">
                          <div className="flex items-start gap-6">
                            <div className="flex-1 min-w-0">
                              {/* Question label */}
                              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                                Въпрос {answer.questions.order_index}
                              </p>
                              {/* Question text */}
                              <p
                                className="text-base text-indigo-700 font-medium mb-3 leading-snug"
                                style={{ fontFamily: 'Noto Serif, serif' }}
                              >
                                {answer.questions.text}
                              </p>
                              {/* Answer content */}
                              <ContentPreview answer={answer} />
                            </div>
                            <div className="flex flex-col items-end gap-3 flex-shrink-0 pt-1">
                              <StatusBadge status={answer.status} />
                              <AnswerActions answer={answer} classId={classId} />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
