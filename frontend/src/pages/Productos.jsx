// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import { obtenerProductos, crearProducto, eliminarProducto, editarProducto } from "../api/productos";
import "../styles/productos.css";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", precio: "", descripcion: "" });
  const [editandoId, setEditandoId] = useState(null);

  // cargar productos
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    obtenerProductos().then(setProductos);
  };

  const abrirModalNuevo = () => {
    setModalAbierto(true);
    setEditandoId(null);
    setFormData({ nombre: "", precio: "", descripcion: "" });
  };

  const abrirModalEditar = (p) => {
    setModalAbierto(true);
    setEditandoId(p.id);
    setFormData({ nombre: p.nombre, precio: p.precio, descripcion: p.descripcion });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();

    if (editandoId) {
      await editarProducto(editandoId, formData);
    } else {
      await crearProducto(formData);
    }

    cargarProductos();
    setModalAbierto(false);
  };

  const borrar = async (id) => {
    await eliminarProducto(id);
    cargarProductos();
  };

  return (
    <div className="productos-container">

      <header className="productos-header">
        <h1>Gestión de Productos</h1>
        <button className="btn-primary" onClick={abrirModalNuevo}>
          + Agregar Producto
        </button>
      </header>

      <div className="productos-grid">
        {productos.map((p) => (
          <div key={p.id} className="producto-card">
            <h3>{p.nombre}</h3>
            <p className="precio">${p.precio}</p>
            <p className="descripcion">{p.descripcion}</p>

            <div className="acciones">
              <button className="btn-edit" onClick={() => abrirModalEditar(p)}>Editar</button>
              <button className="btn-delete" onClick={() => borrar(p.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editandoId ? "Editar Producto" : "Nuevo Producto"}</h2>

            <form onSubmit={enviarFormulario}>
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />

              <label>Precio</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />

              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />

              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Guardar</button>
                <button type="button" className="btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
