"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { createFactura } from "@/app/actions/invoices";
import type { Cliente, Producto } from "@prisma/client";
import { useRouter } from "next/navigation";

interface FacturaFormProps {
  clientes: Cliente[];
  productos: Producto[];
}

interface DetalleItem {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
}

export function FacturaForm({ clientes, productos }: FacturaFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clienteId, setClienteId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);

  const agregarDetalle = () => {
    setDetalles([
      ...detalles,
      {
        productoId: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
      },
    ]);
  };

  const eliminarDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const actualizarDetalle = (
    index: number,
    campo: keyof DetalleItem,
    valor: any
  ) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };

    // Si cambia el producto, actualizar el precio
    if (campo === "productoId") {
      const producto = productos.find((p) => p.id === valor);
      if (producto) {
        nuevosDetalles[index].precioUnitario = producto.precio;
      }
    }

    setDetalles(nuevosDetalles);
  };

  const calcularSubtotal = (detalle: DetalleItem) => {
    const subtotal = detalle.cantidad * detalle.precioUnitario;
    const descuento = (subtotal * detalle.descuento) / 100;
    return subtotal - descuento;
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      const subtotal = calcularSubtotal(detalle);
      const producto = productos.find((p) => p.id === detalle.productoId);
      const iva = producto?.iva ? subtotal * 0.12 : 0;
      return total + subtotal + iva;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createFactura({
        clienteId,
        observaciones,
        detalles,
      });

      if (result.success) {
        router.push("/dashboard/facturas");
      } else {
        setError(result.error || "Error al crear factura");
      }
    } catch (error) {
      setError("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.razon_social} - {cliente.identificacion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones adicionales (opcional)"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalles de la Factura</CardTitle>
          <Button
            type="button"
            onClick={agregarDetalle}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        </CardHeader>
        <CardContent>
          {detalles.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No hay productos agregados
            </p>
          ) : (
            <div className="rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="w-24">Cantidad</TableHead>
                    <TableHead className="w-32">Precio</TableHead>
                    <TableHead className="w-24">Desc. %</TableHead>
                    <TableHead className="w-32">Subtotal</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detalles.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={detalle.productoId}
                          onValueChange={(value) =>
                            actualizarDetalle(index, "productoId", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {productos.map((producto) => (
                              <SelectItem key={producto.id} value={producto.id}>
                                {producto.nombre} -{" "}
                                {formatPrice(producto.precio)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={detalle.cantidad}
                          onChange={(e) =>
                            actualizarDetalle(
                              index,
                              "cantidad",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={detalle.precioUnitario}
                          onChange={(e) =>
                            actualizarDetalle(
                              index,
                              "precioUnitario",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={detalle.descuento}
                          onChange={(e) =>
                            actualizarDetalle(
                              index,
                              "descuento",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(calcularSubtotal(detalle))}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => eliminarDetalle(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {detalles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(calcularTotal())}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || detalles.length === 0}>
          {isLoading ? "Creando..." : "Crear Factura"}
        </Button>
      </div>
    </form>
  );
}
