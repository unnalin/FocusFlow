import { useEffect, useRef, useState, useCallback } from 'react'

interface TimerState {
  timeLeft: number // milliseconds
  isRunning: boolean
  startTime: number | null
  pausedTime: number
}

interface UseTimerOptions {
  duration: number // minutes
  onComplete?: () => void
  onTick?: (timeLeft: number) => void
}

const STORAGE_KEY = 'focusflow-timer-state'

export const useTimer = ({ duration, onComplete, onTick }: UseTimerOptions) => {
  const [state, setState] = useState<TimerState>(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Ignore parse errors
      }
    }
    return {
      timeLeft: duration * 60 * 1000,
      isRunning: false,
      startTime: null,
      pausedTime: 0,
    }
  })

  const intervalRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(Date.now())

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const tick = useCallback(() => {
    const now = Date.now()
    const delta = now - lastTickRef.current
    lastTickRef.current = now

    setState((prev) => {
      if (!prev.isRunning || !prev.startTime) return prev

      const elapsed = now - prev.startTime - prev.pausedTime
      const newTimeLeft = Math.max(0, duration * 60 * 1000 - elapsed)

      if (newTimeLeft === 0) {
        onComplete?.()
        return {
          ...prev,
          timeLeft: 0,
          isRunning: false,
        }
      }

      onTick?.(newTimeLeft)

      return {
        ...prev,
        timeLeft: newTimeLeft,
      }
    })
  }, [duration, onComplete, onTick])

  useEffect(() => {
    if (state.isRunning) {
      lastTickRef.current = Date.now()
      intervalRef.current = window.setInterval(tick, 100) // 100ms for smooth updates
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.isRunning, tick])

  const start = useCallback(() => {
    setState((prev) => {
      const now = Date.now()
      return {
        ...prev,
        isRunning: true,
        startTime: prev.startTime || now,
      }
    })
  }, [])

  const pause = useCallback(() => {
    setState((prev) => {
      if (!prev.isRunning || !prev.startTime) return prev

      const now = Date.now()
      const additionalPausedTime = now - lastTickRef.current

      return {
        ...prev,
        isRunning: false,
        pausedTime: prev.pausedTime + additionalPausedTime,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      timeLeft: duration * 60 * 1000,
      isRunning: false,
      startTime: null,
      pausedTime: 0,
    })
    localStorage.removeItem(STORAGE_KEY)
  }, [duration])

  const stop = useCallback(() => {
    reset()
  }, [reset])

  return {
    timeLeft: state.timeLeft,
    isRunning: state.isRunning,
    start,
    pause,
    stop,
    reset,
  }
}
