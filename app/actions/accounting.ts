"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  cuentaContableSchema,
  asientoContableSchema,
  type CuentaContableInput,
  type AsientoContableInput,
} from "@/lib/validations/contabilidad";

// Obtener empresa del usuario autenticado
async function getCompanyId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  const company = await prisma.empresa.findFirst({
    where: { user_id: user.id },
  });

  if (!company) {
    throw new Error("Empresa no encontrada");
  }

  return company.id;
}

// ============ CUENTAS CONTABLES ============

export async function getCuentasContables() {
  try {
    const empresa_id = await getCompanyId();

    const cuentas = await prisma.cuentaContable.findMany({
      where: { empresa_id: empresa_id },
      orderBy: { codigo: "asc" },
      include: {
        cuenta_padre: true,
      },
    });

    return { success: true, data: cuentas };
  } catch (error) {
    console.error("[v0] Error al obtener cuentas:", error);
    return { success: false, error: "Error al obtener cuentas contables" };
  }
}

export async function getCuentasMovimiento() {
  try {
    const empresa_id = await getCompanyId();

    const cuentas = await prisma.cuentaContable.findMany({
      where: {
        empresa_id,
        acepta_movimiento: true,
        activa: true,
      },
      orderBy: { codigo: "asc" },
    });

    return { success: true, data: cuentas };
  } catch (error) {
    console.error("[v0] Error al obtener cuentas de movimiento:", error);
    return { success: false, error: "Error al obtener cuentas" };
  }
}

export async function createCuentaContable(data: CuentaContableInput) {
  try {
    const empresa_id = await getCompanyId();
    const validated = cuentaContableSchema.parse(data);

    const cuenta = await prisma.cuentaContable.create({
      data: {
        ...validated,
        empresa_id,
      },
    });

    revalidatePath("/dashboard/contabilidad/cuentas");
    return { success: true, data: cuenta };
  } catch (error) {
    console.error("[v0] Error al crear cuenta:", error);
    return { success: false, error: "Error al crear cuenta contable" };
  }
}

export async function updateCuentaContable(
  id: string,
  data: CuentaContableInput
) {
  try {
    const empresa_id = await getCompanyId();
    const validated = cuentaContableSchema.parse(data);

    const cuenta = await prisma.cuentaContable.update({
      where: { id, empresa_id },
      data: validated,
    });

    revalidatePath("/dashboard/contabilidad/cuentas");
    return { success: true, data: cuenta };
  } catch (error) {
    console.error("[v0] Error al actualizar cuenta:", error);
    return { success: false, error: "Error al actualizar cuenta contable" };
  }
}

export async function deleteCuentaContable(id: string) {
  try {
    const empresa_id = await getCompanyId();

    await prisma.cuentaContable.delete({
      where: { id, empresa_id },
    });

    revalidatePath("/dashboard/contabilidad/cuentas");
    return { success: true };
  } catch (error) {
    console.error("[v0] Error al eliminar cuenta:", error);
    return { success: false, error: "Error al eliminar cuenta contable" };
  }
}

// ============ ASIENTOS CONTABLES ============

export async function getAsientosContables() {
  try {
    const empresa_id = await getCompanyId();

    const asientos = await prisma.asientoContable.findMany({
      where: { empresa_id },
      orderBy: { fecha: "desc" },
      include: {
        detalles: {
          include: {
            cuenta: true,
          },
        },
      },
    });

    return { success: true, data: asientos };
  } catch (error) {
    console.error("[v0] Error al obtener asientos:", error);
    return { success: false, error: "Error al obtener asientos contables" };
  }
}

export async function getAsientoContable(id: string) {
  try {
    const empresa_id = await getCompanyId();

    const asiento = await prisma.asientoContable.findUnique({
      where: { id, empresa_id },
      include: {
        detalles: {
          include: {
            cuenta: true,
          },
        },
        factura: {
          include: {
            cliente: true,
          },
        },
      },
    });

    if (!asiento) {
      return { success: false, error: "Asiento no encontrado" };
    }

    return { success: true, data: asiento };
  } catch (error) {
    console.error("[v0] Error al obtener asiento:", error);
    return { success: false, error: "Error al obtener asiento contable" };
  }
}

export async function createAsientoContable(data: AsientoContableInput) {
  try {
    const empresa_id = await getCompanyId();
    const validated = asientoContableSchema.parse(data);

    // Generar número de asiento
    const result = await prisma.$queryRaw<[{ generar_numero_asiento: string }]>`
      SELECT generar_numero_asiento(${empresa_id})
    `;
    const numero = result[0].generar_numero_asiento;

    const asiento = await prisma.asientoContable.create({
      data: {
        empresa_id,
        numero,
        fecha: validated.fecha,
        descripcion: validated.descripcion,
        tipo_asiento: "MANUAL",
        detalles: {
          create: validated.detalles,
        },
      },
      include: {
        detalles: {
          include: {
            cuenta: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/contabilidad/asientos");
    return { success: true, data: asiento };
  } catch (error) {
    console.error("[v0] Error al crear asiento:", error);
    return { success: false, error: "Error al crear asiento contable" };
  }
}

export async function contabilizarAsiento(id: string) {
  try {
    const empresa_id = await getCompanyId();

    const asiento = await prisma.asientoContable.update({
      where: { id, empresa_id },
      data: { estado: "CONTABILIZADO" },
    });

    revalidatePath("/dashboard/contabilidad/asientos");
    return { success: true, data: asiento };
  } catch (error) {
    console.error("[v0] Error al contabilizar asiento:", error);
    return { success: false, error: "Error al contabilizar asiento" };
  }
}

export async function anularAsiento(id: string) {
  try {
    const empresa_id = await getCompanyId();

    const asiento = await prisma.asientoContable.update({
      where: { id, empresa_id },
      data: { estado: "ANULADO" },
    });

    revalidatePath("/dashboard/contabilidad/asientos");
    return { success: true, data: asiento };
  } catch (error) {
    console.error("[v0] Error al anular asiento:", error);
    return { success: false, error: "Error al anular asiento" };
  }
}
