import { useUIStore } from '@/store/uiStore'
import { translations } from '@/utils/translations'

export const ColorSchemeSelector = () => {
  const { colorScheme, setColorScheme, language } = useUIStore()
  const t = translations[language]

  const schemes = [
    { value: 'default', label: t.oceanBlue, emoji: '🌊' },
    { value: 'forest', label: t.forestGreen, emoji: '🌲' },
  ]

  return (
    <div>
      <span className="text-base font-medium block mb-2">{t.colorScheme}:</span>
      <div className="flex gap-2">
        {schemes.map((scheme) => (
          <button
            key={scheme.value}
            onClick={() => setColorScheme(scheme.value as 'default' | 'forest')}
            style={{
              backgroundColor: colorScheme === scheme.value
                ? 'rgb(var(--color-accent-600))'
                : undefined,
              boxShadow: colorScheme === scheme.value
                ? `0 0 0 2px rgb(var(--color-accent-400))`
                : undefined,
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              colorScheme === scheme.value
                ? 'text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            <span className="mr-2">{scheme.emoji}</span>
            {scheme.label}
          </button>
        ))}
      </div>
    </div>
  )
}
