import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/productos")
      .then((res) => res.json())
      .then(setProductos);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión Ventas Capilar 💇‍♀️</h1>
      {productos.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        <ul>
          {productos.map((p) => (
            <li key={p.id}>
              {p.nombre} — ${p.precio} ({p.stock} en stock)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
