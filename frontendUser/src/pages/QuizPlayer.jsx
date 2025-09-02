import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Pause,
} from "lucide-react";
import {
  getPublicQuizInfo,
  startPublicQuizSession,
  getSessionQuestions,
  submitSessionAnswer,
  submitSession,
  getSessionResults,
} from "../services/PublicQuizServices";

//==================================================================
// Composant pour afficher les résultats
//==================================================================
const QuizResults = ({ userData, results, quizInfo, onRetry, onHome }) => {
  const score = results?.score || 0;
  const totalQuestions = results?.data.results.total_questions || 0;
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
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
                <strong>Quiz:</strong> {quizInfo?.title}
              </p>
              <p>
                <strong>Nom:</strong> {userData?.candidate_name}
              </p>
              <p>
                <strong>Réussi:</strong> {userData?.is_passed ? "Oui" : "Non"}
              </p>
              <p>
                <strong>Score de passage:</strong> {userData?.passing_score}
              </p>
              <p>
                <strong>Terminé le:</strong> {userData?.completed_at}
              </p>
              <p>
                <strong>Temps écoulé (s):</strong> {userData?.time_spent}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" /> Recommencer
            </button>
            <button
              onClick={onHome}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <Home className="w-5 h-5" /> Retour à l'accueil
            </button>
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
  const [answers, setAnswers] = useState({}); // Pour MCQ: {questionId: [optionId1, optionId2]}
  const [answerStatus, setAnswerStatus] = useState({});
  const [questionValidated, setQuestionValidated] = useState({});
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
        if (!infoResponse?.success)
          throw new Error("Impossible de charger les informations du quiz.");

        const quizData = infoResponse.data.quiz;
        const convertedQuizData = {
          ...quizData,
          time_limit_minutes: quizData.time_limit
            ? Math.floor(quizData.time_limit / 60)
            : 0,
        };
        setQuizInfo(convertedQuizData);

        const sessionResponse = await startPublicQuizSession(quizId, userData);
        if (!sessionResponse?.success)
          throw new Error(
            sessionResponse?.message || "Impossible de démarrer la session."
          );
        const token = sessionResponse.data.session_token;
        setSessionToken(token);

        const questionsResponse = await getSessionQuestions(token);
        // --> AJOUTEZ CECI POUR DÉBOGUER <--
        console.log(
          "Données brutes de l'API:",
          questionsResponse.data.questions
        );
        if (!questionsResponse?.success)
          throw new Error("Impossible de charger les questions.");

        const cleanedQuestions = (questionsResponse.data.questions || []).map(
          (question) => ({
            ...question,
            options: (question.options || []).map((option) => ({
              ...option,
              is_correct: [true, 1, "1", "true"].includes(option.is_correct),
            })),
          })
        );

        setQuestions(cleanedQuestions);
        setTimeLeft(
          questionsResponse.data.time_limit || sessionResponse.data.time_limit
        );

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
    if (questionValidated[questionId]) return;

    const currentQuestion = questions.find((q) => q.id === questionId);
    if (!currentQuestion) return;

    const isMCQ = currentQuestion.question_type === "mcq";

    if (isMCQ) {
      // Pour les questions à choix multiples
      setAnswers((prev) => {
        const currentAnswers = prev[questionId] || [];
        const isSelected = currentAnswers.includes(optionId);

        if (isSelected) {
          // Désélectionner
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== optionId),
          };
        } else {
          // Sélectionner
          return {
            ...prev,
            [questionId]: [...currentAnswers, optionId],
          };
        }
      });
    } else {
      // Pour les questions à réponse unique
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

      // Validation immédiate pour les questions à réponse unique
      await validateAnswer(questionId, [optionId], currentQuestion);
    }
  };

  const validateAnswer = async (
    questionId,
    selectedOptions,
    currentQuestion
  ) => {
    try {
      console.log("Validation de la réponse:", { questionId, selectedOptions });

      // Validation côté client
      const correctOptions = currentQuestion.options
        .filter((option) => option.is_correct === true) // Vérification simple sur le booléen
        .map((opt) => opt.id);

      const isMCQ = currentQuestion.question_type === "mcq";
      let isCorrectAnswer = false;

      if (isMCQ) {
        // Pour MCQ: toutes les bonnes réponses doivent être sélectionnées et aucune mauvaise
        const selectedSet = new Set(selectedOptions);
        const correctSet = new Set(correctOptions);
        isCorrectAnswer =
          selectedSet.size === correctSet.size &&
          [...selectedSet].every((id) => correctSet.has(id));
      } else {
        // Pour réponse unique
        isCorrectAnswer =
          selectedOptions.length === 1 &&
          correctOptions.includes(selectedOptions[0]);
      }


      // Envoi vers l'API
      for (const optionId of selectedOptions) {
        await submitSessionAnswer(sessionToken, questionId, String(optionId));
      }

      // Mise à jour du statut
      setAnswerStatus((prev) => ({
        ...prev,
        [questionId]: isCorrectAnswer ? "correct" : "incorrect",
      }));

      setQuestionValidated((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    } catch (err) {
      console.error("Erreur lors de la validation de la réponse:", err);
    }
  };

  const handleValidateMCQ = async (questionId) => {
    const currentQuestion = questions.find((q) => q.id === questionId);
    const selectedOptions = answers[questionId] || [];

    if (selectedOptions.length === 0) {
      alert("Veuillez sélectionner au moins une réponse.");
      return;
    }

    await validateAnswer(questionId, selectedOptions, currentQuestion);
  };

  const handleFinishQuiz = useCallback(async () => {
    if (!sessionToken) return;
    setIsTimerRunning(false);
    setLoading(true);
    try {
      await submitSession(sessionToken);
      const resultsResponse = await getSessionResults(sessionToken);
      if (resultsResponse?.success) {
        setFinalResults(resultsResponse.data.results);
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
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const formatTime = (seconds) => {
    if (seconds === null || typeof seconds === "undefined") return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isQuestionAnswered = (questionId) => {
    const currentQuestion = questions.find((q) => q.id === questionId);
    if (!currentQuestion) return false;

    if (currentQuestion.question_type === "mcq") {
      return questionValidated[questionId];
    } else {
      return answers[questionId] !== undefined;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const TimerIcon = isTimerRunning ? Pause : Play;

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4 text-center">
        <div>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">
            Une erreur est survenue
          </h2>
          <p className="text-slate-600 mt-2">{error}</p>
          <button
            onClick={onFinish}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg"
          >
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
          <h2 className="text-2xl font-bold text-slate-800">
            Aucune question trouvée pour ce quiz.
          </h2>
          <button
            onClick={onFinish}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const isMCQ = currentQuestion.question_type === "mcq";
  const selectedAnswers = answers[currentQuestion.id] || (isMCQ ? [] : null);
  const isValidated = questionValidated[currentQuestion.id];
  const status = answerStatus[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {quizInfo?.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} sur {questions.length}
                  {isMCQ && (
                    <span className="text-blue-600 ml-2">
                      (Choix multiples)
                    </span>
                  )}
                </p>
                {quizInfo?.time_limit_minutes !== undefined && (
                  <p className="text-xs text-gray-400">
                    Temps limite du quiz : {quizInfo.time_limit_minutes} min
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-gray-600" />
              <span
                className={`font-mono font-bold text-lg ${
                  timeLeft < 60 ? "text-red-600" : "text-gray-700"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="ml-2 p-1 hover:bg-gray-200 rounded-full"
              >
                <TimerIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                animate={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentQuestion.question_text}
              </h2>
              {isMCQ && (
                <p className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">
                  💡 Plusieurs réponses peuvent être correctes
                </p>
              )}
            </div>

            <div className="space-y-4 mb-8">
              {currentQuestion.options?.map((option) => {
                const isSelected = isMCQ
                  ? selectedAnswers.includes(option.id)
                  : selectedAnswers === option.id;

                const isCorrect = option.is_correct;

                let buttonClass =
                  "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";

                if (!isValidated) {
                  // Avant validation
                  buttonClass += isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                } else {
                  // Après validation
                  if (isSelected && isCorrect) {
                    buttonClass += "border-green-500 bg-green-50 shadow-md";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "border-red-500 bg-red-50 shadow-md";
                  } else if (!isSelected && isCorrect) {
                    buttonClass += "border-green-500 bg-green-100 shadow-md";
                  } else {
                    buttonClass += "border-gray-200 opacity-60";
                  }
                }

                return (
                  <motion.button
                    key={option.id}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion.id, option.id)
                    }
                    disabled={isValidated}
                    className={buttonClass}
                    whileHover={!isValidated ? { scale: 1.02 } : {}}
                    whileTap={!isValidated ? { scale: 0.98 } : {}}
                  >
                    <span className="font-medium text-gray-900">
                      {option.option_text}
                    </span>
                    <div className="flex items-center gap-2">
                      {isSelected && !isValidated && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {isValidated && isSelected && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      {isValidated && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      {isValidated && !isSelected && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </motion.button>
                );
              })}

              {/* Bouton de validation pour les questions MCQ */}
              {isMCQ && !isValidated && selectedAnswers.length > 0 && (
                <motion.button
                  onClick={() => handleValidateMCQ(currentQuestion.id)}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Valider ma réponse
                </motion.button>
              )}

              {/* Affichage du résultat après validation */}
              {isValidated && (
                <div
                  className={`mt-4 p-4 rounded-xl flex items-center gap-2 ${
                    status === "correct"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {status === "correct" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-green-700 font-semibold">
                        Excellente réponse ! 🎉
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-red-700 font-semibold">
                        Réponse incorrecte. Les bonnes réponses sont surlignées
                        en vert.
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" /> Précédent
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleFinishQuiz}
                  disabled={!isQuestionAnswered(currentQuestion.id)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" /> Terminer le Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={!isQuestionAnswered(currentQuestion.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50"
                >
                  Suivant <ChevronRight className="w-5 h-5" />
                </button>
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
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 scale-125"
                    : answerStatus[q.id]
                    ? answerStatus[q.id] === "correct"
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
