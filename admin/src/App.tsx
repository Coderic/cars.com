import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/auth/AuthProvider";
import { AdminShell } from "@/components/AdminShell";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { VehicleListPage } from "@/pages/VehicleListPage";
import { VehicleFormPage } from "@/pages/VehicleFormPage";

function ProtectedLayout() {
  return (
    <RequireAuth>
      <AdminShell />
    </RequireAuth>
  );
}

export function App() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/vehicles" element={<VehicleListPage />} />
            <Route path="/vehicles/new" element={<VehicleFormPage />} />
            <Route path="/vehicles/:id/edit" element={<VehicleFormPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
