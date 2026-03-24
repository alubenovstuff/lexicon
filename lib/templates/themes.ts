import type { Theme } from './types'

export const themes: Record<string, Theme> = {
  classic: {
    id: 'classic',
    name: 'Класика',
    previewBg: 'bg-[#e2dfff]',
    vars: {
      '--lex-primary': '#3632b7',
      '--lex-secondary': '#855300',
      '--lex-accent': '#fea619',
      '--lex-bg': '#faf9f8',
      '--lex-surface': '#ffffff',
      '--lex-text': '#1a1c1c',
      '--lex-muted': '#6b7280',
      '--lex-radius': '2rem',
    },
  },
  magazine: {
    id: 'magazine',
    name: 'Списание',
    previewBg: 'bg-[#fff0e8]',
    vars: {
      '--lex-primary': '#c2410c',
      '--lex-secondary': '#1e3a5f',
      '--lex-accent': '#f97316',
      '--lex-bg': '#fffbf5',
      '--lex-surface': '#ffffff',
      '--lex-text': '#111827',
      '--lex-muted': '#6b7280',
      '--lex-radius': '0.5rem',
    },
  },
  adventure: {
    id: 'adventure',
    name: 'Приключение',
    previewBg: 'bg-[#d1fae5]',
    vars: {
      '--lex-primary': '#065f46',
      '--lex-secondary': '#92400e',
      '--lex-accent': '#34d399',
      '--lex-bg': '#f0fdf4',
      '--lex-surface': '#ffffff',
      '--lex-text': '#064e3b',
      '--lex-muted': '#6b7280',
      '--lex-radius': '1.5rem',
    },
  },
}

export const defaultTheme = themes.classic
