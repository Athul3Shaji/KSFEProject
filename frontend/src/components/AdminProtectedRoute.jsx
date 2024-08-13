import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const useAuth = () => {
    const userToken = localStorage.getItem("userToken");
    const userType = localStorage.getItem("userType");
    return userToken && userType === "admin";
  };
  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminProtectedRoute;
