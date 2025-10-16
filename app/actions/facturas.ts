"use server"

import { prisma } from "@/lib/prisma"
import { facturaSchema } from "@/lib/validations/factura"
import { revalidatePath } from "next/cache"
import { getCompanyId } from "./clientes"

const IVA_RATE = 0.15 // 15% IVA en Ecuador

function calcularTotales(detalles: any[]) {
  let subtotal = 0
  let descuentoTotal = 0
  let ivaTotal = 0
  let iceTotal = 0

  for (const detalle of detalles) {
    const subtotalDetalle = detalle.cantidad * detalle.precioUnitario
    const descuentoDetalle = (subtotalDetalle * detalle.descuento) / 100
    const baseImponible = subtotalDetalle - descuentoDetalle

    subtotal += subtotalDetalle
    descuentoTotal += descuentoDetalle

    if (detalle.producto.iva) {
      ivaTotal += baseImponible * IVA_RATE
    }

    // ICE se calcularía aquí si aplica
    if (detalle.producto.ice) {
      // Implementación simplificada
      iceTotal += baseImponible * 0.05
    }
  }

  const subtotalSinImpuestos = subtotal - descuentoTotal
  const total = subtotalSinImpuestos + ivaTotal + iceTotal

  return {
    subtotal,
    descuento: descuentoTotal,
    subtotalSinImpuestos,
    iva: ivaTotal,
    ice: iceTotal,
    total,
  }
}

export async function getFacturas() {
  try {
    const companyId = await getCompanyId()

    const facturas = await prisma.factura.findMany({
      where: { companyId },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: facturas }
  } catch (error) {
    console.error("[v0] Error al obtener facturas:", error)
    return { success: false, error: "Error al obtener facturas" }
  }
}

export async function getFactura(id: string) {
  try {
    const companyId = await getCompanyId()

    const factura = await prisma.factura.findUnique({
      where: { id, companyId },
      include: {
        cliente: true,
        company: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    })

    if (!factura) {
      return { success: false, error: "Factura no encontrada" }
    }

    return { success: true, data: factura }
  } catch (error) {
    console.error("[v0] Error al obtener factura:", error)
    return { success: false, error: "Error al obtener factura" }
  }
}

export async function createFactura(data: unknown) {
  try {
    const companyId = await getCompanyId()

    const validated = facturaSchema.parse(data)

    // Obtener productos para calcular totales
    const productos = await prisma.producto.findMany({
      where: {
        id: { in: validated.detalles.map((d) => d.productoId) },
        companyId,
      },
    })

    // Preparar detalles con información de productos
    const detallesConProductos = validated.detalles.map((detalle) => {
      const producto = productos.find((p) => p.id === detalle.productoId)
      if (!producto) throw new Error("Producto no encontrado")

      const subtotalDetalle = detalle.cantidad * detalle.precioUnitario
      const descuentoDetalle = (subtotalDetalle * detalle.descuento) / 100
      const baseImponible = subtotalDetalle - descuentoDetalle

      let ivaDetalle = 0
      let iceDetalle = 0

      if (producto.iva) {
        ivaDetalle = baseImponible * IVA_RATE
      }

      if (producto.ice) {
        iceDetalle = baseImponible * 0.05
      }

      const totalDetalle = baseImponible + ivaDetalle + iceDetalle

      return {
        ...detalle,
        producto,
        subtotal: subtotalDetalle,
        iva: ivaDetalle,
        ice: iceDetalle,
        total: totalDetalle,
      }
    })

    const totales = calcularTotales(detallesConProductos)

    // Generar número de factura
    const ultimaFactura = await prisma.factura.findFirst({
      where: { companyId },
      orderBy: { numeroFactura: "desc" },
    })

    const ultimoNumero = ultimaFactura ? Number.parseInt(ultimaFactura.numeroFactura) : 0
    const nuevoNumero = (ultimoNumero + 1).toString().padStart(9, "0")

    // Crear factura con detalles
    const factura = await prisma.factura.create({
      data: {
        companyId,
        clienteId: validated.clienteId,
        numeroFactura: nuevoNumero,
        observaciones: validated.observaciones,
        ...totales,
        detalles: {
          create: detallesConProductos.map((detalle) => ({
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            descuento: detalle.descuento,
            subtotal: detalle.subtotal,
            iva: detalle.iva,
            ice: detalle.ice,
            total: detalle.total,
          })),
        },
      },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    })

    revalidatePath("/dashboard/facturas")
    return { success: true, data: factura }
  } catch (error) {
    console.error("[v0] Error al crear factura:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Error al crear factura" }
  }
}

export async function deleteFactura(id: string) {
  try {
    const companyId = await getCompanyId()

    await prisma.factura.delete({
      where: { id, companyId },
    })

    revalidatePath("/dashboard/facturas")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error al eliminar factura:", error)
    return { success: false, error: "Error al eliminar factura" }
  }
}

export async function emitirFactura(id: string) {
  try {
    const companyId = await getCompanyId()

    const factura = await prisma.factura.update({
      where: { id, companyId },
      data: { estado: "EMITIDA" },
    })

    revalidatePath("/dashboard/facturas")
    return { success: true, data: factura }
  } catch (error) {
    console.error("[v0] Error al emitir factura:", error)
    return { success: false, error: "Error al emitir factura" }
  }
}
