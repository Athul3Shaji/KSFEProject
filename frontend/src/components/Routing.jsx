import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Enquiry from "./Enquiry";
import AdminLogin from "./AdminLogin";

const Routing = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/admin" element={<AdminLogin />} />
          {/* <Route path="/*" element={<ErrorPage />} /> */}
        </Routes>
      </Router>
    </>
  );
};

export default Routing;
