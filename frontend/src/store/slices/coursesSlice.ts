import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { apiService } from '../../services/api'
import type { Course } from '../../types/course'

interface CoursesState {
  courses: Course[]
  loading: boolean
  error: string | null
  lastFetched: number | null
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
  lastFetched: null,
}

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any
      const lastFetched = state.courses.lastFetched
      const now = Date.now()
      
      // Cache for 5 minutes
      if (lastFetched && (now - lastFetched) < 300000 && state.courses.courses.length > 0) {
        return state.courses.courses
      }
      
      const courses = await apiService.getCourses()
      return courses
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch courses')
    }
  }
)

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const course = await apiService.getCourseById(courseId)
      return course
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch course')
    }
  }
)

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCourses: (state) => {
      state.courses = []
      state.lastFetched = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false
        state.courses = action.payload
        state.lastFetched = Date.now()
        state.error = null
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false
        // Update existing course or add new one
        const existingIndex = state.courses.findIndex(c => c.id === action.payload.id)
        if (existingIndex >= 0) {
          state.courses[existingIndex] = action.payload
        } else {
          state.courses.push(action.payload)
        }
        state.error = null
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearCourses } = coursesSlice.actions
export default coursesSlice.reducer
