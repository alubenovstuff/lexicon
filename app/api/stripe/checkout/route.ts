import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

// POST /api/stripe/checkout
// body: { classId: string }
// Returns: { url: string } — redirect moderator to Stripe-hosted checkout
export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { classId } = await request.json()
  if (!classId) {
    return NextResponse.json({ error: 'Missing classId' }, { status: 400 })
  }

  const admin = createServiceRoleClient()

  // Verify this user is the moderator of this class
  const { data: classData } = await admin
    .from('classes')
    .select('id, status')
    .eq('id', classId)
    .eq('moderator_id', user.id)
    .single()

  if (!classData) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  }

  if (classData.status === 'published') {
    return NextResponse.json({ error: 'Already published' }, { status: 400 })
  }

  // Mark as pending_payment immediately
  await admin
    .from('classes')
    .update({ status: 'pending_payment' })
    .eq('id', classId)

  const url = await createCheckoutSession(classId, user.email ?? '')

  return NextResponse.json({ url })
}
