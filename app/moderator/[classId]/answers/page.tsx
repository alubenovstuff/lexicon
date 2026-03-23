export const dynamic = 'force-dynamic'

import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { createServiceRoleClient } from '@/lib/supabase/server'
import AnswersTable from './AnswersTable'

interface AnswerRow {
  id: string
  status: string
  text_content: string | null
  media_url: string | null
  media_type: string | null
  updated_at: string
  student_id: string
  question_id: string
  students: { first_name: string; last_name: string }
  questions: { text: string; order_index: number }
}

export default async function AnswersPage({ params }: { params: { classId: string } }) {
  noStore()
  const { classId } = params
  const supabase = createServiceRoleClient()

  const { data: classData } = await supabase
    .from('classes')
    .select('id, name, school_year, school_logo_url')
    .eq('id', classId)
    .single()

  const { data: students } = await supabase
    .from('students')
    .select('id')
    .eq('class_id', classId)

  const studentIds = (students ?? []).map((s) => s.id)

  let answers: AnswerRow[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('answers')
      .select(
        'id, status, text_content, media_url, media_type, updated_at, student_id, question_id, students(first_name, last_name), questions(text, order_index)'
      )
      .in('student_id', studentIds)
      .order('updated_at', { ascending: false })
    answers = (data ?? []) as unknown as AnswerRow[]
  }

  const [namePart] = classData?.name?.includes(' — ')
    ? classData.name.split(' — ')
    : [classData?.name ?? '']

  const base = `/moderator/${classId}`

  const navItems = [
    { icon: 'dashboard', label: 'Табло', href: base },
    { icon: 'group', label: 'Деца', href: `${base}/students` },
    { icon: 'volunteer_activism', label: 'Отговори', href: `${base}/answers`, active: true },
    { icon: 'quiz', label: 'Въпросник', href: `${base}/questions` },
    { icon: 'calendar_month', label: 'Събития', href: `${base}/events` },
  ]

  const pendingCount = answers.filter((a) => a.status === 'submitted').length
  const approvedCount = answers.filter((a) => a.status === 'approved').length

  return (
    <div className="flex min-h-screen bg-[#faf9f8]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-64 fixed left-0 top-0 h-screen bg-[#f4f3f2] flex flex-col p-4 z-50">
        <div className="px-2 py-4">
          <h1
            className="text-indigo-900 text-xl font-bold tracking-tight"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Един неразделен клас
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <div className="flex items-center gap-3 px-2 py-3 bg-white/60 rounded-xl mb-4">
          {classData?.school_logo_url ? (
            <img
              src={classData.school_logo_url}
              alt="Лого"
              className="w-10 h-10 rounded-full object-contain bg-white border border-gray-100 p-0.5"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              {namePart[0]}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-indigo-900 truncate">{namePart}</p>
            <p className="text-xs text-slate-400 truncate">{classData?.school_year}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                item.active
                  ? 'bg-white text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-500 hover:bg-white/50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 space-y-2">
          <Link
            href={base}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-white/50 transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-xl">help</span>
            Помощен център
          </Link>
          <Link
            href={`${base}/finalize`}
            className="w-full block bg-gradient-to-br from-indigo-600 to-indigo-500 text-white py-3 px-4 rounded-xl font-bold text-sm text-center shadow hover:opacity-90 transition-opacity"
          >
            Финализирай лексикона
          </Link>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8 lg:p-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">
            Преглед на съдържанието
          </p>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1
                className="text-4xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                Отговори за одобрение
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Прегледайте и одобрете подадените отговори на учениците.
              </p>
            </div>
            {pendingCount > 0 && (
              <div className="flex-shrink-0 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                <span className="material-symbols-outlined text-amber-500 text-base">pending</span>
                <span className="text-sm font-semibold text-amber-700">{pendingCount} чакащи</span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mt-6">
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="material-symbols-outlined text-slate-400 text-xl">forum</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Общо</p>
                <p className="text-lg font-bold text-gray-800">{answers.length}</p>
              </div>
            </div>
            <div className="bg-white border border-amber-100 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="material-symbols-outlined text-amber-400 text-xl">schedule</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Чакащи</p>
                <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
              </div>
            </div>
            <div className="bg-white border border-green-100 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Одобрени</p>
                <p className="text-lg font-bold text-green-600">{approvedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <AnswersTable answers={answers} classId={classId} />
      </main>
    </div>
  )
}
