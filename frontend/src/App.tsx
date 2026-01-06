import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUIStore } from './store/uiStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { SettingsModal } from './components/Settings/SettingsModal'
import FocusPage from './pages/FocusPage'

function App() {
  const { theme, colorScheme, immersiveMode, setImmersiveMode } = useUIStore()

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  useEffect(() => {
    // Apply color scheme class to document
    document.documentElement.classList.remove('scheme-default', 'scheme-forest')
    document.documentElement.classList.add(`scheme-${colorScheme}`)
  }, [colorScheme])

  // ESC key exits immersive mode
  useKeyboardShortcuts({
    'escape': () => {
      if (immersiveMode) setImmersiveMode(false)
    },
  })

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-300 ${immersiveMode ? 'immersive-mode' : ''}`}>
        <SettingsModal />

        {immersiveMode && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-neutral-800/80 backdrop-blur-sm rounded-full text-white text-sm animate-fade-in">
            Press <kbd className="px-2 py-1 bg-neutral-700 rounded">Esc</kbd> to exit immersive mode
          </div>
        )}

        <Routes>
          <Route path="/" element={<FocusPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
