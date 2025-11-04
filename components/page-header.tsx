import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    href: string;
  };
}

export default function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {actionButton && (
        <Link
          href={actionButton.href}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {actionButton.label}
        </Link>
      )}
    </div>
  );
}
