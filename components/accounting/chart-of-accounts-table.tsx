"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { deleteCuentaContable } from "@/app/actions/accounting"
import { useRouter } from "next/navigation"

type CuentaContable = {
  id: string
  codigo: string
  nombre: string
  tipoCuenta: string
  nivel: number
  aceptaMovimiento: boolean
  activa: boolean
  cuentaPadre: { codigo: string; nombre: string } | null
}

const tipoCuentaColors = {
  ACTIVO: "bg-green-100 text-green-800",
  PASIVO: "bg-red-100 text-red-800",
  PATRIMONIO: "bg-blue-100 text-blue-800",
  INGRESO: "bg-purple-100 text-purple-800",
  GASTO: "bg-orange-100 text-orange-800",
}

export function CuentasTable({ cuentas }: { cuentas: CuentaContable[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta cuenta?")) return

    setLoading(id)
    const result = await deleteCuentaContable(id)
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
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Movimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cuentas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-500">
                No hay cuentas contables registradas
              </TableCell>
            </TableRow>
          ) : (
            cuentas.map((cuenta) => (
              <TableRow key={cuenta.id}>
                <TableCell className="font-mono font-medium">{cuenta.codigo}</TableCell>
                <TableCell style={{ paddingLeft: `${cuenta.nivel * 12}px` }}>{cuenta.nombre}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={tipoCuentaColors[cuenta.tipoCuenta as keyof typeof tipoCuentaColors]}
                  >
                    {cuenta.tipoCuenta}
                  </Badge>
                </TableCell>
                <TableCell>{cuenta.nivel}</TableCell>
                <TableCell>
                  {cuenta.aceptaMovimiento ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Sí
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {cuenta.activa ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Activa
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Inactiva
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" disabled>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cuenta.id)}
                      disabled={loading === cuenta.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
