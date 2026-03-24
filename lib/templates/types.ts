export type BlockType =
  | 'hero'
  | 'students_grid'
  | 'question'
  | 'photo_gallery'
  | 'poll'
  | 'class_voice'
  | 'events'
  | 'superhero'

export interface HeroBlockConfig {
  title?: string
  subtitle?: string
}

export interface StudentsGridBlockConfig {
  columns?: 3 | 4 | 5
  showTeaser?: boolean
}

export interface QuestionBlockConfig {
  questionId?: string | null
  /** placeholder label shown when no question is linked */
  placeholder?: string
  layout?: 'grid' | 'list' | 'masonry'
}

export interface PhotoGalleryBlockConfig {
  columns?: 2 | 3 | 4
  caption?: string
}

export interface PollBlockConfig {
  pollId?: string | null
  placeholder?: string
}

export interface ClassVoiceBlockConfig {
  questionId?: string | null
  placeholder?: string
}

export interface EventsBlockConfig {
  limit?: number
  style?: 'cards' | 'polaroids' | 'timeline'
}

export interface SuperheroBlockConfig {
  caption?: string
}

export type BlockConfig =
  | HeroBlockConfig
  | StudentsGridBlockConfig
  | QuestionBlockConfig
  | PhotoGalleryBlockConfig
  | PollBlockConfig
  | ClassVoiceBlockConfig
  | EventsBlockConfig
  | SuperheroBlockConfig

export interface Block {
  id: string
  type: BlockType
  config: BlockConfig
}

export interface Template {
  id: string
  name: string
  description: string
  thumbnail?: string
  themeId: string
  blocks: Block[]
}

export interface Theme {
  id: string
  name: string
  /** CSS custom property overrides */
  vars: Record<string, string>
  /** Tailwind-safe bg class for template picker card */
  previewBg: string
}

// Assets available for a class — loaded server-side and passed to the layout editor
export interface LayoutAsset {
  id: string
  label: string
}

export interface LayoutAssets {
  questions: (LayoutAsset & { type: string })[]   // personal questions
  voiceQuestions: LayoutAsset[]                    // class_voice questions
  polls: LayoutAsset[]
  events: LayoutAsset[]
}
