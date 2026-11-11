import { NextResponse } from "next/server";
import db from "@/lib/db";
import { expenseSchema } from "@/lib/validations/expense";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const rows = db
      .prepare(
        "SELECT * FROM expenses ORDER BY expense_date DESC, created_at DESC"
      )
      .all() as Array<{
        id: string;
        amount: number;
        category: string;
        description: string | null;
        expense_date: string;
        created_at: string;
        updated_at: string;
      }>;

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar despesas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { amount, category, description, expense_date } = parsed.data;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(
      "INSERT INTO expenses (id, amount, category, description, expense_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(id, amount, category, description ?? null, expense_date, now, now);

    return NextResponse.json(
      { id, amount, category, description, expense_date, created_at: now, updated_at: now },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar despesa" }, { status: 500 });
  }
}
