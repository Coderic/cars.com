import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/api";
import { useAuth } from "@/auth/AuthProvider";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (user) {
    navigate("/");
    return null;
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      window.location.href = "/admin/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de login");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-surface-alt)] p-4">
      <div className="mb-8">
        <BrandMark subtitle="ADMIN" homeHref="/admin/" />
      </div>
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold">Panel de inventario</h1>
        <p className="mt-2 text-sm text-muted">Gestión de vehículos Coderic Cars</p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label>Usuario</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</Button>
        </form>
      </Card>
    </div>
  );
}
