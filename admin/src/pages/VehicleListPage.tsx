import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteVehicle, fetchAdminVehicles } from "@/lib/api";
import type { Vehicle } from "@/lib/api";
import { formatCop } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function VehicleListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setVehicles(await fetchAdminVehicles());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(); }, []);
  async function onDelete(id: number) {
    if (!confirm("¿Eliminar este vehículo?")) return;
    await deleteVehicle(id);
    await load();
  }
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Inventario</h1>
        <Button asChild><Link to="/vehicles/new">Nuevo</Link></Button>
      </div>
      {loading ? (
        <p className="text-slate-500">Cargando…</p>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3">Vehículo</th>
                <th className="p-3">Año</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={v.image_url} alt="" className="h-10 w-14 rounded object-cover" />
                      <span>{v.make} {v.model}</span>
                    </div>
                  </td>
                  <td className="p-3">{v.year}</td>
                  <td className="p-3">{formatCop(v.price)}</td>
                  <td className="p-3 capitalize">{v.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm"><Link to={`/vehicles/${v.id}/edit`}>Editar</Link></Button>
                      <Button variant="destructive" size="sm" onClick={() => void onDelete(v.id)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
