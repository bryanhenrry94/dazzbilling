import { z } from "zod"

export const detalleFacturaSchema = z.object({
  productoId: z.string().min(1, "Selecciona un producto"),
  cantidad: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0"),
  precioUnitario: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  descuento: z.coerce.number().min(0).default(0),
})

export const facturaSchema = z.object({
  clienteId: z.string().min(1, "Selecciona un cliente"),
  observaciones: z.string().optional(),
  detalles: z.array(detalleFacturaSchema).min(1, "Agrega al menos un producto"),
})

export type FacturaFormData = z.infer<typeof facturaSchema>
export type DetalleFacturaFormData = z.infer<typeof detalleFacturaSchema>
