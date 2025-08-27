import React, { useState, useEffect } from "react";
import { fetchCategoriesList } from "../services/QuestionCategorieService";

const INITIAL_STATE = {
  title: "",
  description: "",
  category_id: "",
  difficulty_level: "easy",
  time_limit: 0, // En minutes pour l'interface
  passing_score: 100,
  max_attempts: 10,
  shuffle_questions: true,
  show_results: true,
  question_ids: [],
};

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

export default function QuizForm({ onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await fetchCategoriesList();
        if (result?.data) {
          setCategories(result.data.categories || result.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des catégories :", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Convertir les secondes en minutes pour l'affichage
      const convertedData = {
        ...initialData,
        time_limit: initialData.time_limit
          ? Math.floor(initialData.time_limit / 60)
          : 0,
      };
      setFormData({ ...INITIAL_STATE, ...convertedData });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation basique
      if (!formData.title.trim()) {
        throw new Error("Le titre est requis");
      }
      if (!formData.category_id) {
        throw new Error("La catégorie est requise");
      }

      // Validation du temps limite
      if (
        formData.time_limit > 0 &&
        (formData.time_limit < 1 || formData.time_limit > 120)
      ) {
        throw new Error(
          "Le temps limite doit être entre 1 minute et 2 heures (120 minutes)"
        );
      }

      // Préparer les données pour l'API (convertir minutes en secondes)
      const apiData = {
        ...formData,
        time_limit: formData.time_limit > 0 ? formData.time_limit * 60 : 0, // Convertir en secondes
      };

      await onSave(apiData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Titre du quiz *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Entrez le titre du quiz"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Entrez la description du quiz"
            rows={3}
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Catégorie *
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => handleInputChange("category_id", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
            disabled={loadingCategories}
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {loadingCategories && (
            <p className="text-sm text-slate-500 mt-1">
              Chargement des catégories...
            </p>
          )}
        </div>

        {/* Niveau de difficulté */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Niveau de difficulté
          </label>
          <select
            value={formData.difficulty_level}
            onChange={(e) =>
              handleInputChange("difficulty_level", e.target.value)
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Limite de temps */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Limite de temps (en minutes)
          </label>
          <input
            type="number"
            value={formData.time_limit}
            onChange={(e) =>
              handleInputChange("time_limit", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="0 = pas de limite, 1-120 minutes"
            min="0"
            max="120"
          />
          <p className="text-xs text-slate-500 mt-1">
            Entre 1 et 120 minutes (ou 0 pour pas de limite)
          </p>
        </div>

        {/* Score de passage */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Score de passage (%)
          </label>
          <input
            type="number"
            value={formData.passing_score}
            onChange={(e) =>
              handleInputChange("passing_score", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min="0"
            max="100"
          />
        </div>

        {/* Nombre maximum de tentatives */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre maximum de tentatives
          </label>
          <input
            type="number"
            value={formData.max_attempts}
            onChange={(e) =>
              handleInputChange("max_attempts", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min="1"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shuffle_questions"
              checked={formData.shuffle_questions}
              onChange={(e) =>
                handleInputChange("shuffle_questions", e.target.checked)
              }
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="shuffle_questions"
              className="ml-2 text-sm text-slate-700"
            >
              Mélanger les questions
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="show_results"
              checked={formData.show_results}
              onChange={(e) =>
                handleInputChange("show_results", e.target.checked)
              }
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="show_results"
              className="ml-2 text-sm text-slate-700"
            >
              Afficher les résultats
            </label>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enregistrement..." : initialData ? "Modifier" : "Créer"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
