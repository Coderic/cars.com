import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

export function AdminShell() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[var(--bg-surface-alt)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border-surface)] bg-[color-mix(in_srgb,var(--bg-surface)_92%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <BrandMark subtitle="ADMIN" homeHref="/admin/" />
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="text-muted hover:text-coderic-600">Dashboard</Link>
            <Link to="/vehicles" className="text-muted hover:text-coderic-600">Inventario</Link>
            <a href="/" className="text-muted hover:text-coderic-600">Ver sitio</a>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">{user}</span>
            <Button variant="outline" size="sm" onClick={() => void logout()}>Salir</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
