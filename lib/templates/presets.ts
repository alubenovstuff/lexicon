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
      block('question', { placeholder: 'Добави въпрос → ученическите отговори ще се покажат тук' }),
      block('class_voice', { placeholder: 'Добави въпрос за гласа на класа' }),
      block('poll', { placeholder: 'Добави анкета' }),
      block('events', { limit: 4, style: 'polaroids' }),
    ],
  },
  {
    id: 'magazine',
    name: 'Списание',
    description: 'Редакционен стил — заглавна страница, репортажи, колони.',
    themeId: 'magazine',
    blocks: [
      block('hero', {}),
      block('question', { layout: 'list', placeholder: 'Добави водещ въпрос на броя' }),
      block('photo_gallery', { columns: 3, caption: 'Фото галерия' }),
      block('students_grid', { columns: 5, showTeaser: false }),
      block('poll', { placeholder: 'Добави анкета' }),
      block('class_voice', { placeholder: 'Гласът на класа' }),
      block('events', { limit: 6, style: 'timeline' }),
    ],
  },
  {
    id: 'adventure',
    name: 'Приключение',
    description: 'Супергеройска тема — приключения, мисии, спомени.',
    themeId: 'adventure',
    blocks: [
      block('superhero', {}),
      block('hero', {}),
      block('students_grid', { columns: 4, showTeaser: true }),
      block('question', { layout: 'masonry', placeholder: 'Добави въпрос' }),
      block('photo_gallery', { columns: 2 }),
      block('events', { limit: 5, style: 'cards' }),
      block('class_voice', { placeholder: 'Гласът на класа' }),
    ],
  },
]

export const defaultTemplate = templatePresets[0]
