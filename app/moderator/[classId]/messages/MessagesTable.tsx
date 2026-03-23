'use client'

import { useState } from 'react'
import MessageActions from './MessageActions'

export interface Message {
  id: string
  content: string
  status: string
  created_at: string
  recipient: { first_name: string; last_name: string }
  author: { first_name: string; last_name: string }
}

interface Props {
  messages: Message[]
  classId: string
}

type FilterTab = 'all' | 'pending' | 'approved'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export default function MessagesTable({ messages, classId }: Props) {
  const [filter, setFilter] = useState<FilterTab>('pending')

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'Всички', count: messages.length },
    { key: 'pending', label: 'Чакащи', count: messages.filter((m) => m.status === 'pending').length },
    { key: 'approved', label: 'Одобрени', count: messages.filter((m) => m.status === 'approved').length },
  ]

  const filtered = messages.filter((m) => {
    if (filter === 'all') return true
    if (filter === 'pending') return m.status === 'pending'
    if (filter === 'approved') return m.status === 'approved'
    return true
  })

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
                  filter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">forum</span>
          <p className="text-gray-500 text-sm font-medium">
            {filter === 'pending' ? 'Няма чакащи послания' : 'Няма послания'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((message) => {
            const preview =
              message.content.length > 160
                ? message.content.slice(0, 160) + '…'
                : message.content

            return (
              <div
                key={message.id}
                className="bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-5">
                  {/* From → To */}
                  <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                      {initials(message.author.first_name, message.author.last_name)}
                    </div>
                    <span className="material-symbols-outlined text-gray-300 text-base">arrow_forward</span>
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">
                      {initials(message.recipient.first_name, message.recipient.last_name)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">
                        {message.author.first_name} {message.author.last_name}
                      </span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {message.recipient.first_name} {message.recipient.last_name}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{formatDate(message.created_at)}</span>
                    </div>
                    <p
                      className="text-sm text-gray-600 leading-relaxed italic"
                      style={{ fontFamily: 'Noto Serif, serif' }}
                    >
                      „{preview}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 pt-0.5">
                    <MessageActions message={message} classId={classId} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
