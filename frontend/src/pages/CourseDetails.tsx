import React, { useEffect } from 'react'
import LessonList from '../components/LessonList'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ProgressIndicator from '../components/ProgressIndicator'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchLessonsByCourseId } from '../store/slices/lessonsSlice'
import { updateCourseProgress, enrollInCourse, unenrollFromCourse } from '../store/slices/progressSlice'
import { selectLessonsByCourseId, selectLessonsLoading, selectLessonsError, selectIsEnrolledInCourse } from '../store/selectors'
import { useLanguage } from '../context/LanguageContext'
import type { Lesson } from '../types/lesson'
import type { Course } from '../types/course'

interface CourseDetailsProps {
    course?: Course 
    lessons?: Lesson[]
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ course, lessons: propLessons }) => {
    const dispatch = useAppDispatch()
    const { t } = useLanguage()
    const lessons = useAppSelector(selectLessonsByCourseId(course?.id || 0))
    const loading = useAppSelector(selectLessonsLoading)
    const error = useAppSelector(selectLessonsError)
    const isEnrolled = useAppSelector(selectIsEnrolledInCourse(course?.id || 0))
    const displayLessons = propLessons || lessons

    useEffect(() => {
        if (course && (!propLessons || propLessons.length === 0)) {
            dispatch(fetchLessonsByCourseId(course.id))
        }
    }, [dispatch, course, propLessons])

    // Update course progress when lessons are loaded
    useEffect(() => {
        if (course && displayLessons && displayLessons.length > 0) {
            dispatch(updateCourseProgress({ 
                courseId: course.id, 
                totalLessons: displayLessons.length 
            }))
        }
    }, [dispatch, course, displayLessons])
    
    const handleEnroll = () => {
        if (course) {
            if (isEnrolled) {
                dispatch(unenrollFromCourse(course.id))
            } else {
                dispatch(enrollInCourse(course.id))
            }
        }
    }
    
    const lessonIndex = 0
    const featuredLesson = displayLessons && displayLessons.length > 0 ? displayLessons[lessonIndex] : null

    if (loading) {
        return (
            <div className="animate-fade-in max-w-4xl mx-auto">
                <LoadingSpinner size="lg" text={t('loading.course')} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="animate-fade-in max-w-4xl mx-auto text-center py-12">
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                        {t('error.courseLoadFailed')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        {t('error.courseLoadMessage')}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => course && dispatch(fetchLessonsByCourseId(course.id))}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {t('button.tryAgain')}
                        </button>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            {t('button.goHome')}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-0">
            {/* Course Header */}
            <Card className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <img
                    src={course?.imageUrl || `https://picsum.photos/400/200`}
                    alt={course?.title || 'Course'}
                    className="w-full sm:w-64 h-48 sm:h-48 object-cover rounded-lg"
                />
                <div className="flex-grow">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {course?.title || 'Course Title'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                        {course?.description?.intro || 'Course description goes here.'}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium self-start">
                            {course?.difficulty || 'Beginner Friendly'}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                            ⏱️ {displayLessons?.length || 0} {t('courses.lessonsCount')}
                        </span>
                    </div>
                    
                    {/* Progress Indicator */}
                    {course && (
                        <div className="mb-4">
                            <ProgressIndicator 
                                courseId={course.id} 
                                className="mb-4"
                            />
                        </div>
                    )}
                    
                    <Button 
                        variant="primary" 
                        onClick={handleEnroll}
                        className="w-full sm:w-auto"
                    >
                        {isEnrolled ? t('button.enrolled') : t('button.enrollNow')}
                    </Button>
                </div>
            </Card>

            {/* Featured Lesson */}
            {featuredLesson && (
                <Card>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('courses.featuredLesson')}: {featuredLesson.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {featuredLesson.content || t('courses.lessonContentPlaceholder')}
                    </p>
                </Card>
            )}

            {/* All Lessons */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t('courses.allLessons')} ({displayLessons?.length || 0})
                </h2>
                {displayLessons && displayLessons.length > 0 ? (
                    <LessonList lessons={displayLessons} />
                ) : (
                    <Card className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                            {loading ? t('loading.lessons') : t('courses.noLessons')}
                        </div>
                        {!loading && (
                            <button 
                                onClick={() => course && dispatch(fetchLessonsByCourseId(course.id))}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {t('button.tryAgain')}
                            </button>
                        )}
                    </Card>
                )}
            </div>

            {/* About Section */}
            {course?.description?.scope && course.description.scope.length > 0 && (
                <Card>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('courses.aboutCourse')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {course.description.intro}
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        {course.description.scope.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    )
}

export default CourseDetails