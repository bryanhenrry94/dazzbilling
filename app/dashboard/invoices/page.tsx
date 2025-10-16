import { FacturasTable } from "@/components/invoices/invoice-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getFacturas } from "@/app/actions/invoices";

export default async function FacturasPage() {
  const result = await getFacturas();
  const facturas =
    result.success && Array.isArray(result.data) ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Facturas</h1>
          <p className="text-slate-600">Gestiona tus facturas electrónicas</p>
        </div>
        <Button asChild className="bg-slate-900 hover:bg-slate-800">
          <Link href="/dashboard/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Link>
        </Button>
      </div>

      <FacturasTable facturas={facturas} />
    </div>
  );
}
