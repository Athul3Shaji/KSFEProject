import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const useAuth = () => {
    const userToken = localStorage.getItem("userToken");
    const userType = localStorage.getItem("userType");
    return userToken && userType === "user";
  };
  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default UserProtectedRoute;
