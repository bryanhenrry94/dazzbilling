import { getCuentasMovimiento } from "@/app/actions/contabilidad";
import { AsientoForm } from "@/components/contabilidad/asiento-form";

export default async function NuevoAsientoPage() {
  const result = await getCuentasMovimiento();
  const cuentas = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Nuevo Asiento Contable
        </h1>
        <p className="text-slate-600">
          Registra un nuevo asiento contable manual
        </p>
      </div>

      <AsientoForm cuentas={cuentas} />
    </div>
  );
}
