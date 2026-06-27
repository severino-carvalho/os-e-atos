# Frontend — Padrões e Decisões

## Stack
React 18, Vite, TypeScript, TanStack Query, React Router v6, Axios

## Organização
Estrutura por feature em src/features/.
Cada feature pode ter: components/, hooks/, types/, services/

## Padrões
- Componentes funcionais com arrow function
- Nenhum `any` — tipagem sempre explícita
- Chamadas de API isoladas em services/, nunca dentro de componentes
- Estado de servidor via TanStack Query (sem useState para dados async)
- Nomes de componentes em PascalCase, hooks com prefixo `use`

## Variáveis de ambiente
VITE_API_URL — base URL do backend