import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Resumo dos seus gastos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total do mês</p>
          <p className="text-2xl font-semibold">R$ 0,00</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Orçamento restante</p>
          <p className="text-2xl font-semibold">R$ 0,00</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">% utilizado</p>
          <p className="text-2xl font-semibold">0%</p>
        </div>
      </div>

      <div className="rounded-lg border p-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Gráficos</h2>
          <p className="text-sm text-muted-foreground">
            Evolução mensal e gasto por categoria estarão aqui.
          </p>
        </div>
        <Link
          href="/dashboard/expenses"
          className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Gerenciar despesas
        </Link>
      </div>
    </div>
  );
}
