// backend/server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

// Crear servidor HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let repartidores = {};

// 📀 Conexión a SQLite
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

// 🌐 Endpoints REST
app.get("/", (req, res) => res.send("Backend operativo ✅"));

app.get("/productos", async (req, res) => {
  const productos = await db.all("SELECT * FROM productos");
  res.json(productos);
});

app.post("/productos", async (req, res) => {
  const { nombre, tipo, precio, stock } = req.body;
  if (!nombre || !precio)
    return res.status(400).json({ error: "Faltan datos obligatorios" });

  await db.run(
    "INSERT INTO productos (nombre, tipo, precio, stock) VALUES (?, ?, ?, ?)",
    [nombre, tipo || "botella", precio, stock || 0]
  );

  res.json({ status: "Producto agregado" });
});

app.post("/ventas", async (req, res) => {
  const { producto_id, cantidad, vendedora, metodo_pago } = req.body;
  const fecha = new Date().toISOString();

  await db.run(
    "INSERT INTO ventas (producto_id, cantidad, vendedora, fecha, metodo_pago) VALUES (?, ?, ?, ?, ?)",
    [producto_id, cantidad, vendedora, fecha, metodo_pago]
  );

  res.json({ status: "Venta registrada" });
});

// 🛰️ SOCKET.IO - Ubicación en tiempo real
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  // Recibir ubicación real
  socket.on("ubicacion", (data) => {
    // data = { idRepartidor, lat, lng, pedidoId }
    repartidores[data.idRepartidor] = data;
    io.emit("ubicaciones", Object.values(repartidores)); // enviar a todos
  });

  // Simulador de ubicación (solo para test)
  const sim = setInterval(() => {
    const lat = -32.89 + Math.random() * 0.01;
    const lng = -68.83 + Math.random() * 0.01;
    io.emit("posicion_repartidor", { lat, lng });
  }, 5000);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
    delete repartidores[socket.id];
    io.emit("ubicaciones", Object.values(repartidores));
    clearInterval(sim);
  });
});

// 🚀 Inicialización
const PORT = 4000;
server.listen(PORT, async () => {
  await initDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
