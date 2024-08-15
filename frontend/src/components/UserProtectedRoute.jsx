import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const useAuth = () => {
    const userToken = localStorage.getItem("user_accesstoken");
    const userType = localStorage.getItem("userType");
    return Boolean(userToken && userType === "user");
  };

  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="/" replace />;
};

export default UserProtectedRoute;
