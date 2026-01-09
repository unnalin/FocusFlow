import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/uiStore'
import { translations } from '@/utils/translations'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onStop: () => void
}

export const TimerControls = ({ isRunning, onStart, onPause, onStop }: TimerControlsProps) => {
  const { language } = useUIStore()
  const t = translations[language]

  return (
    <div className="flex gap-4 justify-center">
      {!isRunning ? (
        <Button onClick={onStart} size="lg" className="min-w-[120px]">
          ▶ {t.start}
        </Button>
      ) : (
        <Button onClick={onPause} variant="secondary" size="lg" className="min-w-[120px]">
          ⏸ {t.pause}
        </Button>
      )}
      <Button onClick={onStop} variant="secondary" size="lg" className="min-w-[120px]">
        ⏹ {t.stop}
      </Button>
    </div>
  )
}
