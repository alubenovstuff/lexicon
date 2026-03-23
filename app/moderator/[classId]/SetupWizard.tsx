'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateClassInfo } from './actions'

interface Props {
  classId: string
}

export default function SetupWizard({ classId }: Props) {
  const router = useRouter()
  const [className, setClassName] = useState('')
  const [school, setSchool] = useState('')
  const [schoolYear, setSchoolYear] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setLogoUrl(data.url)
    } catch {
      setError('Качването на логото не успя.')
    } finally {
      setLogoUploading(false)
    }
  }

  function handleSubmit() {
    if (!className.trim() || !school.trim() || !schoolYear.trim()) {
      setError('Моля попълнете всички полета.')
      return
    }

    setError(null)
    startTransition(async () => {
      const name = `${className.trim()} — ${school.trim()}`
      const result = await updateClassInfo(classId, {
        name,
        school_year: schoolYear.trim(),
        ...(logoUrl ? { school_logo_url: logoUrl } : {}),
      })
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/moderator/${classId}`)
        router.refresh()
      }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Добре дошли!</h1>
          <p className="mt-2 text-sm text-gray-500">Попълнете данните за класа, за да започнете.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Клас</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="3А"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Училище</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="ОУ Христо Ботев"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Учебна година</label>
            <input
              type="text"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              placeholder="2024/2025"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Лого на училището <span className="text-gray-400 font-normal">(по желание)</span>
            </label>
            <div className="flex items-center gap-4">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Лого"
                  className="w-14 h-14 rounded-lg object-contain border border-gray-200 bg-white p-1"
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                {logoUploading ? 'Качване...' : logoUrl ? 'Смени логото' : 'Качи лого'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                  disabled={logoUploading}
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending || logoUploading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-2"
          >
            {isPending ? 'Запазване...' : 'Създай класа →'}
          </button>
        </div>
      </div>
    </main>
  )
}
