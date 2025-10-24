import React from 'react'
import { Link } from 'react-router-dom'
import Card from './Card'
import type { Course } from '../types/course'
import { useLanguage } from '../context/LanguageContext'

interface CourseListProps {
  course: Course
}

export const CourseList: React.FC<CourseListProps> = ({ course }) => {
  const { t } = useLanguage()
  
  return (
    <Link to={`/courses/${course.id}`} className="block">
      <Card className="flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer">
        <img
          src={course.imageUrl ?? `https://picsum.photos/300/300?random=${course.id}`}
          alt={course.title}
          className="w-full h-40 object-cover rounded-lg mb-2"
        />
        <h3 className="text-lg font-semibold dark:text-white">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
          {course.description?.intro ?? 'No description available.'}
        </p>
        <div className="btn-primary mt-3 self-start">
          {t('button.viewCourse')}
        </div>
      </Card>
    </Link>
  )
}

export default CourseList
