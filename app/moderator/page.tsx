export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export default async function ModeratorIndexPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceRoleClient()

  const { data: classes } = await admin
    .from('classes')
    .select('id, name, school_year, status')
    .eq('moderator_id', user.id)
    .order('created_at', { ascending: false })

  // If the moderator already has a class, go straight to it
  if (classes && classes.length > 0) {
    redirect(`/moderator/${classes[0].id}`)
  }

  // No classes yet — send straight to the "create class" panel step
  redirect('/moderator/new')
}
