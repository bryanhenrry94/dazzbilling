"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { clienteSchema } from "@/lib/validations/cliente";
import { revalidatePath } from "next/cache";

export async function getCompanyId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  // Buscar o crear empresa para el usuario
  let empresa = await prisma.empresa.findFirst({
    where: { user_id: user.id },
  });

  if (!empresa) {
    // Crear empresa por defecto
    empresa = await prisma.empresa.create({
      data: {
        user_id: user.id,
        ruc: "9999999999999",
        razon_social: "Mi Empresa",
        direccion: "Dirección por defecto",
        email: user.email || "email@ejemplo.com",
      },
    });
  }

  return empresa.id;
}

export async function getClientes() {
  try {
    const empresa_id = await getCompanyId();

    const clientes = await prisma.cliente.findMany({
      where: { empresa_id },
    });

    return { success: true, data: clientes };
  } catch (error) {
    console.error("[v0] Error al obtener clientes:", error);
    return { success: false, error: "Error al obtener clientes" };
  }
}

export async function createCliente(data: unknown) {
  try {
    const empresa_id = await getCompanyId();

    const validated = clienteSchema.parse(data);

    const cliente = await prisma.cliente.create({
      data: {
        ...validated,
        empresa_id,
      },
    });

    revalidatePath("/dashboard/clientes");
    return { success: true, data: cliente };
  } catch (error) {
    console.error("[v0] Error al crear cliente:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al crear cliente" };
  }
}

export async function updateCliente(id: string, data: unknown) {
  try {
    const empresa_id = await getCompanyId();

    const validated = clienteSchema.parse(data);

    const cliente = await prisma.cliente.update({
      where: { id, empresa_id },
      data: validated,
    });

    revalidatePath("/dashboard/clientes");
    return { success: true, data: cliente };
  } catch (error) {
    console.error("[v0] Error al actualizar cliente:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al actualizar cliente" };
  }
}

export async function deleteCliente(id: string) {
  try {
    const empresa_id = await getCompanyId();

    await prisma.cliente.delete({
      where: { id, empresa_id },
    });

    revalidatePath("/dashboard/clientes");
    return { success: true };
  } catch (error) {
    console.error("[v0] Error al eliminar cliente:", error);
    return { success: false, error: "Error al eliminar cliente" };
  }
}
