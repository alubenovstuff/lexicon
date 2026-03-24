export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
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

  // No classes yet — show the welcome / create state
  return (
    <div
      className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center px-6"
      style={{ fontFamily: 'Manrope, sans-serif' }}
    >
      <div className="max-w-md w-full text-center">
        {/* Brand */}
        <h1
          className="text-3xl font-bold text-indigo-900 mb-2"
          style={{ fontFamily: 'Noto Serif, serif' }}
        >
          Един неразделен клас
        </h1>
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-14">Добре дошли</p>

        {/* Empty state */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 mb-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-indigo-400">school</span>
          </div>
          <h2
            className="text-2xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Нямате клас
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Създайте лексикон за вашия клас. Отнема само 2 минути — попълнете основните данни и сте готови.
          </p>
          <Link
            href="/moderator/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors shadow-md w-full justify-center"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Създай клас
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          Регистрирани като {user.email}
        </p>
      </div>
    </div>
  )
}
