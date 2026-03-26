'use client'

import type { Block, BlockType, LayoutAssets } from '@/lib/templates/types'

// ── Meta ──────────────────────────────────────────────────────────────────

const BLOCK_META: Record<BlockType, { label: string; icon: string; addLabel: string }> = {
  hero:          { label: 'Герой',            icon: 'add_a_photo',       addLabel: 'Добави снимка на класа' },
  students_grid: { label: 'Ученици',          icon: 'group',             addLabel: 'Ученици на класа' },
  question:      { label: 'Въпрос',           icon: 'quiz',              addLabel: 'Избери въпрос' },
  photo_gallery: { label: 'Галерия',          icon: 'photo_library',     addLabel: 'Избери въпрос за снимки' },
  poll:          { label: 'Анкета',           icon: 'poll',              addLabel: 'Добави анкета' },
  polls_grid:    { label: 'Победители',       icon: 'emoji_events',      addLabel: 'Победители в анкети' },
  class_voice:   { label: 'Гласът на класа', icon: 'record_voice_over', addLabel: 'Гласът на класа' },
  subjects_bar:  { label: 'Предмети (графика)', icon: 'bar_chart',       addLabel: 'Бар диаграма' },
  events:        { label: 'Спомени',          icon: 'photo_album',       addLabel: 'Добави спомени' },
  superhero:     { label: 'Супергерой',       icon: 'bolt',              addLabel: 'AI изображение на класа' },
}

function linkedLabel(type: BlockType, cfg: Record<string, unknown>, assets: LayoutAssets): string | null {
  switch (type) {
    case 'question':
    case 'photo_gallery': {
      const id = cfg.questionId as string | null
      return id ? (assets.questions.find(q => q.id === id)?.label ?? null) : null
    }
    case 'poll': {
      const id = cfg.pollId as string | null
      return id ? (assets.polls.find(p => p.id === id)?.label ?? null) : null
    }
    case 'class_voice':
    case 'subjects_bar': {
      const id = cfg.questionId as string | null
      return id ? (assets.voiceQuestions.find(q => q.id === id)?.label ?? null) : null
    }
    default: return null
  }
}

// ── Shell ──────────────────────────────────────────────────────────────────

interface CanvasProps {
  blocks: Block[]
  assets: LayoutAssets
  activeId: string | null
  onSelect: (id: string) => void
}

export default function LayoutCanvas({ blocks, assets, activeId, onSelect }: CanvasProps) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <CanvasBlock
          key={block.id}
          block={block}
          assets={assets}
          isActive={activeId === block.id}
          onSelect={() => onSelect(block.id)}
        />
      ))}
    </div>
  )
}

// ── Per-block wrapper ──────────────────────────────────────────────────────

function CanvasBlock({ block, assets, isActive, onSelect }: {
  block: Block
  assets: LayoutAssets
  isActive: boolean
  onSelect: () => void
}) {
  const cfg = block.config as Record<string, unknown>
  const linked = linkedLabel(block.type, cfg, assets)
  const meta = BLOCK_META[block.type]

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl transition-all duration-200 ${
        isActive
          ? 'ring-2 ring-indigo-500 ring-offset-2'
          : 'hover:ring-2 hover:ring-indigo-300 hover:ring-offset-2'
      }`}
    >
      {/* Block label badge */}
      <div className="absolute -top-3 left-4 z-10 flex items-center gap-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
          isActive ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 border border-gray-200'
        }`}>
          {meta.label}
        </span>
        {linked && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 max-w-[160px] truncate">
            {linked}
          </span>
        )}
      </div>

      <BlockVisual block={block} assets={assets} linked={linked} />
    </div>
  )
}

// ── Visual skeletons per block type ───────────────────────────────────────

function BlockVisual({ block, assets, linked }: { block: Block; assets: LayoutAssets; linked: string | null }) {
  const cfg = block.config as Record<string, unknown>
  const meta = BLOCK_META[block.type]

  switch (block.type) {

    case 'hero':
      return (
        <div className="w-full h-[200px] sm:h-[260px] dashed-placeholder rounded-xl bg-[#f4f3f2] flex flex-col items-center justify-center gap-3 hover:bg-white transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#e2dfff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#3632b7] text-3xl">add_a_photo</span>
          </div>
          <span className="font-semibold text-[#3632b7]" style={{ fontFamily: 'Noto Serif, serif' }}>Добави снимка на класа</span>
          <p className="text-xs text-gray-400">Препоръчителен размер: 1920×1080px</p>
        </div>
      )

    case 'superhero':
      return (
        <div className="w-full h-[200px] sm:h-[260px] dashed-placeholder rounded-xl bg-[#fef9c3] flex flex-col items-center justify-center gap-3 hover:bg-white transition-colors">
          <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-yellow-600 text-3xl">bolt</span>
          </div>
          <span className="font-semibold text-yellow-700" style={{ fontFamily: 'Noto Serif, serif' }}>AI Супергерой на класа</span>
          <p className="text-xs text-yellow-500">Генерира се автоматично след настройка</p>
        </div>
      )

    case 'students_grid':
      return (
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif, serif' }}>Нашите ученици</h2>
            <span className="text-xs uppercase tracking-widest text-gray-400">
              {assets.questions.length > 0 ? 'ученици' : 'добавете ученици'}
            </span>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-3 hide-scrollbar">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]" style={{ opacity: 1 - i * 0.15 }}>
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
                  <span className="material-symbols-outlined text-gray-300 text-xl">person</span>
                </div>
                <div className="w-12 h-2 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )

    case 'question': {
      const hasLink = !!linked
      return (
        <div className={`rounded-xl p-8 flex flex-col items-center justify-center min-h-[140px] gap-3 transition-colors ${
          hasLink
            ? 'bg-[#e2dfff] border-2 border-[#3632b7]/30'
            : 'dashed-placeholder bg-[#f4f3f2] hover:bg-white'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasLink ? 'bg-[#3632b7]' : 'bg-amber-50'}`}>
            <span className={`material-symbols-outlined text-2xl ${hasLink ? 'text-white' : 'text-amber-600'}`}>quiz</span>
          </div>
          <span className={`font-semibold text-center ${hasLink ? 'text-[#3632b7]' : 'text-gray-600'}`} style={{ fontFamily: 'Noto Serif, serif' }}>
            {hasLink ? `„${linked}"` : 'Избери въпрос'}
          </span>
          {!hasLink && <p className="text-xs text-gray-400">Отговорите на учениците ще се покажат тук</p>}
          {hasLink && (
            <div className="flex items-center gap-1.5 text-xs text-[#3632b7]/70">
              <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
              Свързан · {(cfg.layout as string) ?? 'grid'} оформление
            </div>
          )}
        </div>
      )
    }

    case 'photo_gallery': {
      const hasLink = !!linked
      return (
        <div className="space-y-3">
          {hasLink ? (
            <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center flex-none">
                <span className="material-symbols-outlined text-pink-500">photo_library</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{linked}</p>
                <p className="text-xs text-pink-500">Фото галерия · {String(cfg.columns ?? 3)} колони</p>
              </div>
              <span className="material-symbols-outlined text-sm text-green-500 ml-auto">check_circle</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="aspect-square dashed-placeholder bg-[#f4f3f2] rounded-xl flex items-center justify-center hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-gray-300 text-2xl">add_photo_alternate</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-400">Избери въпрос за снимки от настройките</p>
            </div>
          )}
        </div>
      )
    }

    case 'class_voice': {
      const hasLink = !!linked
      return (
        <div className={`rounded-xl p-8 flex flex-col items-center justify-center min-h-[130px] gap-3 transition-colors ${
          hasLink
            ? 'bg-purple-50 border-2 border-purple-200'
            : 'dashed-placeholder bg-[#f4f3f2] hover:bg-white'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasLink ? 'bg-purple-600' : 'bg-purple-50'}`}>
            <span className={`material-symbols-outlined text-2xl ${hasLink ? 'text-white' : 'text-purple-400'}`}>record_voice_over</span>
          </div>
          <span className={`font-semibold text-center ${hasLink ? 'text-purple-800' : 'text-gray-600'}`} style={{ fontFamily: 'Noto Serif, serif' }}>
            {hasLink ? `„${linked}"` : 'Гласът на класа'}
          </span>
          {!hasLink && <p className="text-xs text-gray-400">Word cloud с отговорите на класа</p>}
          {hasLink && <span className="text-xs text-purple-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm text-green-500">check_circle</span>Свързан</span>}
        </div>
      )
    }

    case 'poll': {
      const hasLink = !!linked
      return (
        <div className={`rounded-xl p-8 flex flex-col items-center justify-center min-h-[130px] gap-3 transition-colors ${
          hasLink
            ? 'bg-green-50 border-2 border-green-200'
            : 'dashed-placeholder bg-[#f4f3f2] hover:bg-white'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasLink ? 'bg-green-600' : 'bg-green-50'}`}>
            <span className={`material-symbols-outlined text-2xl ${hasLink ? 'text-white' : 'text-green-500'}`}>poll</span>
          </div>
          <span className={`font-semibold text-center ${hasLink ? 'text-green-800' : 'text-gray-600'}`} style={{ fontFamily: 'Noto Serif, serif' }}>
            {hasLink ? `„${linked}"` : 'Добави анкета'}
          </span>
          {!hasLink && <p className="text-xs text-gray-400">Резултатите ще се покажат тук</p>}
          {hasLink && <span className="text-xs text-green-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span>Свързана анкета</span>}
        </div>
      )
    }

    case 'events': {
      const style = (cfg.style as string) ?? 'polaroids'
      const limit = (cfg.limit as number) ?? 4
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif, serif' }}>Нашите спомени</h2>
            <span className="text-xs text-gray-400 uppercase tracking-widest">{style} · {limit}</span>
          </div>
          <div className={style === 'timeline' ? 'space-y-3' : 'grid grid-cols-2 gap-3'}>
            {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
              style === 'timeline' ? (
                <div key={i} className="dashed-placeholder bg-[#f4f3f2] rounded-xl h-14 flex items-center gap-4 px-5">
                  <span className="material-symbols-outlined text-gray-300 text-lg">event</span>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-2 bg-gray-200 rounded-full w-1/2" />
                  </div>
                </div>
              ) : (
                <div key={i} className={`aspect-square dashed-placeholder bg-[#f4f3f2] rounded-xl flex items-center justify-center hover:bg-white transition-colors ${i === 0 ? 'rotate-1' : i === 1 ? '-rotate-1' : ''}`}>
                  <span className="material-symbols-outlined text-gray-300 text-2xl">add_photo_alternate</span>
                </div>
              )
            ))}
          </div>
        </div>
      )
    }

    default:
      return (
        <div className="dashed-placeholder bg-[#f4f3f2] rounded-xl p-8 flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-gray-300">{meta.icon}</span>
          <span className="text-sm text-gray-400">{meta.addLabel}</span>
        </div>
      )
  }
}
