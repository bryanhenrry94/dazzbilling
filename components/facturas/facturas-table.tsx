"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Trash2, Send } from "lucide-react"
import { deleteFactura, emitirFactura } from "@/app/actions/facturas"
import type { Factura, Cliente, DetalleFactura, Producto } from "@prisma/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

type FacturaConRelaciones = Factura & {
  cliente: Cliente
  detalles: (DetalleFactura & { producto: Producto })[]
}

interface FacturasTableProps {
  facturas: FacturaConRelaciones[]
}

export function FacturasTable({ facturas }: FacturasTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deletingId) return
    await deleteFactura(deletingId)
    setDeletingId(null)
  }

  const handleEmitir = async (id: string) => {
    await emitirFactura(id)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      BORRADOR: "secondary",
      EMITIDA: "default",
      AUTORIZADA: "default",
      ANULADA: "destructive",
    }

    return (
      <Badge variant={variants[estado] || "outline"} className="text-xs">
        {estado}
      </Badge>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500">
                  No hay facturas registradas
                </TableCell>
              </TableRow>
            ) : (
              facturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.numeroFactura}</TableCell>
                  <TableCell>{factura.cliente.razonSocial}</TableCell>
                  <TableCell>{formatDate(factura.fechaEmision)}</TableCell>
                  <TableCell className="font-medium">{formatPrice(factura.total)}</TableCell>
                  <TableCell>{getEstadoBadge(factura.estado)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/facturas/${factura.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalle
                          </Link>
                        </DropdownMenuItem>
                        {factura.estado === "BORRADOR" && (
                          <DropdownMenuItem onClick={() => handleEmitir(factura.id)}>
                            <Send className="mr-2 h-4 w-4" />
                            Emitir
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setDeletingId(factura.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La factura será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
