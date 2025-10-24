import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'

// Course selectors
export const selectCourses = (state: RootState) => state.courses.courses
export const selectCoursesLoading = (state: RootState) => state.courses.loading
export const selectCoursesError = (state: RootState) => state.courses.error

export const selectCourseById = (courseId: number) => (state: RootState) =>
  state.courses.courses.find(course => course.id === courseId)

// Lesson selectors
export const selectLessons = (state: RootState) => state.lessons.lessons
export const selectLessonsLoading = (state: RootState) => state.lessons.loading
export const selectLessonsError = (state: RootState) => state.lessons.error
export const selectAllLessons = (state: RootState) => state.lessons.lessons

export const selectLessonsByCourseId = (courseId: number) => (state: RootState) =>
  state.lessons.lessons.filter(lesson => lesson.courseId === courseId)

export const selectLessonById = (lessonId: number) => (state: RootState) =>
  state.lessons.lessons.find(lesson => lesson.id === lessonId)

// Progress selectors
export const selectLessonProgress = (lessonId: number) => (state: RootState) =>
  state.progress.lessonProgress?.[lessonId]

export const selectCourseProgress = (courseId: number) => (state: RootState) =>
  state.progress.courseProgress?.[courseId]

export const selectIsLessonCompleted = (lessonId: number) => (state: RootState) =>
  state.progress.lessonProgress?.[lessonId]?.completed || false

export const selectCourseCompletionPercentage = (courseId: number) => (state: RootState) => {
  const courseProgress = state.progress.courseProgress?.[courseId]
  if (!courseProgress || courseProgress.totalLessons === 0) return 0
  return Math.round((courseProgress.completedLessons / courseProgress.totalLessons) * 100)
}

export const selectIsEnrolledInCourse = (courseId: number) => (state: RootState) => {
  const enrolledCourses = state.progress.enrolledCourses || {}
  return enrolledCourses[courseId] || false
}

// Combined selectors
export const selectCourseWithProgress = (courseId: number) => createSelector(
  [selectCourseById(courseId), selectLessonsByCourseId(courseId), selectCourseProgress(courseId)],
  (course, lessons, progress) => ({
    course,
    lessons,
    progress,
    completionPercentage: progress ? Math.round((progress.completedLessons / progress.totalLessons) * 100) : 0,
  })
)

export const selectLessonWithProgress = (lessonId: number) => createSelector(
  [selectLessonById(lessonId), selectLessonProgress(lessonId)],
  (lesson, progress) => ({
    lesson,
    progress,
    isCompleted: progress?.completed || false,
  })
)
