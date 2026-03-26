import { nanoid } from 'nanoid'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Block } from './types'

/** Default questions to seed for every new class */
const DEFAULT_QUESTIONS = [
  { text: 'Представи се на останалите',                                                              type: 'video',       allows_text: false, allows_media: true,  order_index: 0 },
  { text: 'Какъв е нашият клас? Опиши го с две или три думи',                                        type: 'class_voice', allows_text: true,  allows_media: false, order_index: 1 },
  { text: 'Кой предмет харесваш най-много:',                                                         type: 'class_voice', allows_text: true,  allows_media: false, order_index: 2 },
  { text: 'А по кой предмет ти е най-трудно?',                                                       type: 'class_voice', allows_text: true,  allows_media: false, order_index: 3 },
  { text: 'Ако бях животно, щях да бъда:',                                                           type: 'personal',    allows_text: true,  allows_media: false, order_index: 4 },
  { text: 'Ако имах вълшебна пръчка, щях да:',                                                       type: 'personal',    allows_text: true,  allows_media: false, order_index: 5 },
  { text: 'Най-хубавото в приятелството е:',                                                         type: 'personal',    allows_text: true,  allows_media: false, order_index: 6 },
  { text: 'Моята тайна суперсила е:',                                                                type: 'personal',    allows_text: true,  allows_media: false, order_index: 7 },
  { text: 'Мечтая да отида:',                                                                        type: 'personal',    allows_text: true,  allows_media: false, order_index: 8 },
  { text: 'Най-интересният ден тази година беше:',                                                   type: 'personal',    allows_text: true,  allows_media: false, order_index: 9 },
  { text: 'Представи си, че можеш да си учител за един ден. Какво щеше да направиш?',               type: 'personal',    allows_text: true,  allows_media: false, order_index: 10 },
  { text: 'Каква е за теб класната/класния? Опиши го с три думи',                                   type: 'class_voice', allows_text: true,  allows_media: false, order_index: 11 },
]

/** Default polls */
const DEFAULT_POLLS = [
  { question: 'Кой ще стане президент?',          order_index: 0 },
  { question: 'Кой е бъдеща поп-звезда?',         order_index: 1 },
  { question: 'Кой е винаги готов да помогне?',   order_index: 2 },
]

/** Default events */
const DEFAULT_EVENTS = [
  { title: 'Тържествено начало на учебната година', note: 'Денят, в който всичко започна.', order_index: 0 },
  { title: 'Коледно тържество',                    note: 'Магията на коледните празници заедно.', order_index: 1 },
  { title: 'Пролетен празник',                     note: 'Пролетта дойде и ние я посрещнахме с усмивки.', order_index: 2 },
]

function blk(type: Block['type'], config: Record<string, unknown> = {}): Block {
  return { id: nanoid(8), type, config }
}

export async function seedDefaultClass(
  classId: string,
  admin: SupabaseClient
): Promise<{ blocks: Block[]; error: string | null }> {
  // ── Questions ──────────────────────────────────────────────────────────
  const { data: insertedQs, error: qErr } = await admin
    .from('questions')
    .insert(DEFAULT_QUESTIONS.map(q => ({ ...q, class_id: classId, is_system: false })))
    .select('id, type, order_index')

  if (qErr || !insertedQs) return { blocks: [], error: 'Грешка при създаване на въпросите.' }

  // ── Polls ──────────────────────────────────────────────────────────────
  const { data: insertedPolls, error: pollErr } = await admin
    .from('class_polls')
    .insert(DEFAULT_POLLS.map(p => ({ ...p, class_id: classId })))
    .select('id, order_index')

  if (pollErr || !insertedPolls) return { blocks: [], error: 'Грешка при създаване на анкетите.' }

  const polls = [...insertedPolls].sort((a, b) => a.order_index - b.order_index)

  // ── Events ─────────────────────────────────────────────────────────────
  const { error: evErr } = await admin
    .from('events')
    .insert(DEFAULT_EVENTS.map(e => ({ ...e, class_id: classId })))

  if (evErr) return { blocks: [], error: 'Грешка при създаване на събитията.' }

  // ── Build layout ───────────────────────────────────────────────────────
  const qs = [...insertedQs].sort((a, b) => a.order_index - b.order_index)
  const byIdx = new Map(qs.map(q => [q.order_index, q]))
  const classDescQ   = byIdx.get(1)   // "Какъв е нашият клас?"
  const favSubjectQ  = byIdx.get(2)   // "Кой предмет харесваш"
  const hardSubjectQ = byIdx.get(3)   // "А по кой предмет"
  const teacherQ     = byIdx.get(11)  // "Каква е за теб класната"

  const blocks: Block[] = [
    blk('hero'),
    blk('students_grid', { columns: 4, showTeaser: true }),
    ...(classDescQ  ? [blk('class_voice',   { questionId: classDescQ.id  })] : []),
    ...(teacherQ    ? [blk('class_voice',   { questionId: teacherQ.id    })] : []),
    blk('polls_grid', { pollIds: polls.map(p => p.id) }),
    ...(favSubjectQ  ? [blk('subjects_bar', { questionId: favSubjectQ.id  })] : []),
    ...(hardSubjectQ ? [blk('subjects_bar', { questionId: hardSubjectQ.id })] : []),
    blk('events', { limit: 20, style: 'photo_grid' }),
  ]

  return { blocks, error: null }
}

/** Questions to show students in the wizard (personal + video only; class_voice answered implicitly) */
export function getWizardQuestionTypes(): string[] {
  return ['video', 'personal']
}
