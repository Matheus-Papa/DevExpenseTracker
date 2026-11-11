"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, CATEGORY_OPTIONS } from "@/types";

interface ExpenseFormData {
  amount: string;
  category: string;
  description: string;
  expense_date: string;
}

export default function NewExpensePage() {
  const [form, setForm] = useState<ExpenseFormData>({
    amount: "",
    category: "",
    description: "",
    expense_date: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.category) {
      setError("Selecione uma categoria.");
      return;
    }
    if (!form.expense_date) {
      setError("Informe a data.");
      return;
    }

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          category: form.category,
          description: form.description || undefined,
          expense_date: form.expense_date,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/expenses";
      }, 800);
    } catch {
      setError("Não foi possível salvar a despesa. Tente novamente.");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/expenses" className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-semibold">Nova despesa</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Despesa salva com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Selecione</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data da despesa</label>
          <input
            type="date"
            value={form.expense_date}
            onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
            className="h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="rounded-md border w-full px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button type="submit" disabled={success} className="w-full">
          Salvar despesa
        </Button>
      </form>
    </div>
  );
}
