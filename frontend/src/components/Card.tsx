import React from 'react'
import { useDarkMode } from '../context/DarkModeContext'

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const { darkMode } = useDarkMode()
  
  return (
    <div className={`rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 p-6 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    } ${className}`}>
      {children}
    </div>
  )
}

export default Card