import React, { useState, useEffect } from "react";
import { fetchCategoriesList } from "../services/QuestionCategorieService";
const INITIAL_STATE = {
  title: "",
  question_text: "",
  points: 1,
  question_type: "mcq",
  options: [{ option_text: "", is_correct: false }],
  correct_answer: "",
  question_category_id: "",
  difficulty_level: "easy",
  is_active: true,
};

export default function QuestionForm({ onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [categories, setCategories] = useState([]); // <--- Liste des catégories
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  // Le useEffect clé qui synchronise l'état du formulaire avec les données reçues.
  useEffect(() => {
    if (initialData) {
      let dataToSet = { ...INITIAL_STATE, ...initialData };

      // CORRECTION N°1 : Convertir les options reçues en booléens
      if (dataToSet.options && Array.isArray(dataToSet.options)) {
        dataToSet.options = dataToSet.options.map((opt) => ({
          ...opt,
          is_correct: !!opt.is_correct, // Convertit 1 en true, 0 en false
        }));
      }

      if (dataToSet.question_type === "boolean") {
        const correctOpt = dataToSet.options.find((opt) => opt.is_correct);
        dataToSet.correct_answer =
          correctOpt?.option_text === "Vrai" ? "true" : "false";
      }

      setFormData(dataToSet);
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [initialData]);

  const isEditMode = !!initialData;

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const newOptions =
      newType === "boolean"
        ? [
            { option_text: "Vrai", is_correct: false },
            { option_text: "Faux", is_correct: false },
          ]
        : [{ option_text: "", is_correct: false }];

    setFormData({
      ...formData,
      question_type: newType,
      options: newOptions,
      correct_answer: newType === "boolean" ? "true" : "",
    });
  };

  const handleSubmit = () => {
    let payload = { ...formData };

    // CORRECTION N°2 : S'assurer que les options envoyées sont des booléens
    if (payload.options && Array.isArray(payload.options)) {
      payload.options = payload.options.map((opt) => ({
        ...opt,
        is_correct: !!opt.is_correct, // Double garantie
      }));
    }

    if (payload.question_type === "boolean") {
      payload.options = [
        {
          option_text: "Vrai",
          is_correct: payload.correct_answer === "true",
        },
        {
          option_text: "Faux",
          is_correct: payload.correct_answer === "false",
        },
      ];
    }

    // On retire la clé temporaire avant l'envoi
    delete payload.correct_answer;

    onSave({ ...payload, id: initialData?.id });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm flex flex-col max-h-[80vh]">
      <div className="space-y-6 overflow-y-auto pr-2 flex-1">
        <h2 className="text-xl font-semibold text-slate-800">
          {isEditMode ? "Modifier la question" : "Créer une question"}
        </h2>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Titre de la question *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Énoncé */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Énoncé de la question *
          </label>
          <textarea
            value={formData.question_text}
            onChange={(e) =>
              setFormData({ ...formData, question_text: e.target.value })
            }
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 resize-none"
          />
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Points attribués
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.points}
            onChange={(e) =>
              setFormData({ ...formData, points: Number(e.target.value) })
            }
            className="w-24 border border-slate-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Type de question */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type de question *
          </label>
          <select
            placeholder="Sélectionner un type de question"
            value={formData.question_type}
            onChange={(e) =>
              setFormData({ ...formData, question_type: e.target.value })
            }
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="mcq">QCM</option>
            <option value="boolean">Vrai / Faux</option>
            <option value="single">Réponse Unique</option>
            <option value="short_text">Texte libre</option>
            <option value="long_text">Texte long (paragraphe)</option>
          </select>
        </div>

        {/* Difficulté */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Difficulté *
          </label>
          <select
            value={formData.difficulty_level}
            onChange={(e) =>
              setFormData({ ...formData, difficulty_level: e.target.value })
            }
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Catégorie *
          </label>
          {loadingCategories ? (
            <div className="text-slate-500 text-sm">Chargement...</div>
          ) : (
            <select
              value={formData.question_category_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  question_category_id: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              required
            >
              <option value="">-- Sélectionner une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* QCM */}
        {formData.question_type === "mcq" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Options de réponse *
            </label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {formData.options.map((opt, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt.option_text}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[i].option_text = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={opt.is_correct}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[i].is_correct = e.target.checked;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    Correcte
                  </label>
                  {formData.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = formData.options.filter(
                          (_, index) => index !== i
                        );
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  options: [
                    ...formData.options,
                    { option_text: "", is_correct: false },
                  ],
                })
              }
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              + Ajouter une option
            </button>
          </div>
        )}

        {/* Gestion du choix Vrai / Faux */}
        {formData.question_type === "boolean" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Réponse correcte *
            </label>
            <div className="flex items-center gap-6">
              {["true", "false"].map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <input
                    type="radio"
                    name="boolean_answer"
                    value={val}
                    checked={formData.correct_answer === val}
                    // ON CHANGE SIMPLIFIÉ : On ne met à jour que la réponse sélectionnée.
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        correct_answer: e.target.value,
                      });
                    }}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  {val === "true" ? "Vrai" : "Faux"}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Réponse Unique (Single) */}
        {formData.question_type === "single" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Options de réponse *
            </label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {formData.options.map((opt, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt.option_text}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[i].option_text = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="single_answer" // Utilisation du même nom pour le groupe radio
                      checked={opt.is_correct}
                      onChange={(e) => {
                        const newOptions = formData.options.map(
                          (option, index) => ({
                            ...option,
                            is_correct: index === i ? e.target.checked : false, // S'assure qu'une seule option est correcte
                          })
                        );
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Correcte
                  </label>
                  {formData.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = formData.options.filter(
                          (_, index) => index !== i
                        );
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  options: [
                    ...formData.options,
                    { option_text: "", is_correct: false },
                  ],
                })
              }
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              + Ajouter une option
            </button>
          </div>
        )}
        {/* Texte libre */}
        {formData.question_type === "short_text" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Réponse attendue *
            </label>
            <input
              type="text"
              value={formData.correct_answer || ""}
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>
        )}

        {/* Texte libre */}
        {formData.question_type === "long_text" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Réponse attendue *
            </label>
            <input
              type="text"
              value={formData.correct_answer || ""}
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            {isEditMode ? "Enregistrer" : "Créer la question"}
          </button>
        </div>
      </div>
    </div>
  );
}
