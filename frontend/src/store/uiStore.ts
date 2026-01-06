import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark'
  colorScheme: 'default' | 'forest'
  immersiveMode: boolean
  setTheme: (theme: 'light' | 'dark') => void
  setColorScheme: (scheme: 'default' | 'forest') => void
  setImmersiveMode: (enabled: boolean) => void
  toggleTheme: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      colorScheme: 'default',
      immersiveMode: true,
      setTheme: (theme) => set({ theme }),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setImmersiveMode: (enabled) => set({ immersiveMode: enabled }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'focusflow-ui',
    }
  )
)
