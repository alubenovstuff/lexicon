import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { defaultTemplate } from '@/lib/templates/presets'
import type { Block } from '@/lib/templates/types'
import LayoutEditor from './LayoutEditor'

export default async function LayoutPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceRoleClient()
  const { data: cls } = await admin
    .from('classes')
    .select('id, name, layout, template_id')
    .eq('id', classId)
    .eq('moderator_id', user.id)
    .single()

  if (!cls) redirect('/moderator')

  const initialBlocks: Block[] = (cls.layout as Block[] | null) ?? defaultTemplate.blocks

  return (
    <LayoutEditor
      classId={classId}
      className={cls.name}
      initialBlocks={initialBlocks}
      templateId={cls.template_id ?? 'classic'}
    />
  )
}
