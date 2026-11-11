export type Category = "hosting" | "api" | "domain" | "course" | "other";

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description?: string | null;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  month: string;
  limit_amount: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  hosting: "Hospedagem",
  api: "API",
  domain: "Domínio",
  course: "Curso",
  other: "Outro",
};
