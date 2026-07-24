import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchVehicle } from "@/lib/api";
import type { Vehicle } from "@/lib/api";
import { formatCop, formatKm } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function VehicleDetailPage() {
  const { codigo } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!codigo) return;
    fetchVehicle(codigo)
      .then((v) => {
        setVehicle(v);
        setActiveImage(v.image_url);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [codigo]);
  if (loading) return <p className="mx-auto max-w-6xl px-4 py-10 text-muted">Cargando…</p>;
  if (error || !vehicle) return <p className="mx-auto max-w-6xl px-4 py-10 text-red-600">{error || "No encontrado"}</p>;
  const gallery = [vehicle.image_url, ...vehicle.images.filter((u) => u !== vehicle.image_url)];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Button asChild variant="ghost" className="mb-6 px-0">
        <Link to="/catalogo">← Volver al catálogo</Link>
      </Button>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--border-surface)] bg-stone-100">
            <img src={activeImage} alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {gallery.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className="shrink-0 overflow-hidden rounded-lg border-2 border-transparent focus:border-coderic-600"
                >
                  <img src={url} alt="" className="h-16 w-24 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-coderic-500">{vehicle.codigo}</p>
              <h1 className="font-display mt-1 text-3xl font-bold">{vehicle.make} {vehicle.model}</h1>
              <p className="mt-1 text-muted">{vehicle.year} · {vehicle.color}</p>
            </div>
            <Badge status={vehicle.status} />
          </div>
          <p className="mt-6 text-3xl font-bold text-coderic-600">{formatCop(vehicle.price)}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted">Kilometraje</dt><dd className="font-medium">{formatKm(vehicle.mileage)}</dd></div>
            <div><dt className="text-muted">Combustible</dt><dd className="font-medium">{vehicle.fuel_type}</dd></div>
            <div><dt className="text-muted">Transmisión</dt><dd className="font-medium">{vehicle.transmission}</dd></div>
            <div><dt className="text-muted">Carrocería</dt><dd className="font-medium">{vehicle.body_type}</dd></div>
          </dl>
          <p className="mt-8 leading-relaxed text-[var(--text-base)]">{vehicle.description}</p>
        </div>
      </div>
    </div>
  );
}
