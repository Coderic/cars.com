import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/admin/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    outDir: "../public/admin",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": "http://localhost:8788",
      "/media": "http://localhost:8788",
    },
  },
});
