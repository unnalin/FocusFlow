import api from './api'
import {
  PomodoroSession,
  PomodoroSessionCreate,
  PomodoroSessionUpdate,
  PomodoroStats,
} from '@/types/pomodoro'

export const pomodoroService = {
  async createSession(session: PomodoroSessionCreate): Promise<PomodoroSession> {
    const response = await api.post('/pomodoro/sessions', session)
    return response.data
  },

  async getSession(id: number): Promise<PomodoroSession> {
    const response = await api.get(`/pomodoro/sessions/${id}`)
    return response.data
  },

  async getActiveSession(): Promise<PomodoroSession | null> {
    const response = await api.get('/pomodoro/active')
    return response.data
  },

  async updateSession(id: number, update: PomodoroSessionUpdate): Promise<PomodoroSession> {
    const response = await api.put(`/pomodoro/sessions/${id}`, update)
    return response.data
  },

  async getStatsToday(): Promise<PomodoroStats> {
    const response = await api.get('/pomodoro/stats/today')
    return response.data
  },
}
