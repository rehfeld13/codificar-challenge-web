'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateTask, type ValidationErrors } from '@/lib/validations';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/task.types';
import type { Task } from '@/lib/task.types';
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

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    responsible: '',
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
    deadline: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchTask();
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks/${params.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Tarefa não encontrada');
      }

      const task: Task = await response.json();

      // Format deadline from ISO to YYYY-MM-DD for input[type="date"]
      const deadline = task.deadline ? task.deadline.split('T')[0] : '';

      setFormData({
        title: task.title,
        description: task.description || '',
        project_id: task.project_id.toString(),
        responsible: task.responsible,
        priority: task.priority,
        status: task.status,
        deadline: deadline,
      });
    } catch (err) {
      console.error('Erro ao buscar tarefa:', err);
      alert('Erro ao carregar tarefa');
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await fetch(
        `${API_URL}/projects?per_page=50&sort_by=name&sort_order=asc`,
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

      const response = await fetch(`${API_URL}/tasks/${params.id}`, {
        method: 'PUT',
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
        throw new Error(data.message || 'Erro ao atualizar tarefa');
      }

      // Success - redirect to task details
      router.push(`/tasks/${params.id}`);
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      alert('Erro ao atualizar tarefa. Tente novamente.');
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href={`/tasks/${params.id}`}
            className="mb-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Voltar para detalhes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Tarefa
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
        >
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.title
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
              placeholder="Digite o título da tarefa"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
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
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
              placeholder="Digite a descrição da tarefa"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description[0]}</p>
            )}
          </div>

          {/* Project */}
          <div className="mb-4">
            <label
              htmlFor="project_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Projeto <span className="text-red-500">*</span>
            </label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              disabled={loadingProjects}
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.project_id
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            >
              <option value="">Selecione um projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <p className="mt-1 text-sm text-red-500">{errors.project_id[0]}</p>
            )}
          </div>

          {/* Responsible */}
          <div className="mb-4">
            <label
              htmlFor="responsible"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Responsável <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="responsible"
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.responsible
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
              placeholder="Digite o nome do responsável"
            />
            {errors.responsible && (
              <p className="mt-1 text-sm text-red-500">{errors.responsible[0]}</p>
            )}
          </div>

          {/* Priority and Status */}
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Prioridade <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                  errors.priority
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                }`}
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-500">{errors.priority[0]}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                  errors.status
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                }`}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status[0]}</p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="mb-6">
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Prazo (opcional)
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.deadline
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-500">{errors.deadline[0]}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Link
              href={`/tasks/${params.id}`}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
