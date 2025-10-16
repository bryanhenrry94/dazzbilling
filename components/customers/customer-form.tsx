"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createCliente, updateCliente } from "@/app/actions/customers";
import {
  tiposIdentificacion,
  type ClienteFormData,
} from "@/lib/validations/cliente";
import type { Cliente } from "@prisma/client";

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente;
}

export function ClienteForm({ open, onOpenChange, cliente }: ClienteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClienteFormData>({
    tipo_identificacion: (cliente?.tipo_identificacion as any) || "CEDULA",
    identificacion: cliente?.identificacion || "",
    razon_social: cliente?.razon_social || "",
    nombre_comercial: cliente?.nombre_comercial || "",
    direccion: cliente?.direccion || "",
    telefono: cliente?.telefono || "",
    email: cliente?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = cliente
        ? await updateCliente(cliente.id, formData)
        : await createCliente(formData);

      if (result.success) {
        onOpenChange(false);
        setFormData({
          tipo_identificacion: "CEDULA",
          identificacion: "",
          razon_social: "",
          nombre_comercial: "",
          direccion: "",
          telefono: "",
          email: "",
        });
      } else {
        setError(result.error || "Error al guardar cliente");
      }
    } catch (error) {
      setError("Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {cliente
              ? "Actualiza la información del cliente"
              : "Ingresa los datos del nuevo cliente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_identificacion">
                  Tipo de Identificación
                </Label>
                <Select
                  value={formData.tipo_identificacion}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, tipo_identificacion: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposIdentificacion.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="identificacion">Identificación</Label>
                <Input
                  id="identificacion"
                  value={formData.identificacion}
                  onChange={(e) =>
                    setFormData({ ...formData, identificacion: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="razon_social">Razón Social</Label>
              <Input
                id="razon_social"
                value={formData.razon_social}
                onChange={(e) =>
                  setFormData({ ...formData, razon_social: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_comercial">Nombre Comercial</Label>
              <Input
                id="nombre_comercial"
                value={formData.nombre_comercial}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_comercial: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
