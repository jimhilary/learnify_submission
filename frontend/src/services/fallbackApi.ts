import type { Course } from '../types/course'
import type { Lesson } from '../types/lesson'
import courses from '../dummydata/courses'
import lessons from '../dummydata/lessons'

// Fallback API service using dummy data
export const fallbackApiService = {
  // Courses
  async getCourses(): Promise<Course[]> {
    console.log('Using fallback data for courses')
    return new Promise((resolve) => {
      setTimeout(() => resolve(courses), 500) // Simulate API delay
    })
  },

  async getCourseById(id: number): Promise<Course> {
    console.log(`Using fallback data for course ${id}`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = courses.find(c => c.id === id)
        if (course) {
          resolve(course)
        } else {
          reject(new Error(`Course with id ${id} not found`))
        }
      }, 500)
    })
  },

  // Lessons
  async getLessonsByCourseId(courseId: number): Promise<Lesson[]> {
    console.log(`Using fallback data for lessons of course ${courseId}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        const courseLessons = lessons.filter(lesson => lesson.courseId === courseId)
        resolve(courseLessons)
      }, 500)
    })
  },

  async getLessonById(id: number): Promise<Lesson> {
    console.log(`Using fallback data for lesson ${id}`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lesson = lessons.find(l => l.id === id)
        if (lesson) {
          resolve(lesson)
        } else {
          reject(new Error(`Lesson with id ${id} not found`))
        }
      }, 500)
    })
  },
}
