import express from "express";
import path from "path";
import dotenv from "dotenv";

import productsRouter from "./routes/products.js";
import purchasesRouter from "./routes/purchases.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static
app.use("/public", express.static(path.join(process.cwd(), "src", "public")));

// Home
app.get("/", (req, res) => res.redirect("/products"));

// Routes
app.use("/products", productsRouter);
app.use("/purchases", purchasesRouter);

// 404
app.use((req, res) => res.status(404).send("404 - Page not found"));

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).send(err?.message || "Internal Server Error");
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
