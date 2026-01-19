import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminGuard() {
  const { user, isAdmin } = useAdminAuth();

  // dacă nu e logat → login
  if (!user) return <Navigate to="/admin/login" replace />;

  // dacă e logat dar nu e emailul tău → blocat
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
