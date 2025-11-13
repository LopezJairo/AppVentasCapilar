// backend/server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

// Conexión SQLite
let db;
const initDB = async () => {
  db = await open({
    filename: "./db/database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      tipo TEXT,
      precio REAL,
      stock INTEGER
    );

    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_id INTEGER,
      cantidad INTEGER,
      vendedora TEXT,
      fecha TEXT,
      metodo_pago TEXT,
      FOREIGN KEY(producto_id) REFERENCES productos(id)
    );
  `);

  console.log("📀 Base de datos inicializada");
};

// Rutas base
app.get("/", (req, res) => res.send("Backend operativo ✅"));

// Endpoint para obtener productos
app.get("/productos", async (req, res) => {
  const productos = await db.all("SELECT * FROM productos");
  res.json(productos);
});

// ✅ Crear un producto nuevo
app.post("/productos", async (req, res) => {
  const { nombre, tipo, precio, stock } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  await db.run(
    "INSERT INTO productos (nombre, tipo, precio, stock) VALUES (?, ?, ?, ?)",
    [nombre, tipo || "botella", precio, stock || 0]
  );

  res.json({ status: "Producto agregado" });
});

// Agregar una venta
app.post("/ventas", async (req, res) => {
  const { producto_id, cantidad, vendedora, metodo_pago } = req.body;
  const fecha = new Date().toISOString();
  await db.run(
    "INSERT INTO ventas (producto_id, cantidad, vendedora, fecha, metodo_pago) VALUES (?,?,?,?,?)",
    [producto_id, cantidad, vendedora, fecha, metodo_pago]
  );
  res.json({ status: "ok" });
});

const PORT = 4000;
app.listen(PORT, async () => {
  await initDB();
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
