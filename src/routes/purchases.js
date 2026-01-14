import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// list purchases
router.get("/", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*,
      COALESCE(SUM(i.qty * i.price), 0) AS total
    FROM purchases p
    LEFT JOIN purchase_items i ON i.purchase_id = p.id
    GROUP BY p.id
    ORDER BY p.id DESC
  `);
  res.render("purchases/index", { purchases: rows });
});

// form new purchase
router.get("/new", async (req, res) => {
  const { rows: products } = await pool.query(`
    SELECT p.id, p.sku, p.name, p.price, s.qty
    FROM products p
    JOIN product_stocks s ON s.product_id = p.id
    ORDER BY p.name ASC
  `);

  res.render("purchases/new", { products });
});

// create purchase (multi-item) using transaction
router.post("/", async (req, res) => {
  const { invoice_no, items } = req.body;

  const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
  if (!invoice_no) return res.status(400).send("invoice_no is required");
  if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
    return res.status(400).send("items is required");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // create header
    const header = await client.query(
      "INSERT INTO purchases (invoice_no, status) VALUES ($1,'ACTIVE') RETURNING id",
      [invoice_no]
    );
    const purchaseId = header.rows[0].id;

    // insert each item + reduce stock
    for (const it of parsedItems) {
      const productId = Number(it.product_id);
      const qty = Number(it.qty);

      if (!productId || !qty || qty <= 0) throw new Error("Item invalid");

      // lock stock row
      const stockRes = await client.query(
        "SELECT qty FROM product_stocks WHERE product_id=$1 FOR UPDATE",
        [productId]
      );
      if (stockRes.rowCount === 0) throw new Error("Stock not found");
      if (stockRes.rows[0].qty < qty) throw new Error("Stok tidak cukup");

      const prodRes = await client.query("SELECT price FROM products WHERE id=$1", [
        productId,
      ]);
      if (prodRes.rowCount === 0) throw new Error("Product not found");

      await client.query(
        "INSERT INTO purchase_items (purchase_id, product_id, qty, price) VALUES ($1,$2,$3,$4)",
        [purchaseId, productId, qty, prodRes.rows[0].price]
      );

      await client.query(
        "UPDATE product_stocks SET qty = qty - $1, updated_at = NOW() WHERE product_id=$2",
        [qty, productId]
      );
    }

    await client.query("COMMIT");
    res.redirect(`/purchases/${purchaseId}`);
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).send(e.message);
  } finally {
    client.release();
  }
});

// show purchase detail
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const header = await pool.query("SELECT * FROM purchases WHERE id=$1", [id]);
  if (header.rowCount === 0) return res.status(404).send("Purchase not found");

  const items = await pool.query(
    `
    SELECT i.*, p.sku, p.name
    FROM purchase_items i
    JOIN products p ON p.id = i.product_id
    WHERE i.purchase_id=$1
    ORDER BY i.id
  `,
    [id]
  );

  res.render("purchases/show", { purchase: header.rows[0], items: items.rows });
});

// cancel purchase (revert stock) using transaction
router.post("/:id/cancel", async (req, res) => {
  const id = Number(req.params.id);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const header = await client.query(
      "SELECT status FROM purchases WHERE id=$1 FOR UPDATE",
      [id]
    );
    if (header.rowCount === 0) throw new Error("Purchase not found");
    if (header.rows[0].status !== "ACTIVE") throw new Error("Purchase sudah tidak ACTIVE");

    const items = await client.query(
      "SELECT product_id, qty FROM purchase_items WHERE purchase_id=$1",
      [id]
    );

    for (const it of items.rows) {
      await client.query(
        "UPDATE product_stocks SET qty = qty + $1, updated_at = NOW() WHERE product_id=$2",
        [it.qty, it.product_id]
      );
    }

    await client.query(
      "UPDATE purchases SET status='CANCELLED', cancelled_at=NOW() WHERE id=$1",
      [id]
    );

    await client.query("COMMIT");
    res.redirect(`/purchases/${id}`);
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).send(e.message);
  } finally {
    client.release();
  }
});

export default router;
