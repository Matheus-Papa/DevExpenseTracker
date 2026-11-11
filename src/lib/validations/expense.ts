import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  category: z.enum(["hosting", "api", "domain", "course", "other"]),
  description: z.string().optional(),
  expense_date: z.string().min(1, "Data é obrigatória"),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export const budgetSchema = z.object({
  month: z.string().min(1, "Mês é obrigatório"),
  limit_amount: z.coerce.number().positive("Limite deve ser maior que zero"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
