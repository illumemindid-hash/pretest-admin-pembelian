-- =========================
-- TABLE: products
-- =========================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- TABLE: product_stocks
-- =========================
CREATE TABLE IF NOT EXISTS product_stocks (
  product_id INT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  qty INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- TABLE: purchases
-- =========================
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(60) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMP NULL
);

-- =========================
-- TABLE: purchase_items
-- =========================
CREATE TABLE IF NOT EXISTS purchase_items (
  id SERIAL PRIMARY KEY,
  purchase_id INT NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  qty INT NOT NULL CHECK (qty > 0),
  price NUMERIC(12,2) NOT NULL DEFAULT 0
);

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id
  ON purchase_items(purchase_id);

CREATE INDEX IF NOT EXISTS idx_purchase_items_product_id
  ON purchase_items(product_id);
