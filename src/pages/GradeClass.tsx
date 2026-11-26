import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth'
import { addRating, listRatingsByTeacher } from '../data/store'
import { classLabel, type Rating, type SchoolClass } from '../types'
import ScoreBadge, { formatDate, scoreTone } from '../components/ScoreBadge'

export default function GradeClass({ classes }: { classes: SchoolClass[] }) {
  const { user } = useAuth()
  const [selected, setSelected] = useState<SchoolClass | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [recent, setRecent] = useState<Rating[]>([])

  const refreshRecent = () => user && listRatingsByTeacher(user.id).then(setRecent)
  useEffect(() => {
    refreshRecent()
  }, [user?.id])

  // Group classes by grade, preserving list order
  const byGrade = useMemo(() => {
    const map = new Map<string, SchoolClass[]>()
    for (const c of classes) map.set(c.grade, [...(map.get(c.grade) ?? []), c])
    return [...map.entries()]
  }, [classes])

  const classById = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes])

  async function submit() {
    if (!user || !selected || score == null) return
    setSaving(true)
    await addRating({ classId: selected.id, teacherId: user.id, score, comment })
    setSaving(false)
    setToast(`הדירוג לכיתה ${classLabel(selected)} נשמר ✓`)
    setTimeout(() => setToast(''), 2500)
    setSelected(null)
    setScore(null)
    setComment('')
    refreshRecent()
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>1. בחרו כיתה</h2>
        {byGrade.map(([grade, list]) => (
          <div key={grade} className="grade-row">
            <span className="grade-label">שכבה {grade}</span>
            <div className="chips">
              {list.map((c) => (
                <button
                  key={c.id}
                  className={`chip ${selected?.id === c.id ? 'active' : ''}`}
                  onClick={() => setSelected(c)}
                >
                  {classLabel(c)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {selected && (
        <section className="card">
          <h2>2. דרגו את כיתה {classLabel(selected)}</h2>
          <div className="score-grid" role="radiogroup" aria-label="ציון">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                role="radio"
                aria-checked={score === n}
                className={`score-btn ${scoreTone(n)} ${score === n ? 'active' : ''}`}
                onClick={() => setScore(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <label className="field">
            <span>הערה (לא חובה)</span>
            <textarea
              className="input"
              rows={3}
              placeholder="לדוגמה: הכיתה הייתה שקטה ומשתפת פעולה"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
          <button className="primary" disabled={score == null || saving} onClick={submit}>
            {saving ? 'שומר…' : 'שליחת דירוג'}
          </button>
        </section>
      )}

      <section className="card">
        <h2>הדירוגים האחרונים שלי</h2>
        {recent.length === 0 ? (
          <p className="muted">עדיין לא דירגת כיתות</p>
        ) : (
          <ul className="rating-list">
            {recent.map((r) => {
              const c = classById.get(r.classId)
              return (
                <li key={r.id} className="rating-item">
                  <ScoreBadge score={r.score} />
                  <div className="rating-body">
                    <div className="rating-head">
                      <strong>{c ? classLabel(c) : '—'}</strong>
                      <span className="muted small">{formatDate(r.createdAt)}</span>
                    </div>
                    {r.comment && <p className="rating-comment">{r.comment}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
