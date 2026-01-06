interface TimerDisplayProps {
  timeLeft: number // milliseconds
}

export const TimerDisplay = ({ timeLeft }: TimerDisplayProps) => {
  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  return (
    <div className="text-7xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}
