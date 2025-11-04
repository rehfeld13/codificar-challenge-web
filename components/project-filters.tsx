interface ProjectFiltersProps {
  status: string;
  perPage: string;
  onStatusChange: (value: string) => void;
  onPerPageChange: (value: string) => void;
}

export default function ProjectFilters({
  status,
  perPage,
  onStatusChange,
  onPerPageChange,
}: ProjectFiltersProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2">
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
          <option value="planning">Planejamento</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>
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
