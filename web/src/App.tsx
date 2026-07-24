import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { CatalogPage } from "@/pages/CatalogPage";
import { VehicleDetailPage } from "@/pages/VehicleDetailPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/vehiculos/:codigo" element={<VehicleDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
