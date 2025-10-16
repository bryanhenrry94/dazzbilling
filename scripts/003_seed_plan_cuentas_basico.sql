-- Plan de cuentas básico para Ecuador
-- Este script inserta un plan de cuentas básico que puede ser personalizado por cada empresa

-- Nota: Este script debe ejecutarse después de crear una empresa
-- Reemplazar 'COMPANY_ID_AQUI' con el ID real de la empresa

-- ACTIVOS (1)
INSERT INTO "CuentaContable" (id, "companyId", codigo, nombre, "tipoCuenta", nivel, "aceptaMovimiento", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1', 'ACTIVO', 'ACTIVO', 1, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1', 'ACTIVO CORRIENTE', 'ACTIVO', 2, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.01', 'CAJA Y BANCOS', 'ACTIVO', 3, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.01.01', 'Caja General', 'ACTIVO', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.01.02', 'Caja Chica', 'ACTIVO', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.02', 'BANCOS', 'ACTIVO', 3, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.02.01', 'Banco Pichincha', 'ACTIVO', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.03', 'CUENTAS POR COBRAR', 'ACTIVO', 3, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.03.01', 'Clientes', 'ACTIVO', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.04', 'INVENTARIOS', 'ACTIVO', 3, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '1.1.04.01', 'Inventario de Mercaderías', 'ACTIVO', 4, true, NOW(), NOW());

-- PASIVOS (2)
INSERT INTO "CuentaContable" (id, "companyId", codigo, nombre, "tipoCuenta", nivel, "aceptaMovimiento", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '2', 'PASIVO', 'PASIVO', 1, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '2.1', 'PASIVO CORRIENTE', 'PASIVO', 2, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '2.1.01', 'CUENTAS POR PAGAR', 'PASIVO', 3, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '2.1.01.01', 'Proveedores', 'PASIVO', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '2.1.02', 'IMPUESTOS POR PAGAR', 'PASIVO', 3, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '2.1.02.01', 'IVA por Pagar', 'PASIVO', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '2.1.02.02', 'Retenciones por Pagar', 'PASIVO', 4, true, NOW(), NOW());

-- PATRIMONIO (3)
INSERT INTO "CuentaContable" (id, "companyId", codigo, nombre, "tipoCuenta", nivel, "aceptaMovimiento", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '3', 'PATRIMONIO', 'PATRIMONIO', 1, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '3.1', 'CAPITAL', 'PATRIMONIO', 2, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '3.1.01', 'Capital Social', 'PATRIMONIO', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '3.2', 'RESULTADOS', 'PATRIMONIO', 2, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '3.2.01', 'Utilidad del Ejercicio', 'PATRIMONIO', 3, true, NOW(), NOW());

-- INGRESOS (4)
INSERT INTO "CuentaContable" (id, "companyId", codigo, nombre, "tipoCuenta", nivel, "aceptaMovimiento", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '4', 'INGRESOS', 'INGRESO', 1, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '4.1', 'INGRESOS OPERACIONALES', 'INGRESO', 2, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '4.1.01', 'Ventas', 'INGRESO', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '4.1.02', 'Prestación de Servicios', 'INGRESO', 3, true, NOW(), NOW());

-- GASTOS (5)
INSERT INTO "CuentaContable" (id, "companyId", codigo, nombre, "tipoCuenta", nivel, "aceptaMovimiento", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '5', 'GASTOS', 'GASTO', 1, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '5.1', 'COSTO DE VENTAS', 'GASTO', 2, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '5.1.01', 'Costo de Ventas', 'GASTO', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '5.2', 'GASTOS OPERACIONALES', 'GASTO', 2, false, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '5.2.01', 'Sueldos y Salarios', 'GASTO', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '5.2.02', 'Servicios Básicos', 'GASTO', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'COMPANY_ID_AQUI', '5.2.03', 'Arriendo', 'GASTO', 3, true, NOW(), NOW());
