'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block, BlockType, LayoutAssets } from '@/lib/templates/types'

const BLOCK_META: Record<BlockType, { label: string; icon: string; color: string }> = {
  hero:          { label: 'Герой',           icon: 'photo',             color: 'bg-[#e2dfff] text-[#3632b7]' },
  students_grid: { label: 'Ученици',         icon: 'people',            color: 'bg-blue-50 text-blue-700'   },
  question:      { label: 'Въпрос',          icon: 'quiz',              color: 'bg-amber-50 text-amber-700' },
  photo_gallery: { label: 'Галерия',         icon: 'photo_library',     color: 'bg-pink-50 text-pink-700'   },
  poll:          { label: 'Анкета',          icon: 'bar_chart',         color: 'bg-green-50 text-green-700' },
  class_voice:   { label: 'Гласът на класа', icon: 'record_voice_over', color: 'bg-purple-50 text-purple-700' },
  events:        { label: 'Спомени',         icon: 'photo_album',       color: 'bg-orange-50 text-orange-700' },
  superhero:     { label: 'Супергерой',      icon: 'bolt',              color: 'bg-yellow-50 text-yellow-700' },
}

interface Props {
  block: Block
  assets: LayoutAssets
  onRemove: () => void
  onUpdate: (config: Record<string, unknown>) => void
}

export default function BlockCard({ block, assets, onRemove, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const meta = BLOCK_META[block.type]
  const cfg = block.config as Record<string, unknown>

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Derive a subtitle showing linked asset name
  const subtitle = getBlockSubtitle(block.type, cfg, assets)
  const isLinked = !!subtitle && subtitle !== '—'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow ${
        isDragging ? 'shadow-lg border-gray-200' : isLinked ? 'border-indigo-100' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
        >
          <span className="material-symbols-outlined text-xl">drag_indicator</span>
        </button>

        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${meta.color}`}>
          <span className="material-symbols-outlined text-base">{meta.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{meta.label}</p>
          {subtitle && (
            <p className={`text-xs truncate mt-0.5 ${isLinked ? 'text-indigo-500' : 'text-gray-400 italic'}`}>
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          className={`transition-colors ${expanded ? 'text-indigo-500' : 'text-gray-300 hover:text-gray-600'}`}
        >
          <span className="material-symbols-outlined text-base">
            {expanded ? 'expand_less' : 'tune'}
          </span>
        </button>

        <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined text-base">delete</span>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 bg-gray-50/50 space-y-4">
          <BlockConfigPanel block={block} cfg={cfg} assets={assets} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  )
}

// ── Subtitle helper ────────────────────────────────────────────────────────

function getBlockSubtitle(type: BlockType, cfg: Record<string, unknown>, assets: LayoutAssets): string | null {
  switch (type) {
    case 'question': {
      const qid = cfg.questionId as string | null
      if (!qid) return 'Без избран въпрос'
      return assets.questions.find(q => q.id === qid)?.label ?? 'Въпрос'
    }
    case 'poll': {
      const pid = cfg.pollId as string | null
      if (!pid) return 'Без избрана анкета'
      return assets.polls.find(p => p.id === pid)?.label ?? 'Анкета'
    }
    case 'class_voice': {
      const qid = cfg.questionId as string | null
      if (!qid) return 'Без избран въпрос'
      return assets.voiceQuestions.find(q => q.id === qid)?.label ?? 'Гласът на класа'
    }
    case 'hero': return 'Заглавна снимка + надпис'
    case 'superhero': return 'AI-генерирано изображение'
    case 'students_grid': return 'Всички ученици в класа'
    case 'photo_gallery': {
      const qid = cfg.questionId as string | null
      if (!qid) return 'Без свързан въпрос за снимки'
      return assets.questions.find(q => q.id === qid)?.label ?? 'Снимки'
    }
    case 'events': {
      const limit = (cfg.limit as number) ?? 4
      return `${limit} спомени · ${styleLabel((cfg.style as string) ?? 'polaroids')}`
    }
    default: return null
  }
}

function styleLabel(s: string) {
  return s === 'polaroids' ? 'поляроиди' : s === 'cards' ? 'карти' : 'таймлайн'
}

// ── Config panel ───────────────────────────────────────────────────────────

interface PanelProps {
  block: Block
  cfg: Record<string, unknown>
  assets: LayoutAssets
  onUpdate: (c: Record<string, unknown>) => void
}

function BlockConfigPanel({ block, cfg, assets, onUpdate }: PanelProps) {
  function set(key: string, value: unknown) {
    onUpdate({ ...cfg, [key]: value })
  }

  switch (block.type) {

    case 'question':
      return (
        <div className="space-y-3">
          <AssetPicker
            label="Въпрос"
            value={(cfg.questionId as string) ?? ''}
            options={assets.questions}
            emptyLabel="Избери въпрос..."
            onChange={v => set('questionId', v || null)}
          />
          <SelectField
            label="Оформление"
            value={(cfg.layout as string) ?? 'grid'}
            options={[
              { value: 'grid', label: 'Решетка' },
              { value: 'list', label: 'Списък' },
              { value: 'masonry', label: 'Масонри' },
            ]}
            onChange={v => set('layout', v)}
          />
        </div>
      )

    case 'poll':
      return (
        <AssetPicker
          label="Анкета"
          value={(cfg.pollId as string) ?? ''}
          options={assets.polls}
          emptyLabel="Избери анкета..."
          onChange={v => set('pollId', v || null)}
        />
      )

    case 'class_voice':
      return (
        <AssetPicker
          label="Въпрос за гласа на класа"
          value={(cfg.questionId as string) ?? ''}
          options={assets.voiceQuestions}
          emptyLabel="Избери въпрос..."
          onChange={v => set('questionId', v || null)}
        />
      )

    case 'photo_gallery':
      return (
        <div className="space-y-3">
          <AssetPicker
            label="Въпрос с медия отговори"
            value={(cfg.questionId as string) ?? ''}
            options={assets.questions}
            emptyLabel="Избери въпрос..."
            onChange={v => set('questionId', v || null)}
          />
          <SelectField
            label="Колони"
            value={String((cfg.columns as number) ?? 3)}
            options={[
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
            onChange={v => set('columns', Number(v))}
          />
        </div>
      )

    case 'students_grid':
      return (
        <div className="space-y-3">
          <SelectField
            label="Колони"
            value={String((cfg.columns as number) ?? 4)}
            options={[
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
            ]}
            onChange={v => set('columns', Number(v))}
          />
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

    case 'events':
      return (
        <div className="space-y-3">
          <SelectField
            label="Стил"
            value={(cfg.style as string) ?? 'polaroids'}
            options={[
              { value: 'polaroids', label: 'Поляроиди' },
              { value: 'cards', label: 'Карти' },
              { value: 'timeline', label: 'Таймлайн' },
            ]}
            onChange={v => set('style', v)}
          />
          <label className="block">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Брой</span>
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
      return <p className="text-xs text-gray-400">Няма настройки за този блок.</p>
  }
}

// ── Reusable field components ──────────────────────────────────────────────

function AssetPicker({
  label, value, options, emptyLabel, onChange,
}: {
  label: string
  value: string
  options: { id: string; label: string }[]
  emptyLabel: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      {options.length === 0 ? (
        <p className="mt-1 text-xs text-gray-400 italic">
          Няма налични елементи — добавете ги от съответния раздел в дашборда.
        </p>
      ) : (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">{emptyLabel}</option>
          {options.map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      )}
    </label>
  )
}

function SelectField({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}
