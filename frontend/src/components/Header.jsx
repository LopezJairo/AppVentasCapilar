import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div style={{ fontWeight: "bold" }}>Capilar Delivery</div>

      <nav className="nav-links">
        <Link to="/">Productos</Link>
        <Link to="/rutas">Rutas</Link>
      </nav>
    </header>
  );
}
