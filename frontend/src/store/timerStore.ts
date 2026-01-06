import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  currentTaskId: number | null
  sessionType: 'focus' | 'break'
  isRunning: boolean
  completedToday: number
  currentSessionId: number | null
  setCurrentTask: (id: number | null) => void
  setSessionType: (type: 'focus' | 'break') => void
  setIsRunning: (running: boolean) => void
  setCurrentSessionId: (id: number | null) => void
  incrementCompleted: () => void
  resetDaily: () => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      currentTaskId: null,
      sessionType: 'focus',
      isRunning: false,
      completedToday: 0,
      currentSessionId: null,
      setCurrentTask: (id) => set({ currentTaskId: id }),
      setSessionType: (type) => set({ sessionType: type }),
      setIsRunning: (running) => set({ isRunning: running }),
      setCurrentSessionId: (id) => set({ currentSessionId: id }),
      incrementCompleted: () => set((state) => ({ completedToday: state.completedToday + 1 })),
      resetDaily: () => set({ completedToday: 0 }),
    }),
    {
      name: 'focusflow-timer',
    }
  )
)
