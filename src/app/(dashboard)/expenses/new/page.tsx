"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, CATEGORY_OPTIONS } from "@/types";
import { expenseSchema } from "@/lib/validations/expense";
import type { Category } from "@/types";

interface ExpenseFormData {
  amount: string;
  category: Category;
  description: string;
  expense_date: string;
}

export default function NewExpensePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      amount: "",
      category: "hosting" as Category,
      description: "",
      expense_date: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(data.amount),
          category: data.category,
          description: data.description || undefined,
          expense_date: data.expense_date,
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push("/expenses");
      }, 800);
    },
    onError: () => {
      setError("Não foi possível salvar a despesa. Tente novamente.");
    },
  });

  async function onSubmit(data: ExpenseFormData) {
    mutation.mutate(data);
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

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("amount")}
            className={`h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring ${
              errors.amount ? "border-destructive" : ""
            }`}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <select
            {...register("category")}
            className={`h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring ${
              errors.category ? "border-destructive" : ""
            }`}
          >
            <option value="">Selecione</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data da despesa</label>
          <input
            type="date"
            {...register("expense_date")}
            className={`h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring ${
              errors.expense_date ? "border-destructive" : ""
            }`}
          />
          {errors.expense_date && (
            <p className="text-xs text-destructive">{errors.expense_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <textarea
            {...register("description")}
            rows={3}
            className="rounded-md border w-full px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button type="submit" disabled={success || mutation.isPending} className="w-full">
          Salvar despesa
        </Button>
      </form>
    </div>
  );
}
