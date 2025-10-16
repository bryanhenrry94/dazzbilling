"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProducto, updateProducto } from "@/app/actions/products"
import type { ProductoFormData } from "@/lib/validations/producto"
import type { Producto } from "@prisma/client"

interface ProductoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto?: Producto
}

export function ProductoForm({ open, onOpenChange, producto }: ProductoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductoFormData>({
    codigo: producto?.codigo || "",
    nombre: producto?.nombre || "",
    descripcion: producto?.descripcion || "",
    precio: producto?.precio || 0,
    iva: producto?.iva ?? true,
    ice: producto?.ice ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = producto ? await updateProducto(producto.id, formData) : await createProducto(formData)

      if (result.success) {
        onOpenChange(false)
        setFormData({
          codigo: "",
          nombre: "",
          descripcion: "",
          precio: 0,
          iva: true,
          ice: false,
        })
      } else {
        setError(result.error || "Error al guardar producto")
      }
    } catch (error) {
      setError("Error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{producto ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {producto ? "Actualiza la información del producto" : "Ingresa los datos del nuevo producto o servicio"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                  placeholder="PROD-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: Number.parseFloat(e.target.value) || 0 })}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Nombre del producto o servicio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción opcional del producto"
                rows={3}
              />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="iva"
                  checked={formData.iva}
                  onCheckedChange={(checked) => setFormData({ ...formData, iva: checked as boolean })}
                />
                <Label htmlFor="iva" className="cursor-pointer font-normal">
                  Aplica IVA (12%)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ice"
                  checked={formData.ice}
                  onCheckedChange={(checked) => setFormData({ ...formData, ice: checked as boolean })}
                />
                <Label htmlFor="ice" className="cursor-pointer font-normal">
                  Aplica ICE
                </Label>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
