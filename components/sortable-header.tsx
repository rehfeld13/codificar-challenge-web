interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortBy: string;
  currentSortOrder: string;
  onSort: (field: string, order: string) => void;
}

export default function SortableHeader({
  label,
  field,
  currentSortBy,
  currentSortOrder,
  onSort,
}: SortableHeaderProps) {
  const handleClick = () => {
    const newOrder = currentSortBy === field && currentSortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  return (
    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
      <button
        onClick={handleClick}
        className="flex items-center gap-1 hover:text-blue-600"
      >
        {label}
        {currentSortBy === field && (
          <span>{currentSortOrder === 'asc' ? '↑' : '↓'}</span>
        )}
      </button>
    </th>
  );
}
