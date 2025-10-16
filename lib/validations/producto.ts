import { z } from "zod"

export const productoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  precio: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  iva: z.boolean().default(true),
  ice: z.boolean().default(false),
})

export type ProductoFormData = z.infer<typeof productoSchema>
