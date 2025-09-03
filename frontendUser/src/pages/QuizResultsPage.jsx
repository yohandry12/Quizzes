// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Home, RotateCcw } from "lucide-react";
// import { getSessionResults } from "../services/PublicQuizServices";

// const QuizResultsUI = ({ userData, results, quizInfo, onRetry, onHome }) => {
//   const score = results?.correct_answers || 0;
//   const totalQuestions = results?.total_questions || 0;
//   const percentage =
//     totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
//   const isExcellent = percentage >= 90;
//   const isGood = percentage >= 70;
//   const isAverage = percentage >= 50;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
//       >
//         <div className="text-center">
//           <div className="relative w-32 h-32 mx-auto mb-6">
//             <svg
//               className="w-full h-full transform -rotate-90"
//               viewBox="0 0 36 36"
//             >
//               <path
//                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                 fill="none"
//                 stroke="#e5e7eb"
//                 strokeWidth="2"
//               />
//               <motion.path
//                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                 fill="none"
//                 stroke={
//                   isExcellent
//                     ? "#10b981"
//                     : isGood
//                     ? "#3b82f6"
//                     : isAverage
//                     ? "#f59e0b"
//                     : "#ef4444"
//                 }
//                 strokeWidth="2"
//                 strokeDasharray={`0, 100`}
//                 animate={{ strokeDasharray: `${percentage}, 100` }}
//                 transition={{ duration: 1, ease: "easeInOut" }}
//                 strokeLinecap="round"
//               />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className="text-3xl font-bold text-gray-900">
//                 {percentage}%
//               </span>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             {isExcellent
//               ? "Excellent ! 🎉"
//               : isGood
//               ? "Très bien ! 👏"
//               : isAverage
//               ? "Pas mal ! 👍"
//               : "Continuez ! 💪"}
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Vous avez obtenu {score} bonnes réponses sur {totalQuestions}{" "}
//             questions.
//           </p>
//           <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
//             <h3 className="font-semibold text-gray-900 mb-2">Détails</h3>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p>
//                 <strong>Quiz:</strong> {quizInfo?.title}
//               </p>
//               <p>
//                 <strong>Nom:</strong> {results?.candidate_name || "N/A"}
//               </p>
//               <p>
//                 <strong>Réussi:</strong> {results?.is_passed ? "Oui" : "Non"}
//               </p>
//               <p>
//                 <strong>Score de passage:</strong> {results?.passing_score}%
//               </p>
//               <p>
//                 <strong>Terminé le:</strong>{" "}
//                 {new Date(results?.completed_at).toLocaleString("fr-FR")}
//               </p>
//               <p>
//                 <strong>Temps écoulé (s):</strong> {results?.time_spent}
//               </p>
//             </div>
//           </div>
//           <div className="space-y-3">
//             <button
//               onClick={onRetry}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
//             >
//               <RotateCcw className="w-5 h-5" /> Recommencer
//             </button>
//             <button
//               onClick={onHome}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
//             >
//               <Home className="w-5 h-5" /> Retour à l'accueil
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default function QuizResultsPage() {
//   const { sessionToken } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [resultsData, setResultsData] = useState(location.state || null);

//   useEffect(() => {
//     if (!resultsData && sessionToken) {
//       const fetchResults = async () => {
//         setLoading(true);
//         try {
//           const response = await getSessionResults(sessionToken);
//           if (response?.success) {
//             setResultsData(response.data);
//           } else {
//             throw new Error("Impossible de récupérer les résultats.");
//           }
//         } catch (err) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchResults();
//     } else {
//       setLoading(false);
//     }
//   }, [sessionToken, resultsData]);

//   const handleRetry = () => navigate("/quiz-player");
//   const handleHome = () => navigate("/quiz-player");

//   if (loading) return <div>Chargement...</div>;
//   if (error) return <div>Erreur: {error}</div>;
//   if (!resultsData) return <div>Aucun résultat trouvé.</div>;

//   return (
//     <QuizResultsUI
//       results={resultsData.results}
//       quizInfo={resultsData.quizInfo}
//       onRetry={handleRetry}
//       onHome={handleHome}
//     />
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RotateCcw, Loader2 } from "lucide-react"; // Ajout de l'icône de chargement
import {
  getSessionResults,
  getPublicQuizInfo,
} from "../services/PublicQuizServices";

// Le composant d'affichage (UI) reste le même
const QuizResultsUI = ({ results, quizInfo, onHome }) => {
  const score = results?.correct_answers || 0;
  const totalQuestions = results?.total_questions || 0;
  const percentage = results?.percentage_score || 0;
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 70;
  const isAverage = percentage >= 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  isExcellent
                    ? "#10b981"
                    : isGood
                    ? "#3b82f6"
                    : isAverage
                    ? "#f59e0b"
                    : "#ef4444"
                }
                strokeWidth="2"
                strokeDasharray={`0, 100`}
                animate={{ strokeDasharray: `${percentage}, 100` }}
                transition={{ duration: 1, ease: "easeInOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {percentage}%
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isExcellent
              ? "Excellent ! 🎉"
              : isGood
              ? "Très bien ! 👏"
              : isAverage
              ? "Pas mal ! 👍"
              : "Continuez ! 💪"}
          </h2>
          <p className="text-gray-600 mb-6">
            Vous avez obtenu {score} bonnes réponses sur {totalQuestions}{" "}
            questions.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Détails</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Quiz:</strong>{" "}
                {quizInfo?.title || results?.quiz_title || "N/A"}
              </p>
              <p>
                <strong>Nom:</strong> {results?.candidate_name || "N/A"}
              </p>
              <p>
                <strong>Réussi:</strong> {results?.is_passed ? "Oui" : "Non"}
              </p>
              <p>
                <strong>Score de passage:</strong> {results?.passing_score}%
              </p>
              <p>
                <strong>Terminé le:</strong>{" "}
                {results?.completed_at
                  ? new Date(results.completed_at).toLocaleString("fr-FR")
                  : "N/A"}
              </p>
              <p>
                <strong>Temps écoulé (s):</strong> {results?.time_spent}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={onHome}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Home className="w-5 h-5" /> Retour à l'accueil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function QuizResultsPage() {
  const { sessionToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);
  const [pendingMessage, setPendingMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getSessionResults(sessionToken);

        // Cas 1: Les résultats sont prêts
        if (response?.data?.results) {
          setFinalResults(response.data.results);
          if (response.data.results.quiz_id) {
            const info = await getPublicQuizInfo(response.data.results.quiz_id);
            setQuizInfo(info?.data?.quiz);
          }
        }
        // Cas 2: Les résultats ne sont pas prêts, on a un message
        else if (response?.data?.message) {
          setPendingMessage(response.data.message);
        }
        // Cas 3: Réponse inattendue
        else {
          throw new Error(
            "La réponse de l'API pour les résultats est dans un format inattendu."
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sessionToken]);

  const handleHome = () => navigate("/quiz-player");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Récupération de vos résultats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Erreur: {error}
      </div>
    );
  }

  // Si on a un message d'attente, on l'affiche
  if (pendingMessage && !finalResults) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Quiz terminé !
        </h2>
        <p className="text-gray-600 max-w-md mb-8">{pendingMessage}</p>
        <button
          onClick={handleHome}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Si on a les résultats, on les affiche
  if (finalResults) {
    return (
      <QuizResultsUI
        results={finalResults}
        quizInfo={quizInfo}
        onHome={handleHome}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      Aucun résultat trouvé pour cette session.
    </div>
  );
}
