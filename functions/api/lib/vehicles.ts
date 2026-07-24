export type VehicleRow = {
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
  images: string;
  status: "available" | "reserved" | "sold";
  featured: number;
  created_at: string;
  updated_at: string;
};

export type Vehicle = Omit<VehicleRow, "images" | "featured"> & {
  images: string[];
  featured: boolean;
};

export function mapVehicle(row: VehicleRow): Vehicle {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(row.images) as unknown;
    if (Array.isArray(parsed)) images = parsed.filter((v) => typeof v === "string");
  } catch {
    images = [];
  }
  return {
    ...row,
    images,
    featured: row.featured === 1,
  };
}

export type VehicleFilters = {
  make?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  featured?: boolean;
};

export async function listVehicles(db: D1Database, filters: VehicleFilters): Promise<Vehicle[]> {
  const clauses: string[] = [];
  const binds: (string | number)[] = [];
  if (filters.make) {
    clauses.push("make = ?");
    binds.push(filters.make);
  }
  if (filters.bodyType) {
    clauses.push("body_type = ?");
    binds.push(filters.bodyType);
  }
  if (filters.minPrice !== undefined) {
    clauses.push("price >= ?");
    binds.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    clauses.push("price <= ?");
    binds.push(filters.maxPrice);
  }
  if (filters.status) {
    clauses.push("status = ?");
    binds.push(filters.status);
  }
  if (filters.featured) {
    clauses.push("featured = 1");
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const stmt = db.prepare(`SELECT * FROM vehicles ${where} ORDER BY featured DESC, year DESC, id DESC`);
  const result = await stmt.bind(...binds).all<VehicleRow>();
  return (result.results ?? []).map(mapVehicle);
}

export async function getVehicleByCodigo(db: D1Database, codigo: string): Promise<Vehicle | null> {
  const row = await db.prepare("SELECT * FROM vehicles WHERE codigo = ?").bind(codigo).first<VehicleRow>();
  return row ? mapVehicle(row) : null;
}

export async function getVehicleById(db: D1Database, id: number): Promise<Vehicle | null> {
  const row = await db.prepare("SELECT * FROM vehicles WHERE id = ?").bind(id).first<VehicleRow>();
  return row ? mapVehicle(row) : null;
}

export async function createVehicle(db: D1Database, input: {
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
  status: string;
  featured: boolean;
}): Promise<Vehicle> {
  const result = await db
    .prepare(
      `INSERT INTO vehicles (codigo, make, model, year, price, mileage, fuel_type, transmission, body_type, color, description, image_url, images, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      input.codigo,
      input.make,
      input.model,
      input.year,
      input.price,
      input.mileage,
      input.fuel_type,
      input.transmission,
      input.body_type,
      input.color,
      input.description,
      input.image_url,
      JSON.stringify(input.images),
      input.status,
      input.featured ? 1 : 0,
    )
    .run();
  const id = result.meta.last_row_id;
  const row = await db.prepare("SELECT * FROM vehicles WHERE id = ?").bind(id).first<VehicleRow>();
  if (!row) throw new Error("insert_failed");
  return mapVehicle(row);
}

export async function updateVehicle(db: D1Database, id: number, input: Partial<{
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
  status: string;
  featured: boolean;
}>): Promise<Vehicle | null> {
  const current = await getVehicleById(db, id);
  if (!current) return null;
  const merged = {
    codigo: input.codigo ?? current.codigo,
    make: input.make ?? current.make,
    model: input.model ?? current.model,
    year: input.year ?? current.year,
    price: input.price ?? current.price,
    mileage: input.mileage ?? current.mileage,
    fuel_type: input.fuel_type ?? current.fuel_type,
    transmission: input.transmission ?? current.transmission,
    body_type: input.body_type ?? current.body_type,
    color: input.color ?? current.color,
    description: input.description ?? current.description,
    image_url: input.image_url ?? current.image_url,
    images: input.images ?? current.images,
    status: input.status ?? current.status,
    featured: input.featured ?? current.featured,
  };
  await db
    .prepare(
      `UPDATE vehicles SET codigo=?, make=?, model=?, year=?, price=?, mileage=?, fuel_type=?, transmission=?, body_type=?, color=?, description=?, image_url=?, images=?, status=?, featured=? WHERE id=?`,
    )
    .bind(
      merged.codigo,
      merged.make,
      merged.model,
      merged.year,
      merged.price,
      merged.mileage,
      merged.fuel_type,
      merged.transmission,
      merged.body_type,
      merged.color,
      merged.description,
      merged.image_url,
      JSON.stringify(merged.images),
      merged.status,
      merged.featured ? 1 : 0,
      id,
    )
    .run();
  return getVehicleById(db, id);
}

export async function deleteVehicle(db: D1Database, id: number): Promise<boolean> {
  const result = await db.prepare("DELETE FROM vehicles WHERE id = ?").bind(id).run();
  return (result.meta.changes ?? 0) > 0;
}

export async function countVehiclesByStatus(db: D1Database): Promise<Record<string, number>> {
  const rows = await db
    .prepare("SELECT status, COUNT(*) as count FROM vehicles GROUP BY status")
    .all<{ status: string; count: number }>();
  const counts: Record<string, number> = { available: 0, reserved: 0, sold: 0, total: 0 };
  for (const row of rows.results ?? []) {
    counts[row.status] = row.count;
    counts.total += row.count;
  }
  return counts;
}
