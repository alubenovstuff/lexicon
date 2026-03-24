'use server'

import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { Block } from '@/lib/templates/types'

export async function saveLayout(classId: string, blocks: Block[]): Promise<{ error: string | null }> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Не сте влезли в системата.' }

  const admin = createServiceRoleClient()

  // Verify ownership
  const { data: cls } = await admin
    .from('classes')
    .select('id')
    .eq('id', classId)
    .eq('moderator_id', user.id)
    .single()

  if (!cls) return { error: 'Нямате достъп до този клас.' }

  const { error } = await admin
    .from('classes')
    .update({ layout: blocks })
    .eq('id', classId)

  return { error: error?.message ?? null }
}
