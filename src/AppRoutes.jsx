import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Categories from "./pages/Categories";
import BusinessSectors from "./pages/BusinessSectors";
import QuizDetailsPage from "./pages/QuizDetailsPage";
import Questions from "./pages/Questions.jsx";
import DesignerCV from "./pages/designer-cv-portfolio.jsx";

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
          path="/"
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
        <Route
          path="/questions"
          element={
            <RequireAuth>
              <Questions />
            </RequireAuth>
          }
        />

        <Route path="/template" element={<DesignerCV />} />
      </Routes>
    </BrowserRouter>
  );
}
