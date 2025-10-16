import { getFactura } from "@/app/actions/facturas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function FacturaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getFactura(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const factura = result.data

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/facturas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Factura #{factura.numeroFactura}</h1>
          <p className="text-slate-600">{formatDate(factura.fechaEmision)}</p>
        </div>
        <Badge className="ml-auto">{factura.estado}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-slate-600">RUC</p>
              <p className="font-medium">{factura.company.ruc}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Razón Social</p>
              <p className="font-medium">{factura.company.razonSocial}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Dirección</p>
              <p className="font-medium">{factura.company.direccion}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-slate-600">Identificación</p>
              <p className="font-medium">{factura.cliente.identificacion}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Razón Social</p>
              <p className="font-medium">{factura.cliente.razonSocial}</p>
            </div>
            {factura.cliente.direccion && (
              <div>
                <p className="text-sm text-slate-600">Dirección</p>
                <p className="font-medium">{factura.cliente.direccion}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Factura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Descuento</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factura.detalles.map((detalle) => (
                  <TableRow key={detalle.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{detalle.producto.nombre}</div>
                        <div className="text-sm text-slate-500">{detalle.producto.codigo}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{detalle.cantidad}</TableCell>
                    <TableCell className="text-right">{formatPrice(detalle.precioUnitario)}</TableCell>
                    <TableCell className="text-right">{formatPrice(detalle.descuento)}</TableCell>
                    <TableCell className="text-right">{formatPrice(detalle.subtotal)}</TableCell>
                    <TableCell className="text-right">{formatPrice(detalle.iva)}</TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(detalle.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(factura.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Descuento:</span>
                <span className="font-medium">{formatPrice(factura.descuento)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal sin impuestos:</span>
                <span className="font-medium">{formatPrice(factura.subtotalSinImpuestos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">IVA (12%):</span>
                <span className="font-medium">{formatPrice(factura.iva)}</span>
              </div>
              {factura.ice > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">ICE:</span>
                  <span className="font-medium">{formatPrice(factura.ice)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold">
                <span>Total:</span>
                <span>{formatPrice(factura.total)}</span>
              </div>
            </div>
          </div>

          {factura.observaciones && (
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Observaciones:</p>
              <p className="text-sm text-slate-600">{factura.observaciones}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
