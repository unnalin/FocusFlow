import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ThemeSelector } from './ThemeSelector'
import { ColorSchemeSelector } from './ColorSchemeSelector'
import { useUIStore } from '@/store/uiStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { translations } from '@/utils/translations'

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
    setBreakDuration,
    language,
    setLanguage,
  } = useUIStore()

  const t = translations[language]

  useKeyboardShortcuts({
    'ctrl+,': () => setIsOpen(true),
    'meta+,': () => setIsOpen(true),
  })

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors shadow-lg"
        title={`${t.settings} (Ctrl+,)`}
      >
        ⚙️
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t.settings}>
        <div className="space-y-6">
          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-medium block">{t.language}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('zh')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  language === 'zh'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {t.chinese}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  language === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {t.english}
              </button>
            </div>
          </div>

          <ThemeSelector />

          <ColorSchemeSelector />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-medium block">{t.immersiveMode}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {language === 'zh' ? '全屏专注，不被打扰' : 'Full-screen distraction-free interface'}
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
              <span className="text-base font-medium block">{t.breakBgm}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {language === 'zh' ? '休息时播放轻音乐' : 'Play relaxing music during break sessions'}
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
              <span className="text-base font-medium block">{t.focusDuration}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {language === 'zh' ? '每次专注多久' : 'Duration of focus sessions in minutes'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="60"
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                className="w-16 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <span className="text-sm text-neutral-500">{t.minutes}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-medium block">{t.breakDuration}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {language === 'zh' ? '每次休息多久' : 'Duration of break sessions in minutes'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-16 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <span className="text-sm text-neutral-500">{t.minutes}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {language === 'zh'
                ? <>按 <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded">Esc</kbd> 可退出沉浸模式</>
                : <>Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded">Esc</kbd> to exit immersive mode</>
              }
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
