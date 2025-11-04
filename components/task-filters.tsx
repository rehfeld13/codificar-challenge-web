interface TaskFiltersProps {
  status: string;
  priority: string;
  responsible: string;
  perPage: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onResponsibleChange: (value: string) => void;
  onPerPageChange: (value: string) => void;
}

export default function TaskFilters({
  status,
  priority,
  responsible,
  perPage,
  onStatusChange,
  onPriorityChange,
  onResponsibleChange,
  onPerPageChange,
}: TaskFiltersProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Todos</option>
          <option value="todo">A Fazer</option>
          <option value="in_progress">Em Progresso</option>
          <option value="in_review">Em Revisão</option>
          <option value="completed">Concluída</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Prioridade
        </label>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Todas</option>
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>
      </div>

      {/* Responsible Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Responsável
        </label>
        <input
          type="text"
          value={responsible}
          onChange={(e) => onResponsibleChange(e.target.value)}
          placeholder="Filtrar por responsável"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Per Page */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Por Página
        </label>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}
