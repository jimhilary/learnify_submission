import React from 'react'
import { useAppSelector } from '../store/hooks'
import { selectCourseCompletionPercentage } from '../store/selectors'

interface ProgressIndicatorProps {
  courseId: number
  className?: string
  showPercentage?: boolean
  showAnimation?: boolean
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  courseId, 
  className = '',
  showPercentage = true,
  showAnimation = true
}) => {
  const completionPercentage = useAppSelector(selectCourseCompletionPercentage(courseId))

  // Determine progress color and animation
  const getProgressColor = () => {
    if (completionPercentage === 100) return 'bg-green-500'
    if (completionPercentage > 75) return 'bg-blue-500'
    if (completionPercentage > 50) return 'bg-yellow-500'
    if (completionPercentage > 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getProgressIcon = () => {
    if (completionPercentage === 100) return '🎉'
    if (completionPercentage > 75) return '🚀'
    if (completionPercentage > 50) return '📈'
    if (completionPercentage > 25) return '⏳'
    return '🎯'
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Progress
          </span>
          <span className="text-lg">{getProgressIcon()}</span>
        </div>
        {showPercentage && (
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {completionPercentage}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
            showAnimation ? 'animate-pulse' : ''
          } ${getProgressColor()}`}
          style={{ 
            width: `${completionPercentage}%`,
            background: completionPercentage === 100 
              ? 'linear-gradient(90deg, #10b981, #34d399)' 
              : completionPercentage > 75
                ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                : completionPercentage > 50
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : completionPercentage > 25
                    ? 'linear-gradient(90deg, #f97316, #fb923c)'
                    : 'linear-gradient(90deg, #ef4444, #f87171)'
          }}
        />
      </div>
      
      {/* Progress Status Text */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {completionPercentage === 100 && '🎉 Course Completed!'}
        {completionPercentage > 75 && completionPercentage < 100 && '🚀 Almost there!'}
        {completionPercentage > 50 && completionPercentage <= 75 && '📈 Great progress!'}
        {completionPercentage > 25 && completionPercentage <= 50 && '⏳ Keep going!'}
        {completionPercentage > 0 && completionPercentage <= 25 && '🎯 Getting started!'}
        {completionPercentage === 0 && 'Start your learning journey!'}
      </div>
    </div>
  )
}

export default ProgressIndicator
