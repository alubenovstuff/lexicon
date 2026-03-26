'use client'

import type { Block, BlockType, LayoutAssets } from '@/lib/templates/types'

const BLOCK_META: Record<BlockType, { label: string; icon: string; color: string }> = {
  hero:          { label: 'Герой',            icon: 'add_a_photo',       color: 'bg-[#e2dfff] text-[#3632b7]' },
  students_grid: { label: 'Ученици',          icon: 'people',            color: 'bg-blue-50 text-blue-700'    },
  question:      { label: 'Въпрос',           icon: 'quiz',              color: 'bg-amber-50 text-amber-700'  },
  photo_gallery: { label: 'Галерия',          icon: 'photo_library',     color: 'bg-pink-50 text-pink-700'    },
  poll:          { label: 'Анкета',           icon: 'bar_chart',         color: 'bg-green-50 text-green-700'  },
  polls_grid:    { label: 'Победители',       icon: 'emoji_events',      color: 'bg-emerald-50 text-emerald-700' },
  class_voice:   { label: 'Гласът на класа', icon: 'record_voice_over', color: 'bg-purple-50 text-purple-700'},
  subjects_bar:  { label: 'Предмети (графика)', icon: 'bar_chart',       color: 'bg-teal-50 text-teal-700'   },
  events:        { label: 'Спомени',          icon: 'photo_album',       color: 'bg-orange-50 text-orange-700'},
  superhero:     { label: 'Супергерой',       icon: 'bolt',              color: 'bg-yellow-50 text-yellow-700'},
}

interface Props {
  block: Block
  assets: LayoutAssets
  blockIndex: number
  blocksTotal: number
  onUpdate: (config: Record<string, unknown>) => void
  onRemove: () => void
  onMove: (dir: 'up' | 'down') => void
  onClose: () => void
}

export default function BlockConfigDrawer({ block, assets, blockIndex, blocksTotal, onUpdate, onRemove, onMove, onClose }: Props) {
  const meta = BLOCK_META[block.type]
  const cfg = block.config as Record<string, unknown>

  function set(key: string, value: unknown) {
    onUpdate({ ...cfg, [key]: value })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/10 z-40" onClick={onClose} />
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[75vh] overflow-y-auto">

        {/* Handle + header */}
        <div className="sticky top-0 bg-white px-5 pt-4 pb-3 border-b border-gray-50">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${meta.color}`}>
              <span className="material-symbols-outlined text-base">{meta.icon}</span>
            </div>
            <p className="font-bold text-gray-800 flex-1">{meta.label}</p>

            {/* Reorder */}
            <button
              onClick={() => onMove('up')}
              disabled={blockIndex === 0}
              className="text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_upward</span>
            </button>
            <button
              onClick={() => onMove('down')}
              disabled={blockIndex === blocksTotal - 1}
              className="text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
            </button>

            {/* Delete */}
            <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors ml-1">
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>

            {/* Close */}
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors ml-1">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Config body */}
        <div className="px-5 py-5 space-y-5 pb-safe-area-inset-bottom pb-8">
          <ConfigBody type={block.type} cfg={cfg} assets={assets} set={set} />
        </div>
      </div>
    </>
  )
}

// ── Config body ────────────────────────────────────────────────────────────

function ConfigBody({ type, cfg, assets, set }: {
  type: BlockType
  cfg: Record<string, unknown>
  assets: LayoutAssets
  set: (key: string, value: unknown) => void
}) {
  switch (type) {

    case 'question':
      return (
        <div className="space-y-4">
          <AssetPicker
            label="Въпрос"
            value={(cfg.questionId as string) ?? ''}
            options={assets.questions}
            emptyLabel="Избери въпрос..."
            onChange={v => set('questionId', v || null)}
          />
          <SelectField
            label="Оформление на отговорите"
            value={(cfg.layout as string) ?? 'grid'}
            options={[
              { value: 'grid',    label: 'Решетка' },
              { value: 'list',    label: 'Списък' },
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

    case 'subjects_bar':
      return (
        <AssetPicker
          label="Въпрос (class voice)"
          value={(cfg.questionId as string) ?? ''}
          options={assets.voiceQuestions}
          emptyLabel="Избери въпрос..."
          onChange={v => set('questionId', v || null)}
        />
      )

    case 'photo_gallery':
      return (
        <div className="space-y-4">
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
            options={[{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]}
            onChange={v => set('columns', Number(v))}
          />
        </div>
      )

    case 'students_grid':
      return (
        <div className="space-y-4">
          <SelectField
            label="Колони"
            value={String((cfg.columns as number) ?? 4)}
            options={[{ value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }]}
            onChange={v => set('columns', Number(v))}
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={(cfg.showTeaser as boolean) ?? true}
              onChange={e => set('showTeaser', e.target.checked)}
              className="rounded w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm text-gray-700">Покажи тийзър отговор</span>
          </label>
        </div>
      )

    case 'events':
      return (
        <div className="space-y-4">
          <SelectField
            label="Стил"
            value={(cfg.style as string) ?? 'polaroids'}
            options={[
              { value: 'polaroids',  label: 'Поляроиди' },
              { value: 'cards',      label: 'Карти' },
              { value: 'timeline',   label: 'Таймлайн' },
              { value: 'photo_grid', label: 'Фото грид' },
            ]}
            onChange={v => set('style', v)}
          />
          <label className="block">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Брой спомени</span>
            <input
              type="number" min={1} max={20}
              value={(cfg.limit as number) ?? 4}
              onChange={e => set('limit', Number(e.target.value))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>
        </div>
      )

    default:
      return <p className="text-sm text-gray-400">Няма допълнителни настройки за този блок.</p>
  }
}

// ── Field helpers ──────────────────────────────────────────────────────────

function AssetPicker({ label, value, options, emptyLabel, onChange }: {
  label: string; value: string
  options: { id: string; label: string }[]
  emptyLabel: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      {options.length === 0 ? (
        <p className="mt-2 text-xs text-gray-400 italic bg-gray-50 rounded-xl px-4 py-3">
          Няма налични елементи — добавете от съответния раздел в дашборда.
        </p>
      ) : (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">{emptyLabel}</option>
          {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      )}
    </label>
  )
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}
