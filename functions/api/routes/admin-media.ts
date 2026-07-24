import { Hono } from "hono";
import { deleteUploadedImage, uploadVehicleImage } from "../lib/media";
import { mediaDeleteSchema } from "../lib/validation";
import { requireAdmin } from "../auth";

const app = new Hono<{ Bindings: Env }>();

app.use("*", requireAdmin);

app.post("/", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file;
  if (!(file instanceof File)) {
    return c.json({ error: "validation", message: "file requerido" }, 422);
  }
  try {
    const result = await uploadVehicleImage(c.env, file);
    return c.json({ data: result }, 201);
  } catch (err) {
    const code = err instanceof Error ? err.message : "upload_failed";
    if (code === "invalid_mime") return c.json({ error: "validation", message: "Tipo de archivo no permitido" }, 422);
    if (code === "file_too_large") return c.json({ error: "validation", message: "Archivo demasiado grande (máx 5 MB)" }, 422);
    return c.json({ error: "server_error", message: "Error al subir archivo" }, 500);
  }
});

app.delete("/", async (c) => {
  const body = await c.req.json();
  const parsed = mediaDeleteSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "validation", message: "key requerido" }, 422);
  const deleted = await deleteUploadedImage(c.env, parsed.data.key);
  if (!deleted) return c.json({ error: "validation", message: "No se puede eliminar esta clave" }, 422);
  return c.json({ data: { key: parsed.data.key, deleted: true } });
});

export default app;
