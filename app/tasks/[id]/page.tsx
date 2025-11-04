'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Task } from '@/lib/task.types';
import type { Project } from '@/lib/project.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'A Fazer',
  in_progress: 'Em Progresso',
  in_review: 'Em Revisão',
  completed: 'Concluída',
};

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  in_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTask();
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
        if (response.status === 404) {
          setError('Tarefa não encontrada');
        } else {
          setError('Erro ao carregar tarefa');
        }
        return;
      }

      const data = await response.json();
      setTask(data);

      // Fetch project details
      if (data.project_id) {
        fetchProject(data.project_id);
      }
    } catch (err) {
      console.error('Erro ao buscar tarefa:', err);
      setError('Erro ao carregar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async (projectId: number) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (err) {
      console.error('Erro ao buscar projeto:', err);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/tasks/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar tarefa');
      }

      router.push('/tasks');
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      alert('Erro ao deletar tarefa. Tente novamente.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = (deadline: string | null) => {
    if (!deadline || task?.status === 'completed') return false;
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-300">{error || 'Tarefa não encontrada'}</p>
        </div>
        <Link
          href="/tasks"
          className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Voltar para tarefas
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/tasks"
            className="mb-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Voltar para tarefas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {task.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Editar
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Deletar
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Detalhes da Tarefa
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Projeto
            </label>
            {project ? (
              <Link
                href={`/projects/${project.id}`}
                className="mt-1 block text-blue-600 hover:underline dark:text-blue-400"
              >
                {project.name}
              </Link>
            ) : (
              <p className="mt-1 text-gray-900 dark:text-white">-</p>
            )}
          </div>

          {/* Responsible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Responsável
            </label>
            <p className="mt-1 text-gray-900 dark:text-white">{task.responsible}</p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioridade
            </label>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                PRIORITY_COLORS[task.priority]
              }`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                STATUS_COLORS[task.status]
              }`}
            >
              {STATUS_LABELS[task.status]}
            </span>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prazo
            </label>
            <p
              className={`mt-1 ${
                isOverdue(task.deadline)
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {formatDate(task.deadline)}
              {isOverdue(task.deadline) && ' ⚠️ Atrasada'}
            </p>
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Criação
            </label>
            <p className="mt-1 text-gray-900 dark:text-white">
              {formatDate(task.created_at)}
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <p className="mt-1 whitespace-pre-wrap text-gray-900 dark:text-white">
              {task.description || 'Sem descrição'}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Confirmar Exclusão
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Tem certeza que deseja deletar a tarefa <strong>{task.title}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {deleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
