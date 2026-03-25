export interface PDFStudent {
  id: string
  first_name: string
  last_name: string
  photo_url: string | null
  answers: Array<{
    question_text: string
    text_content: string
  }>
  messages: Array<{
    content: string
    author_name: string
  }>
}

export interface PDFPoll {
  question: string
  nominees: Array<{ name: string; votes: number; pct: number }>
  totalVotes: number
}

export interface PDFEvent {
  title: string
  event_date: string | null
  note: string | null
}

export interface PDFData {
  classInfo: {
    name: string
    namePart: string
    schoolPart: string | null
    school_year: string
    school_logo_url: string | null
    superhero_image_url: string | null
    superhero_prompt: string | null
  }
  students: PDFStudent[]
  polls: PDFPoll[]
  events: PDFEvent[]
}
