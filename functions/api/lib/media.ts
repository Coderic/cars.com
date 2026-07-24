export function resolveMediaR2Key(pathOrUrl: string): string | null {
  const path = pathOrUrl.startsWith("http")
    ? new URL(pathOrUrl).pathname
    : pathOrUrl.startsWith("/")
      ? pathOrUrl
      : `/${pathOrUrl}`;
  if (!path.startsWith("/media/")) return null;
  const key = path.slice("/media/".length);
  return key || null;
}

export function mediaPublicUrl(r2Key: string): string {
  return `/media/${r2Key.replace(/^\/+/, "")}`;
}

export function contentTypeForKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export function sanitizeUploadFilename(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function uploadVehicleImage(env: Env, file: File): Promise<{ url: string; key: string }> {
  const bucket = env.CARS_MEDIA;
  if (!bucket) throw new Error("media_bucket_missing");
  if (!ALLOWED_MIME.has(file.type)) throw new Error("invalid_mime");
  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("file_too_large");
  const safeName = sanitizeUploadFilename(file.name || "upload.jpg");
  const key = `vehicles/upload/${crypto.randomUUID()}-${safeName}`;
  await bucket.put(key, bytes, {
    httpMetadata: { contentType: file.type || contentTypeForKey(key) },
  });
  return { url: mediaPublicUrl(key), key };
}

export async function deleteUploadedImage(env: Env, key: string): Promise<boolean> {
  if (!key.startsWith("vehicles/upload/")) return false;
  const bucket = env.CARS_MEDIA;
  if (!bucket) return false;
  await bucket.delete(key);
  return true;
}
