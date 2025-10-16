"use server";

import { prisma } from "@/lib/prisma";
import { productoSchema } from "@/lib/validations/producto";
import { revalidatePath } from "next/cache";
import { getCompanyId } from "./customers";

export async function getProductos() {
  try {
    const empresa_id = await getCompanyId();

    const productos = await prisma.producto.findMany({
      where: { empresa_id },
      // orderBy: { created_at: "desc" },
    });

    return { success: true, data: productos };
  } catch (error) {
    console.error("[v0] Error al obtener productos:", error);
    return { success: false, error: "Error al obtener productos" };
  }
}

export async function createProducto(data: unknown) {
  try {
    const empresa_id = await getCompanyId();

    const validated = productoSchema.parse(data);

    const producto = await prisma.producto.create({
      data: {
        ...validated,
        empresa_id,
      },
    });

    revalidatePath("/dashboard/productos");
    return { success: true, data: producto };
  } catch (error) {
    console.error("[v0] Error al crear producto:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al crear producto" };
  }
}

export async function updateProducto(id: string, data: unknown) {
  try {
    const empresa_id = await getCompanyId();

    const validated = productoSchema.parse(data);

    const producto = await prisma.producto.update({
      where: { id, empresa_id },
      data: validated,
    });

    revalidatePath("/dashboard/productos");
    return { success: true, data: producto };
  } catch (error) {
    console.error("[v0] Error al actualizar producto:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al actualizar producto" };
  }
}

export async function deleteProducto(id: string) {
  try {
    const empresa_id = await getCompanyId();

    await prisma.producto.delete({
      where: { id, empresa_id },
    });

    revalidatePath("/dashboard/productos");
    return { success: true };
  } catch (error) {
    console.error("[v0] Error al eliminar producto:", error);
    return { success: false, error: "Error al eliminar producto" };
  }
}
