'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Project, PaginatedProjects } from '@/lib/project.types';
import PageHeader from '@/components/page-header';
import ProjectFilters from '@/components/project-filters';
import ProjectCard from '@/components/project-card';
import SortableHeader from '@/components/sortable-header';
import Pagination from '@/components/pagination';
import DeleteModal from '@/components/delete-modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // URL params
  const page = parseInt(searchParams.get('page') || '1');
  const perPageRaw = parseInt(searchParams.get('per_page') || '10');
  const perPage = [10, 25, 50].includes(perPageRaw) ? perPageRaw : 10;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrderRaw = searchParams.get('sort_order') || 'desc';
  const sortOrder = sortOrderRaw.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (sortBy) params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);

      const response = await fetch(`${API_URL}/projects?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar projetos');
      }
      
      const data: PaginatedProjects = await response.json();
      setProjects(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search, status, sortBy, sortOrder]);

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
    
    router.push(`/projects?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateParams({ search: value });
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/projects/${projectToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar projeto');
      }

      await fetchProjects();
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar projeto:', err);
      alert('Erro ao deletar projeto. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
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
        title="Projetos"
        actionButton={{
          label: 'Novo Projeto',
          href: '/projects/new',
        }}
      />

      {/* Search */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Buscar
        </label>
        <input
          type="text"
          placeholder="Nome ou descrição..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <ProjectFilters
        status={status}
        perPage={perPage.toString()}
        onStatusChange={(value) => updateParams({ status: value })}
        onPerPageChange={(value) => updateParams({ per_page: value })}
      />

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Mostrando {projects.length} de {total} projeto(s)
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
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            Nenhum projeto encontrado
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <SortableHeader
                  label="Nome"
                  field="name"
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
                  label="Início"
                  field="start_date"
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Término"
                  field="expected_end_date"
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
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
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
        itemName={projectToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={deleting}
        warningMessage="Esta ação não pode ser desfeita. Todas as tarefas vinculadas também serão deletadas."
      />
    </div>
  );
}
