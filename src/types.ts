export interface Teacher {
  id: string
  name: string
}

export interface SchoolClass {
  id: string
  /** Hebrew grade label, e.g. "ז׳" or "י״א" */
  grade: string
  /** Parallel class number, e.g. 3 for ז׳3 */
  number: number
  homeroomTeacherId: string | null
}

export interface Rating {
  id: string
  classId: string
  teacherId: string
  /** 1–10 */
  score: number
  comment: string
  /** ISO timestamp */
  createdAt: string
  /** e.g. "2026-2027" (Israeli school year starts September 1) */
  schoolYear: string
}

export const classLabel = (c: SchoolClass) => `${c.grade}${c.number}`
