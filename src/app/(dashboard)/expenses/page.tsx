"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Edit3, Plus, Filter } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/types";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
}

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "hosting", label: "Hospedagem" },
  { value: "api", label: "API" },
  { value: "domain", label: "Domínio" },
  { value: "course", label: "Curso" },
  { value: "other", label: "Outro" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  async function loadExpenses() {
    const res = await fetch("/api/expenses", { cache: "no-store" });
    const data = await res.json();
    setExpenses(data);
  }

  async function deleteExpense(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
  }

  const filtered = expenses.filter((e) => {
    if (filterMonth && !e.expense_date.startsWith(filterMonth)) return false;
    if (filterCategory && e.category !== filterCategory) return false;
    return true;
  });

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Despesas</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie seus gastos com ferramentas de desenvolvedor.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/expenses/new"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Plus className="mr-2" /> Nova despesa
          </Link>
        </div>
      </div>

      <div className="rounded-lg border p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <label className="text-sm font-medium">Filtrar por mês:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="ml-2 h-8 rounded-md border input bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Categoria:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-8 rounded-md border bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-muted-foreground">Total filtrado</p>
          <p className="text-lg font-semibold">{formatCurrency(total)}</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border p-12 text-center text-muted-foreground">
          Nenhuma despesa encontrada.
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted">
                <th className="px-4 py-3 text-sm font-medium">Data</th>
                <th className="px-4 py-3 text-sm font-medium">Categoria</th>
                <th className="px-4 py-3 text-sm font-medium">Descrição</th>
                <th className="px-4 py-3 text-sm font-medium text-right">Valor</th>
                <th className="px-4 py-3 text-sm font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b hover:bg-accent/50">
                  <td className="px-4 py-3 text-sm">{formatDate(e.expense_date)}</td>
                  <td className="px-4 py-3 text-sm">
                    {CATEGORY_LABELS[e.category as keyof typeof CATEGORY_LABELS] || e.category}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {e.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatCurrency(e.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/expenses/${e.id}/edit`}
                      className="text-sm text-primary hover:underline mr-3"
                    >
                      <Edit3 className="h-4 w-4 inline mr-1" /> Editar
                    </Link>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="text-sm text-destructive hover:underline"
                    >
                      <Trash2 className="h-4 w-4 inline mr-1" /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
