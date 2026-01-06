import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface TaskInputProps {
  onSubmit: (title: string) => void
  placeholder?: string
}

export const TaskInput = ({ onSubmit, placeholder = 'What are you focusing on?' }: TaskInputProps) => {
  const [value, setValue] = useState('')

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
        placeholder={placeholder}
        className="flex-1"
        autoFocus
      />
      <Button onClick={handleSubmit} disabled={!value.trim()}>
        Add
      </Button>
    </div>
  )
}
