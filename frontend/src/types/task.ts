export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  order: number
  created_at: string
  updated_at?: string
}

export interface TaskCreate {
  title: string
  description?: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  completed?: boolean
  order?: number
}
