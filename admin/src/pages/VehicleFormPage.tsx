import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createVehicle, fetchAdminVehicle, updateVehicle } from "@/lib/api";
import type { VehicleInput } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const empty: VehicleInput = {
  codigo: "",
  make: "",
  model: "",
  year: 2020,
  price: 0,
  mileage: 0,
  fuel_type: "gasolina",
  transmission: "automática",
  body_type: "sedán",
  color: "",
  description: "",
  image_url: "",
  images: [],
  status: "available",
  featured: false,
};

export function VehicleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<VehicleInput>(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!id) return;
    fetchAdminVehicle(Number(id))
      .then((v) => setForm({
        codigo: v.codigo,
        make: v.make,
        model: v.model,
        year: v.year,
        price: v.price,
        mileage: v.mileage,
        fuel_type: v.fuel_type,
        transmission: v.transmission,
        body_type: v.body_type,
        color: v.color,
        description: v.description,
        image_url: v.image_url,
        images: v.images,
        status: v.status,
        featured: v.featured,
      }))
      .catch((e: Error) => setError(e.message));
  }, [id]);
  function set<K extends keyof VehicleInput>(key: K, value: VehicleInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isEdit) await updateVehicle(Number(id), form);
      else await createVehicle(form);
      navigate("/vehicles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">{isEdit ? "Editar vehículo" : "Nuevo vehículo"}</h1>
      <Card className="max-w-2xl p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Marca</Label><Input value={form.make} onChange={(e) => set("make", e.target.value)} required /></div>
            <div><Label>Modelo</Label><Input value={form.model} onChange={(e) => set("model", e.target.value)} required /></div>
            <div><Label>Código</Label><Input value={form.codigo} onChange={(e) => set("codigo", e.target.value)} required placeholder="toyota-corolla-2019" /></div>
            <div><Label>Año</Label><Input type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} required /></div>
            <div><Label>Precio (COP)</Label><Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} required /></div>
            <div><Label>Kilometraje</Label><Input type="number" value={form.mileage} onChange={(e) => set("mileage", Number(e.target.value))} required /></div>
            <div><Label>Combustible</Label><Input value={form.fuel_type} onChange={(e) => set("fuel_type", e.target.value)} /></div>
            <div><Label>Transmisión</Label><Input value={form.transmission} onChange={(e) => set("transmission", e.target.value)} /></div>
            <div><Label>Carrocería</Label><Input value={form.body_type} onChange={(e) => set("body_type", e.target.value)} /></div>
            <div><Label>Color</Label><Input value={form.color} onChange={(e) => set("color", e.target.value)} /></div>
            <div>
              <Label>Estado</Label>
              <select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" value={form.status} onChange={(e) => set("status", e.target.value as VehicleInput["status"])}>
                <option value="available">Disponible</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} id="featured" />
              <Label htmlFor="featured">Destacado</Label>
            </div>
          </div>
          <div><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} required /></div>
          <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</Button>
            <Button type="button" variant="outline" onClick={() => navigate("/vehicles")}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
