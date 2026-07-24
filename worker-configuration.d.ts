interface Env {
  ASSETS: Fetcher;
  CARS_DB: D1Database;
  CARS_MEDIA: R2Bucket;
  ADMIN_USER: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
}
