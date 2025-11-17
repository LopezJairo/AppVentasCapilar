import { useEffect, useState } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/rutas.css";

// =============================
// ICONOS PROFESIONALES
// =============================
const iconRepartidor = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1048/1048949.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40],
});

const iconDestino = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// =============================
// COLORES DE ESTADO
// =============================
// pendiente -> amarillo
// en camino -> azul
// entregado -> verde
const estadoColor = {
  pendiente: "#FFC400",
  camino: "#0054A6",
  entregado: "#00A650",
};

export default function Rutas() {
  const [posicion, setPosicion] = useState({
    lat: -32.8908,
    lng: -68.8319,
  });

  const [recorrido, setRecorrido] = useState([]);
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("posicion_repartidor", (data) => {
      setPosicion({ lat: data.lat, lng: data.lng });
      setPedido(data.pedido);

      setRecorrido((prev) => [...prev, [data.lat, data.lng]]);
    });

    return () => socket.disconnect();
  }, []);

  const colorLinea = pedido ? estadoColor[pedido.estado] : "#0054A6";

  return (
    <div className="rutas-container">

      <aside className="panel-info">
        <h2 className="titulo">Seguimiento del Repartidor</h2>

        {/* Pedido actual */}
        <div className="card">
          <h3>Pedido en Curso</h3>

          {pedido ? (
            <div className="pedido-info">
              <p><strong>ID:</strong> {pedido.id}</p>
              <p><strong>Cliente:</strong> {pedido.cliente}</p>
              <p><strong>Producto:</strong> {pedido.producto}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
            </div>
          ) : (
            <p>No hay pedidos activos.</p>
          )}
        </div>

        {/* Coordenadas */}
        <div className="card">
          <h3>Coordenadas actuales</h3>
          <p>Lat: {posicion.lat.toFixed(5)}</p>
          <p>Lng: {posicion.lng.toFixed(5)}</p>
        </div>
      </aside>

      <main className="mapa-wrapper">
        <MapContainer
          center={[posicion.lat, posicion.lng]}
          zoom={15}
          className="mapa"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* MARCADOR DEL REPARTIDOR */}
          <Marker position={[posicion.lat, posicion.lng]} icon={iconRepartidor}>
            <Popup>
              <strong>Repartidor:</strong> {pedido?.repartidor || "Asignado"}
              <br />
              <strong>Pedido:</strong> {pedido?.id || "-"}
              <br />
              <strong>Estado:</strong>{" "}
              <span style={{ color: colorLinea }}>
                {pedido?.estado || "—"}
              </span>
            </Popup>
          </Marker>

          {/* DESTINO (SI EXISTE) */}
          {pedido?.destino && (
            <Marker
              position={[pedido.destino.lat, pedido.destino.lng]}
              icon={iconDestino}
            >
              <Popup>Destino del pedido</Popup>
            </Marker>
          )}

          {/* POLILÍNEA DEL RECORRIDO */}
          <Polyline
            positions={recorrido}
            pathOptions={{
              color: colorLinea,
              weight: 4,
              opacity: 0.9,
              smoothFactor: 1,
            }}
          />
        </MapContainer>
      </main>
    </div>
  );
}
