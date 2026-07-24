import { serveMedia } from "./lib/serve-media";

export async function onRequest(context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}): Promise<Response> {
  const url = new URL(context.request.url);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin/")) {
    return context.next();
  }
  const isRead = context.request.method === "GET" || context.request.method === "HEAD";
  if (isRead && url.pathname.startsWith("/media/")) {
    const media = await serveMedia(context.request, context.env);
    if (media) return media;
  }
  if (context.request.method !== "GET") {
    return context.next();
  }
  const asset = await context.env.ASSETS.fetch(context.request);
  if (asset.status !== 404) return asset;
  const indexUrl = new URL("/index.html", url.origin);
  return context.env.ASSETS.fetch(new Request(indexUrl.toString(), context.request));
}
