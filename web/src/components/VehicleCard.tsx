import { Link } from "react-router-dom";
import type { Vehicle } from "@/lib/api";
import { formatCop, formatKm } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link to={`/vehiculos/${vehicle.codigo}`} className="group block">
      <Card className="group-hover:shadow-md">
        <div className="aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <CardContent className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-[var(--text-base)]">{vehicle.make} {vehicle.model}</h3>
              <p className="text-sm text-muted">{vehicle.year} · {formatKm(vehicle.mileage)}</p>
            </div>
            <Badge status={vehicle.status} />
          </div>
          <p className="text-lg font-bold text-coderic-600">{formatCop(vehicle.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
