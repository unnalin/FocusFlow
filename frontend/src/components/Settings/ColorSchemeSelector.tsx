import { useUIStore } from '@/store/uiStore'

const schemes = [
  { value: 'default', label: 'Ocean Blue', emoji: '🌊' },
  { value: 'forest', label: 'Forest Green', emoji: '🌲' },
]

export const ColorSchemeSelector = () => {
  const { colorScheme, setColorScheme } = useUIStore()

  return (
    <div>
      <span className="text-sm font-medium block mb-2">Color Scheme:</span>
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
