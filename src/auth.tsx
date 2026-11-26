import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Teacher } from './types'
import { listTeachers } from './data/store'

const KEY = 'class-ratings.teacherId'

interface AuthValue {
  user: Teacher | null
  ready: boolean
  login: (t: Teacher) => void
  logout: () => void
}

const AuthContext = createContext<AuthValue>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Teacher | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem(KEY)
    listTeachers()
      .then((all) => setUser(all.find((t) => t.id === id) ?? null))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  const login = (t: Teacher) => {
    localStorage.setItem(KEY, t.id)
    setUser(t)
  }
  const logout = () => {
    localStorage.removeItem(KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
