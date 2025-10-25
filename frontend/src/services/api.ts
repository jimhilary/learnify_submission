import axios from 'axios'
import type { Course } from '../types/course'
import type { Lesson } from '../types/lesson'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const API_KEY = import.meta.env.VITE_API_KEY || 'test-api-key-12345'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
})

// Request interceptor for adding auth headers
api.interceptors.request.use(
  (config) => {
    // Ensure Authorization header is always set
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${API_KEY}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      throw new Error('Resource not found')
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.')
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.')
    }
    throw error
  }
)

// Helper function to transform API response to frontend format
const transformLesson = (lesson: any): Lesson => ({
  id: lesson.id,
  title: lesson.title,
  content: lesson.content,
  difficulty: lesson.difficulty,
  courseId: lesson.courseId, // Backend already returns camelCase
  imageUrl: lesson.imageUrl, // Backend already returns camelCase
  description: lesson.description,
})

const transformCourse = (course: any): Course => ({
  id: course.id,
  title: course.title,
  description: course.description,
  category: course.category,
  imageUrl: course.imageUrl, // Backend already returns camelCase
  difficulty: course.difficulty,
})

// API Service Functions
export const apiService = {
  // Courses
  async getCourses(): Promise<Course[]> {
    const response = await api.get('/courses')
    const transformedCourses = response.data.map(transformCourse)
    return transformedCourses
  },

  async getCourseById(id: number): Promise<Course> {
    const response = await api.get(`/courses/${id}`)
    const transformedCourse = transformCourse(response.data)
    return transformedCourse
  },

  // Lessons
  async getAllLessons(): Promise<Lesson[]> {
    const response = await api.get('/lessons')
    const transformedLessons = response.data.map(transformLesson)
    return transformedLessons
  },

  async getLessonById(id: number): Promise<Lesson> {
    const response = await api.get(`/lessons/${id}`)
    const transformedLesson = transformLesson(response.data)
    return transformedLesson
  },

  async getLessonsByCourseId(courseId: number): Promise<Lesson[]> {
    const response = await api.get(`/courses/${courseId}/lessons`)
    const transformedLessons = response.data.map(transformLesson)
    return transformedLessons
  },

  // Alternative endpoint for lessons by course
  async getLessonsByCourseIdAlt(courseId: number): Promise<Lesson[]> {
    const response = await api.get(`/lessons/${courseId}`)
    const transformedLessons = response.data.map(transformLesson)
    return transformedLessons
  },
}

export default api
