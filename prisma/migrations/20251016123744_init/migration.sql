-- CreateEnum
CREATE TYPE "TipoCuenta" AS ENUM ('ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO');

-- CreateEnum
CREATE TYPE "TipoAsiento" AS ENUM ('MANUAL', 'AUTOMATICO');

-- CreateEnum
CREATE TYPE "EstadoAsiento" AS ENUM ('BORRADOR', 'CONTABILIZADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('BORRADOR', 'EMITIDA', 'AUTORIZADA', 'ANULADA');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "nombreComercial" TEXT,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT NOT NULL,
    "obligadoContabilidad" BOOLEAN NOT NULL DEFAULT false,
    "agenteRetencion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tipoIdentificacion" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "nombreComercial" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "iva" BOOLEAN NOT NULL DEFAULT true,
    "ice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "numeroFactura" TEXT NOT NULL,
    "claveAcceso" TEXT,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotalSinImpuestos" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL,
    "ice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'BORRADOR',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleFactura" (
    "id" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL,
    "ice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleFactura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentaContable" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoCuenta" "TipoCuenta" NOT NULL,
    "nivel" INTEGER NOT NULL,
    "cuentaPadreId" TEXT,
    "aceptaMovimiento" BOOLEAN NOT NULL DEFAULT true,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsientoContable" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT NOT NULL,
    "tipoAsiento" "TipoAsiento" NOT NULL DEFAULT 'MANUAL',
    "facturaId" TEXT,
    "estado" "EstadoAsiento" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsientoContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleAsiento" (
    "id" TEXT NOT NULL,
    "asientoId" TEXT NOT NULL,
    "cuentaId" TEXT NOT NULL,
    "descripcion" TEXT,
    "debe" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "haber" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "DetalleAsiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_ruc_key" ON "Company"("ruc");

-- CreateIndex
CREATE INDEX "Company_userId_idx" ON "Company"("userId");

-- CreateIndex
CREATE INDEX "Cliente_companyId_idx" ON "Cliente"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_companyId_identificacion_key" ON "Cliente"("companyId", "identificacion");

-- CreateIndex
CREATE INDEX "Producto_companyId_idx" ON "Producto"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_companyId_codigo_key" ON "Producto"("companyId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_claveAcceso_key" ON "Factura"("claveAcceso");

-- CreateIndex
CREATE INDEX "Factura_companyId_idx" ON "Factura"("companyId");

-- CreateIndex
CREATE INDEX "Factura_clienteId_idx" ON "Factura"("clienteId");

-- CreateIndex
CREATE INDEX "Factura_fechaEmision_idx" ON "Factura"("fechaEmision");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_companyId_numeroFactura_key" ON "Factura"("companyId", "numeroFactura");

-- CreateIndex
CREATE INDEX "DetalleFactura_facturaId_idx" ON "DetalleFactura"("facturaId");

-- CreateIndex
CREATE INDEX "DetalleFactura_productoId_idx" ON "DetalleFactura"("productoId");

-- CreateIndex
CREATE INDEX "CuentaContable_companyId_idx" ON "CuentaContable"("companyId");

-- CreateIndex
CREATE INDEX "CuentaContable_tipoCuenta_idx" ON "CuentaContable"("tipoCuenta");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaContable_companyId_codigo_key" ON "CuentaContable"("companyId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "AsientoContable_facturaId_key" ON "AsientoContable"("facturaId");

-- CreateIndex
CREATE INDEX "AsientoContable_companyId_idx" ON "AsientoContable"("companyId");

-- CreateIndex
CREATE INDEX "AsientoContable_fecha_idx" ON "AsientoContable"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "AsientoContable_companyId_numero_key" ON "AsientoContable"("companyId", "numero");

-- CreateIndex
CREATE INDEX "DetalleAsiento_asientoId_idx" ON "DetalleAsiento"("asientoId");

-- CreateIndex
CREATE INDEX "DetalleAsiento_cuentaId_idx" ON "DetalleAsiento"("cuentaId");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaContable" ADD CONSTRAINT "CuentaContable_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaContable" ADD CONSTRAINT "CuentaContable_cuentaPadreId_fkey" FOREIGN KEY ("cuentaPadreId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAsiento" ADD CONSTRAINT "DetalleAsiento_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "AsientoContable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAsiento" ADD CONSTRAINT "DetalleAsiento_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaContable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
