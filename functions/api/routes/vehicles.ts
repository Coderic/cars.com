import { Hono } from "hono";
import { listVehicles, getVehicleByCodigo } from "../lib/vehicles";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const make = c.req.query("make");
  const bodyType = c.req.query("bodyType");
  const minPrice = c.req.query("minPrice");
  const maxPrice = c.req.query("maxPrice");
  const status = c.req.query("status") ?? "available";
  const featured = c.req.query("featured");
  const data = await listVehicles(c.env.CARS_DB, {
    make: make || undefined,
    bodyType: bodyType || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    status: status || undefined,
    featured: featured === "1" || featured === "true",
  });
  c.header("Cache-Control", "public, max-age=60");
  return c.json({ data, meta: { count: data.length } });
});

app.get("/:codigo", async (c) => {
  const codigo = c.req.param("codigo");
  const vehicle = await getVehicleByCodigo(c.env.CARS_DB, codigo);
  if (!vehicle) return c.json({ error: "not_found", message: "Vehículo no encontrado" }, 404);
  c.header("Cache-Control", "public, max-age=60");
  return c.json({ data: vehicle });
});

export default app;
