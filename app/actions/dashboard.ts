"use server"

import { prisma } from "@/lib/prisma"
import { getCompanyId } from "./clientes"

export async function getDashboardStats() {
  try {
    const companyId = await getCompanyId()

    const [totalClientes, totalProductos, totalFacturas, facturasRecientes] = await Promise.all([
      prisma.cliente.count({ where: { companyId } }),
      prisma.producto.count({ where: { companyId } }),
      prisma.factura.count({ where: { companyId } }),
      prisma.factura.findMany({
        where: { companyId },
        include: {
          cliente: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    // Calcular ingresos del mes actual
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const facturasDelMes = await prisma.factura.findMany({
      where: {
        companyId,
        fechaEmision: {
          gte: inicioMes,
        },
        estado: {
          in: ["EMITIDA", "AUTORIZADA"],
        },
      },
    })

    const ingresosMes = facturasDelMes.reduce((total, factura) => total + factura.total, 0)

    return {
      success: true,
      data: {
        totalClientes,
        totalProductos,
        totalFacturas,
        ingresosMes,
        facturasRecientes,
      },
    }
  } catch (error) {
    console.error("[v0] Error al obtener estadísticas:", error)
    return { success: false, error: "Error al obtener estadísticas" }
  }
}
