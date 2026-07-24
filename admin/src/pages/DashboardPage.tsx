import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStats } from "@/lib/api";
import type { Stats } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    fetchStats().then(setStats).catch(() => setStats(null));
  }, []);
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <Button asChild><Link to="/vehicles/new">Nuevo vehículo</Link></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats?.total ?? 0 },
          { label: "Disponibles", value: stats?.available ?? 0 },
          { label: "Reservados", value: stats?.reserved ?? 0 },
          { label: "Vendidos", value: stats?.sold ?? 0 },
        ].map((item) => (
          <Card key={item.label} className="p-6">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Button asChild variant="outline"><Link to="/vehicles">Ver inventario</Link></Button>
      </div>
    </div>
  );
}
