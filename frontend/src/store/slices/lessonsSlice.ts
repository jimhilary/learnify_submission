import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { apiService } from '../../services/api'
import type { Lesson } from '../../types/lesson'

interface LessonsState {
  lessons: Lesson[]
  loading: boolean
  error: string | null
}

const initialState: LessonsState = {
  lessons: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchAllLessons = createAsyncThunk(
  'lessons/fetchAllLessons',
  async (_, { rejectWithValue }) => {
    try {
      const lessons = await apiService.getAllLessons()
      return lessons
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lessons')
    }
  }
)

export const fetchLessonsByCourseId = createAsyncThunk(
  'lessons/fetchLessonsByCourseId',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const lessons = await apiService.getLessonsByCourseId(courseId)
      return { courseId, lessons }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lessons')
    }
  }
)

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchLessonById',
  async (lessonId: number, { rejectWithValue }) => {
    try {
      const lesson = await apiService.getLessonById(lessonId)
      return lesson
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lesson')
    }
  }
)

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearLessons: (state) => {
      state.lessons = []
    },
    clearLessonsForCourse: (state, action: PayloadAction<number>) => {
      const courseId = action.payload
      state.lessons = state.lessons.filter(lesson => lesson.courseId !== courseId)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all lessons
      .addCase(fetchAllLessons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllLessons.fulfilled, (state, action: PayloadAction<Lesson[]>) => {
        state.loading = false
        state.lessons = action.payload
        state.error = null
      })
      .addCase(fetchAllLessons.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch lessons by course ID
      .addCase(fetchLessonsByCourseId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLessonsByCourseId.fulfilled, (state, action: PayloadAction<{ courseId: number; lessons: Lesson[] }>) => {
        state.loading = false
        const { courseId, lessons } = action.payload
        
        // Clear existing lessons for this course
        state.lessons = state.lessons.filter(lesson => lesson.courseId !== courseId)
        
        // Add new lessons
        if (lessons && lessons.length > 0) {
          state.lessons.push(...lessons)
        }
        
        state.error = null
      })
      .addCase(fetchLessonsByCourseId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch lesson by ID
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLessonById.fulfilled, (state, action: PayloadAction<Lesson>) => {
        state.loading = false
        // Update existing lesson or add new one
        const existingIndex = state.lessons.findIndex(l => l.id === action.payload.id)
        if (existingIndex >= 0) {
          state.lessons[existingIndex] = action.payload
        } else {
          state.lessons.push(action.payload)
        }
        state.error = null
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearLessons, clearLessonsForCourse } = lessonsSlice.actions
export default lessonsSlice.reducer
