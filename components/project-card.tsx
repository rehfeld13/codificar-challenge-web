import Link from 'next/link';
import type { Project } from '@/lib/project.types';

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
}

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planejamento',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  planning: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <tr
      key={project.id}
      className="hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {project.name}
        </div>
        {project.description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {project.description.substring(0, 60)}
            {project.description.length > 60 ? '...' : ''}
          </div>
        )}
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
            STATUS_COLORS[project.status]
          }`}
        >
          {STATUS_LABELS[project.status]}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
        {formatDate(project.start_date)}
      </td>
      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
        {formatDate(project.expected_end_date)}
      </td>
      <td className="px-4 py-4 text-sm">
        <div className="flex gap-2">
          <Link
            href={`/projects/${project.id}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Ver
          </Link>
          <Link
            href={`/projects/${project.id}/edit`}
            className="text-green-600 hover:underline dark:text-green-400"
          >
            Editar
          </Link>
          <button
            onClick={() => onDelete(project)}
            className="text-red-600 hover:underline dark:text-red-400"
          >
            Deletar
          </button>
        </div>
      </td>
    </tr>
  );
}
