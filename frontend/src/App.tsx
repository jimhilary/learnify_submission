
import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import LessonPage from './pages/LessonPage'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import { DarkModeProvider } from './context/DarkModeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { CourseDetails } from './pages/CourseDetails'
import { Home } from './pages/Home'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchCourseById } from './store/slices/coursesSlice'
import { fetchLessonById } from './store/slices/lessonsSlice'
import { selectCourseById, selectLessonById } from './store/selectors'
import { clearError as clearCoursesError } from './store/slices/coursesSlice'
import { clearError as clearLessonsError } from './store/slices/lessonsSlice'
import LoadingSpinner from './components/LoadingSpinner'
import OfflineIndicator from './components/OfflineIndicator'

// Wrapper components to handle routing logic
const CourseDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { t } = useLanguage()
  
  if (!id || isNaN(Number(id))) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{t('error.invalidCourseId')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('error.invalidIdDesc')}</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('button.goBack')}
        </button>
      </div>
    )
  }

  const courseId = Number(id)
  const course = useAppSelector(selectCourseById(courseId))
  const coursesError = useAppSelector(state => state.courses.error)

  // Fetch course if not in store
  React.useEffect(() => {
    if (!course && !coursesError) {
      dispatch(fetchCourseById(courseId))
    }
  }, [dispatch, courseId, course, coursesError])

  // Clear error when component unmounts or courseId changes
  React.useEffect(() => {
    return () => {
      dispatch(clearCoursesError())
    }
  }, [dispatch, courseId])

  // Handle error state
  if (coursesError) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{t('error.courseNotFound')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('error.courseNotFoundDesc')}
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('button.goHome')}
          </button>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {t('button.goBack')}
          </button>
        </div>
      </div>
    )
  }

  if (!course) {
    return <LoadingSpinner size="lg" text={t('loading.course')} />
  }
  
  return <CourseDetails course={course} />
}

const LessonPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { t } = useLanguage()
  
  if (!id || isNaN(Number(id))) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{t('error.invalidLessonId')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('error.invalidIdDesc')}</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('button.goBack')}
        </button>
      </div>
    )
  }

  const lessonId = Number(id)
  const lesson = useAppSelector(selectLessonById(lessonId))
  const lessonsError = useAppSelector(state => state.lessons.error)

  // Fetch lesson if not in store
  React.useEffect(() => {
    if (!lesson && !lessonsError) {
      dispatch(fetchLessonById(lessonId))
    }
  }, [dispatch, lessonId, lesson, lessonsError])

  // Clear error when component unmounts or lessonId changes
  React.useEffect(() => {
    return () => {
      dispatch(clearLessonsError())
    }
  }, [dispatch, lessonId])

  // Handle error state
  if (lessonsError) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{t('error.lessonNotFound')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('error.lessonNotFoundDesc')}
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('button.goHome')}
          </button>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {t('button.goBack')}
          </button>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return <LoadingSpinner size="lg" text={t('loading.lesson')} />
  }
  
  return <LessonPage lesson={lesson} />
}

export default function App() {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-6 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/courses/:id"
              element={<CourseDetailsWrapper />}
            />
            <Route
              path="/lessons/:id"
              element={<LessonPageWrapper />}
            />
        </Routes>
      </main>
      <Footer />
      <OfflineIndicator />
        </div>
      </LanguageProvider>
    </DarkModeProvider>
  )
}