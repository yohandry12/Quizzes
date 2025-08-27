import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Categories from "./pages/Categories";
import BusinessSectors from "./pages/BusinessSectors";
import QuizDetailsPage from "./pages/QuizDetailsPage";

function RequireAuth({ children }) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/quiz"
          element={
            <RequireAuth>
              <Quiz />
            </RequireAuth>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <RequireAuth>
              <QuizDetailsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/categories"
          element={
            <RequireAuth>
              <Categories />
            </RequireAuth>
          }
        />
        <Route
          path="/business-sectors"
          element={
            <RequireAuth>
              <BusinessSectors />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
