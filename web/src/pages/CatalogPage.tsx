import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchVehicles } from "@/lib/api";
import type { Vehicle } from "@/lib/api";
import { VehicleCard } from "@/components/VehicleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectClass = "h-10 w-full rounded-xl border border-[var(--border-surface)] bg-[var(--bg-surface)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-coderic-500/40";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = useMemo(() => ({
    make: searchParams.get("make") ?? "",
    bodyType: searchParams.get("bodyType") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    status: searchParams.get("status") ?? "available",
  }), [searchParams]);
  useEffect(() => {
    setLoading(true);
    fetchVehicles({
      make: filters.make || undefined,
      bodyType: filters.bodyType || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      status: filters.status || undefined,
    })
      .then(setVehicles)
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, [filters]);
  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }
  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-coderic-500">Inventario</p>
      <h1 className="font-display mt-1 text-3xl font-bold">Catálogo</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel space-y-4 p-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Marca</label>
            <select className={selectClass} value={filters.make} onChange={(e) => updateFilter("make", e.target.value)}>
              <option value="">Todas</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tipo</label>
            <select className={selectClass} value={filters.bodyType} onChange={(e) => updateFilter("bodyType", e.target.value)}>
              <option value="">Todos</option>
              <option value="sedán">Sedán</option>
              <option value="SUV">SUV</option>
              <option value="pickup">Pickup</option>
              <option value="hatchback">Hatchback</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Precio mínimo</label>
            <Input value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Precio máximo</label>
            <Input value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} placeholder="150000000" />
          </div>
          <Button variant="outline" className="w-full" onClick={() => setSearchParams(new URLSearchParams({ status: "available" }))}>
            Limpiar filtros
          </Button>
        </aside>
        <section>
          {loading ? (
            <p className="text-muted">Cargando…</p>
          ) : vehicles.length === 0 ? (
            <p className="text-muted">No hay vehículos con estos filtros.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
