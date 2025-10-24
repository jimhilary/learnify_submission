import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun, Globe, User, Menu, X } from 'lucide-react'
import { useDarkMode } from '../context/DarkModeContext'
import { useLanguage } from '../context/LanguageContext'

export const Navbar: React.FC = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const { language, setLanguage, t } = useLanguage()
    const [isLangOpen, setIsLangOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${darkMode
                ? 'bg-gray-900/95 border-gray-800 text-white'
                : 'bg-white/95 border-gray-200 text-gray-900'
            }`}>
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                            <span className="text-white font-bold text-lg sm:text-xl">L</span>
                        </div>
                        <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Learnify
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-3">
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${darkMode
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                aria-label={t('accessibility.openMenu')}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="font-medium text-sm">{language}</span>
                            </button>

                            {isLangOpen && (
                                <div className={`absolute right-0 mt-2 w-28 rounded-lg shadow-lg overflow-hidden z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'
                                    }`}>
                                    {['EN', 'FR', 'ES', 'DE'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang as 'EN' | 'FR' | 'ES' | 'DE')
                                                setIsLangOpen(false)
                                            }}
                                            className={`w-full px-3 py-2 text-left transition-colors text-sm ${darkMode
                                                    ? 'hover:bg-gray-700 text-gray-200'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                                } ${language === lang ? 'bg-blue-500/10 text-blue-600' : ''}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-all duration-200 ${darkMode
                                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            aria-label={t('accessibility.closeDialog')}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${darkMode
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="font-medium text-white text-sm sm:text-base">Hi, User</span>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-all duration-200 ${darkMode
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        aria-label={isMobileMenuOpen ? t('mobile.menuClose') : t('mobile.menuOpen')}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden mt-4 py-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <div className="space-y-3">
                            {/* Language Selection */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {t('accessibility.openMenu')}
                                </span>
                                <div className="flex space-x-2">
                                    {['EN', 'FR', 'ES', 'DE'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang as 'EN' | 'FR' | 'ES' | 'DE')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                language === lang 
                                                    ? 'bg-blue-500 text-white' 
                                                    : darkMode 
                                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dark Mode Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                                </span>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`p-2 rounded-lg transition-all duration-200 ${darkMode
                                            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* User Profile */}
                            <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${darkMode
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}>
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-white">Hi, User</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar