-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Las tablas serán creadas por Prisma Migrate
-- Este script es para configuraciones adicionales de PostgreSQL

-- Crear índices adicionales para optimización
CREATE INDEX IF NOT EXISTS idx_facturas_fecha_estado ON "Factura"("fechaEmision", "estado");
CREATE INDEX IF NOT EXISTS idx_clientes_identificacion ON "Cliente"("identificacion");

-- Función para generar número de factura secuencial
CREATE OR REPLACE FUNCTION generar_numero_factura(company_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  ultimo_numero INTEGER;
  nuevo_numero TEXT;
BEGIN
  -- Obtener el último número de factura para esta empresa
  SELECT COALESCE(
    MAX(CAST(SUBSTRING("numeroFactura" FROM '[0-9]+') AS INTEGER)), 
    0
  ) INTO ultimo_numero
  FROM "Factura"
  WHERE "companyId" = company_id_param;
  
  -- Incrementar y formatear con ceros a la izquierda
  nuevo_numero := LPAD((ultimo_numero + 1)::TEXT, 9, '0');
  
  RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular clave de acceso (simplificada)
-- En producción, esto debe seguir el algoritmo exacto del SRI
CREATE OR REPLACE FUNCTION generar_clave_acceso(
  fecha DATE,
  tipo_comprobante TEXT,
  ruc TEXT,
  ambiente TEXT,
  serie TEXT,
  numero_secuencial TEXT
)
RETURNS TEXT AS $$
DECLARE
  fecha_str TEXT;
  clave_parcial TEXT;
  digito_verificador INTEGER;
BEGIN
  -- Formato: ddmmyyyy
  fecha_str := TO_CHAR(fecha, 'DDMMYYYY');
  
  -- Construir clave parcial (48 dígitos)
  -- Formato simplificado para demo
  clave_parcial := fecha_str || tipo_comprobante || ruc || ambiente || serie || numero_secuencial;
  
  -- Calcular dígito verificador (módulo 11)
  -- Implementación simplificada
  digito_verificador := (LENGTH(clave_parcial) % 11);
  
  RETURN clave_parcial || digito_verificador::TEXT;
END;
$$ LANGUAGE plpgsql;
