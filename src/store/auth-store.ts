import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database'

interface AuthState {
  user: Profile | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string, organizationId: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        set({ user: profile, initialized: true })
      } else {
        set({ initialized: true })
      }
    } catch {
      set({ initialized: true })
    }
  },

  signIn: async (email, password) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ loading: false })
      return { error: error.message }
    }
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      set({ user: profile, loading: false })
    }
    return { error: null }
  },

  signUp: async (email, password, name, organizationId) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, organization_id: organizationId } }
    })
    if (error) {
      set({ loading: false })
      return { error: error.message }
    }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name,
        role: 'USUARIO' as const,
        is_active: true,
        organization_id: organizationId,
      } as never)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      set({ user: profile, loading: false })
    }
    return { error: null }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
