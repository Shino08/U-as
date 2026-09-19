import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHome from "@/pages/DashboardHome";
import LandingCms from "@/pages/LandingCms";
import Services from "@/pages/Services";
import Appointments from "@/pages/Appointments";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard / Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="servicios" element={<Services />} />
        <Route path="citas" element={<Appointments />} />
        <Route path="cms" element={<LandingCms />} />
      </Route>

      {/* Direct dashboard aliases */}
      <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="/dashboard/servicios" element={<Navigate to="/admin/servicios" replace />} />
      <Route path="/dashboard/citas" element={<Navigate to="/admin/citas" replace />} />

      {/* 404 Error Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
