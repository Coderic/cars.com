import type { Context, MiddlewareHandler } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const SESSION_COOKIE = "cars_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  user: string;
  exp: number;
};

function encoder(): TextEncoder {
  return new TextEncoder();
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder().encode(value));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${value}.${b64}`;
}

async function verify(signed: string, secret: string): Promise<string | null> {
  const idx = signed.lastIndexOf(".");
  if (idx <= 0) return null;
  const value = signed.slice(0, idx);
  const expected = await sign(value, secret);
  if (expected !== signed) return null;
  return value;
}

async function createSessionToken(user: string, secret: string): Promise<string> {
  const payload: SessionPayload = { user, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  return sign(btoa(JSON.stringify(payload)), secret);
}

async function parseSessionToken(token: string, secret: string): Promise<SessionPayload | null> {
  const value = await verify(token, secret);
  if (!value) return null;
  try {
    const payload = JSON.parse(atob(value)) as SessionPayload;
    if (!payload.user || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function loginAdmin(c: Context<{ Bindings: Env }>, username: string, password: string): Promise<boolean> {
  const expectedUser = c.env.ADMIN_USER ?? "admin";
  const expectedPass = c.env.ADMIN_PASSWORD ?? "password";
  if (username !== expectedUser || password !== expectedPass) return false;
  const secret = c.env.SESSION_SECRET ?? "dev-session-secret";
  const token = await createSessionToken(username, secret);
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === "https:",
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export function logoutAdmin(c: Context): void {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
}

export async function getSessionUser(c: Context<{ Bindings: Env }>): Promise<string | null> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return null;
  const secret = c.env.SESSION_SECRET ?? "dev-session-secret";
  const payload = await parseSessionToken(token, secret);
  return payload?.user ?? null;
}

export const requireAdmin: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const user = await getSessionUser(c);
  if (!user) return c.json({ error: "unauthorized", message: "Sesión requerida" }, 401);
  c.set("adminUser", user);
  await next();
};

declare module "hono" {
  interface ContextVariableMap {
    adminUser: string;
  }
}
