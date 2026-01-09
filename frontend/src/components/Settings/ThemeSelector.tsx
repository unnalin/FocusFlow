import { useUIStore } from '@/store/uiStore'
import { translations } from '@/utils/translations'

export const ThemeSelector = () => {
  const { theme, toggleTheme, language } = useUIStore()
  const t = translations[language]

  return (
    <div className="flex items-center gap-3">
      <span className="text-base font-medium">{t.theme}:</span>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
      >
        {theme === 'light' ? `🌙 ${t.dark}` : `☀️ ${t.light}`}
      </button>
    </div>
  )
}
