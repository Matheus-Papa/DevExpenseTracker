import { NextResponse } from "next/server";
import db from "@/lib/db";
import { budgetSchema } from "@/lib/validations/expense";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const rows = db.prepare("SELECT * FROM budgets ORDER BY month DESC").all() as Array<{
      id: string;
      month: string;
      limit_amount: number;
    }>;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar orçamentos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = budgetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { month, limit_amount } = parsed.data;
    const id = uuidv4();

    db.prepare(
      "INSERT OR REPLACE INTO budgets (id, month, limit_amount) VALUES (?, ?, ?)"
    ).run(id, month, limit_amount);

    return NextResponse.json({ id, month, limit_amount }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao salvar orçamento" }, { status: 500 });
  }
}
