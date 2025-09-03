import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuizDemo from "./components/QuizDemo";
// import QuizNavigation from "./components/QuizNavigation";
import QuizHome from "./pages/QuizHome";
import QuizPlayer from "./pages/QuizPlayer";
import QuizResultsPage from "./pages/QuizResultsPage";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route pour l'interface utilisateur des quiz */}
        <Route path="/quiz-player" element={<QuizHome />} />
        {/* Route pour un quiz spécifique, avec son ID dans l'URL */}
        <Route path="/quiz-player/:quizId" element={<QuizPlayer />} />
        {/* Route pour la page des résultats, avec l'ID de la session dans l'URL */}
        <Route
          path="/quiz-player/results/:sessionToken"
          element={<QuizResultsPage />}
        />
        {/* Route pour la démo du template */}
        <Route path="/quiz-demo" element={<QuizDemo />} />
        {/* Redirection : si quelqu'un arrive à la racine, on le redirige */}
        <Route path="/" element={<Navigate to="/quiz-player" />} />
      </Routes>
    </BrowserRouter>
  );
}
