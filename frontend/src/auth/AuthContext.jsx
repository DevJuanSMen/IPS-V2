import { createContext, useContext, useMemo, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authApi.currentUser())
  const [loading, setLoading] = useState(false)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      async login(usuario, password) {
        setLoading(true)
        try {
          const u = await authApi.login(usuario, password)
          setUser(u)
          return u
        } finally {
          setLoading(false)
        }
      },
      async logout() {
        await authApi.logout()
        setUser(null)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
