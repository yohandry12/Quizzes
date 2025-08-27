import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Home,
  BarChart3,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import { fetchPublicQuizById, fetchPublicQuizQuestions } from '../services/PublicQuizServices';

const QuizPlayer = ({ quizId, userData, onFinish }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answerStatus, setAnswerStatus] = useState({});

  useEffect(() => {
    loadQuizData();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft !== null && isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinishQuiz();
    }
  }, [timeLeft, isTimerRunning]);

  const loadQuizData = async () => {
    try {
      // Utiliser la vraie API pour récupérer les données du quiz
      const [quizData, questionsData] = await Promise.all([
        fetchPublicQuizById(quizId),
        fetchPublicQuizQuestions(quizId)
      ]);
      
      if (quizData && questionsData && questionsData.data) {
        console.log('Données du quiz chargées depuis l\'API');
        setQuiz(quizData);
        setQuestions(questionsData.data);
        setTotalQuestions(questionsData.data.length || 0);
        setTimeLeft(quizData.duration * 60 || 900);
      } else {
        // Si l'API ne retourne pas de données, utiliser les mocks
        console.log('API non disponible, utilisation des mocks...');
        const { mockApi } = await import('../data/mockQuizData');
        const [mockQuizData, mockQuestionsData] = await Promise.all([
          mockApi.fetchQuizId(quizId),
          mockApi.fetchQuizQuestions(quizId)
        ]);
        
        console.log('Données du quiz chargées depuis les mocks');
        setQuiz(mockQuizData);
        setQuestions(mockQuestionsData.data || []);
        setTotalQuestions(mockQuestionsData.data?.length || 0);
        setTimeLeft(mockQuizData.duration * 60 || 900);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du quiz:', error);
      // Fallback vers les mocks en cas d'erreur
      try {
        console.log('Fallback vers les mocks après erreur...');
        const { mockApi } = await import('../data/mockQuizData');
        const [mockQuizData, mockQuestionsData] = await Promise.all([
          mockApi.fetchQuizId(quizId),
          mockApi.fetchQuizQuestions(quizId)
        ]);
        
        console.log('Données du quiz chargées depuis les mocks (fallback)');
        setQuiz(mockQuizData);
        setQuestions(mockQuestionsData.data || []);
        setTotalQuestions(mockQuestionsData.data?.length || 0);
        setTimeLeft(mockQuizData.duration * 60 || 900);
      } catch (mockError) {
        console.error('Erreur avec les mocks aussi:', mockError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    // Ne rien faire si déjà répondu à cette question
    if (answerStatus[questionId]) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    const question = questions.find(q => q.id === questionId);
    const correctAnswer = question.answers?.find(a => a.is_correct);
    setAnswerStatus(prev => ({
      ...prev,
      [questionId]: answerId === correctAnswer?.id ? 'correct' : 'incorrect'
    }));
  };

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

  const handleFinishQuiz = () => {
    setIsTimerRunning(false);
    calculateScore();
    setShowResults(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.answers?.find(answer => answer.is_correct);
      if (userAnswer === correctAnswer?.id) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const currentQuestion = questions[currentQuestionIndex];

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

  if (showResults) {
    return (
      <QuizResults 
        score={score}
        totalQuestions={totalQuestions}
        quiz={quiz}
        userData={userData}
        onRetry={() => {
          setShowResults(false);
          setCurrentQuestionIndex(0);
          setAnswers({});
          setTimeLeft(quiz.duration * 60 || 900);
          setIsTimerRunning(true);
          setAnswerStatus({}); // reset feedback visuel
        }}
        onHome={onFinish}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Quiz Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{quiz?.title}</h1>
                <p className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} sur {questions.length}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className={`font-mono font-bold text-lg ${
                  timeLeft < 300 ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {formatTime(timeLeft)}
                </span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {currentQuestionIndex + 1}
                  </span>
                </div>
                <span className="text-sm text-gray-500">Question</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentQuestion?.question_text}
              </h2>
              
              {currentQuestion?.image_url && (
                <div className="mb-6">
                  <img
                    src={currentQuestion.image_url}
                    alt="Question"
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Answers */}
            <div className="space-y-4 mb-8">
              {currentQuestion?.answers?.map((answer, index) => {
                const isSelected = answers[currentQuestion.id] === answer.id;
                const status = answerStatus[currentQuestion.id];
                const correctAnswer = currentQuestion.answers?.find(a => a.is_correct);
                return (
                  <motion.button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                    disabled={!!status}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between
                      ${isSelected && status === 'correct' ? 'border-green-500 bg-green-50 shadow-md' : ''}
                      ${isSelected && status === 'incorrect' ? 'border-red-500 bg-red-50 shadow-md' : ''}
                      ${!isSelected ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' : ''}
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${isSelected && status === 'correct' ? 'border-green-500 bg-green-500' : ''}
                        ${isSelected && status === 'incorrect' ? 'border-red-500 bg-red-500' : ''}
                        ${!isSelected ? 'border-gray-300' : ''}
                      `}>
                        {isSelected && status === 'correct' && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {isSelected && status === 'incorrect' && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {answer.answer_text}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
              {/* Affiche la bonne réponse si l'utilisateur s'est trompé ET a répondu */}
              {answerStatus[currentQuestion?.id] === 'incorrect' && answers[currentQuestion?.id] && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-semibold">Bonne réponse : {currentQuestion.answers?.find(a => a.is_correct)?.answer_text}</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                Précédent
              </button>

              <div className="flex items-center gap-4">
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleFinishQuiz}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Terminer le Quiz
                    <CheckCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Suivant
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question Navigation Dots */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 scale-125'
                    : answers[questions[index]?.id]
                    ? 'bg-green-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher les résultats
const QuizResults = ({ score, totalQuestions, quiz, userData, onRetry, onHome }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
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
          {/* Score Circle */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isExcellent ? "#10b981" : isGood ? "#3b82f6" : isAverage ? "#f59e0b" : "#ef4444"}
                strokeWidth="2"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
            </div>
          </div>

          {/* Result Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isExcellent ? "Excellent ! 🎉" : 
             isGood ? "Très bien ! 👏" : 
             isAverage ? "Pas mal ! 👍" : "Continuez à vous entraîner ! 💪"}
          </h2>
          
          <p className="text-gray-600 mb-6">
            Vous avez obtenu {score} bonnes réponses sur {totalQuestions} questions.
          </p>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Quiz:</strong> {quiz?.title}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Téléphone:</strong> {userData?.phone}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Recommencer
            </button>
            
            <button
              onClick={onHome}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizPlayer;
