import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth'
import { listClasses } from './data/store'
import type { SchoolClass } from './types'
import Layout from './components/Layout'
import Login from './pages/Login'
import GradeClass from './pages/GradeClass'
import MyClass from './pages/MyClass'

export default function App() {
  const { user, ready } = useAuth()
  const [classes, setClasses] = useState<SchoolClass[]>([])

  useEffect(() => {
    listClasses().then(setClasses)
  }, [])

  if (!ready) return null
  if (!user) return <Login />

  const myClasses = classes.filter((c) => c.homeroomTeacherId === user.id)

  return (
    <Layout isHomeroom={myClasses.length > 0}>
      <Routes>
        <Route path="/grade" element={<GradeClass classes={classes} />} />
        {myClasses.length > 0 && <Route path="/my-class" element={<MyClass myClasses={myClasses} />} />}
        <Route path="*" element={<Navigate to="/grade" replace />} />
      </Routes>
    </Layout>
  )
}
