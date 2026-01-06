export interface PomodoroSession {
  id: number
  task_id?: number
  session_type: 'focus' | 'break'
  duration: number
  state: 'pending' | 'active' | 'completed' | 'cancelled'
  started_at?: string
  completed_at?: string
  paused_duration_ms: number
  created_at: string
  updated_at?: string
}

export interface PomodoroSessionCreate {
  task_id?: number
  session_type: 'focus' | 'break'
  duration: number
}

export interface PomodoroSessionUpdate {
  state?: 'pending' | 'active' | 'completed' | 'cancelled'
  started_at?: string
  completed_at?: string
  paused_duration_ms?: number
}

export interface PomodoroStats {
  completed_today: number
  total_focus_time_minutes: number
}
