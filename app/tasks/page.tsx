'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Task, PaginatedTasks } from '@/lib/task.types';
import PageHeader from '@/components/page-header';
import TaskFilters from '@/components/task-filters';
import TaskCard from '@/components/task-card';
import SortableHeader from '@/components/sortable-header';
import Pagination from '@/components/pagination';
import DeleteModal from '@/components/delete-modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // URL params
  const page = parseInt(searchParams.get('page') || '1');
  const perPageRaw = parseInt(searchParams.get('per_page') || '10');
  const perPage = [10, 25, 50, 100].includes(perPageRaw) ? perPageRaw : 10;
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const responsible = searchParams.get('responsible') || '';
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrderRaw = searchParams.get('sort_order') || 'desc';
  const sortOrder = sortOrderRaw.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      if (responsible) params.append('responsible', responsible);
      if (sortBy) params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);

      const response = await fetch(`${API_URL}/tasks?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar tarefas');
      }
      
      const data: PaginatedTasks = await response.json();
      setTasks(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, status, priority, responsible, sortBy, sortOrder]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    if (Object.keys(updates).some(k => k !== 'page')) {
      params.set('page', '1');
    }
    
    router.push(`/tasks?${params.toString()}`);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/tasks/${taskToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar tarefa');
      }

      await fetchTasks();
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      alert('Erro ao deletar tarefa. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleSort = (field: string, order: string) => {
    updateParams({ sort_by: field, sort_order: order, page: page.toString() });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="p-6">
      <PageHeader
        title="Tarefas"
        actionButton={{
          label: 'Nova Tarefa',
          href: '/tasks/new',
        }}
      />

      <TaskFilters
        status={status}
        priority={priority}
        responsible={responsible}
        perPage={perPage.toString()}
        onStatusChange={(value) => updateParams({ status: value })}
        onPriorityChange={(value) => updateParams({ priority: value })}
        onResponsibleChange={(value) => updateParams({ responsible: value })}
        onPerPageChange={(value) => updateParams({ per_page: value })}
      />

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Mostrando {tasks.length} de {total} tarefa(s)
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        {loading ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            Carregando...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            Nenhuma tarefa encontrada
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <SortableHeader
                  label="Título"
                  field="title"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Responsável
                </th>
                <SortableHeader
                  label="Prioridade"
                  field="priority"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Status"
                  field="status"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Prazo"
                  field="deadline"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        title="Confirmar Exclusão"
        itemName={taskToDelete?.title || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={deleting}
        warningMessage="Esta ação não pode ser desfeita."
      />
    </div>
  );
}
