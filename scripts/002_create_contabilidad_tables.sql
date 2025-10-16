-- Crear tabla de cuentas contables
CREATE TABLE IF NOT EXISTS "CuentaContable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoCuenta" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "cuentaPadreId" TEXT,
    "aceptaMovimiento" BOOLEAN NOT NULL DEFAULT true,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CuentaContable_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE,
    CONSTRAINT "CuentaContable_cuentaPadreId_fkey" FOREIGN KEY ("cuentaPadreId") REFERENCES "CuentaContable" ("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "CuentaContable_companyId_codigo_key" ON "CuentaContable"("companyId", "codigo");
CREATE INDEX IF NOT EXISTS "CuentaContable_companyId_idx" ON "CuentaContable"("companyId");
CREATE INDEX IF NOT EXISTS "CuentaContable_tipoCuenta_idx" ON "CuentaContable"("tipoCuenta");

-- Crear tabla de asientos contables
CREATE TABLE IF NOT EXISTS "AsientoContable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT NOT NULL,
    "tipoAsiento" TEXT NOT NULL DEFAULT 'MANUAL',
    "facturaId" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AsientoContable_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE,
    CONSTRAINT "AsientoContable_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "AsientoContable_companyId_numero_key" ON "AsientoContable"("companyId", "numero");
CREATE UNIQUE INDEX IF NOT EXISTS "AsientoContable_facturaId_key" ON "AsientoContable"("facturaId");
CREATE INDEX IF NOT EXISTS "AsientoContable_companyId_idx" ON "AsientoContable"("companyId");
CREATE INDEX IF NOT EXISTS "AsientoContable_fecha_idx" ON "AsientoContable"("fecha");

-- Crear tabla de detalles de asiento
CREATE TABLE IF NOT EXISTS "DetalleAsiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "asientoId" TEXT NOT NULL,
    "cuentaId" TEXT NOT NULL,
    "descripcion" TEXT,
    "debe" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "haber" DOUBLE PRECISION NOT NULL DEFAULT 0,
    CONSTRAINT "DetalleAsiento_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "AsientoContable" ("id") ON DELETE CASCADE,
    CONSTRAINT "DetalleAsiento_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "CuentaContable" ("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "DetalleAsiento_asientoId_idx" ON "DetalleAsiento"("asientoId");
CREATE INDEX IF NOT EXISTS "DetalleAsiento_cuentaId_idx" ON "DetalleAsiento"("cuentaId");

-- Función para generar número de asiento secuencial
CREATE OR REPLACE FUNCTION generar_numero_asiento(company_id TEXT)
RETURNS TEXT AS $$
DECLARE
    ultimo_numero INTEGER;
    nuevo_numero TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(numero AS INTEGER)), 0) INTO ultimo_numero
    FROM "AsientoContable"
    WHERE "companyId" = company_id;
    
    nuevo_numero := LPAD((ultimo_numero + 1)::TEXT, 6, '0');
    RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;
