'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateTask, type ValidationErrors } from '@/lib/validations';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/task.types';
import type { Project } from '@/lib/project.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'A Fazer',
  in_progress: 'Em Progresso',
  in_review: 'Em Revisão',
  completed: 'Concluída',
};

export default function NewTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const projectIdFromUrl = searchParams.get('project_id');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: projectIdFromUrl || '',
    responsible: '',
    priority: 'medium' as const,
    status: 'todo' as const,
    deadline: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await fetch(
        `${API_URL}/projects?per_page=50&sort_by=name&sort_order=asc&status=in_progress`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      project_id: parseInt(formData.project_id) || 0,
      deadline: formData.deadline || null,
    };

    // Client-side validation
    const validation = validateTask(dataToValidate);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);

      // Prepare data for API
      const apiData = {
        title: formData.title,
        description: formData.description || null,
        project_id: parseInt(formData.project_id),
        responsible: formData.responsible,
        priority: formData.priority,
        status: formData.status,
        deadline: formData.deadline || null,
      };

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from server (422)
        if (response.status === 422 && data.errors) {
          // Convert Laravel validation errors to our format
          const serverErrors: ValidationErrors = {};
          Object.keys(data.errors).forEach((key) => {
            serverErrors[key] = data.errors[key];
          });
          setErrors(serverErrors);
          return;
        }
        throw new Error(data.message || 'Erro ao criar tarefa');
      }

      // Success - redirect to tasks list or project details
      if (formData.project_id) {
        router.push(`/projects/${formData.project_id}`);
      } else {
        router.push('/tasks');
      }
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      alert('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Nova Tarefa
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Preencha os dados da tarefa
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Título <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.title
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              placeholder="Título da tarefa"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full rounded-lg border ${
                errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              placeholder="Descrição da tarefa (opcional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description[0]}
              </p>
            )}
          </div>

          {/* Project */}
          <div>
            <label
              htmlFor="project_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Projeto <span className="text-red-600">*</span>
            </label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              disabled={loadingProjects}
              className={`mt-1 block w-full rounded-lg border ${
                errors.project_id
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
            >
              <option value="">Selecione um projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.project_id[0]}
              </p>
            )}
          </div>

          {/* Responsible */}
          <div>
            <label
              htmlFor="responsible"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Responsável <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="responsible"
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.responsible
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              placeholder="Nome do responsável"
            />
            {errors.responsible && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.responsible[0]}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Prioridade <span className="text-red-600">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.priority
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.priority[0]}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.status
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.status[0]}
                </p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Prazo
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.deadline
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.deadline[0]}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Link
              href="/tasks"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
