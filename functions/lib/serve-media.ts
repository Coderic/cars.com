import { contentTypeForKey, resolveMediaR2Key } from "../api/lib/media";

export async function serveMedia(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/media/")) return null;
  const key = resolveMediaR2Key(url.pathname);
  if (!key) return new Response("Not found", { status: 404 });
  const bucket = env.CARS_MEDIA;
  if (!bucket) return new Response("Media storage not configured", { status: 503 });
  const object = await bucket.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", contentTypeForKey(key));
  }
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);
  return new Response(object.body, { headers });
}
