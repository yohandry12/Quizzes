import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuizDemo from "./components/QuizDemo";
import QuizNavigation from "./components/QuizNavigation";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route pour l'interface utilisateur des quiz */}
        <Route path="/quiz-player" element={<QuizNavigation />} />
        {/* Route pour la démo du template */}
        <Route path="/quiz-demo" element={<QuizDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
