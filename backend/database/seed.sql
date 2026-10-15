USE catalogo_tienda;

INSERT INTO categories (name)
VALUES ('Laptops'), ('Monitores'), ('Accesorios')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'MacBook Air M2 13 pulgadas', 'LAP-MBA-001', 'Chip M2, 8GB RAM unificada, 256GB SSD, pantalla Liquid Retina.', 1199.00, 8, categories.id
FROM categories
WHERE categories.name = 'Laptops'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LAP-MBA-001');

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'Dell XPS 13 Plus', 'LAP-XPS-002', 'Intel Core i7 13va Gen, 16GB RAM, acabado en aluminio platino.', 1349.50, 3, categories.id
FROM categories
WHERE categories.name = 'Laptops'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LAP-XPS-002');

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'Monitor LG UltraWide 34 pulgadas WQHD', 'MON-LG-001', 'Panel IPS curvo 21:9, HDR10, 100Hz, puertos USB-C y HDMI.', 489.00, 0, categories.id
FROM categories
WHERE categories.name = 'Monitores'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MON-LG-001');

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'Monitor ASUS ProArt 27 pulgadas 4K', 'MON-ASUS-002', 'Calibración de color de fábrica Delta E menor a 2, 100% sRGB, DisplayPort.', 520.00, 6, categories.id
FROM categories
WHERE categories.name = 'Monitores'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MON-ASUS-002');

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'Mouse Logitech MX Master 3S', 'ACC-LOG-001', 'Sensor óptico 8K DPI silencioso, rueda MagSpeed, Bluetooth y Bolt.', 99.99, 14, categories.id
FROM categories
WHERE categories.name = 'Accesorios'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ACC-LOG-001');

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'Teclado Mecánico Keychron K2 V2', 'ACC-KEY-002', 'Formato 75%, switches Gateron Brown intercambiables, Bluetooth 5.1.', 89.00, 2, categories.id
FROM categories
WHERE categories.name = 'Accesorios'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ACC-KEY-002');

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'Hub USB-C Satechi Multi-puerto 8 en 1', 'ACC-SAT-003', 'Salida HDMI 4K 60Hz, Ethernet Gigabit, lector SD/MicroSD y PD 100W.', 65.00, 0, categories.id
FROM categories
WHERE categories.name = 'Accesorios'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ACC-SAT-003');

INSERT INTO products (name, sku, description, price, stock, categoryId)
SELECT 'Base de Aluminio Ergonómica para Laptop', 'ACC-BAS-004', 'Estructura plegable ventilada compatible con equipos de 11 a 17 pulgadas.', 34.50, 22, categories.id
FROM categories
WHERE categories.name = 'Accesorios'
  AND NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ACC-BAS-004');