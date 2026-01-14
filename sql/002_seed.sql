-- =========================
-- SEED PRODUCTS (10 DATA)
-- =========================
INSERT INTO products (sku, name, price) VALUES
('P001','Produk A',10000),
('P002','Produk B',12000),
('P003','Produk C',15000),
('P004','Produk D',20000),
('P005','Produk E',25000),
('P006','Produk F',30000),
('P007','Produk G',35000),
('P008','Produk H',40000),
('P009','Produk I',45000),
('P010','Produk J',50000)
ON CONFLICT (sku) DO NOTHING;

-- =========================
-- INITIAL STOCK (100 EACH)
-- =========================
INSERT INTO product_stocks (product_id, qty)
SELECT id, 100 FROM products
ON CONFLICT (product_id) DO NOTHING;
