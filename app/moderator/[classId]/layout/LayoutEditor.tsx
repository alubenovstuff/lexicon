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

interface Props {
  classId: string
  className: string
  initialBlocks: Block[]
  templateId: string
}

export default function LayoutEditor({ classId, className, initialBlocks, templateId }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [drawerOpen, setDrawerOpen] = useState(false)
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
    setSaved(false)
  }

  function updateBlock(id: string, config: Record<string, unknown>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, config } : b))
    setSaved(false)
  }

  function addBlock(type: BlockType) {
    const newBlock: Block = { id: nanoid(8), type, config: {} }
    setBlocks(prev => [...prev, newBlock])
    setDrawerOpen(false)
    setSaved(false)
  }

  const handleSave = useCallback(() => {
    setSaveError(null)
    startTransition(async () => {
      const result = await saveLayout(classId, blocks)
      if (result.error) {
        setSaveError(result.error)
      } else {
        setSaved(true)
      }
    })
  }, [classId, blocks])

  return (
    <div className="min-h-screen bg-[#faf9f8]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/moderator/${classId}`}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
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
            Преглед
          </Link>
          <button
            onClick={handleSave}
            disabled={isPending || saved}
            className={`inline-flex items-center gap-1.5 text-sm font-bold rounded-xl px-4 py-2 transition-all ${
              saved
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow'
            } disabled:opacity-50`}
          >
            <span className="material-symbols-outlined text-base">
              {saved ? 'check' : 'save'}
            </span>
            {isPending ? 'Запазване...' : saved ? 'Запазено' : 'Запази'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {saveError}
        </div>
      )}

      {/* Canvas */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">
            <span className="font-bold">{blocks.length}</span> блока · плъзни за пренареждане
          </p>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {blocks.map((block) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onRemove={() => removeBlock(block.id)}
                  onUpdate={(config) => updateBlock(block.id, config)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add block button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="mt-6 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-2xl py-5 text-sm text-gray-400 hover:text-indigo-600 transition-all"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          Добави блок
        </button>

        {/* Quick nav to dashboard */}
        <div className="mt-10 text-center">
          <Link
            href={`/moderator/${classId}`}
            className="text-sm text-indigo-600 hover:underline"
          >
            Към дашборда →
          </Link>
        </div>
      </div>

      {/* Add block drawer */}
      {drawerOpen && (
        <AddBlockDrawer
          onAdd={addBlock}
          onClose={() => setDrawerOpen(false)}
          existingTypes={blocks.map(b => b.type)}
        />
      )}
    </div>
  )
}
