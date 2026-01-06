import { useUIStore } from '@/store/uiStore'

export const ThemeSelector = () => {
  const { theme, toggleTheme } = useUIStore()

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Theme:</span>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  )
}
