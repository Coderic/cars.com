# Cars.com — Concesionario sandbox

Sitio de vehículos usados en Cloudflare Pages: React + shadcn, API Hono, D1, R2.

## Setup local

```bash
cp .dev.vars.example .dev.vars
npm install
npm run setup:local
npm run build
npx wrangler pages dev public
```

Admin: `/admin` — usuario `admin`, contraseña `password`.

## Scripts

- `npm run dev` — migraciones, seed media, build y Pages dev
- `npm run web:dev` / `npm run admin:dev` — Vite con proxy a API
- `npm run deploy` — build y deploy a Cloudflare Pages
