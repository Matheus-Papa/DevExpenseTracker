"use client";

import Link from "next/link";
import { Trash2, Edit3 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_LABELS, Expense } from "@/types";
import { Button } from "@/components/ui/button";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center text-muted-foreground">
        Nenhuma despesa encontrada.
      </div>
    );
  }

  return (
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
          {expenses.map((e) => (
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
                  href={`/expenses/${e.id}/edit`}
                  className="text-sm text-primary hover:underline mr-3"
                >
                  <Edit3 className="h-4 w-4 inline mr-1" /> Editar
                </Link>
                <button
                  onClick={() => onDelete(e.id)}
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
  );
}
