import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  currentTaskId: number | null
  sessionType: 'focus' | 'break'
  isRunning: boolean
  completedToday: number
  lastResetDate: string // Store the date when completedToday was last reset
  currentSessionId: number | null
  setCurrentTask: (id: number | null) => void
  setSessionType: (type: 'focus' | 'break') => void
  setIsRunning: (running: boolean) => void
  setCurrentSessionId: (id: number | null) => void
  incrementCompleted: () => void
  checkAndResetDaily: () => void
}

// Helper function to get today's date string (YYYY-MM-DD)
const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      currentTaskId: null,
      sessionType: 'focus',
      isRunning: false,
      completedToday: 0,
      lastResetDate: getTodayString(),
      currentSessionId: null,
      setCurrentTask: (id) => set({ currentTaskId: id }),
      setSessionType: (type) => set({ sessionType: type }),
      setIsRunning: (running) => set({ isRunning: running }),
      setCurrentSessionId: (id) => set({ currentSessionId: id }),
      incrementCompleted: () => {
        const state = get()
        state.checkAndResetDaily()
        set({ completedToday: state.completedToday + 1 })
      },
      checkAndResetDaily: () => {
        const today = getTodayString()
        const state = get()
        if (state.lastResetDate !== today) {
          set({ completedToday: 0, lastResetDate: today })
        }
      },
    }),
    {
      name: 'focusflow-timer',
    }
  )
)
