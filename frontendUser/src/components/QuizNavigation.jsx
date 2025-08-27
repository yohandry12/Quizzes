import React, { useState } from 'react';
import QuizHome from '../pages/QuizHome';
import QuizPlayer from '../pages/QuizPlayer';

const QuizNavigation = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleQuizStart = (quiz, userInfo) => {
    setSelectedQuiz(quiz);
    setUserData(userInfo);
    setCurrentView('quiz');
  };

  const handleQuizFinish = () => {
    setCurrentView('home');
    setSelectedQuiz(null);
    setUserData(null);
  };

  const handleLoginSuccess = (userInfo) => {
    setUserData(userInfo);
    setCurrentView('quiz');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'quiz':
        if (!selectedQuiz) {
          setCurrentView('home');
          return null;
        }
        return (
          <QuizPlayer
            quizId={selectedQuiz.id}
            userData={userData}
            onFinish={handleQuizFinish}
          />
        );
      case 'home':
      default:
        return (
          <QuizHome
            onQuizStart={handleQuizStart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
    </div>
  );
};

export default QuizNavigation;
