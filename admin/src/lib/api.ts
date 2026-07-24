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

export type VehicleInput = Omit<Vehicle, "id">;

export type Stats = { total: number; available: number; reserved: number; sold: number };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(path, { credentials: "include", ...init, headers });
  const json = await res.json() as { data?: T; error?: string; message?: string };
  if (!res.ok) throw new Error(json.message ?? json.error ?? "Error de API");
  return json.data as T;
}

export async function login(username: string, password: string): Promise<void> {
  await request("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) });
}

export async function logout(): Promise<void> {
  await request("/api/admin/logout", { method: "POST" });
}

export async function getSession(): Promise<{ authenticated: boolean; user?: string }> {
  return request("/api/admin/session");
}

export async function fetchStats(): Promise<Stats> {
  return request("/api/admin/vehicles/stats");
}

export async function fetchAdminVehicles(): Promise<Vehicle[]> {
  return request("/api/admin/vehicles");
}

export async function fetchAdminVehicle(id: number): Promise<Vehicle> {
  return request(`/api/admin/vehicles/${id}`);
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  return request("/api/admin/vehicles", { method: "POST", body: JSON.stringify(input) });
}

export async function updateVehicle(id: number, input: Partial<VehicleInput>): Promise<Vehicle> {
  return request(`/api/admin/vehicles/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteVehicle(id: number): Promise<void> {
  await request(`/api/admin/vehicles/${id}`, { method: "DELETE" });
}

export async function uploadImage(file: File): Promise<{ url: string; key: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", credentials: "include", body: form });
  const json = await res.json() as { data?: { url: string; key: string }; message?: string };
  if (!res.ok) throw new Error(json.message ?? "Error al subir");
  return json.data!;
}

export async function deleteUploadedImage(key: string): Promise<void> {
  await request("/api/admin/media", { method: "DELETE", body: JSON.stringify({ key }) });
}
