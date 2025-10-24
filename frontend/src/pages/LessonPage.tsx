import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import ReactMarkdown from 'react-markdown'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchLessonById } from '../store/slices/lessonsSlice'
import { markLessonCompleted, markLessonIncomplete } from '../store/slices/progressSlice'
import { selectLessonById, selectLessonsByCourseId, selectIsLessonCompleted } from '../store/selectors'
import { useLanguage } from '../context/LanguageContext'
import type { Lesson } from '../types/lesson'
import { generateLessonMarkdown } from '../dummydata/dummyMD'

export const LessonPage: React.FC<{ lesson?: Lesson }> = ({ lesson: propLesson }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useLanguage()
  
  const lessonId = id ? Number(id) : 0
  const lesson = useAppSelector(selectLessonById(lessonId))
  const isCompleted = useAppSelector(selectIsLessonCompleted(lessonId))
  const courseLessons = useAppSelector(selectLessonsByCourseId(lesson?.courseId || 0))
  
  const [completed, setCompleted] = useState(isCompleted)

  useEffect(() => {
    if (!propLesson && lessonId) {
      dispatch(fetchLessonById(lessonId))
    }
  }, [dispatch, lessonId, propLesson])

  useEffect(() => {
    setCompleted(isCompleted)
  }, [isCompleted])

  const displayLesson = propLesson || lesson
  if (!displayLesson) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Lesson Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">The requested lesson does not exist.</p>
      </div>
    )
  }

  const markdownContent = generateLessonMarkdown(displayLesson.title, displayLesson.id)
  
  // Find next and previous lessons
  const sortedLessons = courseLessons.sort((a, b) => a.id - b.id)
  const currentIndex = sortedLessons.findIndex(l => l.id === displayLesson.id)
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null

  const handleToggleComplete = () => {
    const newCompleted = !completed
    setCompleted(newCompleted)
    
    if (displayLesson.courseId) {
      if (newCompleted) {
        dispatch(markLessonCompleted({ lessonId: displayLesson.id, courseId: displayLesson.courseId }))
      } else {
        dispatch(markLessonIncomplete({ lessonId: displayLesson.id, courseId: displayLesson.courseId }))
      }
    }
  }

  // Map difficulty → color pill
  const difficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
    }
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-100">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        <span>/</span>
        <Link to={`/courses/${displayLesson.courseId}`} className="hover:text-blue-600 dark:hover:text-blue-400">Course</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Lesson {displayLesson.id}</span>
      </div>

      {/* Lesson Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{displayLesson.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(displayLesson.difficulty)}`}>
            {displayLesson.difficulty}
          </span>
        </div>

        {/* Lesson Image */}
        <div className="relative mb-6 overflow-hidden rounded-xl shadow-md">
          <img
            src={displayLesson.imageUrl}
            alt={displayLesson.title}
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Markdown Body */}
        <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white">
          {/* <ReactMarkdown>
            {lesson.content}
          </ReactMarkdown> */}
          <ReactMarkdown>
            {markdownContent}
          </ReactMarkdown>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="primary" onClick={handleToggleComplete}>
            {completed ? t('button.completed') : t('button.markComplete')}
          </Button>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2 ml-auto">
            {prevLesson && (
              <Button 
                variant="secondary" 
                onClick={() => navigate(`/lessons/${prevLesson.id}`)}
              >
                {t('button.previous')}
              </Button>
            )}
            {nextLesson && (
              <Button 
                variant="secondary" 
                onClick={() => navigate(`/lessons/${nextLesson.id}`)}
              >
                {t('button.next')}
              </Button>
            )}
            {!nextLesson && (
              <Button 
                variant="secondary" 
                onClick={() => navigate(`/courses/${displayLesson.courseId}`)}
              >
                {t('button.backToCourse')}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Resources Section */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Additional Resources</h3>
        <div className="space-y-3">
          {[
            { name: '📄 Lesson Notes (PDF)', action: 'Download' },
            { name: '💻 Source Code', action: 'View' },
            { name: '🔗 Official Documentation', action: 'Open' },
          ].map((res) => (
            <a
              key={res.name}
              href="#"
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-gray-900 dark:text-white font-medium">{res.name}</span>
              <span className="text-blue-600 dark:text-blue-400">{res.action}</span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default LessonPage
