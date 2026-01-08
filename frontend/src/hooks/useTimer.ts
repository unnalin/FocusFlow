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
      if (!prev.isRunning) return prev

      const newTimeLeft = Math.max(0, prev.timeLeft - delta)

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
  }, [onComplete, onTick])

  const tickRef = useRef(tick)

  // Update tick ref when tick changes
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  useEffect(() => {
    if (state.isRunning) {
      // Reset lastTick only when starting the interval
      lastTickRef.current = Date.now()
      intervalRef.current = window.setInterval(() => tickRef.current(), 100) // 100ms for smooth updates

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRunning])

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
    }))
  }, [])

  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
    }))
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
