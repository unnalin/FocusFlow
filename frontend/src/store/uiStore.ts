import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark'
  colorScheme: 'default' | 'forest'
  immersiveMode: boolean
  breakBgmEnabled: boolean
  focusDuration: number  // in minutes
  breakDuration: number  // in minutes
  language: 'en' | 'zh'  // Language setting
  setTheme: (theme: 'light' | 'dark') => void
  setColorScheme: (scheme: 'default' | 'forest') => void
  setImmersiveMode: (enabled: boolean) => void
  setBreakBgmEnabled: (enabled: boolean) => void
  setFocusDuration: (duration: number) => void
  setBreakDuration: (duration: number) => void
  setLanguage: (language: 'en' | 'zh') => void
  toggleTheme: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      colorScheme: 'default',
      immersiveMode: true,
      breakBgmEnabled: true,
      focusDuration: 25,
      breakDuration: 5,
      language: 'zh',  // Default to Chinese
      setTheme: (theme) => set({ theme }),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setImmersiveMode: (enabled) => set({ immersiveMode: enabled }),
      setBreakBgmEnabled: (enabled) => set({ breakBgmEnabled: enabled }),
      setFocusDuration: (duration) => set({ focusDuration: duration }),
      setBreakDuration: (duration) => set({ breakDuration: duration }),
      setLanguage: (language) => set({ language }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'focusflow-ui',
    }
  )
)
