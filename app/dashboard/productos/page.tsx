import { ProductosTable } from "@/components/productos/productos-table";
import { ProductoFormButton } from "@/components/productos/producto-form-button";
import { getProductos } from "@/app/actions/productos";

export default async function ProductosPage() {
  const result = await getProductos();
  const productos =
    result.success && Array.isArray(result.data) ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Productos y Servicios
          </h1>
          <p className="text-slate-600">
            Gestiona tu catálogo de productos y servicios
          </p>
        </div>
        <ProductoFormButton />
      </div>

      <ProductosTable productos={productos} />
    </div>
  );
}
