import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "./route";

beforeEach(() => {
  // Limpar dados de teste não é trivial com SQLite local;
  // os testes abaixo validam comportamento da API com dados existentes
});

describe("GET /api/expenses", () => {
  it("returns an array of expenses", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(res.status).toBe(200);
  });
});

describe("POST /api/expenses", () => {
  it("creates a valid expense and returns 201", async () => {
    const body = JSON.stringify({
      amount: 49.9,
      category: "hosting",
      description: "VPS mensal",
      expense_date: "2026-11-01",
    });
    const req = new Request("http://localhost/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.amount).toBe(49.9);
    expect(data.category).toBe("hosting");
    expect(data.description).toBe("VPS mensal");
    expect(data.id).toBeDefined();
  });

  it("rejects non-positive amount with 400", async () => {
    const body = JSON.stringify({
      amount: 0,
      category: "hosting",
      expense_date: "2026-11-01",
    });
    const req = new Request("http://localhost/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects invalid category with 400", async () => {
    const body = JSON.stringify({
      amount: 10,
      category: "invalid",
      expense_date: "2026-11-01",
    });
    const req = new Request("http://localhost/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
