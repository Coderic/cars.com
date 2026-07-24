import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { getSessionUser, loginAdmin, logoutAdmin } from "./auth";
import { loginSchema } from "./lib/validation";
import vehicles from "./routes/vehicles";
import adminVehicles from "./routes/admin-vehicles";
import adminMedia from "./routes/admin-media";

const app = new Hono<{ Bindings: Env }>().basePath("/api");

app.get("/health", (c) => {
  return c.json({
    ok: true,
    service: "cars-com",
    timestamp: new Date().toISOString(),
  });
});

app.post("/admin/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "validation", message: "Credenciales inválidas" }, 422);
  const ok = await loginAdmin(c, parsed.data.username, parsed.data.password);
  if (!ok) return c.json({ error: "unauthorized", message: "Usuario o contraseña incorrectos" }, 401);
  return c.json({ data: { user: parsed.data.username } });
});

app.post("/admin/logout", (c) => {
  logoutAdmin(c);
  return c.json({ data: { loggedOut: true } });
});

app.get("/admin/session", async (c) => {
  const user = await getSessionUser(c);
  if (!user) return c.json({ data: { authenticated: false } });
  return c.json({ data: { authenticated: true, user } });
});

app.route("/vehicles", vehicles);
app.route("/admin/vehicles", adminVehicles);
app.route("/admin/media", adminMedia);

export const onRequest = handle(app);
