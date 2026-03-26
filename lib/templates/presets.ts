import { nanoid } from 'nanoid'
import type { Template } from './types'

function block(type: Template['blocks'][number]['type'], config: Record<string, unknown> = {}) {
  return { id: nanoid(8), type, config }
}

export const templatePresets: Template[] = [
  {
    id: 'classic',
    name: 'Класика',
    description: 'Класически лексикон — герой, ученици, въпроси, спомени.',
    themeId: 'classic',
    blocks: [
      block('hero', {}),
      block('students_grid', { columns: 4, showTeaser: true }),
      block('class_voice', { placeholder: 'Какъв е нашият клас?' }),
      block('class_voice', { placeholder: 'Нашият класен е...' }),
      block('polls_grid', {}),
      block('subjects_bar', { placeholder: 'Кой предмет харесваме' }),
      block('subjects_bar', { placeholder: 'Кой предмет е най-труден' }),
      block('events', { limit: 20, style: 'photo_grid' }),
    ],
  },
]

export const defaultTemplate = templatePresets[0]
