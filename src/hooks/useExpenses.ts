"use client";

import { useQuery } from "@tanstack/react-query";
import { Expense } from "@/types";

async function fetchExpenses(): Promise<Expense[]> {
  const res = await fetch("/api/expenses", { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao carregar despesas");
  return res.json();
}

export function useExpenses() {
  return useQuery<Expense[], Error>({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });
}
