import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface LessonProgress {
  lessonId: number
  completed: boolean
  completedAt?: number
  timeSpent?: number // in minutes
}

interface ProgressState {
  lessonProgress: { [lessonId: number]: LessonProgress }
  courseProgress: { [courseId: number]: { completedLessons: number; totalLessons: number } }
  enrolledCourses: { [courseId: number]: boolean }
}

const initialState: ProgressState = {
  lessonProgress: {},
  courseProgress: {},
  enrolledCourses: {},
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    enrollInCourse: (state, action: PayloadAction<number>) => {
      const courseId = action.payload
      console.log('ProgressSlice: Optimistically enrolling in course:', courseId)
      
      // Ensure enrolledCourses exists
      if (!state.enrolledCourses) {
        state.enrolledCourses = {}
      }
      
      // Optimistic update - immediately show enrolled state
      state.enrolledCourses[courseId] = true
      console.log('ProgressSlice: Optimistic enrollment complete for course:', courseId)
    },
    
    unenrollFromCourse: (state, action: PayloadAction<number>) => {
      const courseId = action.payload
      console.log('ProgressSlice: Optimistically unenrolling from course:', courseId)
      
      if (state.enrolledCourses) {
        delete state.enrolledCourses[courseId]
        console.log('ProgressSlice: Optimistic unenrollment complete for course:', courseId)
      }
    },
    
    markLessonCompleted: (state, action: PayloadAction<{ lessonId: number; courseId: number }>) => {
      const { lessonId, courseId } = action.payload
      console.log('ProgressSlice: Optimistically marking lesson as completed:', lessonId, 'for course:', courseId)
      
      // Optimistic update - immediately show completed state
      state.lessonProgress[lessonId] = {
        lessonId,
        completed: true,
        completedAt: Date.now(),
      }
      
      // Update course progress
      if (!state.courseProgress[courseId]) {
        state.courseProgress[courseId] = { completedLessons: 0, totalLessons: 0 }
      }
      
      // Count completed lessons for this course
      const completedCount = Object.values(state.lessonProgress)
        .filter(progress => progress.completed).length
      
      state.courseProgress[courseId].completedLessons = completedCount
      console.log('ProgressSlice: Optimistic lesson completion complete. Course', courseId, 'now has', completedCount, 'completed lessons')
    },
    
    markLessonIncomplete: (state, action: PayloadAction<{ lessonId: number; courseId: number }>) => {
      const { lessonId, courseId } = action.payload
      
      // Update lesson progress
      state.lessonProgress[lessonId] = {
        lessonId,
        completed: false,
      }
      
      // Update course progress
      if (state.courseProgress[courseId]) {
        const completedCount = Object.values(state.lessonProgress)
          .filter(progress => progress.completed)
          .length
        state.courseProgress[courseId].completedLessons = Math.max(0, completedCount)
      }
    },
    
    updateCourseProgress: (state, action: PayloadAction<{ courseId: number; totalLessons: number }>) => {
      const { courseId, totalLessons } = action.payload
      
      if (!state.courseProgress[courseId]) {
        state.courseProgress[courseId] = { completedLessons: 0, totalLessons }
      } else {
        state.courseProgress[courseId].totalLessons = totalLessons
      }
    },
    
    updateTimeSpent: (state, action: PayloadAction<{ lessonId: number; timeSpent: number }>) => {
      const { lessonId, timeSpent } = action.payload
      
      if (state.lessonProgress[lessonId]) {
        state.lessonProgress[lessonId].timeSpent = timeSpent
      }
    },
    
    clearProgress: (state) => {
      state.lessonProgress = {}
      state.courseProgress = {}
    },
    
    clearCourseProgress: (state, action: PayloadAction<number>) => {
      const courseId = action.payload
      
      // Remove progress for all lessons in this course
      Object.keys(state.lessonProgress).forEach(lessonId => {
        // In a real app, we'd have courseId stored in progress
        // For now, we'll clear all progress
        delete state.lessonProgress[Number(lessonId)]
      })
      
      delete state.courseProgress[courseId]
    },
  },
})

export const {
  enrollInCourse,
  unenrollFromCourse,
  markLessonCompleted,
  markLessonIncomplete,
  updateCourseProgress,
  updateTimeSpent,
  clearProgress,
  clearCourseProgress,
} = progressSlice.actions

export default progressSlice.reducer
