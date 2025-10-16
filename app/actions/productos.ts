"use server"

import { prisma } from "@/lib/prisma"
import { productoSchema } from "@/lib/validations/producto"
import { revalidatePath } from "next/cache"
import { getCompanyId } from "./clientes"

export async function getProductos() {
  try {
    const companyId = await getCompanyId()

    const productos = await prisma.producto.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: productos }
  } catch (error) {
    console.error("[v0] Error al obtener productos:", error)
    return { success: false, error: "Error al obtener productos" }
  }
}

export async function createProducto(data: unknown) {
  try {
    const companyId = await getCompanyId()

    const validated = productoSchema.parse(data)

    const producto = await prisma.producto.create({
      data: {
        ...validated,
        companyId,
      },
    })

    revalidatePath("/dashboard/productos")
    return { success: true, data: producto }
  } catch (error) {
    console.error("[v0] Error al crear producto:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Error al crear producto" }
  }
}

export async function updateProducto(id: string, data: unknown) {
  try {
    const companyId = await getCompanyId()

    const validated = productoSchema.parse(data)

    const producto = await prisma.producto.update({
      where: { id, companyId },
      data: validated,
    })

    revalidatePath("/dashboard/productos")
    return { success: true, data: producto }
  } catch (error) {
    console.error("[v0] Error al actualizar producto:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Error al actualizar producto" }
  }
}

export async function deleteProducto(id: string) {
  try {
    const companyId = await getCompanyId()

    await prisma.producto.delete({
      where: { id, companyId },
    })

    revalidatePath("/dashboard/productos")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error al eliminar producto:", error)
    return { success: false, error: "Error al eliminar producto" }
  }
}
