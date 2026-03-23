'use client'

import Link from 'next/link'

interface Props {
  classData: { id: string; name: string; school_year: string; status: string }
  students: Array<{ id: string; first_name: string; last_name: string; invite_accepted_at: string | null }>
  pendingAnswers: number
  pendingMessages: number
  hasQuestionnaire: boolean
  events: Array<{ id: string; title: string; event_date: string | null }>
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Чернова',
  active: 'Активен',
  ready_for_payment: 'Готов за плащане',
  pending_payment: 'Очаква плащане',
  published: 'Публикуван',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  ready_for_payment: 'bg-blue-100 text-blue-700',
  pending_payment: 'bg-yellow-100 text-yellow-700',
  published: 'bg-indigo-100 text-indigo-700',
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })
}

export default function Dashboard({ classData, students, pendingAnswers, pendingMessages, hasQuestionnaire, events }: Props) {
  const totalStudents = students.length
  const acceptedStudents = students.filter((s) => s.invite_accepted_at !== null).length
  const progressPercent = totalStudents > 0 ? Math.round((acceptedStudents / totalStudents) * 100) : 0

  const statusLabel = STATUS_LABELS[classData.status] ?? classData.status
  const statusColor = STATUS_COLORS[classData.status] ?? 'bg-gray-100 text-gray-600'

  const baseUrl = `/moderator/${classData.id}`

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Учебна година: {classData.school_year}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Прогрес на класа</span>
            <span className="text-sm text-gray-500">
              {acceptedStudents} от {totalStudents} деца са попълнили профила си
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progressPercent}%</p>
        </div>

        {/* Въпросник — primary action */}
        <Link href={`${baseUrl}/questions`} className="block">
          <div className="bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-2xl p-6 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">Въпросник</p>
                <p className="text-indigo-200 text-sm mt-1">
                  Изберете и настройте въпросите, на които децата ще отговарят
                </p>
              </div>
              <span className="text-indigo-300 text-2xl">→</span>
            </div>
          </div>
        </Link>

        {/* Покани деца — full width */}
        {hasQuestionnaire ? (
          <Link href={`${baseUrl}/students`} className="block">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-800">Покани деца</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {totalStudents > 0
                      ? `${acceptedStudents} от ${totalStudents} приели поканата`
                      : 'Все още няма добавени деца'}
                  </p>
                </div>
                <span className="text-gray-300 hover:text-indigo-400 transition-colors text-2xl">→</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 opacity-60 cursor-not-allowed">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-gray-500">Покани деца</p>
                <p className="text-sm text-gray-400 mt-0.5">Първо създайте въпросника</p>
              </div>
              <span className="text-gray-300 text-2xl">🔒</span>
            </div>
          </div>
        )}

        {/* Общи събития */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <Link href={`${baseUrl}/events`}>
            <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div>
                <p className="text-base font-semibold text-gray-800">Общи събития 📅</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {events.length > 0 ? `${events.length} добавени` : 'Специални моменти от годината'}
                </p>
              </div>
              <span className="text-gray-300 hover:text-indigo-400 text-xl">→</span>
            </div>
          </Link>

          {events.length > 0 && (
            <div className="border-t border-gray-100 divide-y divide-gray-100">
              {events.map((event, i) => (
                <div key={event.id} className="flex items-center gap-3 px-6 py-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700 flex-1">{event.title}</span>
                  {event.event_date && (
                    <span className="text-xs text-gray-400">{formatDate(event.event_date)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Преглед — Отговори, Послания, Супергерой */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-base font-semibold text-gray-800">Преглед</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <Link href={`${baseUrl}/answers`} className="group p-5 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-medium text-gray-700 mb-1">Отговори</p>
              {pendingAnswers > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                  {pendingAnswers} нови
                </span>
              ) : (
                <span className="text-xs text-gray-400">Няма нови</span>
              )}
            </Link>

            <Link href={`${baseUrl}/messages`} className="group p-5 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-medium text-gray-700 mb-1">Послания</p>
              {pendingMessages > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                  {pendingMessages} нови
                </span>
              ) : (
                <span className="text-xs text-gray-400">Няма нови</span>
              )}
            </Link>

            <Link href={`${baseUrl}/superhero`} className="group p-5 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-medium text-gray-700 mb-1">Супергерой 🦸</p>
              <span className="text-xs text-gray-400">AI образ на класната</span>
            </Link>
          </div>
        </div>

        {/* Преглед на лексикона */}
        <Link href={`/class/${classData.id}/home`} className="block">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-gray-800">Преглед на лексикона</p>
                <p className="text-sm text-gray-400 mt-0.5">Виж как ще изглежда за родителите</p>
              </div>
              <span className="text-gray-300 hover:text-indigo-400 transition-colors text-2xl">→</span>
            </div>
          </div>
        </Link>

        {/* Финализирай */}
        <Link href={`${baseUrl}/finalize`} className="block">
          <div className="bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-2xl p-6 cursor-pointer shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">Финализирай лексикона</p>
                <p className="text-emerald-100 text-sm mt-1">
                  Всичко готово? Заключи и публикувай за целия клас.
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <span className="text-white text-2xl">✓</span>
              </div>
            </div>
          </div>
        </Link>

      </div>
    </main>
  )
}
