"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS } from "@/types";

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "hosting", label: "Hospedagem" },
  { value: "api", label: "API" },
  { value: "domain", label: "Domínio" },
  { value: "course", label: "Curso" },
  { value: "other", label: "Outro" },
];

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
}

export default function EditExpensePage() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    expense_date: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const expenseId = segments[segments.length - 2]; // /expenses/:id/edit
    setId(expenseId);

    if (!expenseId) {
      setError("ID da despesa não encontrado.");
      setLoading(false);
      return;
    }

    fetch(`/api/expenses/${expenseId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Expense) => {
        setForm({
          amount: data.amount.toString(),
          category: data.category,
          description: data.description || "",
          expense_date: data.expense_date,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Não foi possível carregar a despesa.");
        setLoading(false);
      });
  }, []);

  if (!id) return <div className="p-6">Carregando...</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) {
      setError("O valor deve ser maior que zero.");
      return;
    }
    if (!form.category) {
      setError("Selecione uma categoria.");
      return;
    }
    if (!form.expense_date) {
      setError("Informe a data.");
      return;
    }

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          category: form.category,
          description: form.description || undefined,
          expense_date: form.expense_date,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard/expenses";
      }, 800);
    } catch {
      setError("Não foi possível atualizar a despesa. Tente novamente.");
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/expenses" className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-semibold">Editar despesa</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Despesa atualizada com sucesso!
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
          Atualizar despesa
        </Button>
      </form>
    </div>
  );
}
