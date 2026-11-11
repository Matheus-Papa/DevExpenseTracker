"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function SettingsPage() {
  const [month, setMonth] = useState("");
  const [limit, setLimit] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const limitAmount = parseFloat(limit);
    if (!month) {
      setMessage("Informe o mês.");
      return;
    }
    if (!limitAmount || limitAmount <= 0) {
      setMessage("Informe um limite válido.");
      return;
    }

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, limit_amount: limitAmount }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      setMessage("Orçamento salvo com sucesso!");
    } catch {
      setMessage("Erro ao salvar orçamento.");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Configurações</h1>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold">Orçamento mensal</h2>
        <form onSubmit={handleSave} className="space-y-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium block mb-1">Mês</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Limite (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="h-9 rounded-md border w-full px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Salvar orçamento
          </Button>
        </form>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {message}
        </div>
      )}
    </div>
  );
}
