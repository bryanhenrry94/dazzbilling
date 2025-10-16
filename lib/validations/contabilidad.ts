import { z } from "zod"

export const cuentaContableSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipoCuenta: z.enum(["ACTIVO", "PASIVO", "PATRIMONIO", "INGRESO", "GASTO"], {
    required_error: "El tipo de cuenta es requerido",
  }),
  nivel: z.number().int().min(1).max(5),
  cuentaPadreId: z.string().optional(),
  aceptaMovimiento: z.boolean().default(true),
  activa: z.boolean().default(true),
})

export const detalleAsientoSchema = z.object({
  cuentaId: z.string().min(1, "La cuenta es requerida"),
  descripcion: z.string().optional(),
  debe: z.number().min(0, "El debe debe ser mayor o igual a 0").default(0),
  haber: z.number().min(0, "El haber debe ser mayor o igual a 0").default(0),
})

export const asientoContableSchema = z.object({
  fecha: z.date(),
  descripcion: z.string().min(1, "La descripción es requerida"),
  detalles: z
    .array(detalleAsientoSchema)
    .min(2, "Debe haber al menos 2 movimientos")
    .refine(
      (detalles) => {
        const totalDebe = detalles.reduce((sum, d) => sum + d.debe, 0)
        const totalHaber = detalles.reduce((sum, d) => sum + d.haber, 0)
        return Math.abs(totalDebe - totalHaber) < 0.01 // Tolerancia para decimales
      },
      {
        message: "El total del debe debe ser igual al total del haber",
      },
    ),
})

export type CuentaContableInput = z.infer<typeof cuentaContableSchema>
export type AsientoContableInput = z.infer<typeof asientoContableSchema>
export type DetalleAsientoInput = z.infer<typeof detalleAsientoSchema>
