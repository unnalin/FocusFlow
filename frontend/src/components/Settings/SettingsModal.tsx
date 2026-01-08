import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ThemeSelector } from './ThemeSelector'
import { ColorSchemeSelector } from './ColorSchemeSelector'
import { useUIStore } from '@/store/uiStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export const SettingsModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    immersiveMode,
    setImmersiveMode,
    breakBgmEnabled,
    setBreakBgmEnabled,
    focusDuration,
    setFocusDuration,
    breakDuration,
    setBreakDuration
  } = useUIStore()

  useKeyboardShortcuts({
    'ctrl+,': () => setIsOpen(true),
    'meta+,': () => setIsOpen(true),
  })

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors shadow-lg"
        title="Settings (Ctrl+,)"
      >
        ⚙️
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Settings">
        <div className="space-y-6">
          <ThemeSelector />

          <ColorSchemeSelector />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium block">Immersive Mode</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Full-screen distraction-free interface
              </span>
            </div>
            <button
              onClick={() => setImmersiveMode(!immersiveMode)}
              style={{
                backgroundColor: immersiveMode
                  ? 'rgb(var(--color-accent-600))'
                  : undefined,
              }}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                immersiveMode ? '' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  immersiveMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium block">Break Background Music</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Play relaxing music during break sessions
              </span>
            </div>
            <button
              onClick={() => setBreakBgmEnabled(!breakBgmEnabled)}
              style={{
                backgroundColor: breakBgmEnabled
                  ? 'rgb(var(--color-accent-600))'
                  : undefined,
              }}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                breakBgmEnabled ? '' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  breakBgmEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium block">Focus Duration</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Duration of focus sessions in minutes
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="60"
              value={focusDuration}
              onChange={(e) => setFocusDuration(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium block">Break Duration</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Duration of break sessions in minutes
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded">Esc</kbd> to exit immersive mode
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
