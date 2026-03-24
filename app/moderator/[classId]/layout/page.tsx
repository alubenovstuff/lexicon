import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { defaultTemplate } from '@/lib/templates/presets'
import type { Block, LayoutAssets } from '@/lib/templates/types'
import LayoutEditor from './LayoutEditor'

export default async function LayoutPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceRoleClient()

  const [clsRes, questionsRes, voiceQsRes, pollsRes, eventsRes] = await Promise.all([
    admin
      .from('classes')
      .select('id, name, layout, template_id')
      .eq('id', classId)
      .eq('moderator_id', user.id)
      .single(),

    admin
      .from('questions')
      .select('id, text, type')
      .eq('class_id', classId)
      .eq('type', 'personal')
      .order('order_index'),

    admin
      .from('questions')
      .select('id, text')
      .eq('class_id', classId)
      .eq('type', 'class_voice')
      .order('order_index'),

    admin
      .from('class_polls')
      .select('id, question')
      .eq('class_id', classId)
      .order('order_index'),

    admin
      .from('events')
      .select('id, title')
      .eq('class_id', classId)
      .order('order_index'),
  ])

  if (!clsRes.data) redirect('/moderator')

  const cls = clsRes.data
  const initialBlocks: Block[] = (cls.layout as Block[] | null) ?? defaultTemplate.blocks

  const assets: LayoutAssets = {
    questions: (questionsRes.data ?? []).map(q => ({ id: q.id, label: q.text, type: q.type })),
    voiceQuestions: (voiceQsRes.data ?? []).map(q => ({ id: q.id, label: q.text })),
    polls: (pollsRes.data ?? []).map(p => ({ id: p.id, label: p.question })),
    events: (eventsRes.data ?? []).map(e => ({ id: e.id, label: e.title })),
  }

  return (
    <LayoutEditor
      classId={classId}
      className={cls.name}
      initialBlocks={initialBlocks}
      templateId={cls.template_id ?? 'classic'}
      assets={assets}
    />
  )
}
