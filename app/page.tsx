export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Painel de Controle
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bem-vindo ao Project Track
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Projetos
            </h3>
            <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            0
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Nenhum projeto ainda
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Tarefas
            </h3>
            <div className="p-2 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            0
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Nenhuma tarefa criada
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Em Andamento
            </h3>
            <div className="p-2 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            0
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Tudo em dia
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tarefas Atrasadas
            </h3>
            <div className="p-2 bg-red-50 rounded-lg dark:bg-red-900/20">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-red-600 dark:text-red-500">
            0
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Sem atrasos
          </p>
        </div>
      </div>
    </div>
  )
}
