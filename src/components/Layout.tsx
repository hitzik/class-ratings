import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Layout({ isHomeroom, children }: { isHomeroom: boolean; children: ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">דירוג כיתות</span>
          <span className="user">
            שלום, {user?.name}
            <button className="link-btn" onClick={logout}>
              יציאה
            </button>
          </span>
        </div>
        {isHomeroom && (
          <nav className="tabs">
            <NavLink to="/grade">דירוג כיתה</NavLink>
            <NavLink to="/my-class">הכיתה שלי</NavLink>
          </nav>
        )}
      </header>
      <main className="content">{children}</main>
    </div>
  )
}
