// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Search, Clock, Users, Lock, Play, Star } from "lucide-react";
// import QuizLoginModal from "../components/QuizLoginModal";
// import { getPublicQuizzesByIds } from "../services/PublicQuizServices";

// const QuizHome = ({ onQuizStart, onLoginSuccess }) => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   useEffect(() => {
//     loadQuizzes();
//   }, []);

//   const loadQuizzes = async () => {
//     try {
//       // Utiliser la vraie API pour récupérer les quiz
//       // Construire la liste depuis les IDs publics (image 2)
//       const idsEnv = import.meta.env.VITE_PUBLIC_QUIZ_IDS || "";
//       const ids = idsEnv
//         .split(",")
//         .map((s) => parseInt(s.trim(), 10))
//         .filter((n) => !Number.isNaN(n));

//       if (ids.length > 0) {
//         const publicQuizzes = await getPublicQuizzesByIds(ids);
//         if (publicQuizzes.length > 0) {
//           console.log("Quiz publics chargés:", publicQuizzes.length);
//           setQuizzes(publicQuizzes);
//           return;
//         }
//       }
//       // Fallback vers les mocks si aucun ID ou aucun résultat
//       console.log(
//         "Aucun ID public fourni ou aucun résultat. Utilisation des mocks..."
//       );
//       const { mockApi } = await import("../data/mockQuizData");
//       const mockResponse = await mockApi.fetchQuizList(1, 50);
//       if (mockResponse && mockResponse.data) {
//         console.log("Quiz chargés depuis les mocks:", mockResponse.data.length);
//         setQuizzes(mockResponse.data);
//       }
//     } catch (error) {
//       console.error("Erreur lors du chargement des quiz:", error);
//       // Fallback vers les mocks en cas d'erreur
//       try {
//         console.log("Fallback vers les mocks après erreur...");
//         const { mockApi } = await import("../data/mockQuizData");
//         const mockResponse = await mockApi.fetchQuizList(1, 50);
//         if (mockResponse && mockResponse.data) {
//           console.log(
//             "Quiz chargés depuis les mocks (fallback):",
//             mockResponse.data.length
//           );
//           setQuizzes(mockResponse.data);
//         }
//       } catch (mockError) {
//         console.error("Erreur avec les mocks aussi:", mockError);
//         setQuizzes([]); // Au pire, tableau vide
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredQuizzes = quizzes.filter(
//     (quiz) =>
//       quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleQuizSelect = (quiz) => {
//     setSelectedQuiz(quiz);
//     setShowLoginModal(true);
//   };

//   const handleLoginSuccess = (userData) => {
//     if (onQuizStart && selectedQuiz) {
//       onQuizStart(selectedQuiz, userData);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const formatTime = (seconds) => {
//     if (seconds === null || typeof seconds === "undefined") return "00:00";
//     const mins = Math.floor(seconds / 60);
//     return `${mins}`;
//   };

//   const cardVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     },
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Header */}
//       <div className="relative overflow-hidden bg-white shadow-sm">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center"
//           >
//             <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
//               Découvrez nos{" "}
//               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Quiz Interactifs
//               </span>
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
//               Testez vos connaissances avec nos quiz spécialement conçus pour
//               vous challenger et vous faire progresser.
//             </p>

//             {/* Search Bar */}
//             <div className="max-w-md mx-auto relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Rechercher un quiz..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Quiz Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           {filteredQuizzes.map((quiz, index) => (
//             <motion.div
//               key={quiz.id}
//               variants={cardVariants}
//               whileHover={{ y: -8, scale: 1.02 }}
//               className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
//               onClick={() => handleQuizSelect(quiz)}
//             >
//               {/* Card Header */}
//               <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
//                 <div className="absolute inset-0 bg-black opacity-20"></div>
//                 <div className="absolute top-4 right-4">
//                   {quiz.password && (
//                     <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
//                       <Lock className="w-4 h-4 text-white" />
//                       <span className="text-white text-sm font-medium">
//                         Protégé
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="absolute bottom-4 left-4 right-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-4 h-4 ${
//                             i < (quiz.difficulty || 3)
//                               ? "text-yellow-400 fill-current"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-white text-sm font-medium">
//                       {quiz.difficulty || 3}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card Content */}
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//                   {quiz.title}
//                 </h3>
//                 <p className="text-gray-600 mb-4 line-clamp-2">
//                   {quiz.description || "Aucune description disponible"}
//                 </p>

//                 {/* Quiz Stats */}
//                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                   <div className="flex items-center gap-1">
//                     <Clock className="w-4 h-4" />
//                     <span>{formatTime(quiz.duration || 900)} min</span>
//                   </div>
//                   {/* <div className="flex items-center gap-1">
//                     <Users className="w-4 h-4" />
//                     <span>{quiz.participants || 0} participants</span>
//                   </div> */}
//                 </div>

//                 {/* Action Button */}
//                 <div className="flex items-center justify-between">
//                   <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
//                     <Play className="w-4 h-4" />
//                     Commencer
//                   </button>
//                   <div className="text-sm text-gray-500">
//                     {quiz.questions_count || 0} questions
//                   </div>
//                 </div>
//               </div>

//               {/* Hover Effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {filteredQuizzes.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-12"
//           >
//             <div className="text-gray-400 text-6xl mb-4">🔍</div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               Aucun quiz trouvé
//             </h3>
//             <p className="text-gray-500">
//               Essayez de modifier vos critères de recherche
//             </p>
//           </motion.div>
//         )}
//       </div>

//       {/* Login Modal */}
//       {showLoginModal && selectedQuiz && (
//         <QuizLoginModal
//           quiz={selectedQuiz}
//           isOpen={showLoginModal}
//           onClose={() => setShowLoginModal(false)}
//           onSuccess={handleLoginSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default QuizHome;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Lock, Star, BarChart3, ArrowRight } from "lucide-react";
import QuizLoginModal from "../components/QuizLoginModal";
import { getPublicQuizzesByIds } from "../services/PublicQuizServices";

// --- Fonction utilitaire pour la difficulté ---
const getDifficultyInfo = (level) => {
  switch (level) {
    case 1:
      return {
        text: "Facile",
        borderColor: "border-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-100",
      };
    case 2:
      return {
        text: "Normal",
        borderColor: "border-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-100",
      };
    case 3:
      return {
        text: "Difficile",
        borderColor: "border-orange-500",
        textColor: "text-orange-700",
        bgColor: "bg-orange-100",
      };
    case 4:
    default:
      return {
        text: "Moyen",
        borderColor: "border-amber-500",
        textColor: "text-amber-700",
        bgColor: "bg-amber-100",
      };
  }
};

const QuizHome = ({ onQuizStart, onLoginSuccess }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const idsEnv = import.meta.env.VITE_PUBLIC_QUIZ_IDS || "";
      const ids = idsEnv
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n));
      if (ids.length > 0) {
        const publicQuizzes = await getPublicQuizzesByIds(ids);
        if (publicQuizzes.length > 0) {
          setQuizzes(publicQuizzes);
          return;
        }
      }
      const { mockApi } = await import("../data/mockQuizData");
      const mockResponse = await mockApi.fetchQuizList(1, 50);
      if (mockResponse && mockResponse.data) {
        setQuizzes(mockResponse.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des quiz:", error);
      try {
        const { mockApi } = await import("../data/mockQuizData");
        const mockResponse = await mockApi.fetchQuizList(1, 50);
        if (mockResponse && mockResponse.data) {
          setQuizzes(mockResponse.data);
        }
      } catch (mockError) {
        console.error("Erreur avec les mocks aussi:", mockError);
        setQuizzes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userData) => {
    if (onQuizStart && selectedQuiz) {
      onQuizStart(selectedQuiz, userData);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || typeof seconds === "undefined") return "N/A";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Découvrez nos{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quiz Interactifs
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Testez vos connaissances avec nos quiz spécialement conçus pour
              vous challenger et vous faire progresser.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un quiz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredQuizzes.map((quiz) => {
            const difficulty = getDifficultyInfo(quiz.difficulty || 3);
            return (
              <motion.div
                key={quiz.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className={`group relative flex flex-col bg-white bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-xl hover:shadow-blue-500/10 border border-gray-200/50 transition-all duration-300 overflow-hidden cursor-pointer border-t-4 ${difficulty.borderColor}`}
                onClick={() => handleQuizSelect(quiz)}
              >
                <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                  {quiz.password && (
                    <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 flex items-center gap-2 text-white text-xs font-semibold">
                      <Lock className="w-3 h-3" />
                      <span>Protégé</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (quiz.difficulty || 3)
                            ? "text-yellow-300 fill-current"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${difficulty.bgColor} ${difficulty.textColor}`}
                    >
                      {difficulty.text}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-500 to-purple-500 transition-colors duration-300">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                      {quiz.description || "Aucune description disponible."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-500/5 p-3 rounded-xl flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Durée</p>
                        <p className="font-bold text-gray-700">
                          {formatTime(quiz.duration || 900)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-500/5 p-3 rounded-xl flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Questions</p>
                        <p className="font-bold text-gray-700">
                          {quiz.questions_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-200/80">
                    <div className="flex justify-between items-center text-blue-600 font-semibold">
                      <span>Lancer le Quiz</span>
                      <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredQuizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun quiz trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </motion.div>
        )}
      </div>

      {showLoginModal && selectedQuiz && (
        <QuizLoginModal
          quiz={selectedQuiz}
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default QuizHome;
