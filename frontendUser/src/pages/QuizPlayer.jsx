// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ChevronLeft, 
//   ChevronRight, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   Home,
//   BarChart3,
//   RotateCcw,
//   Play,
//   Pause
// } from 'lucide-react';
// import { 
//   getPublicQuizInfo, 
//   startPublicQuizSession, 
//   getSessionQuestions,
//   submitSessionAnswer,
//   submitSession,
//   getSessionResults
// } from '../services/PublicQuizServices';


// //==================================================================
// // Results Component
// //==================================================================
// const QuizResults = ({ results, quizInfo, userData, onRetry, onHome }) => {
//   const score = results?.score || 0;
//   const totalQuestions = results?.total_questions || 0;
//   const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
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
//             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
//               <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="2" />
//               <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={isExcellent ? "#10b981" : isGood ? "#3b82f6" : isAverage ? "#f59e0b" : "#ef4444"} strokeWidth="2" strokeDasharray={`0, 100`} animate={{ strokeDasharray: `${percentage}, 100` }} transition={{ duration: 1, ease: "easeInOut" }} strokeLinecap="round" />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">{isExcellent ? "Excellent ! 🎉" : isGood ? "Très bien ! 👏" : isAverage ? "Pas mal ! 👍" : "Continuez ! 💪"}</h2>
//           <p className="text-gray-600 mb-6">Vous avez obtenu {score} bonnes réponses sur {totalQuestions}.</p>
//           <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
//             <h3 className="font-semibold text-gray-900 mb-2">Détails</h3>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p><strong>Quiz:</strong> {quizInfo?.title}</p>
//               <p><strong>Email:</strong> {userData?.email}</p>
//               <p><strong>Téléphone:</strong> {userData?.phone}</p>
//             </div>
//           </div>
//           <div className="space-y-3">
//             <button onClick={onRetry} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"><RotateCcw className="w-5 h-5" /> Recommencer</button>
//             <button onClick={onHome} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"><Home className="w-5 h-5" /> Retour à l'accueil</button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// //==================================================================
// // Main Quiz Player Component
// //==================================================================
// const QuizPlayer = ({ quizId, userData, onFinish }) => {
//   const [quizInfo, setQuizInfo] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [sessionToken, setSessionToken] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [answerStatus, setAnswerStatus] = useState({});
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showResults, setShowResults] = useState(false);
//   const [finalResults, setFinalResults] = useState(null);

//   // Nouvelle structure pour stocker la bonne réponse pour chaque question
//   const [correctAnswersMap, setCorrectAnswersMap] = useState({});

//   useEffect(() => {
//     const initializeQuiz = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const infoResponse = await getPublicQuizInfo(quizId);
//         if (!infoResponse?.success) throw new Error("Could not load quiz information.");
//         setQuizInfo(infoResponse.data.quiz);

//         const sessionResponse = await startPublicQuizSession(quizId, userData);
//         if (!sessionResponse?.success) throw new Error(sessionResponse?.message || "Could not start the quiz session.");
//         const token = sessionResponse.data.session_token;
//         setSessionToken(token);
//         setTimeLeft(sessionResponse.data.time_limit);

//         const questionsResponse = await getSessionQuestions(token);
//         if (!questionsResponse?.success) throw new Error("Could not load the questions.");
//         setQuestions(questionsResponse.data.questions || []); // Access the nested 'questions' array
//         setTimeLeft(questionsResponse.data.time_limit); 
        
//         setIsTimerRunning(true);

//         // Création du mapping questionId => bonne réponse (option)
//         const correctMap = {};
//         (questionsResponse.data.questions || []).forEach(q => {
//           const correctOption = q.options.find(opt => opt.is_correct);
//           if (correctOption) {
//             correctMap[q.id] = correctOption;
//           }
//         });
//         setCorrectAnswersMap(correctMap);

//       } catch (err) {
//         console.error("Quiz Initialization Error:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initializeQuiz();
//   }, [quizId, userData]);

//   useEffect(() => {
//     if (timeLeft !== null && isTimerRunning && timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeLeft === 0) {
//       handleFinishQuiz();
//     }
//   }, [timeLeft, isTimerRunning]);

//   const handleAnswerSelect = async (questionId, optionId) => {
//     if (answerStatus[questionId]) return;
  
//     // Utiliser le mapping correctAnswersMap pour obtenir la bonne réponse
//     const correctOption = correctAnswersMap[questionId];
//     const isCorrect = correctOption && optionId === correctOption.id;
    
//     setAnswers(prev => ({ ...prev, [questionId]: optionId }));
//     setAnswerStatus(prev => ({
//       ...prev,
//       [questionId]: isCorrect ? 'correct' : 'incorrect'
//     }));
  
//     try {
//       await submitSessionAnswer(sessionToken, questionId, String(optionId));
//     } catch (err) {
//       console.error("Erreur lors de l'envoi de la réponse:", err);
//     }
//   };

//   const handleFinishQuiz = useCallback(async () => {
//     if (!sessionToken) return;
//     setIsTimerRunning(false);
//     setLoading(true);
//     try {
//       await submitSession(sessionToken);
//       const resultsResponse = await getSessionResults(sessionToken);
//       if (resultsResponse?.success) {
//         setFinalResults(resultsResponse.data);
//       }
//       setShowResults(true);
//     } catch (err) {
//       console.error("Error finalizing quiz:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionToken]);

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleRetry = () => {
//     window.location.reload();
//   };

//   const formatTime = (seconds) => {
//     if (seconds === null) return '00:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const currentQuestion = questions[currentQuestionIndex];

//   // --- RENDER STATES ---

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4 text-center">
//         <div>
//           <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-slate-800">An Error Occurred</h2>
//           <p className="text-slate-600 mt-2">{error}</p>
//           <button onClick={onFinish} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg">Return Home</button>
//         </div>
//       </div>
//     );
//   }

//   if (showResults) {
//     return (
//       <QuizResults 
//         results={finalResults}
//         quizInfo={quizInfo}
//         userData={userData}
//         onRetry={handleRetry}
//         onHome={onFinish}
//       />
//     );
//   }

//   // --- MAIN RENDER ---
//   // If we get here, it means loading is false, there are no errors, and results are not shown.
//   // We can safely assume `currentQuestion` exists (if the questions array is not empty).
  
//   if (!currentQuestion) {
//      return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 text-center">
//           <div>
//             <h2 className="text-2xl font-bold text-slate-800">No questions found for this quiz.</h2>
//             <button onClick={onFinish} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg">Return Home</button>
//           </div>
//         </div>
//      );
//   }

//   // Prepare the correct icon for the timer button
//   const TimerIcon = isTimerRunning ? Pause : Play;

//   // Récupérer la bonne réponse pour la question courante
//   const correctOptionForCurrent = correctAnswersMap[currentQuestion.id];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="bg-white shadow-sm border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"><BarChart3 className="w-6 h-6 text-white" /></div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">{quizInfo?.title}</h1>
//                 <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
//               <Clock className="w-4 h-4 text-gray-600" />
//               <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>{formatTime(timeLeft)}</span>
//               <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="ml-2 p-1 hover:bg-gray-200 rounded-full">
//                 <TimerIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <motion.div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} transition={{ duration: 0.5 }} />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentQuestionIndex}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white rounded-2xl shadow-lg p-8"
//           >
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion.question_text}</h2>
//             </div>

//             <div className="space-y-4 mb-8">
//               {currentQuestion.options?.map((option) => {
//                 const isSelected = answers[currentQuestion.id] === option.id;
//                 const status = answerStatus[currentQuestion.id];
//                 // On détermine si c'est la bonne réponse pour affichage
//                 const isCorrectOption = correctOptionForCurrent && option.id === correctOptionForCurrent.id;
//                 return (
//                   <motion.button
//                     key={option.id}
//                     onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
//                     disabled={!!status}
//                     className={
//                       `w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between ` +
//                       (isSelected && status === 'correct'
//                         ? 'border-green-500 bg-green-50 shadow-md'
//                         : isSelected && status === 'incorrect'
//                         ? 'border-red-500 bg-red-50 shadow-md'
//                         : !isSelected && !status
//                         ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                         : status && !isSelected
//                         ? 'border-gray-200 opacity-60'
//                         : '') +
//                       // Affichage de la bonne réponse en vert si l'utilisateur s'est trompé
//                       (status === 'incorrect' && isCorrectOption
//                         ? ' border-green-500 bg-green-50'
//                         : '')
//                     }
//                     whileHover={!status ? { scale: 1.02 } : {}}
//                     whileTap={!status ? { scale: 0.98 } : {}}
//                   >
//                     <span className="font-medium text-gray-900">{option.option_text}</span>
//                     {isSelected && status === 'correct' && <CheckCircle className="w-6 h-6 text-green-500" />}
//                     {isSelected && status === 'incorrect' && <XCircle className="w-6 h-6 text-red-500" />}
//                     {/* Affichage d'une icône verte sur la bonne réponse si l'utilisateur s'est trompé */}
//                     {status === 'incorrect' && isCorrectOption && <CheckCircle className="w-6 h-6 text-green-500" />}
//                   </motion.button>
//                 );
//               })}
//               {/* Affichage explicite de la bonne réponse si l'utilisateur s'est trompé */}
//               {answerStatus[currentQuestion.id] === 'incorrect' && correctOptionForCurrent && (
//                 <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                   <span className="text-green-700 font-semibold">
//                     Bonne réponse : {correctOptionForCurrent.option_text}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center justify-between">
//               <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /> Previous</button>
//               {currentQuestionIndex === questions.length - 1 ? (
//                 <button onClick={handleFinishQuiz} disabled={!answers[currentQuestion.id]} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg disabled:opacity-50"><CheckCircle className="w-5 h-5" /> Finish Quiz</button>
//               ) : (
//                 <button onClick={handleNextQuestion} disabled={!answers[currentQuestion.id]} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50">Next <ChevronRight className="w-5 h-5" /></button>
//               )}
//             </div>
//           </motion.div>
//         </AnimatePresence>
        
//         <div className="mt-8 flex justify-center">
//           <div className="flex gap-2">
//             {questions.map((q, index) => (
//               <button
//                 key={q.id}
//                 onClick={() => setCurrentQuestionIndex(index)}
//                 className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentQuestionIndex ? 'bg-blue-600 scale-125' : answerStatus[q.id] ? (answerStatus[q.id] === 'correct' ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300 hover:bg-gray-400'}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizPlayer;

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Home,
  BarChart3,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import { 
  getPublicQuizInfo, 
  startPublicQuizSession, 
  getSessionQuestions,
  submitSessionAnswer,
  submitSession,
  getSessionResults
} from '../services/PublicQuizServices';


//==================================================================
// Composant pour afficher les résultats
//==================================================================
const QuizResults = ({ results, quizInfo, userData, onRetry, onHome }) => {
  const score = results?.score || 0;
  const totalQuestions = results?.total_questions || 0;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
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
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={isExcellent ? "#10b981" : isGood ? "#3b82f6" : isAverage ? "#f59e0b" : "#ef4444"} strokeWidth="2" strokeDasharray={`0, 100`} animate={{ strokeDasharray: `${percentage}, 100` }} transition={{ duration: 1, ease: "easeInOut" }} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isExcellent ? "Excellent ! 🎉" : isGood ? "Très bien ! 👏" : isAverage ? "Pas mal ! 👍" : "Continuez ! 💪"}</h2>
          <p className="text-gray-600 mb-6">Vous avez obtenu {score} bonnes réponses sur {totalQuestions} questions.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Détails</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Quiz:</strong> {quizInfo?.title}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Téléphone:</strong> {userData?.phone}</p>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={onRetry} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"><RotateCcw className="w-5 h-5" /> Recommencer</button>
            <button onClick={onHome} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"><Home className="w-5 h-5" /> Retour à l'accueil</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


//==================================================================
// Composant principal du Quiz Player
//==================================================================
const QuizPlayer = ({ quizId, userData, onFinish }) => {
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answerStatus, setAnswerStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [finalResults, setFinalResults] = useState(null);

  useEffect(() => {
    const initializeQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const infoResponse = await getPublicQuizInfo(quizId);
        if (!infoResponse?.success) throw new Error("Impossible de charger les informations du quiz.");
        setQuizInfo(infoResponse.data.quiz);

        const sessionResponse = await startPublicQuizSession(quizId, userData);
        if (!sessionResponse?.success) throw new Error(sessionResponse?.message || "Impossible de démarrer la session.");
        const token = sessionResponse.data.session_token;
        setSessionToken(token);
        
        const questionsResponse = await getSessionQuestions(token);
        if (!questionsResponse?.success) throw new Error("Impossible de charger les questions.");
        
        // --- LA MISE À JOUR EST ICI ---
        // On nettoie les données pour s'assurer que `is_correct` est un booléen.
        const cleanedQuestions = (questionsResponse.data.questions || []).map(question => ({
            ...question,
            options: (question.options || []).map(option => ({
                ...option,
                is_correct: !!option.is_correct // Convertit 1 en true, 0 en false
            }))
        }));

        setQuestions(cleanedQuestions);
        setTimeLeft(questionsResponse.data.time_limit || sessionResponse.data.time_limit); 
        
        setIsTimerRunning(true);
      } catch (err) {
        console.error("Erreur d'initialisation du Quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initializeQuiz();
  }, [quizId, userData]);

  useEffect(() => {
    if (timeLeft !== null && isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinishQuiz();
    }
  }, [timeLeft, isTimerRunning]);

  const handleAnswerSelect = async (questionId, optionId) => {
    if (answerStatus[questionId]) return;
  
    // 1. On envoie la réponse de l'utilisateur
    try {
      const response = await submitSessionAnswer(sessionToken, questionId, String(optionId));
  
      // 2. ON UTILISE LA RÉPONSE DE L'API pour mettre à jour l'UI
      if (response && response.success) {
        const { is_correct, correct_option_id } = response.data;
  
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        setAnswerStatus(prev => ({
          ...prev,
          // La vérité vient du backend !
          [questionId]: is_correct ? 'correct' : 'incorrect'
        }));
  
        // Si la réponse était incorrecte, on met à jour la question avec la bonne réponse
        if (!is_correct) {
          setQuestions(prevQuestions => prevQuestions.map(q => {
            if (q.id === questionId) {
              return {
                ...q,
                // On ajoute une propriété temporaire pour savoir quelle était la bonne réponse
                correctAnswerId: correct_option_id
              };
            }
            return q;
          }));
        }
      } else {
        // Gérer le cas où la soumission de la réponse échoue
        console.error("La soumission de la réponse a échoué:", response);
      }
      
    } catch (err) {
      console.error("Erreur lors de l'envoi de la réponse:", err);
    }
  };

  const handleFinishQuiz = useCallback(async () => {
    if(!sessionToken) return;
    setIsTimerRunning(false);
    setLoading(true);
    try {
      await submitSession(sessionToken);
      const resultsResponse = await getSessionResults(sessionToken);
      if (resultsResponse?.success) {
        setFinalResults(resultsResponse.data.results); // Accès à la clé 'results'
      }
      setShowResults(true);
    } catch (err) {
      console.error("Erreur lors de la finalisation du quiz:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionToken]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleRetry = () => {
    window.location.reload();
  };

  const formatTime = (seconds) => {
    if(seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const TimerIcon = isTimerRunning ? Pause : Play;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4 text-center">
        <div>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Une erreur est survenue</h2>
          <p className="text-slate-600 mt-2">{error}</p>
          <button onClick={onFinish} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <QuizResults 
        results={finalResults}
        quizInfo={quizInfo}
        userData={userData}
        onRetry={handleRetry}
        onHome={onFinish}
      />
    );
  }
  
  if (!currentQuestion) {
     return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 text-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Aucune question trouvée pour ce quiz.</h2>
            <button onClick={onFinish} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg">Retour à l'accueil</button>
          </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"><BarChart3 className="w-6 h-6 text-white" /></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{quizInfo?.title}</h1>
                <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} sur {questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>{formatTime(timeLeft)}</span>
              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="ml-2 p-1 hover:bg-gray-200 rounded-full">
                <TimerIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion.question_text}</h2>
            </div>

            <div className="space-y-4 mb-8">
              {currentQuestion.options?.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                const status = answerStatus[currentQuestion.id];
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    disabled={!!status}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${isSelected && status === 'correct' ? 'border-green-500 bg-green-50 shadow-md' : ''} ${isSelected && status === 'incorrect' ? 'border-red-500 bg-red-50 shadow-md' : ''} ${!isSelected && !status ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' : ''} ${status && !isSelected ? 'border-gray-200 opacity-60' : ''}`}
                    whileHover={!status ? { scale: 1.02 } : {}}
                    whileTap={!status ? { scale: 0.98 } : {}}
                  >
                    <span className="font-medium text-gray-900">{option.option_text}</span>
                    {isSelected && status === 'correct' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {isSelected && status === 'incorrect' && <XCircle className="w-6 h-6 text-red-500" />}
                  </motion.button>
                );
              })}
              {answerStatus[currentQuestion.id] === 'incorrect' && (
  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
    <CheckCircle className="w-5 h-5 text-green-600" />
    <span className="text-green-700 font-semibold">
      Bonne réponse : 
      {/* On cherche l'option dont l'ID correspond à `correctAnswerId` qu'on a stocké */}
      {currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswerId)?.option_text}
    </span>
  </div>
)}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /> Précédent</button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button onClick={handleFinishQuiz} disabled={!answers[currentQuestion.id]} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg disabled:opacity-50"><CheckCircle className="w-5 h-5" /> Terminer le Quiz</button>
              ) : (
                <button onClick={handleNextQuestion} disabled={!answers[currentQuestion.id]} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50">Suivant <ChevronRight className="w-5 h-5" /></button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentQuestionIndex ? 'bg-blue-600 scale-125' : answerStatus[q.id] ? (answerStatus[q.id] === 'correct' ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
