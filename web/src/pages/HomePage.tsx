import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVehicles } from "@/lib/api";
import type { Vehicle } from "@/lib/api";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchVehicles({ status: "available", featured: "1" })
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <section className="hero-coderic px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="pill-coderic mb-6">Coderic Motors</p>
          <h1 className="font-display max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
            Tu próximo <span className="text-coderic-500">vehículo usado</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-stone-300">
            Catálogo seleccionado con precios claros, fotos reales y la confianza del ecosistema Coderic.
          </p>
          <Button asChild className="mt-10" size="lg">
            <Link to="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-coderic-500">Inventario</p>
            <h2 className="font-display mt-1 text-3xl font-bold">Destacados</h2>
          </div>
          <Link to="/catalogo" className="text-sm font-medium text-muted hover:text-coderic-600">Ver todos →</Link>
        </div>
        {loading ? (
          <p className="text-muted">Cargando vehículos…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        )}
      </section>
    </div>
  );
}
