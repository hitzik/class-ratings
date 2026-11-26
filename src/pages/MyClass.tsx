import { useEffect, useMemo, useState } from 'react'
import { listRatingsForClass, listTeachers } from '../data/store'
import { classLabel, type Rating, type SchoolClass, type Teacher } from '../types'
import ScoreBadge, { formatDate } from '../components/ScoreBadge'

type Period = 'week' | 'month' | 'year'
const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: '7 ימים' },
  { key: 'month', label: '30 יום' },
  { key: 'year', label: 'כל השנה' },
]
const DAY = 86_400_000

export default function MyClass({ myClasses }: { myClasses: SchoolClass[] }) {
  const [classId, setClassId] = useState(myClasses[0].id)
  const [period, setPeriod] = useState<Period>('month')
  const [ratings, setRatings] = useState<Rating[]>([])
  const [teachers, setTeachers] = useState<Map<string, Teacher>>(new Map())

  useEffect(() => {
    listTeachers().then((all) => setTeachers(new Map(all.map((t) => [t.id, t]))))
  }, [])
  useEffect(() => {
    listRatingsForClass(classId).then(setRatings)
  }, [classId])

  const cls = myClasses.find((c) => c.id === classId)!

  const visible = useMemo(() => {
    if (period === 'year') return ratings
    const since = Date.now() - (period === 'week' ? 7 : 30) * DAY
    return ratings.filter((r) => new Date(r.createdAt).getTime() >= since)
  }, [ratings, period])

  const avg = visible.length ? visible.reduce((s, r) => s + r.score, 0) / visible.length : null

  return (
    <div className="stack">
      <section className="card">
        <div className="class-header">
          <h2>כיתה {classLabel(cls)}</h2>
          {myClasses.length > 1 && (
            <select className="input select" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {myClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {classLabel(c)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="segmented" role="tablist">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={period === p.key}
              className={period === p.key ? 'active' : ''}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="summary">
          {avg == null ? (
            <span className="muted">אין דירוגים בתקופה זו</span>
          ) : (
            <>
              ממוצע <strong>{avg.toFixed(1)}</strong> מתוך {visible.length} דירוגים
            </>
          )}
        </p>
      </section>

      <section className="card">
        <h2>כל הדירוגים</h2>
        {visible.length === 0 ? (
          <p className="muted">כשמורים ידרגו את הכיתה, הדירוגים יופיעו כאן</p>
        ) : (
          <ul className="rating-list">
            {visible.map((r) => (
              <li key={r.id} className="rating-item">
                <ScoreBadge score={r.score} />
                <div className="rating-body">
                  <div className="rating-head">
                    <strong>{teachers.get(r.teacherId)?.name ?? 'מורה לא ידוע/ה'}</strong>
                    <span className="muted small">{formatDate(r.createdAt)}</span>
                  </div>
                  {r.comment && <p className="rating-comment">{r.comment}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
