export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled'

export interface Project {
  id: number
  name: string
  description: string | null
  start_date: string
  expected_end_date: string
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at'>

export const PROJECT_STATUSES: ProjectStatus[] = ['planning', 'in_progress', 'completed', 'cancelled']

export interface PaginatedProjects {
  current_page: number
  data: Project[]
  first_page_url: string
  last_page_url: string
  per_page: number
  total: number
}

export interface ProjectFilters {
  status?: ProjectStatus
  start_date?: string
  end_date?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  per_page?: 10 | 25 | 50
}
