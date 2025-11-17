// src/api/productos.js
const API_URL = "http://localhost:4000";

export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
  return await res.json();
}

export async function crearProducto(data) {
  await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function editarProducto(id, data) {
  await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function eliminarProducto(id) {
  await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
  });
}
