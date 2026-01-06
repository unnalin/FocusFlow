interface CircularTimerProps {
  timeLeft: number // milliseconds
  totalTime: number // milliseconds
  size?: number
}

export const CircularTimer = ({ timeLeft, totalTime, size = 300 }: CircularTimerProps) => {
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius
  const progress = timeLeft / totalTime
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-neutral-200 dark:text-neutral-700"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgb(var(--color-accent-600))"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-300"
      />
    </svg>
  )
}
