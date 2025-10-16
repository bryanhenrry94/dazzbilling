"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { contabilizarAsiento, anularAsiento } from "@/app/actions/accounting"
import { useRouter } from "next/navigation"
import { useState } from "react"

type AsientoContable = {
  id: string
  numero: string
  fecha: Date
  descripcion: string
  tipoAsiento: string
  estado: string
  detalles: Array<{
    debe: number
    haber: number
  }>
}

const estadoColors = {
  BORRADOR: "bg-yellow-100 text-yellow-800",
  CONTABILIZADO: "bg-green-100 text-green-800",
  ANULADO: "bg-red-100 text-red-800",
}

export function AsientosTable({ asientos }: { asientos: AsientoContable[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleContabilizar = async (id: string) => {
    if (!confirm("¿Está seguro de contabilizar este asiento?")) return

    setLoading(id)
    const result = await contabilizarAsiento(id)
    setLoading(null)

    if (!result.success) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  const handleAnular = async (id: string) => {
    if (!confirm("¿Está seguro de anular este asiento?")) return

    setLoading(id)
    const result = await anularAsiento(id)
    setLoading(null)

    if (!result.success) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Total Debe</TableHead>
            <TableHead className="text-right">Total Haber</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asientos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-slate-500">
                No hay asientos contables registrados
              </TableCell>
            </TableRow>
          ) : (
            asientos.map((asiento) => {
              const totalDebe = asiento.detalles.reduce((sum, d) => sum + d.debe, 0)
              const totalHaber = asiento.detalles.reduce((sum, d) => sum + d.haber, 0)

              return (
                <TableRow key={asiento.id}>
                  <TableCell className="font-mono font-medium">{asiento.numero}</TableCell>
                  <TableCell>{new Date(asiento.fecha).toLocaleDateString("es-EC")}</TableCell>
                  <TableCell className="max-w-xs truncate">{asiento.descripcion}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{asiento.tipoAsiento}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">${totalDebe.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${totalHaber.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={estadoColors[asiento.estado as keyof typeof estadoColors]}>
                      {asiento.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/contabilidad/asientos/${asiento.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {asiento.estado === "BORRADOR" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleContabilizar(asiento.id)}
                          disabled={loading === asiento.id}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {asiento.estado === "CONTABILIZADO" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAnular(asiento.id)}
                          disabled={loading === asiento.id}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
