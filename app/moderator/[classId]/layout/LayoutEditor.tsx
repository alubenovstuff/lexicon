'use client'

import { useState, useCallback, useTransition } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import Link from 'next/link'
import { saveLayout } from './actions'
import type { Block, BlockType } from '@/lib/templates/types'
import BlockCard from './BlockCard'
import AddBlockDrawer from './AddBlockDrawer'
import { nanoid } from 'nanoid'
import { templatePresets } from '@/lib/templates/presets'
import type { LayoutAssets } from '@/lib/templates/types'

const TEMPLATE_UI = [
  {
    id: 'classic',
    name: 'Класика',
    icon: 'menu_book',
    color: 'bg-[#e2dfff]',
    accent: 'text-[#3632b7]',
    border: 'border-[#3632b7]',
    dot: 'bg-[#3632b7]',
  },
  {
    id: 'magazine',
    name: 'Списание',
    icon: 'article',
    color: 'bg-[#ffedd5]',
    accent: 'text-[#c2410c]',
    border: 'border-[#c2410c]',
    dot: 'bg-[#c2410c]',
  },
  {
    id: 'adventure',
    name: 'Приключение',
    icon: 'bolt',
    color: 'bg-[#d1fae5]',
    accent: 'text-[#065f46]',
    border: 'border-[#065f46]',
    dot: 'bg-[#065f46]',
  },
  {
    id: 'custom',
    name: 'Собствен',
    icon: 'tune',
    color: 'bg-gray-100',
    accent: 'text-gray-600',
    border: 'border-gray-400',
    dot: 'bg-gray-400',
  },
]

interface Props {
  classId: string
  className: string
  initialBlocks: Block[]
  templateId: string
  assets: LayoutAssets
}

export default function LayoutEditor({ classId, className, initialBlocks, templateId: initialTemplateId, assets }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [activeTemplate, setActiveTemplate] = useState(initialTemplateId || 'classic')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmTemplate, setConfirmTemplate] = useState<string | null>(null)
  const [saved, setSaved] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIdx = items.findIndex(b => b.id === active.id)
        const newIdx = items.findIndex(b => b.id === over.id)
        return arrayMove(items, oldIdx, newIdx)
      })
      setSaved(false)
    }
  }

  function removeBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id))
    setActiveTemplate('custom')
    setSaved(false)
  }

  function updateBlock(id: string, config: Record<string, unknown>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, config } : b))
    setSaved(false)
  }

  function addBlock(type: BlockType) {
    const newBlock: Block = { id: nanoid(8), type, config: {} }
    setBlocks(prev => [...prev, newBlock])
    setActiveTemplate('custom')
    setDrawerOpen(false)
    setSaved(false)
  }

  function applyTemplate(id: string) {
    if (id === 'custom') {
      setActiveTemplate('custom')
      setConfirmTemplate(null)
      return
    }
    const preset = templatePresets.find(t => t.id === id)
    if (!preset) return
    // Re-generate fresh IDs so dnd-kit doesn't get confused
    const freshBlocks = preset.blocks.map(b => ({ ...b, id: nanoid(8) }))
    setBlocks(freshBlocks)
    setActiveTemplate(id)
    setConfirmTemplate(null)
    setSaved(false)
  }

  function handleTemplateClick(id: string) {
    if (id === activeTemplate) return
    if (id === 'custom') {
      setActiveTemplate('custom')
      return
    }
    // Warn before overwriting custom changes
    if (!saved || activeTemplate === 'custom') {
      setConfirmTemplate(id)
    } else {
      applyTemplate(id)
    }
  }

  const handleSave = useCallback(() => {
    setSaveError(null)
    startTransition(async () => {
      const result = await saveLayout(classId, blocks, activeTemplate)
      if (result.error) {
        setSaveError(result.error)
      } else {
        setSaved(true)
      }
    })
  }, [classId, blocks, activeTemplate])

  const activeUI = TEMPLATE_UI.find(t => t.id === activeTemplate) ?? TEMPLATE_UI[3]

  return (
    <div className="min-h-screen bg-[#faf9f8]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/moderator/${classId}`} className="text-gray-400 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Редактор на лексикон</p>
            <p className="font-bold text-gray-800 text-sm truncate">{className}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/lexicon/${classId}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-xl px-3 py-2 hover:border-gray-400 transition-colors"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            <span className="hidden sm:inline">Преглед</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={isPending || saved}
            className={`inline-flex items-center gap-1.5 text-sm font-bold rounded-xl px-4 py-2 transition-all disabled:opacity-50 ${
              saved
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow'
            }`}
          >
            <span className="material-symbols-outlined text-base">{saved ? 'check' : 'save'}</span>
            {isPending ? 'Запазване...' : saved ? 'Запазено' : 'Запази'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {saveError}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* ── Template picker ───────────────────────────────────────── */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Шаблон</p>
          <div className="grid grid-cols-4 gap-2">
            {TEMPLATE_UI.map((t) => {
              const isActive = activeTemplate === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => handleTemplateClick(t.id)}
                  className={`relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all ${
                    isActive
                      ? `${t.border} ${t.color}`
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-1.5 right-1.5 material-symbols-outlined text-sm text-green-500">
                      check_circle
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? t.color : 'bg-gray-100'}`}>
                    <span className={`material-symbols-outlined text-xl ${isActive ? t.accent : 'text-gray-400'}`}>
                      {t.icon}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold text-center leading-tight ${isActive ? t.accent : 'text-gray-500'}`}>
                    {t.name}
                  </span>
                </button>
              )
            })}
          </div>

          {activeTemplate !== 'custom' && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              Шаблон <span className={`font-semibold ${activeUI.accent}`}>{activeUI.name}</span> — пренарели или изтрий блокове за собствен наредба
            </p>
          )}
          {activeTemplate === 'custom' && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              Собствен наредба — цветовата схема е от последния избран шаблон
            </p>
          )}
        </div>

        {/* ── Blocks canvas ────────────────────────────────────────── */}
        <div>
          <p className="text-xs text-gray-400 mb-3">
            <span className="font-bold">{blocks.length}</span> блока · плъзни за пренареждане
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {blocks.map((block) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    assets={assets}
                    onRemove={() => removeBlock(block.id)}
                    onUpdate={(config) => updateBlock(block.id, config)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            onClick={() => setDrawerOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-2xl py-5 text-sm text-gray-400 hover:text-indigo-600 transition-all"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Добави блок
          </button>
        </div>

        <div className="text-center pb-8">
          <Link href={`/moderator/${classId}`} className="text-sm text-indigo-600 hover:underline">
            Към дашборда →
          </Link>
        </div>
      </div>

      {/* ── Add block drawer ──────────────────────────────────────── */}
      {drawerOpen && (
        <AddBlockDrawer
          onAdd={addBlock}
          onClose={() => setDrawerOpen(false)}
          existingTypes={blocks.map(b => b.type)}
        />
      )}

      {/* ── Confirm template switch modal ─────────────────────────── */}
      {confirmTemplate && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm" onClick={() => setConfirmTemplate(null)} />
          <div className="fixed inset-x-4 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-96 z-50 bg-white rounded-3xl shadow-2xl p-6">
            <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${TEMPLATE_UI.find(t=>t.id===confirmTemplate)?.color}`}>
              <span className={`material-symbols-outlined text-2xl ${TEMPLATE_UI.find(t=>t.id===confirmTemplate)?.accent}`}>
                {TEMPLATE_UI.find(t=>t.id===confirmTemplate)?.icon}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-1">Смяна на шаблон?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Шаблон „{TEMPLATE_UI.find(t=>t.id===confirmTemplate)?.name}" ще замени текущите блокове. Незапазените промени ще се изгубят.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmTemplate(null)}
                className="py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={() => applyTemplate(confirmTemplate)}
                className="py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                Смени
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
