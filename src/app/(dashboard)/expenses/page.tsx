"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_OPTIONS } from "@/types";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseList } from "@/components/expenses/ExpenseList";

const CATEGORY_OPTIONS_VALUES = CATEGORY_OPTIONS.map((c) => c.value);

export default function ExpensesPage() {
  const { data: expenses = [], isLoading, error } = useExpenses();
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [errorState, setErrorState] = useState<string | null>(null);

  const filtered = expenses.filter((e) => {
    // expense_date is stored as YYYY-MM-DD; filterMonth is YYYY-MM from <input type="month">
    if (filterMonth && !e.expense_date.startsWith(filterMonth)) return false;
    if (filterCategory && e.category !== filterCategory) return false;
    return true;
  });

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  async function deleteExpense(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
    } catch {
      setErrorState("Não foi possível excluir a despesa. Tente novamente.");
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse rounded-lg bg-muted h-8 w-32" />
      </div>
    );
  }

  if (error) {
    setErrorState("Não foi possível carregar as despesas. Tente novamente.");
  }

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

      {errorState && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {errorState}
        </div>
      )}

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

      <ExpenseList expenses={filtered} onDelete={deleteExpense} />
    </div>
  );
}
