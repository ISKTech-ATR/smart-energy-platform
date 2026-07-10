import { createContext, useContext, useState } from 'react'

const AuthCtx = createContext(null)
const KEY = 'se_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY))
    } catch {
      return null
    }
  })

  const login = (u) => {
    localStorage.setItem(KEY, JSON.stringify(u))
    setUser(u)
  }
  const logout = () => {
    localStorage.removeItem(KEY)
    setUser(null)
  }
  const updateUser = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  return <AuthCtx.Provider value={{ user, login, logout, updateUser }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
