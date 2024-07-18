import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

import StudentForm from "views/examples/StudentForm";
import { isAuthenticated } from "./utils";

const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/auth/login" state={{ from: path }} replace />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/*" element={<AuthLayout />} />

      {/* Private Routes */}
      <Route
        path="/students/*"
        element={<PrivateRoute element={<AdminLayout />} path="/students/*" />}
      />
      
      {/* StudentForm routes */}
      <Route
        path="/students/edit-student/:id"
        element={<PrivateRoute element={<StudentForm mode="edit" />} path="/edit-student/:id" />}
      />
      <Route
        path="/students/add-student/"
        element={<PrivateRoute element={<StudentForm />} path="/add-student/" />}
      />

      Default Redirect
      <Route path="*" element={<Navigate to="/students/admin" replace />} />
    </Routes>
  </BrowserRouter>
);
