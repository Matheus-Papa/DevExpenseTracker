import Link from "next/link";
import { DollarSign, BarChart3, CreditCard, Settings } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
        <DollarSign className="h-5 w-5" />
        <span className="hidden sm:block">Dev Expense Tracker</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          <BarChart3 className="h-4 w-4 mr-1" /> Dashboard
        </Link>
        <Link href="/expenses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          <CreditCard className="h-4 w-4 mr-1" /> Despesas
        </Link>
        <Link href="/settings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          <Settings className="h-4 w-4 mr-1" /> Configurações
        </Link>
      </div>
    </nav>
  );
}
