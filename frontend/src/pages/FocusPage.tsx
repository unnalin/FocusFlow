import { useState, useEffect } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { useTimerStore } from '@/store/timerStore'
import { useTasks } from '@/hooks/useTasks'
import { CircularTimer } from '@/components/Timer/CircularTimer'
import { TimerDisplay } from '@/components/Timer/TimerDisplay'
import { TimerControls } from '@/components/Timer/TimerControls'
import { TaskInput } from '@/components/Tasks/TaskInput'
import { audioManager, preloadAudioFiles } from '@/utils/audioUtils'
import { pomodoroService } from '@/services/pomodoroService'

export default function FocusPage() {
  const {
    currentTaskId,
    sessionType,
    completedToday,
    currentSessionId,
    setCurrentTask,
    setSessionType,
    setIsRunning,
    setCurrentSessionId,
    incrementCompleted,
  } = useTimerStore()

  const { tasks, createTask } = useTasks(false) // Only show incomplete tasks
  const [selectedTask, setSelectedTask] = useState<number | null>(currentTaskId)

  const duration = sessionType === 'focus' ? 25 : 5

  const handleComplete = async () => {
    // Play completion sound
    audioManager.play(sessionType === 'focus' ? 'focus-complete' : 'break-complete')

    // Update session state
    if (currentSessionId) {
      await pomodoroService.updateSession(currentSessionId, {
        state: 'completed',
        completed_at: new Date().toISOString(),
      })
      setCurrentSessionId(null)
    }

    // Increment completed count for focus sessions
    if (sessionType === 'focus') {
      incrementCompleted()
    }

    // Switch session type
    setSessionType(sessionType === 'focus' ? 'break' : 'focus')
    setIsRunning(false)
  }

  const { timeLeft, isRunning, start, pause, stop } = useTimer({
    duration,
    onComplete: handleComplete,
  })

  const totalTime = duration * 60 * 1000

  useEffect(() => {
    // Preload audio files on mount
    preloadAudioFiles()
  }, [])

  useEffect(() => {
    setIsRunning(isRunning)
  }, [isRunning, setIsRunning])

  const handleStart = async () => {
    if (!currentSessionId) {
      // Create new session
      const session = await pomodoroService.createSession({
        task_id: selectedTask || undefined,
        session_type: sessionType,
        duration,
      })
      setCurrentSessionId(session.id)

      // Update session to active
      await pomodoroService.updateSession(session.id, {
        state: 'active',
        started_at: new Date().toISOString(),
      })
    }

    start()
  }

  const handlePause = () => {
    pause()
  }

  const handleStop = async () => {
    if (currentSessionId) {
      await pomodoroService.updateSession(currentSessionId, {
        state: 'cancelled',
      })
      setCurrentSessionId(null)
    }
    stop()
  }

  const handleTaskCreate = (title: string) => {
    createTask({ title })
  }

  const currentTask = tasks.find((t) => t.id === selectedTask)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="max-w-2xl w-full space-y-8">
        {/* Session type indicator */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            {sessionType === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Completed today: {completedToday} sessions
          </p>
        </div>

        {/* Current task display */}
        {currentTask && (
          <div className="card text-center animate-slide-up">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              Working on:
            </p>
            <h2 className="text-2xl font-bold">{currentTask.title}</h2>
          </div>
        )}

        {/* Timer */}
        <div className="relative flex items-center justify-center">
          <CircularTimer timeLeft={timeLeft} totalTime={totalTime} size={320} />
          <div className="absolute inset-0 flex items-center justify-center">
            <TimerDisplay timeLeft={timeLeft} />
          </div>
        </div>

        {/* Controls */}
        <TimerControls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
        />

        {/* Task selection/creation */}
        {!isRunning && sessionType === 'focus' && (
          <div className="card space-y-4 animate-slide-up">
            <h3 className="font-semibold text-lg">Select or Create a Task</h3>
            <TaskInput onSubmit={handleTaskCreate} />

            {tasks.length > 0 && (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task.id)
                      setCurrentTask(task.id)
                    }}
                    style={
                      selectedTask === task.id
                        ? {
                            backgroundColor: 'rgb(var(--color-accent-100) / 0.5)',
                            boxShadow: `0 0 0 2px rgb(var(--color-accent-500))`,
                          }
                        : undefined
                    }
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedTask === task.id
                        ? ''
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {task.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
