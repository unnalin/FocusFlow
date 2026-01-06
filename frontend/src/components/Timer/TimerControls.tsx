import { Button } from '@/components/ui/Button'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onStop: () => void
}

export const TimerControls = ({ isRunning, onStart, onPause, onStop }: TimerControlsProps) => {
  return (
    <div className="flex gap-4 justify-center">
      {!isRunning ? (
        <Button onClick={onStart} size="lg" className="w-32">
          ▶ Start
        </Button>
      ) : (
        <Button onClick={onPause} variant="secondary" size="lg" className="w-32">
          ⏸ Pause
        </Button>
      )}
      <Button onClick={onStop} variant="secondary" size="lg" className="w-32">
        ⏹ Stop
      </Button>
    </div>
  )
}
