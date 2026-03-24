export const dynamic = 'force-dynamic'

import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export default async function ClassEntryPage({ params }: { params: Promise<{ classId: string }> }) {
  noStore()
  const { classId } = await params

  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const admin = createServiceRoleClient()

    // Moderator → moderator dashboard
    const { data: classData } = await admin
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('moderator_id', user.id)
      .single()

    if (classData) redirect(`/moderator/${classId}`)

    // Parent → their child's portal
    const { data: student } = await admin
      .from('students')
      .select('id')
      .eq('class_id', classId)
      .eq('parent_user_id', user.id)
      .single()

    if (student) redirect(`/my/${student.id}`)
  }

  // Visitor or unrelated user → public lexicon
  redirect(`/lexicon/${classId}`)
}
