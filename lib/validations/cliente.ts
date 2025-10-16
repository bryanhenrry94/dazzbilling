import { z } from "zod";

export const tiposIdentificacion = [
  { value: "RUC", label: "RUC" },
  { value: "CEDULA", label: "Cédula" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "CONSUMIDOR_FINAL", label: "Consumidor Final" },
] as const;

export const clienteSchema = z.object({
  tipo_identificacion: z.enum(
    ["RUC", "CEDULA", "PASAPORTE", "CONSUMIDOR_FINAL"],
    {
      required_error: "Selecciona un tipo de identificación",
    }
  ),
  identificacion: z.string().min(1, "La identificación es requerida"),
  razon_social: z.string().min(1, "La razón social es requerida"),
  nombre_comercial: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
