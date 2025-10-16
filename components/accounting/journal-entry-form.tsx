"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { createAsientoContable } from "@/app/actions/accounting";
import type { DetalleAsientoInput } from "@/lib/validations/contabilidad";

type CuentaMovimiento = {
  id: string;
  codigo: string;
  nombre: string;
};

export function AsientoForm({ cuentas }: { cuentas: CuentaMovimiento[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [descripcion, setDescripcion] = useState("");
  const [detalles, setDetalles] = useState<DetalleAsientoInput[]>([
    { cuenta_id: "", descripcion: "", debe: 0, haber: 0 },
  ]);

  const agregarDetalle = () => {
    setDetalles([
      ...detalles,
      { cuenta_id: "", descripcion: "", debe: 0, haber: 0 },
    ]);
  };

  const eliminarDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const actualizarDetalle = (
    index: number,
    campo: keyof DetalleAsientoInput,
    valor: any
  ) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };
    setDetalles(nuevosDetalles);
  };

  const totalDebe = detalles.reduce((sum, d) => sum + Number(d.debe), 0);
  const totalHaber = detalles.reduce((sum, d) => sum + Number(d.haber), 0);
  const diferencia = totalDebe - totalHaber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createAsientoContable({
      fecha: new Date(fecha),
      descripcion,
      detalles: detalles.map((d) => ({
        ...d,
        debe: Number(d.debe),
        haber: Number(d.haber),
      })),
    });

    setLoading(false);

    if (result.success) {
      router.push("/dashboard/contabilidad/asientos");
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del asiento contable"
              required
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Movimientos</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={agregarDetalle}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Movimiento
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Cuenta</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[150px]">Debe</TableHead>
                <TableHead className="w-[150px]">Haber</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalles.map((detalle, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      value={detalle.cuenta_id}
                      onValueChange={(value) =>
                        actualizarDetalle(index, "cuenta_id", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cuenta" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuentas.map((cuenta) => (
                          <SelectItem key={cuenta.id} value={cuenta.id}>
                            {cuenta.codigo} - {cuenta.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={detalle.descripcion || ""}
                      onChange={(e) =>
                        actualizarDetalle(index, "descripcion", e.target.value)
                      }
                      placeholder="Descripción opcional"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={detalle.debe}
                      onChange={(e) =>
                        actualizarDetalle(index, "debe", e.target.value)
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={detalle.haber}
                      onChange={(e) =>
                        actualizarDetalle(index, "haber", e.target.value)
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    {detalles.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarDetalle(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-slate-50 font-semibold">
                <TableCell colSpan={2} className="text-right">
                  Totales:
                </TableCell>
                <TableCell className="text-right">
                  ${totalDebe.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  ${totalHaber.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              {Math.abs(diferencia) > 0.01 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-600">
                    ⚠️ El asiento no está cuadrado. Diferencia: $
                    {Math.abs(diferencia).toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || Math.abs(diferencia) > 0.01}>
          {loading ? "Guardando..." : "Guardar Asiento"}
        </Button>
      </div>
    </form>
  );
}
