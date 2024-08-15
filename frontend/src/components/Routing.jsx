import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./user/Login";
import Enquiry from "./user/Enquiry";
import AdminLogin from "./admin/AdminLogin";
import AdminHome from "./admin/AdminHome";
import Employee from "./admin/Employee";
import Chitty from "./admin/Chitty";
import Agent from "./admin/Agent";
import About from "./user/About";
import ChittyEnroll from "./admin/ChittyEnroll";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import UserProtectedRoute from "../components/UserProtectedRoute";

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* User protected routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/enquiry" element={<Enquiry />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/chitty" element={<Chitty />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/chitty-enrollment" element={<ChittyEnroll />} />
        </Route>

        {/* Common route */}
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default Routing;
