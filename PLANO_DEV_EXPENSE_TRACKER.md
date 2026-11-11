# Plano do Projeto — Dev Expense Tracker

Controle de gastos com ferramentas de desenvolvedor (hosting, APIs, domínios, cursos).

---

## 1. Visão geral

| Item | Detalhe |
|------|---------|
| Problema | Desenvolvedores assinam várias ferramentas e não têm controle centralizado de gastos, nem visão por categoria ou mês. |
| Objetivo | App local (desktop/mobile) para cadastrar, categorizar, visualizar e exportar despesas de desenvolvedor, com alerta de orçamento. Banco SQLite local, sem login. |
| Persona | Desenvolvedor freelancer, CLT ou MEI que precisa controlar custos de trabalho. |
| Entregável | Repositório público no GitHub + app rodando localmente. Deploy futuro opcional. |
| Load assumido | Um usuário por instância (pessoal), poucos acessos simultâneos. |

---

## 2. Requisitos

### Requisitos funcionais (RF)

| ID | Requisito | Status |
|----|-----------|--------|
| RF01 | Cadastrar despesa: valor, categoria, data, descrição. | MVP |
| RF02 | Listar despesas. | MVP |
| RF03 | Filtrar despesas por mês, categoria e valor. | MVP |
| RF04 | Editar despesa. | Depois |
| RF05 | Excluir despesa com confirmação. | Depois |
| RF06 | Categorias padrão: Hosting, API, Domínio, Curso, Outro. | MVP |
| RF07 | Dashboard com total do mês, gasto por categoria e evolução mensal (gráficos). | Depois |
| RF08 | Definir orçamento mensal. | Depois |
| RF09 | Alerta visual quando gasto ultrapassa 80% ou 100% do orçamento. | Depois |
| RF10 | Exportar despesas filtradas para CSV. | Depois |
| RF11 | Responsivo (mobile e desktop). | MVP |
| RF12 | Estrutura pronta para deploy futuro (Vercel). | Futuro |

Não há cadastro nem login: o app é de um único usuário local.

### Requisitos não funcionais (RNF)

| ID | Requisito |
|----|-----------|
| RNF01 | Segurança: validação de entrada com Zod, rotas de API validam corpo da requisição (mesmo sem login). |
| RNF02 | Carregamento inicial < 3s; gráficos < 1s. |
| RNF03 | Acessibilidade: contraste, navegação por teclado, labels. |
| RNF04 | Código tipado (TypeScript), commits semânticos, README. |
| RNF05 | Banco SQLite local (arquivo `.db`), sem servidor externo. |
| RNF06 | Estrutura pronta para deploy futuro (Vercel + API routes). |

---

## 3. Stack tecnológica

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind CSS | SSR, tipagem forte, estilização rápida. |
| Banco | SQLite (arquivo local) | Zero instalação de servidor, arquivo único, fácil de migrar para Postgres/Oracle depois. |
| Biblioteca SQLite | better-sqlite3 | Síncrono, simples, funciona em API routes do Next.js. |
| Gráficos | Recharts | Gráficos declarativos em React. |
| Formulários | React Hook Form + Zod | Validação no frontend, schema compartilhado. |
| Estado / dados | React Query (TanStack Query) | Cache e sincronização (opcional, pode ser simplificado). |
| Deploy (futuro) | Vercel | Integra nativa com Next.js. |
| CI/CD (futuro) | GitHub Actions | Lint, build e deploy preview em PR. |

---

## 4. Modelo de dados (SQLite)

```sql
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL CHECK (category IN ('hosting','api','domain','course','other')),
  description TEXT,
  expense_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);

CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL, -- '2026-11'
  limit_amount REAL NOT NULL CHECK (limit_amount > 0),
  UNIQUE(month)
);
```

Categorias salvas em inglês no banco (`hosting`, `api`, `domain`, `course`, `other`), traduzidas para português apenas na interface (`Hospedagem`, `API`, `Domínio`, `Curso`, `Outro`).

Moeda fixa em BRL (R$), formatação `pt-BR`.

---

## 5. Épicos e sprints (5 semanas)

### Épicos

| Épico | Nome | Objetivo |
|-------|------|----------|
| E1 | Fundação & Banco Local | Repositório, Next.js, Tailwind, SQLite, schema DB, API routes de despesas. |
| E2 | Gestão de Despesas | CRUD completo, categorias, listagem, filtros, validação com Zod. |
| E3 | Dashboard & Visualização | Resumo financeiro, gráficos por categoria e evolução mensal. |
| E4 | Orçamento, Alertas & Exportação | Orçamento mensal, alertas visuais, exportação CSV. |
| E5 | Polimento, QA & Deploy futuro | Testes, lint, CI/CD, README, estrutura pronta para deploy. |

### Sprints

| Sprint | Épico | Escopo |
|--------|-------|--------|
| 1 | E1 | Inicializar Next.js + TS + Tailwind; configurar SQLite (`better-sqlite3`); migrations SQL; API routes de despesas (GET/POST); layout base. |
| 2 | E2 | Formulário de despesa (React Hook Form + Zod); listagem; filtros mês/categoria/valor; editar e excluir; página `/dashboard/expenses`. |
| 3 | E3 | Página `/dashboard` com resumo; gráfico pizza/barra por categoria; gráfico linha últimos 6 meses; cards de métrica. |
| 4 | E4 | Página de configurações (orçamento mensal); alerta visual 80%/100%; botão Exportar CSV; estados vazios e loading. |
| 5 | E5 | ESLint + Prettier + TS strict; testes críticos; GitHub Actions (lint/build); README completo; `.env.example`; estrutura pronta para deploy Vercel. |

---

## 6. Tarefas de implementação

1. Criar repositório Git, `.gitignore`, `.env.example`.
2. Inicializar Next.js 15 + TypeScript + Tailwind.
3. Instalar e configurar `better-sqlite3` em `lib/db.ts`.
4. Criar migrations SQL (`expenses`, `budgets`, índices).
5. Implementar API routes: `GET/POST /api/expenses`, `PUT/DELETE /api/expenses/[id]`, `GET/POST /api/budgets`.
6. Gerar tipos TypeScript para as tabelas.
7. Layout global (navbar, sidebar mobile).
8. Página principal do dashboard (`/dashboard`).
9. Página de despesas (`/dashboard/expenses`) com lista, filtros, ações.
10. Componente `ExpenseForm` (criar/editar) com Zod + React Hook Form.
11. Componente `ExpenseList` (loading, estados vazios).
12. Componente `BudgetForm` (orçamento mensal).
13. Alerta visual de orçamento (badge/banner > 80% ou 100%).
14. Responsividade mobile-first e acessibilidade básica.
15. Hooks com React Query para despesas, orçamentos e resumos.
16. Utilitários: total por mês, total por categoria, formatar moeda (BRL `pt-BR`) e datas.
17. Componente `CategoryChart` (pizza/barra) com Recharts.
18. Componente `MonthlyChart` (linha, últimos 6 meses).
19. Cards de métrica: total gasto, orçamento restante, % utilizado.
20. Lógica de filtro (mês, categoria, valor mínimo/máximo).
21. Função `exportToCSV` (download de arquivo CSV).
22. Tratamento de erros de rede e mensagens amigáveis.
23. ESLint, Prettier, TypeScript strict mode.
24. Testes críticos (validação Zod, cálculo de total por mês).
25. Workflow GitHub Actions: lint → build.
26. `README.md` completo: descrição, problema, stack, como rodar localmente, prints/GIF, decisões técnicas, o que faria diferente.
27. `LICENSE` (MIT).

---

## 7. Checklist do repositório

- [ ] Repositório público no GitHub
- [ ] README com descrição em uma linha, stack, como rodar localmente, prints/GIF, decisões técnicas, o que faria diferente
- [ ] Código limpo, commits descritivos, `.gitignore` correto
- [ ] App rodando localmente (`npm run dev`)
- [ ] Estrutura pronta para deploy futuro (Vercel)

---

## 8. Estrutura sugerida de pastas

```
dev-expense-tracker/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx              # dashboard (resumo + gráficos)
│   │   ├── expenses/
│   │   │   ├── page.tsx          # lista + filtros
│   │   │   ├── new/page.tsx      # criar
│   │   │   └── [id]/edit/page.tsx
│   │   └── settings/page.tsx     # orçamento mensal
│   ├── api/
│   │   ├── expenses/route.ts     # GET, POST
│   │   ├── expenses/[id]/route.ts # PUT, DELETE
│   │   └── budgets/route.ts
│   ├── layout.tsx
│   └── page.tsx                  # redireciona para dashboard
├── components/
│   ├── ui/               componentes base
│   ├── expenses/         ExpenseForm, ExpenseList, ExpenseCard
│   └── charts/           CategoryChart, MonthlyChart
├── lib/
│   ├── db.ts             # conexão SQLite, init schema
│   ├── validations/      schemas Zod
│   └── utils/            formatCurrency (BRL), dateHelpers
├── types/
│   └── index.ts          tipos globais (Expense, Category, Budget)
├── .env.local
├── prisma/schema.prisma  # se usar Prisma em vez de better-sqlite3
└── README.md
```

---

## 9. Primeira recomendação

Comece pelo Sprint 1. Tenha o app rodando localmente com cadastro e listagem de despesas antes de adicionar gráficos ou orçamento. Qualidade > quantidade.