'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectInput, PROJECT_STATUSES } from '@/lib/project.types';
import { validateProject } from '@/lib/validations';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ProjectInput>({
    name: '',
    description: null,
    start_date: '',
    expected_end_date: '',
    status: 'planning',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateProject(formData);
    if (!validation.valid) {
      // Convert ValidationErrors (string[]) to Record<string, string>
      const clientErrors: Record<string, string> = {};
      Object.entries(validation.errors).forEach(([field, messages]) => {
        clientErrors[field] = messages[0];
      });
      setErrors(clientErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 422) {
        // Validation errors from server
        const data = await response.json();
        const serverErrors: Record<string, string> = {};
        
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              serverErrors[field] = messages[0];
            }
          });
        }
        
        setErrors(serverErrors);
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao criar projeto');
      }

      // Success - redirect to projects list
      router.push('/projects');
    } catch (err) {
      setErrors({
        _form: err instanceof Error ? err.message : 'Erro ao criar projeto',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Novo Projeto
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Preencha os dados do projeto
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors._form && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errors._form}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nome <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              placeholder="Nome do projeto"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
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
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full rounded-lg border ${
                errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              placeholder="Descrição do projeto (opcional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Start Date */}
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Data de Início <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.start_date
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.start_date}
                </p>
              )}
            </div>

            {/* Expected End Date */}
            <div>
              <label
                htmlFor="expected_end_date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Data Prevista de Término <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="expected_end_date"
                name="expected_end_date"
                value={formData.expected_end_date}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.expected_end_date
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
              />
              {errors.expected_end_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.expected_end_date}
                </p>
              )}
            </div>
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
              <option value="planning">Planejamento</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.status}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Link
              href="/projects"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
