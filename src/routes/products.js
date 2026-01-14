import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// list products
router.get("/", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, s.qty
    FROM products p
    LEFT JOIN product_stocks s ON s.product_id = p.id
    ORDER BY p.id DESC
  `);
  res.render("products/index", { products: rows });
});

// new product form
router.get("/new", (req, res) => res.render("products/new"));

// create product + stock
router.post("/", async (req, res) => {
  const { sku, name, price, qty } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const inserted = await client.query(
      "INSERT INTO products (sku, name, price) VALUES ($1,$2,$3) RETURNING id",
      [sku, name, Number(price || 0)]
    );

    await client.query(
      "INSERT INTO product_stocks (product_id, qty) VALUES ($1,$2)",
      [inserted.rows[0].id, Number(qty || 0)]
    );

    await client.query("COMMIT");
    res.redirect("/products");
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).send(e.message);
  } finally {
    client.release();
  }
});

export default router;
