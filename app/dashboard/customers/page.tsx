import { ClientesTable } from "@/components/customers/customer-table";
import { ClienteFormButton } from "@/components/customers/customer-form-button";
import { getClientes } from "@/app/actions/customers";

export default async function ClientesPage() {
  const result = await getClientes();
  const clientes =
    Array.isArray(result.data) && result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600">Gestiona tu cartera de clientes</p>
        </div>
        <ClienteFormButton />
      </div>

      <ClientesTable clientes={clientes} />
    </div>
  );
}
