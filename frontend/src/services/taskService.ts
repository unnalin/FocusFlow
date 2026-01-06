import api from './api'
import { Task, TaskCreate, TaskUpdate } from '@/types/task'

export const taskService = {
  async create(task: TaskCreate): Promise<Task> {
    const response = await api.post('/tasks', task)
    return response.data
  },

  async list(includeCompleted: boolean = true): Promise<Task[]> {
    const response = await api.get('/tasks', {
      params: { include_completed: includeCompleted }
    })
    return response.data
  },

  async get(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  async update(id: number, task: TaskUpdate): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, task)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}
