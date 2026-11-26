/**
 * Data access layer. The UI only talks to these async functions.
 * Backend: Supabase when configured (src/config.ts), otherwise local demo mode.
 */
import { createClient } from '@supabase/supabase-js'
import type { Rating, SchoolClass, Teacher } from '../types'
import { SUPABASE_ANON_KEY, SUPABASE_URL, USE_SUPABASE } from '../config'
import * as seed from './seed'

export function currentSchoolYear(d = new Date()): string {
  const start = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1 // Sept = month 8
  return `${start}-${start + 1}`
}

const db = USE_SUPABASE ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

// ---------- Row mapping (DB snake_case ↔ app camelCase) ----------
type ClassRow = { id: string; grade: string; number: number; homeroom_teacher_id: string | null }
type RatingRow = {
  id: string
  class_id: string
  teacher_id: string
  score: number
  comment: string
  created_at: string
  school_year: string
}
const toClass = (r: ClassRow): SchoolClass => ({
  id: r.id,
  grade: r.grade,
  number: r.number,
  homeroomTeacherId: r.homeroom_teacher_id,
})
const toRating = (r: RatingRow): Rating => ({
  id: r.id,
  classId: r.class_id,
  teacherId: r.teacher_id,
  score: r.score,
  comment: r.comment,
  createdAt: r.created_at,
  schoolYear: r.school_year,
})

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

// ---------- Local demo mode ----------
const LOCAL_KEY = 'class-ratings.ratings.v1'
const readLocal = (): Rating[] => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')
  } catch {
    return []
  }
}
const newestFirst = (a: Rating, b: Rating) => b.createdAt.localeCompare(a.createdAt)

// ---------- API ----------
export async function listTeachers(): Promise<Teacher[]> {
  const list = db ? check(await db.from('teachers').select('id, name')) : seed.teachers
  return [...list].sort((a, b) => a.name.localeCompare(b.name, 'he'))
}

export async function listClasses(): Promise<SchoolClass[]> {
  const list = db
    ? check(
        await db
          .from('classes')
          .select('id, grade, number, homeroom_teacher_id')
          .eq('school_year', currentSchoolYear()),
      ).map(toClass)
    : seed.classes
  // Code-point order sorts Hebrew grades correctly: א׳ … ט׳, י׳, י״א, י״ב
  return [...list].sort((a, b) => (a.grade === b.grade ? a.number - b.number : a.grade < b.grade ? -1 : 1))
}

export async function addRating(input: {
  classId: string
  teacherId: string
  score: number
  comment: string
}): Promise<void> {
  const comment = input.comment.trim()
  const schoolYear = currentSchoolYear()
  if (db) {
    check(
      await db.from('ratings').insert({
        class_id: input.classId,
        teacher_id: input.teacherId,
        score: input.score,
        comment,
        school_year: schoolYear,
      }),
    )
    return
  }
  const rating: Rating = {
    ...input,
    comment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    schoolYear,
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify([...readLocal(), rating]))
}

export async function listRatingsForClass(
  classId: string,
  schoolYear = currentSchoolYear(),
): Promise<Rating[]> {
  if (db) {
    return check(
      await db
        .from('ratings')
        .select('*')
        .eq('class_id', classId)
        .eq('school_year', schoolYear)
        .order('created_at', { ascending: false }),
    ).map(toRating)
  }
  return readLocal()
    .filter((r) => r.classId === classId && r.schoolYear === schoolYear)
    .sort(newestFirst)
}

export async function listRatingsByTeacher(teacherId: string, limit = 10): Promise<Rating[]> {
  if (db) {
    return check(
      await db
        .from('ratings')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false })
        .limit(limit),
    ).map(toRating)
  }
  return readLocal()
    .filter((r) => r.teacherId === teacherId)
    .sort(newestFirst)
    .slice(0, limit)
}
