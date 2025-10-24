import React from 'react'
import { useDarkMode } from '../context/DarkModeContext'
import { useLanguage } from '../context/LanguageContext'

export const Footer: React.FC = () => {
    const { darkMode } = useDarkMode()
    const { t } = useLanguage()

    return (
        <footer className={`mt-auto py-6 px-4 border-t transition-colors duration-300 ${darkMode
                ? 'bg-gray-900 border-gray-800 text-gray-400'
                : 'bg-white border-gray-200 text-gray-600'
            }`}>
            <div className="container mx-auto text-center">
                <p className="text-sm">
                   {t('footer.builtWith')}
                </p>

            </div>
        </footer>
    )
}

export default Footer