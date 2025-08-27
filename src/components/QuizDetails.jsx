import React, { useState, useEffect } from "react";
import { fetchCategoriesList } from "../services/QuestionCategorieService";
import { Plus, Edit, Eye, Clock, Target, Users, Shuffle, BarChart3, X } from "lucide-react";

export default function QuizDetails({ quiz, onClose, onAddQuestions, onEdit }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await fetchCategoriesList();
      if (result?.data) {
        setCategories(result.data.categories || result.data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id == categoryId);
    return category ? category.name : "Catégorie inconnue";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      case "expert": return "text-purple-600 bg-purple-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case "easy": return "Facile";
      case "medium": return "Moyen";
      case "hard": return "Difficile";
      case "expert": return "Expert";
      default: return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          Détails du quiz
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(quiz)}
            className="p-2 hover:bg-slate-100 rounded-lg"
            title="Modifier le quiz"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
            title="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {quiz.title}
            </h2>
            {quiz.description && (
              <p className="text-slate-600 mb-4">{quiz.description}</p>
            )}
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(quiz.difficulty_level)}`}>
            {getDifficultyLabel(quiz.difficulty_level)}
          </span>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                     <div className="flex items-center gap-2 text-sm text-slate-600">
             <Clock size={16} />
             <span>{quiz.time_limit > 0 ? `${Math.floor(quiz.time_limit / 60)} min` : "Pas de limite"}</span>
           </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Target size={16} />
            <span>{quiz.passing_score}% de réussite</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users size={16} />
            <span>{quiz.max_attempts} tentatives max</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <BarChart3 size={16} />
            <span>{quiz.questions?.length || quiz.question_ids?.length || 0} questions</span>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 text-sm">
          {quiz.shuffle_questions && (
            <div className="flex items-center gap-2 text-slate-600">
              <Shuffle size={14} />
              <span>Questions mélangées</span>
            </div>
          )}
          {quiz.show_results && (
            <div className="flex items-center gap-2 text-slate-600">
              <Eye size={14} />
              <span>Résultats affichés</span>
            </div>
          )}
        </div>

        {/* Catégorie */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <span className="text-sm text-slate-500">Catégorie : </span>
          <span className="text-sm font-medium text-slate-700">
            {getCategoryName(quiz.category_id)}
          </span>
        </div>
      </div>

      {/* Section des questions */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-800">
            Questions ({quiz.questions?.length || quiz.question_ids?.length || 0})
          </h4>
          <button
            onClick={() => onAddQuestions(quiz)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <Plus size={16} />
            Ajouter des questions
          </button>
        </div>

        {(quiz.questions && quiz.questions.length > 0) || (quiz.question_ids && quiz.question_ids.length > 0) ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Ce quiz contient {quiz.questions?.length || quiz.question_ids?.length} question(s).
            </p>
            {/* Afficher la liste des questions si elles existent */}
            {quiz.questions && quiz.questions.length > 0 && (
              <div className="space-y-3 mt-4">
                {quiz.questions.map((question, index) => (
                  <div key={question.quiz_question_id || question.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            Question {index + 1}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {question.question_category_name}
                          </span>
                        </div>
                        <h5 className="font-medium text-slate-800 mb-1">{question.title}</h5>
                        <p className="text-sm text-slate-600">{question.question_text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              <Plus size={32} className="mx-auto" />
            </div>
            <p className="text-slate-500 mb-4">
              Aucune question n'a été ajoutée à ce quiz
            </p>
            <button
              onClick={() => onAddQuestions(quiz)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Ajouter des questions
            </button>
          </div>
        )}
      </div>

      {/* Bouton de fermeture */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
