export async function onRequest(context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}): Promise<Response> {
  const url = new URL(context.request.url);
  if (!url.pathname.startsWith("/admin")) {
    return context.next();
  }
  if (context.request.method !== "GET") {
    return context.next();
  }
  const assetPath = url.pathname.endsWith("/") ? "/admin/index.html" : url.pathname;
  const asset = await context.env.ASSETS.fetch(new URL(assetPath, url.origin));
  if (asset.status !== 404) return asset;
  return context.env.ASSETS.fetch(new URL("/admin/index.html", url.origin));
}
