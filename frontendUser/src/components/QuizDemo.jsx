import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import QuizNavigation from './QuizNavigation';

const QuizDemo = () => {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return <QuizNavigation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Template Quiz Frontend
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Découvrez notre interface de quiz moderne avec une UX/UI époustouflante
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Page d'Accueil</h3>
            <p className="text-sm text-gray-600">
              Liste des quiz avec recherche et filtres
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Connexion</h3>
            <p className="text-sm text-gray-600">
              Modal d'authentification sécurisée
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quiz Interactif</h3>
            <p className="text-sm text-gray-600">
              Navigation fluide entre les questions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowDemo(true)}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Lancer la Démo
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-sm text-gray-500">
            Cliquez pour voir le template en action avec des données fictives
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Fonctionnalités Incluses</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>✅ Design moderne et responsive</div>
            <div>✅ Animations fluides avec Framer Motion</div>
            <div>✅ Modal de connexion élégante</div>
            <div>✅ Timer interactif</div>
            <div>✅ Navigation par points</div>
            <div>✅ Page de résultats animée</div>
            <div>✅ Gestion des erreurs</div>
            <div>✅ Accessibilité optimisée</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizDemo;
