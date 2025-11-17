import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ListaProductos from "./pages/ListaProductos";
import Productos from "./pages/Productos";
import Rutas from "./pages/Rutas";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ListaProductos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/rutas" element={<Rutas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
