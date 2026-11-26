import type { SchoolClass, Teacher } from '../types'

// ⚠️ SAMPLE DATA — replace with the school's real teacher & homeroom lists.

export const teachers: Teacher[] = [
  { id: 't1', name: 'אורטל כהן' },
  { id: 't2', name: 'מיכל לוי' },
  { id: 't3', name: 'דני אברהם' },
  { id: 't4', name: 'רונית מזרחי' },
  { id: 't5', name: 'יוסי פרץ' },
  { id: 't6', name: 'שירה ביטון' },
  { id: 't7', name: 'נועה דהן' },
  { id: 't8', name: 'אבי שושן' },
]

export const classes: SchoolClass[] = [
  { id: 'c-z1', grade: 'ז׳', number: 1, homeroomTeacherId: 't1' },
  { id: 'c-z2', grade: 'ז׳', number: 2, homeroomTeacherId: 't2' },
  { id: 'c-z3', grade: 'ז׳', number: 3, homeroomTeacherId: 't3' },
  { id: 'c-h1', grade: 'ח׳', number: 1, homeroomTeacherId: 't4' },
  { id: 'c-h2', grade: 'ח׳', number: 2, homeroomTeacherId: 't5' },
  { id: 'c-t1', grade: 'ט׳', number: 1, homeroomTeacherId: 't6' },
  { id: 'c-t2', grade: 'ט׳', number: 2, homeroomTeacherId: null },
]
