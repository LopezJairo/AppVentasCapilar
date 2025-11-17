import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <h2 className="logo">AppCapilar</h2>
      </div>

      <div className="nav-right">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/rutas">Rutas</Link>
      </div>
    </nav>
  );
}
