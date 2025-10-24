import React, { useEffect } from 'react'
import Button from '../components/Button'
import { CourseList } from '../components/CourseList'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCourses } from '../store/slices/coursesSlice'
import { selectCourses, selectCoursesLoading, selectCoursesError } from '../store/selectors'
import LoadingSpinner from '../components/LoadingSpinner'
import { useLanguage } from '../context/LanguageContext'

export const Home: React.FC = () => {
    const dispatch = useAppDispatch()
    const courses = useAppSelector(selectCourses)
    const loading = useAppSelector(selectCoursesLoading)
    const error = useAppSelector(selectCoursesError)
    const { t } = useLanguage()
    const [showAllCourses, setShowAllCourses] = React.useState(false)

    useEffect(() => {
        // Only fetch if we don't have courses or if they're stale (older than 5 minutes)
        if (courses.length === 0) {
            dispatch(fetchCourses())
        }
    }, [dispatch, courses.length])

    if (loading) {
        return (
            <div className="animate-fade-in">
                <LoadingSpinner size="lg" text="Loading courses..." />
            </div>
        )
    }

    if (error) {
        // Show cached courses if available, otherwise show error
        if (courses.length > 0) {
            return (
                <div className="animate-fade-in">
                    <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Showing cached content - you're offline
                            </span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Some features may be limited while offline.
                        </p>
                    </div>
                    
                    {/* Hero Section */}
                    <div className="mb-12 text-center py-12 px-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {t('welcome.title')}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            {t('welcome.subtitle')}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="primary" onClick={() => {
                                const gridElement = document.querySelector('.grid') as HTMLElement
                                if (gridElement) {
                                    window.scrollTo({ top: gridElement.offsetTop, behavior: 'smooth' })
                                }
                            }}>
                                {t('button.getStarted')}
                            </Button>
                            <Button variant="outline" onClick={() => {
                                const gridElement = document.querySelector('.grid') as HTMLElement
                                if (gridElement) {
                                    window.scrollTo({ top: gridElement.offsetTop, behavior: 'smooth' })
                                }
                            }}>
                                {t('button.browseCourses')}
                            </Button>
                        </div>
                    </div>

                    {/* Courses Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('courses.popular')} (Cached)
                            </h2>
                            <Button variant="secondary" onClick={() => setShowAllCourses(!showAllCourses)}>
                                {showAllCourses ? 'Show Less' : t('courses.viewAll')}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(showAllCourses ? courses : courses?.slice(0, 20))?.map((course) => (
                                <CourseList key={course.id} course={course} />
                            ))}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="card text-center">
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                500+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Courses Available</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                10K+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Active Students</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                                50+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Expert Instructors</div>
                        </div>
                    </div>
                </div>
            )
        }
        
        return (
            <div className="animate-fade-in text-center py-12">
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Service Unavailable
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        We're having trouble connecting to our servers. Please check your internet connection and try again.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => dispatch(fetchCourses())}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            
            {/* Hero Section */}
            <div className="mb-12 text-center py-12 px-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('welcome.title')}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    {t('welcome.subtitle')}
                </p>
                <div className="flex gap-4 justify-center">
                    <Button variant="primary" onClick={() => {
                        const gridElement = document.querySelector('.grid') as HTMLElement
                        if (gridElement) {
                            window.scrollTo({ top: gridElement.offsetTop, behavior: 'smooth' })
                        }
                    }}>
                        {t('button.getStarted')}
                    </Button>
                    <Button variant="outline" onClick={() => {
                        const gridElement = document.querySelector('.grid') as HTMLElement
                        if (gridElement) {
                            window.scrollTo({ top: gridElement.offsetTop, behavior: 'smooth' })
                        }
                    }}>
                        {t('button.browseCourses')}
                    </Button>
                </div>
            </div>

            {/* Courses Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('courses.popular')}
                    </h2>
                    <Button variant="secondary" onClick={() => setShowAllCourses(!showAllCourses)}>
                        {showAllCourses ? 'Show Less' : t('courses.viewAll')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showAllCourses ? courses : courses?.slice(0, 20))?.map((course) => (
                        <CourseList key={course.id} course={course} />
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="card text-center">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        500+
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Courses Available</div>
                </div>
                <div className="card text-center">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        10K+
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Active Students</div>
                </div>
                <div className="card text-center">
                    <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                        50+
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Expert Instructors</div>
                </div>
            </div>

        </div>
    )
}
