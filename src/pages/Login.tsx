import { useEffect, useState } from 'react'
import { useAuth } from '../auth'
import { listTeachers } from '../data/store'
import type { Teacher } from '../types'

export default function Login() {
  const { login } = useAuth()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    listTeachers().then(setTeachers)
  }, [])

  const filtered = teachers.filter((t) => t.name.includes(query.trim()))

  return (
    <div className="login">
      <div className="card login-card">
        <h1>דירוג כיתות</h1>
        <p className="muted">בחרו את שמכם כדי להיכנס</p>
        <input
          className="input"
          type="search"
          placeholder="חיפוש שם…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="teacher-list">
          {filtered.map((t) => (
            <li key={t.id}>
              <button onClick={() => login(t)}>{t.name}</button>
            </li>
          ))}
          {filtered.length === 0 && <li className="muted empty">לא נמצאו מורים</li>}
        </ul>
      </div>
    </div>
  )
}
