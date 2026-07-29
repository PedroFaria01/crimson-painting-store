import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      loadRole(data.session)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // Re-arm loading for the duration of the role lookup so a stale
      // isAdmin=false doesn't briefly bounce RequireAdmin back to /admin/login
      // right after a successful sign-in.
      setLoading(true)
      setSession(newSession)
      loadRole(newSession)
    })

    async function loadRole(currentSession) {
      if (!currentSession) {
        setRole(null)
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentSession.user.id)
        .single()
      if (!active) return
      setRole(error ? null : data.role)
      setLoading(false)
    }

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  // Returns true when the project requires email confirmation (no session
  // yet, the caller should tell the user to check their inbox) and false
  // when the account is signed in immediately.
  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return !data.session
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      role,
      isAdmin: role === 'admin',
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, role, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
