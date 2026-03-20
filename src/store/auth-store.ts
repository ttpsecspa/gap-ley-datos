import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database'

const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

const DEMO_USER: Profile = {
  id: 'demo-user-001',
  email: 'admin@gap-demo.cl',
  name: 'Admin Demo',
  role: 'ADMIN',
  is_active: true,
  organization_id: 'demo-org-001',
  last_login: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

interface AuthState {
  user: Profile | null
  loading: boolean
  initialized: boolean
  demoMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string, organizationId: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  demoMode: isDemo,

  initialize: async () => {
    if (isDemo) {
      set({ user: DEMO_USER, initialized: true, demoMode: true })
      return
    }
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
    if (isDemo) {
      set({ user: { ...DEMO_USER, email, name: email.split('@')[0] }, loading: false })
      return { error: null }
    }
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
    if (isDemo) {
      set({ user: { ...DEMO_USER, email, name }, loading: false })
      return { error: null }
    }
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
    if (!isDemo) {
      await supabase.auth.signOut()
    }
    set({ user: null })
  },
}))
