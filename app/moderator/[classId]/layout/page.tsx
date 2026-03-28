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
      .select('id, name, layout, template_id, cover_image_url')
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
      .select('id, text, description, type, max_length, voice_display, order_index')
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
  const savedBlocks = cls.layout as Block[] | null
  const initialBlocks: Block[] = savedBlocks?.length ? savedBlocks : defaultTemplate.blocks

  // Back-fill voice_display for questions that predate migration 017.
  // Matches defaultSeed.ts: order_index 0-1 → barchart, rest → wordcloud.
  const voiceQsRaw = voiceQsRes.data ?? []
  const nullVoiceQs = voiceQsRaw.filter(q => q.voice_display === null)
  if (nullVoiceQs.length > 0) {
    await Promise.all(nullVoiceQs.map(q =>
      admin.from('questions').update({
        voice_display: q.order_index <= 1 ? 'barchart' : 'wordcloud',
      }).eq('id', q.id)
    ))
    // Patch in-memory too so the editor gets the correct values immediately
    for (const q of voiceQsRaw) {
      if (q.voice_display === null) {
        q.voice_display = q.order_index <= 1 ? 'barchart' : 'wordcloud'
      }
    }
  }

  const assets: LayoutAssets = {
    questions: (questionsRes.data ?? []).map(q => ({ id: q.id, label: q.text, type: q.type })),
    voiceQuestions: voiceQsRaw.map(q => ({
      id: q.id,
      label: q.text,
      description: q.description ?? null,
      type: q.type,
      max_length: q.max_length ?? null,
      voice_display: (q.voice_display as 'wordcloud' | 'barchart') ?? 'wordcloud',
      order_index: q.order_index ?? 0,
    })),
    polls: (pollsRes.data ?? []).map(p => ({ id: p.id, label: p.question })),
    events: (eventsRes.data ?? []).map(e => ({ id: e.id, label: e.title })),
    coverImageUrl: cls.cover_image_url ?? null,
  }

  return (
    <LayoutEditor
      classId={classId}
      className={cls.name}
      initialBlocks={initialBlocks}
      templateId={cls.template_id ?? 'primary'}
      assets={assets}
    />
  )
}
