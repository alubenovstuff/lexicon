export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceRoleClient()

  const { data: students } = await admin
    .from('students')
    .select('id, first_name, last_name, photo_url, class_id')
    .eq('parent_user_id', user.id)
    .order('first_name')

  // Single student → redirect directly
  if (students && students.length === 1) {
    redirect(`/my/${students[0].id}`)
  }

  // Multiple students → show selector
  if (students && students.length > 1) {
    // Fetch class names for each student
    const classIds = students.map(s => s.class_id)
    const { data: classes } = await admin
      .from('classes')
      .select('id, name, school_year')
      .in('id', classIds)

    const classMap = Object.fromEntries((classes ?? []).map(c => [c.id, c]))

    return (
      <div className="min-h-screen bg-[#f4f3f2] flex flex-col items-center justify-center px-4 py-12" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-indigo-900 mb-2 text-center" style={{ fontFamily: 'Noto Serif, serif' }}>
            Изберете дете
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">Имате профили в повече от един клас.</p>

          <div className="space-y-3">
            {students.map(student => {
              const cls = classMap[student.class_id]
              return (
                <Link
                  key={student.id}
                  href={`/my/${student.id}`}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  {student.photo_url ? (
                    <img src={student.photo_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-indigo-400">person</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{student.first_name} {student.last_name}</p>
                    {cls && (
                      <p className="text-xs text-gray-400 truncate">{cls.name}{cls.school_year ? ` · ${cls.school_year}` : ''}</p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-gray-300 ml-auto flex-shrink-0">arrow_forward_ios</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // No students linked yet → show info
  return (
    <div className="min-h-screen bg-[#f4f3f2] flex flex-col items-center justify-center px-4 py-12" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl text-amber-500">mail</span>
        </div>
        <h1 className="text-2xl font-bold text-indigo-900 mb-2" style={{ fontFamily: 'Noto Serif, serif' }}>
          Нямате свързан профил
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          За да видите анкетата на детето си, трябва да отворите личния линк от имейла на покана, изпратен от учителя.
        </p>
        <p className="text-xs text-gray-400">
          Влезли сте като <span className="font-medium text-gray-600">{user.email}</span>
        </p>
      </div>
    </div>
  )
}
