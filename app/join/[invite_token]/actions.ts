'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function loginFromJoin(
  prevState: { error: string | null; redirectTo: string | null },
  formData: FormData
): Promise<{ error: string | null; redirectTo: string | null }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const studentId = formData.get('studentId') as string

  const supabase = createServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return { error: 'Грешна парола. Опитайте отново.', redirectTo: null }
  }

  return { error: null, redirectTo: `/my/${studentId}` }
}
