import { getAsientosContables } from "@/app/actions/accounting";
import { AsientosTable } from "@/components/accounting/journal-entry-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AsientosPage() {
  const result = await getAsientosContables();
  const asientos =
    result.success && Array.isArray(result.data) ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Asientos Contables
          </h1>
          <p className="text-slate-600">
            Gestiona los registros contables de tu empresa
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/contabilidad/asientos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Asiento
          </Link>
        </Button>
      </div>

      <AsientosTable asientos={asientos} />
    </div>
  );
}
