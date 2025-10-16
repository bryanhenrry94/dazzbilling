import { getAsientoContable } from "@/app/actions/accounting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const estadoColors = {
  BORRADOR: "bg-yellow-100 text-yellow-800",
  CONTABILIZADO: "bg-green-100 text-green-800",
  ANULADO: "bg-red-100 text-red-800",
};

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AsientoDetallePage({ params }: any) {
  const result = await getAsientoContable(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const asiento = result.data;
  const totalDebe = asiento.detalles.reduce((sum, d) => sum + d.debe, 0);
  const totalHaber = asiento.detalles.reduce((sum, d) => sum + d.haber, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/contabilidad/asientos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Asiento Contable #{asiento.numero}
            </h1>
            <p className="text-slate-600">
              {new Date(asiento.fecha).toLocaleDateString("es-EC", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={
              estadoColors[asiento.estado as keyof typeof estadoColors]
            }
          >
            {asiento.estado}
          </Badge>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold text-slate-700">Descripción:</span>
            <span className="text-slate-900">{asiento.descripcion}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-slate-700">Tipo:</span>
            <Badge variant="secondary">{asiento.tipo_asiento}</Badge>
          </div>
          {asiento.factura && (
            <div className="flex gap-2">
              <span className="font-semibold text-slate-700">Factura:</span>
              <Link
                href={`/dashboard/facturas/${asiento.factura.id}`}
                className="text-blue-600 hover:underline"
              >
                #{asiento.factura.numero_factura} -{" "}
                {asiento.factura.cliente.razon_social}
              </Link>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cuenta</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Debe</TableHead>
                <TableHead className="text-right">Haber</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asiento.detalles.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell className="font-mono">
                    {detalle.cuenta.codigo}
                  </TableCell>
                  <TableCell>{detalle.cuenta.nombre}</TableCell>
                  <TableCell className="text-slate-600">
                    {detalle.descripcion || "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {detalle.debe > 0 ? `$${detalle.debe.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {detalle.haber > 0 ? `$${detalle.haber.toFixed(2)}` : "-"}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-slate-50 font-bold">
                <TableCell colSpan={3} className="text-right">
                  Totales:
                </TableCell>
                <TableCell className="text-right">
                  ${totalDebe.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${totalHaber.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
