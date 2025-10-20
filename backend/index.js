const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

// ---------------- ROUTES ---------------- //

// Get all fishes
app.get("/fishes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM fishes ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add new fish
app.post("/fishes", async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ error: "Name and price are required" });

  try {
    const result = await pool.query(
      "INSERT INTO fishes (name, price, updated_at) VALUES ($1, $2, NOW()) RETURNING *",
      [name, price]
    );

    const fish = result.rows[0];

    await pool.query(
      "INSERT INTO fish_price_history (fish_id, price, updated_at) VALUES ($1, $2, NOW())",
      [fish.id, price]
    );

    res.status(201).json(fish);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update fish price
app.post("/fishes/:id/price", async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  try {
    await pool.query("UPDATE fishes SET price = $1, updated_at = NOW() WHERE id = $2", [price, id]);
    await pool.query("INSERT INTO fish_price_history(fish_id, price, updated_at) VALUES($1, $2, NOW())", [id, price]);
    res.json({ success: true });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get fishes updated today
app.get("/fishes/updated_today", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM fishes WHERE updated_at >= CURRENT_DATE ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------- START SERVER ---------------- //
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on port ${PORT}`));
