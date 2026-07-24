export type Vehicle = {
  id: number;
  codigo: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string;
  description: string;
  image_url: string;
  images: string[];
  status: "available" | "reserved" | "sold";
  featured: boolean;
};

export type VehicleFilters = {
  make?: string;
  bodyType?: string;
  minPrice?: string;
  maxPrice?: string;
  status?: string;
  featured?: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json() as { data?: T; error?: string; message?: string };
  if (!res.ok) throw new Error(json.message ?? json.error ?? "Error de API");
  return json.data as T;
}

export async function fetchVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  const params = new URLSearchParams();
  if (filters.make) params.set("make", filters.make);
  if (filters.bodyType) params.set("bodyType", filters.bodyType);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.status) params.set("status", filters.status);
  if (filters.featured) params.set("featured", filters.featured);
  const qs = params.toString();
  return apiFetch<Vehicle[]>(`/api/vehicles${qs ? `?${qs}` : ""}`);
}

export async function fetchVehicle(codigo: string): Promise<Vehicle> {
  return apiFetch<Vehicle>(`/api/vehicles/${codigo}`);
}
