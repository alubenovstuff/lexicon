export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import NewMessageForm from './NewMessageForm'

interface Props {
  searchParams: Promise<{ recipientId?: string }>
}

export default async function NewMessagePage({ searchParams }: Props) {
  const { recipientId } = await searchParams

  if (!recipientId) notFound()

  // Auth: require logged-in parent
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceRoleClient()

  // Find parent's student
  const { data: myStudent } = await admin
    .from('students')
    .select('id, class_id')
    .eq('parent_user_id', user.id)
    .single()

  if (!myStudent) redirect('/login')

  // Cannot send to own child
  if (myStudent.id === recipientId) notFound()

  // Fetch recipient — must be in the same class
  const { data: recipient } = await admin
    .from('students')
    .select('id, first_name, last_name, photo_url, class_id')
    .eq('id', recipientId)
    .eq('class_id', myStudent.class_id)
    .single()

  if (!recipient) notFound()

  // Existing message (if any)
  const { data: existing } = await admin
    .from('peer_messages')
    .select('content, status')
    .eq('author_student_id', myStudent.id)
    .eq('recipient_student_id', recipientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const backHref = `/my/${myStudent.id}`

  return (
    <div className="min-h-screen bg-[#faf9f8]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <NewMessageForm
        authorStudentId={myStudent.id}
        recipient={recipient}
        existingMessage={existing ?? null}
        backHref={backHref}
      />
    </div>
  )
}
