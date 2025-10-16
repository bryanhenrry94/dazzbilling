import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { getDashboardStats } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const result = await getDashboardStats();

  if (!result.success) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-500">Error al cargar el dashboard</p>
      </div>
    );
  }

  if (!result.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-500">
          No hay datos disponibles para el dashboard
        </p>
      </div>
    );
  }

  const {
    totalClientes,
    totalProductos,
    totalFacturas,
    ingresosMes,
    facturasRecientes,
  } = result.data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel</h1>
          <p className="text-slate-600">Resumen de tu negocio</p>
        </div>
        <Button asChild className="bg-slate-900 hover:bg-slate-800">
          <Link href="/dashboard/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Link>
        </Button>
      </div>

      <StatsCards
        totalClientes={totalClientes}
        totalProductos={totalProductos}
        totalFacturas={totalFacturas}
        ingresosMes={ingresosMes}
      />

      <RecentInvoices facturas={facturasRecientes} />
    </div>
  );
}
