import { Hono } from "hono";
import {
  listVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  countVehiclesByStatus,
} from "../lib/vehicles";
import { vehicleInputSchema, vehiclePatchSchema } from "../lib/validation";
import { requireAdmin } from "../auth";

const app = new Hono<{ Bindings: Env }>();

app.use("*", requireAdmin);

app.get("/stats", async (c) => {
  const stats = await countVehiclesByStatus(c.env.CARS_DB);
  return c.json({ data: stats });
});

app.get("/", async (c) => {
  const data = await listVehicles(c.env.CARS_DB, {});
  return c.json({ data, meta: { count: data.length } });
});

app.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) return c.json({ error: "validation", message: "id inválido" }, 422);
  const vehicle = await getVehicleById(c.env.CARS_DB, id);
  if (!vehicle) return c.json({ error: "not_found", message: "Vehículo no encontrado" }, 404);
  return c.json({ data: vehicle });
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = vehicleInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "validation", message: parsed.error.flatten() }, 422);
  }
  try {
    const vehicle = await createVehicle(c.env.CARS_DB, parsed.data);
    return c.json({ data: vehicle }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear";
    if (message.includes("UNIQUE")) {
      return c.json({ error: "conflict", message: "El código ya existe" }, 409);
    }
    return c.json({ error: "server_error", message: "No se pudo crear el vehículo" }, 500);
  }
});

app.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) return c.json({ error: "validation", message: "id inválido" }, 422);
  const body = await c.req.json();
  const parsed = vehiclePatchSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "validation", message: parsed.error.flatten() }, 422);
  }
  try {
    const vehicle = await updateVehicle(c.env.CARS_DB, id, parsed.data);
    if (!vehicle) return c.json({ error: "not_found", message: "Vehículo no encontrado" }, 404);
    return c.json({ data: vehicle });
  } catch {
    return c.json({ error: "conflict", message: "El código ya existe" }, 409);
  }
});

app.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) return c.json({ error: "validation", message: "id inválido" }, 422);
  const deleted = await deleteVehicle(c.env.CARS_DB, id);
  if (!deleted) return c.json({ error: "not_found", message: "Vehículo no encontrado" }, 404);
  return c.json({ data: { id, deleted: true } });
});

export default app;
