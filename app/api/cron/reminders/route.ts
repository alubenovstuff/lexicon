import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendReminderEmail } from '@/lib/resend'

export const runtime = 'nodejs'

// Called daily by Vercel Cron at 09:00 UTC
// Sends reminders to parents of students who haven't submitted answers
// 7 days before deadline and 2 days before deadline
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createServiceRoleClient()
  const now   = new Date()

  // Find classes with deadline in exactly 7 or 2 days
  const targets = [7, 2]
  let sent = 0

  for (const daysAhead of targets) {
    const dayStart = new Date(now)
    dayStart.setDate(dayStart.getDate() + daysAhead)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(dayStart)
    dayEnd.setHours(23, 59, 59, 999)

    const { data: classes } = await admin
      .from('classes')
      .select('id, name')
      .gte('deadline', dayStart.toISOString())
      .lte('deadline', dayEnd.toISOString())
      .neq('status', 'published')

    for (const cls of classes ?? []) {
      // Find students whose parents haven't submitted all answers
      const { data: students } = await admin
        .from('students')
        .select('id, first_name, last_name, parent_email, invite_accepted_at')
        .eq('class_id', cls.id)
        .not('parent_email', 'is', null)

      if (!students?.length) continue

      const studentIds = students.map(s => s.id)

      // Count submitted/approved answers per student
      const { data: answers } = await admin
        .from('answers')
        .select('student_id')
        .in('student_id', studentIds)
        .in('status', ['submitted', 'approved'])

      const submittedSet = new Set((answers ?? []).map(a => a.student_id))

      for (const student of students) {
        if (!student.parent_email) continue
        // Only remind if parent has joined but hasn't submitted anything
        if (!student.invite_accepted_at) continue
        if (submittedSet.has(student.id)) continue

        try {
          await sendReminderEmail(
            student.parent_email,
            `${student.first_name} ${student.last_name}`,
            student.id,
            daysAhead
          )
          sent++
        } catch {
          // Continue on failure
        }
      }
    }
  }

  return NextResponse.json({ ok: true, sent })
}
