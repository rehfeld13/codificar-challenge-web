export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed'

export interface Task {
  id: number
  title: string
  description: string | null
  project_id: number
  responsible: string
  priority: TaskPriority
  status: TaskStatus
  deadline: string | null
  created_at: string
  updated_at: string
}

export type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at'>

export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'critical']
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'completed']

export interface PaginatedTasks {
  current_page: number
  data: Task[]
  first_page_url: string
  last_page: number
  last_page_url: string
  per_page: number
  total: number
}

export interface TaskFilters {
  project_id?: number
  status?: TaskStatus
  priority?: TaskPriority
  responsible?: string
  deadline_from?: string
  deadline_to?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  per_page?: 10 | 25 | 50
}
