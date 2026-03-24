'use server'

import { createServerClient } from '@/lib/supabase/server'

interface State {
  error: string | null
  redirectTo: string | null
}

export async function registerModerator(prevState: State, formData: FormData): Promise<State> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const tos = formData.get('tos')

  if (!tos) {
    return { error: 'Трябва да приемете условията за ползване.', redirectTo: null }
  }

  if (!email || !password) {
    return { error: 'Моля попълнете всички полета.', redirectTo: null }
  }

  if (password.length < 6) {
    return { error: 'Паролата трябва да е поне 6 символа.', redirectTo: null }
  }

  const supabase = createServerClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })

  if (authError) {
    if (authError.message.toLowerCase().includes('already registered')) {
      return { error: 'Вече има акаунт с този имейл. Опитайте да влезете.', redirectTo: null }
    }
    return { error: 'Регистрацията не успя. Опитайте отново.', redirectTo: null }
  }

  if (!authData.user) {
    return { error: 'Регистрацията не успя. Опитайте отново.', redirectTo: null }
  }

  // Sign in immediately to establish session
  await supabase.auth.signInWithPassword({ email, password })

  return { error: null, redirectTo: '/moderator' }
}
