'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  inProgressProjects: number;
  overdueTasks: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalTasks: 0,
    inProgressProjects: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch projects (using per_page=10, minimum valid value)
      const projectsRes = await fetch(`${API_URL}/projects?per_page=10&sort_by=created_at&sort_order=desc`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!projectsRes.ok) throw new Error('API not available');
      const projectsData = await projectsRes.json();
      console.log('🔵 Projects Data:', projectsData);
      
      // Fetch in-progress projects
      const inProgressRes = await fetch(`${API_URL}/projects?status=in_progress&per_page=10&sort_by=created_at&sort_order=desc`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!inProgressRes.ok) throw new Error('API not available');
      const inProgressData = await inProgressRes.json();
      
      // Fetch tasks
      const tasksRes = await fetch(`${API_URL}/tasks?per_page=10&sort_by=created_at&sort_order=desc`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!tasksRes.ok) throw new Error('API not available');
      const tasksData = await tasksRes.json();
      
      // Fetch overdue tasks (tasks not completed with deadline before today)
      const today = new Date().toISOString().split('T')[0];
      const overdueRes = await fetch(`${API_URL}/tasks?deadline_to=${today}&per_page=10&sort_by=created_at&sort_order=desc`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!overdueRes.ok) throw new Error('API not available');
      const overdueData = await overdueRes.json();

      const newStats = {
        totalProjects: projectsData.total || 0,
        totalTasks: tasksData.total || 0,
        inProgressProjects: inProgressData.total || 0,
        overdueTasks: overdueData.total || 0,
      };
      
      console.log('📊 Dashboard Stats:', newStats);
      setStats(newStats);
    } catch (err) {
      // Silently fail - API might not be running yet or CORS issue
      console.log('⚠️ API não disponível ou erro de CORS. Certifique-se de que o backend está rodando em', API_URL);
      console.log('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Painel
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Projetos
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalProjects}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Tarefas
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalTasks}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Em Andamento
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.inProgressProjects}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <svg
                className="h-8 w-8 text-yellow-600 dark:text-yellow-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tarefas Atrasadas
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.overdueTasks}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
