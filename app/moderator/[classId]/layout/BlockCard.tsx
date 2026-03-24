'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block, BlockType } from '@/lib/templates/types'

const BLOCK_META: Record<BlockType, { label: string; icon: string; color: string }> = {
  hero: { label: 'Герой', icon: 'photo', color: 'bg-[#e2dfff] text-[#3632b7]' },
  students_grid: { label: 'Ученици', icon: 'people', color: 'bg-blue-50 text-blue-700' },
  question: { label: 'Въпрос', icon: 'quiz', color: 'bg-amber-50 text-amber-700' },
  photo_gallery: { label: 'Галерия', icon: 'photo_library', color: 'bg-pink-50 text-pink-700' },
  poll: { label: 'Анкета', icon: 'bar_chart', color: 'bg-green-50 text-green-700' },
  class_voice: { label: 'Гласът на класа', icon: 'record_voice_over', color: 'bg-purple-50 text-purple-700' },
  events: { label: 'Спомени', icon: 'photo_album', color: 'bg-orange-50 text-orange-700' },
  superhero: { label: 'Супергерой', icon: 'bolt', color: 'bg-yellow-50 text-yellow-700' },
}

interface Props {
  block: Block
  onRemove: () => void
  onUpdate: (config: Record<string, unknown>) => void
}

export default function BlockCard({ block, onRemove, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const meta = BLOCK_META[block.type]

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
        >
          <span className="material-symbols-outlined text-xl">drag_indicator</span>
        </button>

        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.color}`}>
          <span className="material-symbols-outlined text-base">{meta.icon}</span>
        </div>

        {/* Label */}
        <span className="font-semibold text-gray-800 text-sm flex-1">{meta.label}</span>

        {/* Expand config */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-gray-300 hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            {expanded ? 'expand_less' : 'settings'}
          </span>
        </button>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <span className="material-symbols-outlined text-base">delete</span>
        </button>
      </div>

      {/* Config panel */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 bg-gray-50/50">
          <BlockConfigPanel block={block} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  )
}

function BlockConfigPanel({ block, onUpdate }: { block: Block; onUpdate: (c: Record<string, unknown>) => void }) {
  const cfg = block.config as Record<string, unknown>

  function set(key: string, value: unknown) {
    onUpdate({ ...cfg, [key]: value })
  }

  switch (block.type) {
    case 'students_grid':
      return (
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Колони</span>
            <select
              value={(cfg.columns as number) ?? 4}
              onChange={e => set('columns', Number(e.target.value))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={(cfg.showTeaser as boolean) ?? true}
              onChange={e => set('showTeaser', e.target.checked)}
              className="rounded"
            />
            Покажи тийзър отговор
          </label>
        </div>
      )

    case 'question':
      return (
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Оформление</span>
            <select
              value={(cfg.layout as string) ?? 'grid'}
              onChange={e => set('layout', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="grid">Решетка</option>
              <option value="list">Списък</option>
              <option value="masonry">Масонри</option>
            </select>
          </label>
          <p className="text-xs text-gray-400">
            Свъртете въпрос от страницата на ученика след запазване.
          </p>
        </div>
      )

    case 'photo_gallery':
      return (
        <label className="block">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Колони</span>
          <select
            value={(cfg.columns as number) ?? 3}
            onChange={e => set('columns', Number(e.target.value))}
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </label>
      )

    case 'events':
      return (
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Стил</span>
            <select
              value={(cfg.style as string) ?? 'polaroids'}
              onChange={e => set('style', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="polaroids">Поляроиди</option>
              <option value="cards">Карти</option>
              <option value="timeline">Таймлайн</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Брой спомени</span>
            <input
              type="number"
              min={1}
              max={20}
              value={(cfg.limit as number) ?? 4}
              onChange={e => set('limit', Number(e.target.value))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          </label>
        </div>
      )

    default:
      return (
        <p className="text-xs text-gray-400">Няма настройки за този блок.</p>
      )
  }
}
