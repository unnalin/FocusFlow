import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/taskService'
import { TaskCreate, TaskUpdate } from '@/types/task'

export const useTasks = (includeCompleted: boolean = true) => {
  const queryClient = useQueryClient()

  const tasksQuery = useQuery({
    queryKey: ['tasks', includeCompleted],
    queryFn: () => taskService.list(includeCompleted),
  })

  const createMutation = useMutation({
    mutationFn: (task: TaskCreate) => taskService.create(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, task }: { id: number; task: TaskUpdate }) =>
      taskService.update(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,
  }
}
