/**
 * Data access layer. Everything the UI needs goes through these async functions,
 * so swapping localStorage for Supabase later only touches this file.
 */
import type { Rating, SchoolClass, Teacher } from '../types'
import { classes, teachers } from './seed'

const RATINGS_KEY = 'class-ratings.ratings.v1'

export function currentSchoolYear(d = new Date()): string {
  const start = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1 // Sept = month 8
  return `${start}-${start + 1}`
}

function readRatings(): Rating[] {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeRatings(r: Rating[]) {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(r))
}

export async function listTeachers(): Promise<Teacher[]> {
  return [...teachers].sort((a, b) => a.name.localeCompare(b.name, 'he'))
}

export async function listClasses(): Promise<SchoolClass[]> {
  return classes
}

export async function addRating(input: {
  classId: string
  teacherId: string
  score: number
  comment: string
}): Promise<Rating> {
  const now = new Date()
  const rating: Rating = {
    ...input,
    comment: input.comment.trim(),
    id: crypto.randomUUID(),
    createdAt: now.toISOString(),
    schoolYear: currentSchoolYear(now),
  }
  writeRatings([...readRatings(), rating])
  return rating
}

const newestFirst = (a: Rating, b: Rating) => b.createdAt.localeCompare(a.createdAt)

export async function listRatingsForClass(
  classId: string,
  schoolYear = currentSchoolYear(),
): Promise<Rating[]> {
  return readRatings()
    .filter((r) => r.classId === classId && r.schoolYear === schoolYear)
    .sort(newestFirst)
}

export async function listRatingsByTeacher(teacherId: string, limit = 10): Promise<Rating[]> {
  return readRatings()
    .filter((r) => r.teacherId === teacherId)
    .sort(newestFirst)
    .slice(0, limit)
}
