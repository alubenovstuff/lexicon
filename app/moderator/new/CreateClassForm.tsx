'use client'

import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createClass } from './actions'

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Класика',
    description: 'Класически лексикон — ученици, въпроси, спомени.',
    color: 'bg-[#e2dfff]',
    accent: 'text-[#3632b7]',
    border: 'border-[#3632b7]',
    blocks: ['Герой', 'Ученици', 'Въпрос', 'Гласът на класа', 'Анкета', 'Спомени'],
  },
  {
    id: 'magazine',
    name: 'Списание',
    description: 'Редакционен стил — репортажи, колони, галерия.',
    color: 'bg-[#fff0e8]',
    accent: 'text-[#c2410c]',
    border: 'border-[#c2410c]',
    blocks: ['Герой', 'Водещ въпрос', 'Галерия', 'Ученици', 'Анкета', 'Таймлайн'],
  },
  {
    id: 'adventure',
    name: 'Приключение',
    description: 'Супергеройска тема — приключения, мисии, спомени.',
    color: 'bg-[#d1fae5]',
    accent: 'text-[#065f46]',
    border: 'border-[#065f46]',
    blocks: ['Супергерой', 'Герой', 'Ученици', 'Въпрос', 'Галерия', 'Спомени'],
  },
]

function currentSchoolYear(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  return m >= 9 ? `${y}/${y + 1}` : `${y - 1}/${y}`
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50 shadow"
    >
      <span className="material-symbols-outlined text-base">school</span>
      {pending ? 'Създаване...' : 'Създай класа →'}
    </button>
  )
}

export default function CreateClassForm() {
  const router = useRouter()
  const [state, action] = useActionState(createClass, { error: null, classId: null })
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedTemplate, setSelectedTemplate] = useState('classic')

  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Capture form values to carry across steps
  const [savedParallel, setSavedParallel] = useState('')
  const [savedSchool, setSavedSchool] = useState('')
  const [savedCity, setSavedCity] = useState('')
  const [savedYear, setSavedYear] = useState(currentSchoolYear())
  const [savedTeacher, setSavedTeacher] = useState('')

  useEffect(() => {
    if (state.classId) {
      router.push(`/moderator/${state.classId}/layout`)
    }
  }, [state.classId, router])

  async function uploadFile(file: File, onDone: (url: string) => void, setLoading: (v: boolean) => void) {
    setLoading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        onDone(data.url)
      } else {
        setUploadError('Качването не успя.')
      }
    } catch {
      setUploadError('Качването не успя.')
    } finally {
      setLoading(false)
    }
  }

  function handleNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSavedParallel(fd.get('parallel') as string ?? '')
    setSavedSchool(fd.get('school') as string ?? '')
    setSavedCity(fd.get('city') as string ?? '')
    setSavedYear(fd.get('school_year') as string ?? currentSchoolYear())
    setSavedTeacher(fd.get('teacher_name') as string ?? '')
    setStep(2)
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Назад
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Стъпка 2 от 2</p>
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Noto Serif, serif' }}>
            Избери шаблон
          </h2>
          <p className="text-sm text-gray-400 mt-1">Ще можеш да редактираш и пренареждаш блоковете след това.</p>
        </div>

        <div className="space-y-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTemplate(t.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selectedTemplate === t.id
                  ? `${t.border} ${t.color}`
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-sm ${selectedTemplate === t.id ? t.accent : 'text-gray-800'}`}>
                      {t.name}
                    </span>
                    {selectedTemplate === t.id && (
                      <span className="material-symbols-outlined text-base text-green-500">check_circle</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{t.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {t.blocks.map((b) => (
                      <span
                        key={b}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          selectedTemplate === t.id
                            ? `${t.color} ${t.accent}`
                            : 'bg-white text-gray-400'
                        }`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex-none ${t.color} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-xl ${t.accent}`}>
                    {t.id === 'classic' ? 'menu_book' : t.id === 'magazine' ? 'article' : 'bolt'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Final submit form with all hidden fields */}
        <form action={action}>
          <input type="hidden" name="parallel" value={savedParallel} />
          <input type="hidden" name="school" value={savedSchool} />
          <input type="hidden" name="city" value={savedCity} />
          <input type="hidden" name="school_year" value={savedYear} />
          <input type="hidden" name="teacher_name" value={savedTeacher} />
          <input type="hidden" name="cover_image_url" value={coverUrl ?? ''} />
          <input type="hidden" name="school_logo_url" value={logoUrl ?? ''} />
          <input type="hidden" name="template_id" value={selectedTemplate} />

          {state.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    )
  }

  return (
    <form onSubmit={handleNext} className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Стъпка 1 от 2</p>
      </div>

      {(uploadError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {uploadError}
        </div>
      )}

      {/* Required fields */}
      <div className="bg-indigo-50/50 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Задължително</p>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Паралелка</label>
          <input
            name="parallel"
            type="text"
            required
            defaultValue={savedParallel}
            placeholder="3А"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <p className="text-xs text-gray-400 mt-1">Напр. 3А, 5Б, 7В</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Училище</label>
          <input
            name="school"
            type="text"
            required
            defaultValue={savedSchool}
            placeholder="ОУ Христо Ботев"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
      </div>

      {/* Optional fields */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">По желание</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Град</label>
            <input
              name="city"
              type="text"
              defaultValue={savedCity}
              placeholder="София"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Учебна година</label>
            <input
              name="school_year"
              type="text"
              defaultValue={savedYear}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Класен ръководител</label>
          <input
            name="teacher_name"
            type="text"
            defaultValue={savedTeacher}
            placeholder="Мария Иванова"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Cover photo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Снимка на класа
            <span className="text-gray-400 font-normal ml-1">— кавър на лексикона</span>
          </label>
          {coverUrl ? (
            <div className="relative rounded-xl overflow-hidden aspect-video mb-2">
              <img src={coverUrl} alt="Кавър" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverUrl(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-lg px-2 py-1 text-xs hover:bg-black/70"
              >
                Смени
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 cursor-pointer bg-gray-50 hover:bg-indigo-50/30 transition-colors">
              {coverUploading ? (
                <span className="text-sm text-gray-400">Качване...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-3xl text-gray-300 mb-2">add_photo_alternate</span>
                  <span className="text-sm text-gray-400">Кликнете за качване</span>
                  <span className="text-xs text-gray-300 mt-1">Групова снимка на класа</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={coverUploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) uploadFile(f, setCoverUrl, setCoverUploading)
                }}
              />
            </label>
          )}
        </div>

        {/* School logo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Лого на училището</label>
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Лого"
                className="w-14 h-14 rounded-xl object-contain border border-gray-200 bg-white p-1"
              />
            )}
            <label className="inline-flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-base">upload</span>
              {logoUploading ? 'Качване...' : logoUrl ? 'Смени логото' : 'Качи лого'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={logoUploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) uploadFile(f, setLogoUrl, setLogoUploading)
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow"
      >
        Избери шаблон →
      </button>
    </form>
  )
}
