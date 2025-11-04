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
    errors.name = ['O nome é obrigatório']
  } else if (input.name.length > 255) {
    errors.name = ['O nome deve ter no máximo 255 caracteres']
  }

  if (!input.start_date || !isISODate(input.start_date)) {
    errors.start_date = ['A data de início é obrigatória e deve estar no formato YYYY-MM-DD']
  }

  if (!input.expected_end_date || !isISODate(input.expected_end_date)) {
    errors.expected_end_date = ['A data de término é obrigatória e deve estar no formato YYYY-MM-DD']
  }

  if (input.start_date && input.expected_end_date && isISODate(input.start_date) && isISODate(input.expected_end_date)) {
    const a = new Date(input.start_date)
    const b = new Date(input.expected_end_date)
    if (b.getTime() < a.getTime()) {
      errors.expected_end_date = errors.expected_end_date || []
      errors.expected_end_date.push('A data de término deve ser maior ou igual à data de início')
    }
  }

  if (!input.status || !PROJECT_STATUSES.includes(input.status)) {
    errors.status = ['O status é obrigatório e deve ser um valor válido']
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateTask(input: Partial<TaskInput>): ValidationResult {
  const errors: ValidationErrors = {}
  
  if (!input.title || input.title.trim() === '') {
    errors.title = ['O título é obrigatório']
  } else if (input.title.length > 255) {
    errors.title = ['O título deve ter no máximo 255 caracteres']
  }

  if (!input.project_id || typeof input.project_id !== 'number' || input.project_id <= 0) {
    errors.project_id = ['O ID do projeto é obrigatório e deve ser um número válido']
  }

  if (!input.responsible || input.responsible.trim() === '') {
    errors.responsible = ['O responsável é obrigatório']
  } else if (input.responsible.length > 255) {
    errors.responsible = ['O responsável deve ter no máximo 255 caracteres']
  }

  if (!input.priority || !TASK_PRIORITIES.includes(input.priority)) {
    errors.priority = ['A prioridade é obrigatória e deve ser um valor válido']
  }

  if (!input.status || !TASK_STATUSES.includes(input.status)) {
    errors.status = ['O status é obrigatório e deve ser um valor válido']
  }

  if (input.deadline && !isISODate(input.deadline)) {
    errors.deadline = ['O prazo deve estar no formato YYYY-MM-DD']
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
