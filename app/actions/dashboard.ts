"use server";

import { prisma } from "@/lib/prisma";
import { getCompanyId } from "./customers";

export async function getDashboardStats() {
  try {
    const empresa_id = await getCompanyId();

    const [totalClientes, totalProductos, totalFacturas, facturasRecientes] =
      await Promise.all([
        prisma.cliente.count({ where: { empresa_id } }),
        prisma.producto.count({ where: { empresa_id } }),
        prisma.factura.count({ where: { empresa_id } }),
        prisma.factura.findMany({
          where: { empresa_id },
          include: {
            cliente: true,
          },
          // orderBy: { created_at: "desc" },
          take: 5,
        }),
      ]);

    // Calcular ingresos del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const facturasDelMes = await prisma.factura.findMany({
      where: {
        empresa_id,
        fecha_emision: {
          gte: inicioMes,
        },
        estado: {
          in: ["EMITIDA", "AUTORIZADA"],
        },
      },
    });

    const ingresosMes = facturasDelMes.reduce(
      (total, factura) => total + factura.total,
      0
    );

    return {
      success: true,
      data: {
        totalClientes,
        totalProductos,
        totalFacturas,
        ingresosMes,
        facturasRecientes,
      },
    };
  } catch (error) {
    console.error("[v0] Error al obtener estadísticas:", error);
    return { success: false, error: "Error al obtener estadísticas" };
  }
}
