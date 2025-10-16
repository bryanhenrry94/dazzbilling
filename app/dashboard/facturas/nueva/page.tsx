import { FacturaForm } from "@/components/facturas/factura-form";
import { getClientes } from "@/app/actions/clientes";
import { getProductos } from "@/app/actions/productos";

export default async function NuevaFacturaPage() {
  const [clientesResult, productosResult] = await Promise.all([
    getClientes(),
    getProductos(),
  ]);

  const clientes = Array.isArray(clientesResult?.data)
    ? clientesResult.data
    : [];
  const productos = Array.isArray(productosResult?.data)
    ? productosResult.data
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nueva Factura</h1>
        <p className="text-slate-600">Crea una nueva factura electrónica</p>
      </div>

      <FacturaForm clientes={clientes} productos={productos} />
    </div>
  );
}
