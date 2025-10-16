import { getCuentasContables } from "@/app/actions/accounting";
import { CuentasTable } from "@/components/accounting/chart-of-accounts-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CuentasPage() {
  const result = await getCuentasContables();
  const cuentas =
    result?.success && Array.isArray(result.data) ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Plan de Cuentas</h1>
          <p className="text-slate-600">
            Gestiona el catálogo de cuentas contables
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cuenta
        </Button>
      </div>

      <CuentasTable cuentas={cuentas} />
    </div>
  );
}
