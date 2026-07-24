import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession, logout as apiLogout } from "@/lib/api";

type AuthState = { loading: boolean; user: string | null; logout: () => Promise<void> };

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    getSession()
      .then((s) => setUser(s.authenticated ? s.user ?? "admin" : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  async function logout() {
    await apiLogout();
    setUser(null);
  }
  return <AuthContext.Provider value={{ loading, user, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();
  const location = useLocation();
  if (loading) return <p className="p-8 text-slate-500">Cargando…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
