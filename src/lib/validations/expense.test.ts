import { describe, it, expect } from "vitest";
import { expenseSchema, budgetSchema } from "./expense";

describe("expenseSchema", () => {
  it("accepts a valid expense", () => {
    const result = expenseSchema.safeParse({
      amount: 49.9,
      category: "hosting",
      description: "VPS",
      expense_date: "2026-11-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive amount", () => {
    const result = expenseSchema.safeParse({
      amount: 0,
      category: "hosting",
      expense_date: "2026-11-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = expenseSchema.safeParse({
      amount: 10,
      category: "invalid",
      expense_date: "2026-11-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing date", () => {
    const result = expenseSchema.safeParse({
      amount: 10,
      category: "hosting",
      expense_date: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("budgetSchema", () => {
  it("accepts a valid budget", () => {
    const result = budgetSchema.safeParse({
      month: "2026-11",
      limit_amount: 500,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive limit", () => {
    const result = budgetSchema.safeParse({
      month: "2026-11",
      limit_amount: -10,
    });
    expect(result.success).toBe(false);
  });
});
