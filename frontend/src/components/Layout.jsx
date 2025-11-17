import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />

      {/* Margen para que el navbar no tape nada */}
      <div style={{ paddingTop: "60px" }}>
        {children}
      </div>
    </div>
  );
}
