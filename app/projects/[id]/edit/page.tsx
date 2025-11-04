'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateProject, type ValidationErrors } from '@/lib/validations';
import type { Project } from '@/lib/project.types';
import { PROJECT_STATUSES } from '@/lib/project.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planejamento',
  in_progress: 'Em Progresso',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    expected_end_date: '',
    status: 'planning' as Project['status'],
  });

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects/${params.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Projeto não encontrado');
      }

      const project: Project = await response.json();
      
      // Format dates from ISO to YYYY-MM-DD for input[type="date"]
      const startDate = project.start_date.split('T')[0];
      const endDate = project.expected_end_date.split('T')[0];

      setFormData({
        name: project.name,
        description: project.description || '',
        start_date: startDate,
        expected_end_date: endDate,
        status: project.status,
      });
    } catch (err) {
      console.error('Erro ao buscar projeto:', err);
      alert('Erro ao carregar projeto');
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const validation = validateProject(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
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
        throw new Error(data.message || 'Erro ao atualizar projeto');
      }

      // Success - redirect to project details
      router.push(`/projects/${params.id}`);
    } catch (err) {
      console.error('Erro ao atualizar projeto:', err);
      alert('Erro ao atualizar projeto. Tente novamente.');
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
            href={`/projects/${params.id}`}
            className="mb-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Voltar para detalhes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Projeto
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
        >
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nome do Projeto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
              placeholder="Digite o nome do projeto"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
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
              placeholder="Digite a descrição do projeto"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description[0]}</p>
            )}
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data de Início <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.start_date
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-500">{errors.start_date[0]}</p>
            )}
          </div>

          {/* Expected End Date */}
          <div className="mb-4">
            <label
              htmlFor="expected_end_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data de Término Prevista <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expected_end_date"
              name="expected_end_date"
              value={formData.expected_end_date}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white ${
                errors.expected_end_date
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }`}
            />
            {errors.expected_end_date && (
              <p className="mt-1 text-sm text-red-500">
                {errors.expected_end_date[0]}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="mb-6">
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
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status[0]}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Link
              href={`/projects/${params.id}`}
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
