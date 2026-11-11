import { NextResponse } from "next/server";
import db from "@/lib/db";
import { expenseSchema } from "@/lib/validations/expense";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { amount, category, description, expense_date } = parsed.data;
    const now = new Date().toISOString();

    const result = db.prepare(
      "UPDATE expenses SET amount = ?, category = ?, description = ?, expense_date = ?, updated_at = ? WHERE id = ?"
    ).run(amount, category, description ?? null, expense_date, now, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ id, amount, category, description, expense_date, updated_at: now });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar despesa" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = db.prepare("DELETE FROM expenses WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir despesa" }, { status: 500 });
  }
}
