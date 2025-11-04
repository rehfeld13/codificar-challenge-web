# Project Track - Frontend

Sistema de gerenciamento de projetos e tarefas desenvolvido com Next.js, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 16.0.1** - App Router
- **TypeScript 5.5.0** - Tipagem estática
- **Tailwind CSS v4** - Estilização com suporte a dark mode
- **React 19** - Interface de usuário
- **Arquitetura Componentizada** - Componentes reutilizáveis

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend Laravel rodando em `http://localhost:8000`

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd codificar-challenge-web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` conforme necessário:
```env
NEXT_PUBLIC_API_URL=/api
```

> **Nota**: A URL da API é configurada para usar o proxy do Next.js (`/api`). Para apontar diretamente para o backend, use `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

## 🏃 Executando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

### Verificar Erros

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
codificar-challenge-web/
├── app/                          # App Router do Next.js
│   ├── page.tsx                 # Dashboard
│   ├── layout.tsx               # Layout principal
│   ├── globals.css              # Estilos globais
│   ├── projects/                # Rotas de projetos
│   │   ├── page.tsx            # Lista de projetos
│   │   ├── new/
│   │   │   └── page.tsx        # Criar projeto
│   │   └── [id]/
│   │       ├── page.tsx        # Detalhes do projeto
│   │       └── edit/
│   │           └── page.tsx    # Editar projeto
│   └── tasks/                   # Rotas de tarefas
│       ├── page.tsx            # Lista de tarefas
│       ├── new/
│       │   └── page.tsx        # Criar tarefa
│       └── [id]/
│           ├── page.tsx        # Detalhes da tarefa
│           └── edit/
│               └── page.tsx    # Editar tarefa
├── components/                  # Componentes reutilizáveis
│   ├── header.tsx              # Cabeçalho com navegação
│   ├── theme-toggle.tsx        # Toggle de tema claro/escuro
│   ├── theme-script.tsx        # Script para prevenir flash do tema
│   ├── delete-modal.tsx        # Modal de confirmação de exclusão
│   ├── pagination.tsx          # Controles de paginação
│   ├── page-header.tsx         # Cabeçalho de página com ações
│   ├── form-field.tsx          # Campo de formulário genérico
│   ├── sortable-header.tsx     # Cabeçalho de tabela ordenável
│   ├── project-card.tsx        # Card/linha de projeto
│   ├── project-filters.tsx     # Filtros de projetos
│   ├── task-card.tsx           # Card/linha de tarefa
│   └── task-filters.tsx        # Filtros de tarefas
├── lib/                        # Utilitários e tipos
│   ├── project.types.ts        # Tipos do projeto
│   ├── task.types.ts           # Tipos de tarefa
│   ├── validations.ts          # Validações client-side
│   └── utils.ts                # Funções utilitárias
├── .env.local                  # Variáveis de ambiente (não commitado)
├── .env.local.example          # Exemplo de variáveis de ambiente
└── next.config.ts              # Configuração do Next.js (inclui proxy)
```

## 🧩 Arquitetura de Componentes

O projeto segue uma arquitetura componentizada com componentes reutilizáveis:

### Componentes Compartilhados
- **DeleteModal**: Modal de confirmação de exclusão reutilizado em projetos e tarefas
- **Pagination**: Controles de paginação com números de página
- **PageHeader**: Cabeçalho padrão de páginas com título e botão de ação
- **FormField**: Campo de formulário genérico para text, textarea, select e date
- **SortableHeader**: Cabeçalho de tabela com ordenação

### Componentes Específicos
- **ProjectCard/TaskCard**: Renderização de linhas de tabela com dados formatados
- **ProjectFilters/TaskFilters**: Filtros específicos de cada módulo

### Benefícios
- ✅ **Reutilização**: Código compartilhado entre múltiplas páginas
- ✅ **Manutenibilidade**: Mudanças centralizadas em componentes
- ✅ **Consistência**: Design e comportamento uniformes
- ✅ **Testabilidade**: Componentes isolados facilitam testes

## 🎨 Funcionalidades

### Dashboard
- **Estatísticas em tempo real**: Total de projetos, tarefas, projetos em progresso e tarefas atrasadas
- **Cards informativos** com ícones e badges coloridas
- **Dark mode** com persistência no localStorage

### Projetos
- ✅ **Listagem** com filtros (busca, status), ordenação e paginação
- ✅ **Criação** com validação client-side e server-side
- ✅ **Edição** com formulário pré-populado
- ✅ **Detalhes** com lista de tarefas vinculadas
- ✅ **Exclusão** com modal de confirmação e aviso de cascade

### Tarefas
- ✅ **Listagem** com filtros avançados (status, prioridade, responsável)
- ✅ **Criação** com seleção de projeto
- ✅ **Edição** completa
- ✅ **Detalhes** com link para o projeto
- ✅ **Exclusão** com confirmação
- ✅ **Badges coloridas** por prioridade e status
- ✅ **Indicador visual** para tarefas atrasadas

## 🔌 Integração com API

A URL da API é configurada via variável de ambiente:

```env
NEXT_PUBLIC_API_URL=/api
```

O projeto utiliza um **proxy configurado no Next.js** (em `next.config.ts`) para evitar problemas de CORS:

- Frontend faz requisições para `/api/*`
- Next.js redireciona para `http://localhost:8000/api/*`

### Alterando a URL da API

Para apontar diretamente para o backend sem proxy:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Para ambientes de produção:

```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
```

### Parâmetros da API

Todos os parâmetros seguem o padrão **snake_case** do Laravel:

```typescript
// Paginação
per_page: 10 | 25 | 50
page: number

// Ordenação
sort_by: string
sort_order: 'asc' | 'desc'

// Filtros (Projetos)
search: string
status: 'planning' | 'in_progress' | 'completed' | 'cancelled'
start_date: string (YYYY-MM-DD)
end_date: string (YYYY-MM-DD)

// Filtros (Tarefas)
project_id: number
status: 'todo' | 'in_progress' | 'in_review' | 'completed'
priority: 'low' | 'medium' | 'high' | 'critical'
responsible: string
deadline_from: string (YYYY-MM-DD)
deadline_to: string (YYYY-MM-DD)
```

## 🎨 Dark Mode

O dark mode está implementado com:
- **Tailwind CSS v4** usando `@custom-variant dark`
- **Persistência** no localStorage
- **Script inline** no layout para prevenir flash
- **Toggle** no header para alternar entre temas

## ✅ Validações

### Client-side (lib/validations.ts)
- Campos obrigatórios
- Formatos de data
- Mensagens em PT-BR

### Server-side (Laravel)
- Erros 422 são capturados e exibidos nos formulários
- Conversão automática do formato Laravel para o formato da aplicação

## 🌐 Navegação

- `/` - Dashboard
- `/projects` - Lista de projetos
- `/projects/new` - Criar projeto
- `/projects/[id]` - Detalhes do projeto
- `/projects/[id]/edit` - Editar projeto
- `/tasks` - Lista de tarefas
- `/tasks/new` - Criar tarefa
- `/tasks/[id]` - Detalhes da tarefa
- `/tasks/[id]/edit` - Editar tarefa

## 🔍 URL-Driven State

Todos os filtros, ordenação e paginação são gerenciados via **query parameters** na URL:

```
/projects?search=teste&status=in_progress&sort_by=name&sort_order=asc&per_page=25&page=2
/tasks?priority=high&status=todo&responsible=João&per_page=50
```

Isso permite:
- **Compartilhar links** com filtros aplicados
- **Navegação com botões do navegador** (voltar/avançar)
- **Bookmarks** de visualizações específicas

## 🐛 Troubleshooting

### CORS Error
Se você ver erros de CORS, verifique:
1. O backend Laravel está rodando em `http://localhost:8000`
2. O arquivo `.env.local` está configurado corretamente
3. O proxy está configurado em `next.config.ts`

### Erro 422 (Validation Error)
- Verifique se os parâmetros estão em **snake_case**
- Confirme que `per_page` é 10, 25 ou 50
- Confirme que `sort_order` é 'asc' ou 'desc'

### Dark Mode não persiste
- Verifique se o JavaScript está habilitado no navegador
- Limpe o localStorage e tente novamente

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Iniciar produção
npm start

