import React, { useState, useEffect } from "react";
import { fetchQuestionsList } from "../services/QuestionService";
import { fetchCategoriesList } from "../services/QuestionCategorieService";
import { Check, X, Plus, Search } from "lucide-react";

export default function QuizQuestionsManager({ quiz, onClose, onQuestionsAdded }) {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
    loadQuestions();
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

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const result = await fetchQuestionsList(1, 10);
      if (result?.data) {
        setQuestions(result.data.questions || result.data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des questions :", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.question_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || question.question_category_id == selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleAddQuestions = () => {
    if (selectedQuestions.length > 0) {
      onQuestionsAdded(selectedQuestions);
      onClose();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          Ajouter des questions au quiz : {quiz.title}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Rechercher
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre ou contenu..."
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Filtrer par catégorie
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loadingCategories}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions sélectionnées */}
      {selectedQuestions.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-700">
              {selectedQuestions.length} question(s) sélectionnée(s)
            </span>
            <button
              onClick={() => setSelectedQuestions([])}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Tout désélectionner
            </button>
          </div>
        </div>
      )}

      {/* Liste des questions */}
      <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-lg">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement des questions...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Aucune question trouvée
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredQuestions.map((question) => {
              const isSelected = selectedQuestions.includes(question.id);
              return (
                <div
                  key={question.id}
                  className={`p-4 hover:bg-slate-50 cursor-pointer ${
                    isSelected ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
                  }`}
                  onClick={() => toggleQuestionSelection(question.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-slate-800">
                          {question.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty_level)}`}>
                          {question.difficulty_level}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {question.question_text}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Catégorie: {getCategoryName(question.question_category_id)}</span>
                        <span>Points: {question.points}</span>
                        <span>Type: {question.question_type}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {isSelected ? (
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleAddQuestions}
          disabled={selectedQuestions.length === 0}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Ajouter {selectedQuestions.length} question(s)
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
