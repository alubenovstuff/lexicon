import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { createServiceRoleClient } from '@/lib/supabase/server'
import EventsEditor from './EventsEditor'

export default async function EventsPage({ params }: { params: { classId: string } }) {
  noStore()
  const { classId } = params
  const admin = createServiceRoleClient()

  const { data: classData } = await admin
    .from('classes')
    .select('id, name')
    .eq('id', classId)
    .single()

  if (!classData) notFound()

  const { data: events } = await admin
    .from('events')
    .select('id, title, event_date, note, order_index')
    .eq('class_id', classId)
    .order('order_index')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-3">
          <Link href={`/moderator/${classId}`} className="text-sm text-gray-400 hover:text-gray-600">
            ← {classData.name}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Събития през годината</h1>
          <p className="text-sm text-gray-500 mt-1">
            Добавете до 10 специални момента от учебната година.
          </p>
        </div>

        <EventsEditor classId={classId} initialEvents={events ?? []} />
      </div>
    </main>
  )
}
