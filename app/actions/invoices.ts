"use server";

import { prisma } from "@/lib/prisma";
import { facturaSchema } from "@/lib/validations/factura";
import { revalidatePath } from "next/cache";
import { getCompanyId } from "./customers";

const IVA_RATE = 0.15; // 15% IVA en Ecuador

function calcularTotales(detalles: any[]) {
  let subtotal = 0;
  let descuentoTotal = 0;
  let ivaTotal = 0;
  let iceTotal = 0;

  for (const detalle of detalles) {
    const subtotalDetalle = detalle.cantidad * detalle.precioUnitario;
    const descuentoDetalle = (subtotalDetalle * detalle.descuento) / 100;
    const baseImponible = subtotalDetalle - descuentoDetalle;

    subtotal += subtotalDetalle;
    descuentoTotal += descuentoDetalle;

    if (detalle.producto.iva) {
      ivaTotal += baseImponible * IVA_RATE;
    }

    // ICE se calcularía aquí si aplica
    if (detalle.producto.ice) {
      // Implementación simplificada
      iceTotal += baseImponible * 0.05;
    }
  }

  const subtotalSinImpuestos = subtotal - descuentoTotal;
  const total = subtotalSinImpuestos + ivaTotal + iceTotal;

  return {
    subtotal,
    descuento: descuentoTotal,
    subtotalSinImpuestos,
    iva: ivaTotal,
    ice: iceTotal,
    total,
  };
}

export async function getFacturas() {
  try {
    const empresa_id = await getCompanyId();

    const facturas = await prisma.factura.findMany({
      where: { empresa_id },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
      // orderBy: { created_at: "desc" },
    });

    return { success: true, data: facturas };
  } catch (error) {
    console.error("[v0] Error al obtener facturas:", error);
    return { success: false, error: "Error al obtener facturas" };
  }
}

export async function getFactura(id: string) {
  try {
    const empresa_id = await getCompanyId();

    const factura = await prisma.factura.findUnique({
      where: { id, empresa_id },
      include: {
        cliente: true,
        empresa: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!factura) {
      return { success: false, error: "Factura no encontrada" };
    }

    return { success: true, data: factura };
  } catch (error) {
    console.error("[v0] Error al obtener factura:", error);
    return { success: false, error: "Error al obtener factura" };
  }
}

export async function createFactura(data: unknown) {
  try {
    const empresa_id = await getCompanyId();

    const validated = facturaSchema.parse(data);

    // Obtener productos para calcular totales
    const productos = await prisma.producto.findMany({
      where: {
        id: { in: validated.detalles.map((d) => d.producto_id) },
        empresa_id,
      },
    });

    // Preparar detalles con información de productos
    const detallesConProductos = validated.detalles.map((detalle) => {
      const producto = productos.find((p) => p.id === detalle.producto_id);
      if (!producto) throw new Error("Producto no encontrado");

      const subtotalDetalle = detalle.cantidad * detalle.precio_unitario;
      const descuentoDetalle = (subtotalDetalle * detalle.descuento) / 100;
      const baseImponible = subtotalDetalle - descuentoDetalle;

      let ivaDetalle = 0;
      let iceDetalle = 0;

      if (producto.iva) {
        ivaDetalle = baseImponible * IVA_RATE;
      }

      if (producto.ice) {
        iceDetalle = baseImponible * 0.05;
      }

      const totalDetalle = baseImponible + ivaDetalle + iceDetalle;

      return {
        ...detalle,
        producto,
        subtotal: subtotalDetalle,
        iva: ivaDetalle,
        ice: iceDetalle,
        total: totalDetalle,
      };
    });

    const totales = calcularTotales(detallesConProductos);

    // Generar número de factura
    const ultimaFactura = await prisma.factura.findFirst({
      where: { empresa_id },
      orderBy: { numero_factura: "desc" },
    });

    const ultimoNumero = ultimaFactura
      ? Number.parseInt(ultimaFactura.numero_factura)
      : 0;
    const nuevoNumero = (ultimoNumero + 1).toString().padStart(9, "0");

    // Crear factura con detalles
    const factura = await prisma.factura.create({
      data: {
        empresa_id,
        cliente_id: validated.cliente_id,
        numero_factura: nuevoNumero,
        observaciones: validated.observaciones,
        subtotal: totales.subtotal,
        descuento: totales.descuento,
        subtotal_sin_impuestos: totales.subtotalSinImpuestos,
        iva: totales.iva,
        ice: totales.ice,
        total: totales.total,
        detalles: {
          create: detallesConProductos.map((detalle) => ({
            producto_id: detalle.producto_id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
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
    });

    revalidatePath("/dashboard/facturas");
    return { success: true, data: factura };
  } catch (error) {
    console.error("[v0] Error al crear factura:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al crear factura" };
  }
}

export async function deleteFactura(id: string) {
  try {
    const empresa_id = await getCompanyId();

    await prisma.factura.delete({
      where: { id, empresa_id },
    });

    revalidatePath("/dashboard/facturas");
    return { success: true };
  } catch (error) {
    console.error("[v0] Error al eliminar factura:", error);
    return { success: false, error: "Error al eliminar factura" };
  }
}

export async function emitirFactura(id: string) {
  try {
    const empresa_id = await getCompanyId();

    const factura = await prisma.factura.update({
      where: { id, empresa_id },
      data: { estado: "EMITIDA" },
    });

    revalidatePath("/dashboard/facturas");
    return { success: true, data: factura };
  } catch (error) {
    console.error("[v0] Error al emitir factura:", error);
    return { success: false, error: "Error al emitir factura" };
  }
}
