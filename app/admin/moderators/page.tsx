export const dynamic = 'force-dynamic'

import { unstable_noStore as noStore } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import ModeratorsBulkList from './ModeratorsBulkList'
import type { ModeratorRowData } from './ModeratorsBulkList'

export default async function AdminModeratorsPage() {
  noStore()
  const admin = createServiceRoleClient()

  // List all auth users
  const { data: usersData } = await admin.auth.admin.listUsers()
  const allUsers = usersData?.users ?? []

  // Get classes per moderator
  const { data: classes } = await admin
    .from('classes')
    .select('id, name, school_year, status, moderator_id')
    .order('created_at', { ascending: false })

  const classesByModerator = new Map<string, typeof classes>()
  for (const cls of classes ?? []) {
    const existing = classesByModerator.get(cls.moderator_id) ?? []
    classesByModerator.set(cls.moderator_id, [...existing, cls])
  }

  // Get student counts per class
  const { data: students } = await admin
    .from('students')
    .select('class_id')
  const studentsByClass: Record<string, number> = {}
  for (const s of students ?? []) {
    studentsByClass[s.class_id] = (studentsByClass[s.class_id] ?? 0) + 1
  }

  const moderators: ModeratorRowData[] = allUsers.map((user) => {
    const userClasses = classesByModerator.get(user.id) ?? []
    return {
      id: user.id,
      email: user.email ?? user.id,
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at ?? null,
      classes: userClasses.map(cls => ({
        id: cls.id,
        name: cls.name,
        school_year: cls.school_year,
        status: cls.status,
        studentCount: studentsByClass[cls.id] ?? 0,
      })),
      totalStudents: userClasses.reduce((sum, c) => sum + (studentsByClass[c.id] ?? 0), 0),
      publishedCount: userClasses.filter(c => c.status === 'published').length,
    }
  })

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Администрация</p>
        <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Noto Serif, serif' }}>
          Модератори
        </h1>
        <p className="text-sm text-gray-500 mt-2">{allUsers.length} регистрирани потребители</p>
      </div>

      {allUsers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center text-gray-400">
          <span className="material-symbols-outlined text-4xl block mb-2 text-gray-200">manage_accounts</span>
          Няма регистрирани потребители.
        </div>
      ) : (
        <ModeratorsBulkList moderators={moderators} />
      )}
    </div>
  )
}
