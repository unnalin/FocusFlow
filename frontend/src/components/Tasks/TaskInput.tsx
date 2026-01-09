import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/uiStore'
import { translations } from '@/utils/translations'

interface TaskInputProps {
  onSubmit: (title: string) => void
  placeholder?: string
}

export const TaskInput = ({ onSubmit, placeholder }: TaskInputProps) => {
  const [value, setValue] = useState('')
  const { language } = useUIStore()
  const t = translations[language]

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="flex gap-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t.focusingOn}
        className="flex-1"
        autoFocus
      />
      <Button onClick={handleSubmit} disabled={!value.trim()} className="whitespace-nowrap">
        {t.addTask}
      </Button>
    </div>
  )
}
