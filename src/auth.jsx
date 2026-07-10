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

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
