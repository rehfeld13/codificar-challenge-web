import { ProjectInput, PROJECT_STATUSES } from './project.types'
import { TaskInput, TASK_PRIORITIES, TASK_STATUSES } from './task.types'

export interface ValidationErrors {
  [field: string]: string[]
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationErrors
}

function isISODate(value: string): boolean {
  const iso = /^\d{4}-\d{2}-\d{2}$/
  if (!iso.test(value)) return false
  const d = new Date(value)
  return !Number.isNaN(d.getTime())
}

export function validateProject(input: Partial<ProjectInput>): ValidationResult {
  const errors: ValidationErrors = {}
  
  if (!input.name || input.name.trim() === '') {
    errors.name = ['Name is required']
  } else if (input.name.length > 255) {
    errors.name = ['Name must be at most 255 characters']
  }

  if (!input.start_date || !isISODate(input.start_date)) {
    errors.start_date = ['Start date is required and must be YYYY-MM-DD']
  }

  if (!input.expected_end_date || !isISODate(input.expected_end_date)) {
    errors.expected_end_date = ['Expected end date is required and must be YYYY-MM-DD']
  }

  if (input.start_date && input.expected_end_date && isISODate(input.start_date) && isISODate(input.expected_end_date)) {
    const a = new Date(input.start_date)
    const b = new Date(input.expected_end_date)
    if (b.getTime() < a.getTime()) {
      errors.expected_end_date = errors.expected_end_date || []
      errors.expected_end_date.push('Expected end date must be greater than or equal to start date')
    }
  }

  if (!input.status || !PROJECT_STATUSES.includes(input.status)) {
    errors.status = ['Status is required and must be a valid value']
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateTask(input: Partial<TaskInput>): ValidationResult {
  const errors: ValidationErrors = {}
  
  if (!input.title || input.title.trim() === '') {
    errors.title = ['Title is required']
  } else if (input.title.length > 255) {
    errors.title = ['Title must be at most 255 characters']
  }

  if (!input.project_id || typeof input.project_id !== 'number' || input.project_id <= 0) {
    errors.project_id = ['Project id is required and must be a valid number']
  }

  if (!input.responsible || input.responsible.trim() === '') {
    errors.responsible = ['Responsible is required']
  } else if (input.responsible.length > 255) {
    errors.responsible = ['Responsible must be at most 255 characters']
  }

  if (!input.priority || !TASK_PRIORITIES.includes(input.priority)) {
    errors.priority = ['Priority is required and must be a valid value']
  }

  if (!input.status || !TASK_STATUSES.includes(input.status)) {
    errors.status = ['Status is required and must be a valid value']
  }

  if (input.deadline && !isISODate(input.deadline)) {
    errors.deadline = ['Deadline must be in YYYY-MM-DD format']
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
