import Link from 'next/link';
import type { Task } from '@/lib/task.types';

interface TaskCardProps {
  task: Task;
  onDelete: (task: Task) => void;
}

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

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (deadline: string, status: string) => {
    if (status === 'completed') return false;
    return new Date(deadline) < new Date();
  };

  return (
    <tr
      key={task.id}
      className="hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {task.title}
        </div>
        {task.description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {task.description.substring(0, 60)}
            {task.description.length > 60 ? '...' : ''}
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
        {task.responsible}
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
            PRIORITY_COLORS[task.priority]
          }`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
            STATUS_COLORS[task.status]
          }`}
        >
          {STATUS_LABELS[task.status]}
        </span>
      </td>
      <td className="px-4 py-4 text-sm">
        {task.deadline ? (
          <span
            className={
              isOverdue(task.deadline, task.status)
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-900 dark:text-white'
            }
          >
            {formatDate(task.deadline)}
            {isOverdue(task.deadline, task.status) && ' ⚠️'}
          </span>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td className="px-4 py-4 text-sm">
        <div className="flex gap-2">
          <Link
            href={`/tasks/${task.id}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Ver
          </Link>
          <Link
            href={`/tasks/${task.id}/edit`}
            className="text-green-600 hover:underline dark:text-green-400"
          >
            Editar
          </Link>
          <button
            onClick={() => onDelete(task)}
            className="text-red-600 hover:underline dark:text-red-400"
          >
            Deletar
          </button>
        </div>
      </td>
    </tr>
  );
}
