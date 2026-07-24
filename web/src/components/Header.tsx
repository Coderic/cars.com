import { Link } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";

const navLink = "text-sm font-medium text-muted transition-colors hover:text-[var(--text-base)]";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-surface)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4">
        <BrandMark subtitle="CARS" />
        <nav className="flex items-center gap-6">
          <Link to="/" className={navLink}>Inicio</Link>
          <Link to="/catalogo" className={navLink}>Catálogo</Link>
          <a href="/admin/" className={cn(navLink, "rounded-full border border-[var(--border-surface)] px-4 py-2 hover:border-coderic-600/30 hover:bg-coderic-600/5")}>
            Admin
          </a>
        </nav>
      </div>
      <div className="border-t border-[var(--border-surface)] bg-[color-mix(in_srgb,var(--bg-surface)_95%,transparent)]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs text-muted">
          <span className="pill-coderic">Concesionario</span>
          <span>Vehículos usados certificados · Precios en COP</span>
        </div>
      </div>
    </header>
  );
}
