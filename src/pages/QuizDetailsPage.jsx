import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import QuizForm from "../components/QuizForm";
import QuizQuestionsManager from "../components/QuizQuestionsManager";
import { fetchQuizId, fetchQuizQuestions, fetchPutQuiz, fetchAddQuestionsToQuiz } from "../services/QuizServices";
import { fetchCategoriesList } from "../services/QuestionCategorieService";
import { Clock, Target, Users, BarChart3, Edit, Plus, ArrowLeft } from "lucide-react";

export default function QuizDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openQuestionsManager, setOpenQuestionsManager] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadQuiz();
    loadCategories();
    // eslint-disable-next-line
  }, [id]);

  async function loadQuiz() {
    setLoading(true);
    try {
      const response = await fetchQuizId(id);
      if (response && response.success) {
        const quizData = response.data.quiz;
        // Charger les questions
        try {
          const questionsResponse = await fetchQuizQuestions(id);
          if (questionsResponse && questionsResponse.success) {
            quizData.questions = questionsResponse.data.questions;
            quizData.question_ids = questionsResponse.data.questions.map(q => q.id);
          }
        } catch (e) {
          quizData.questions = [];
          quizData.question_ids = [];
        }
        setQuiz(quizData);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const result = await fetchCategoriesList();
      if (result?.data) {
        setCategories(result.data.categories || result.data);
      }
    } catch (err) {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id == categoryId);
    return category ? category.name : "Catégorie inconnue";
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };
  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case "easy": return "Facile";
      case "medium": return "Moyen";
      case "hard": return "Difficile";
      default: return difficulty;
    }
  };

  async function handleEditQuiz(data) {
    try {
      await fetchPutQuiz(quiz.id, data);
      setOpenEdit(false);
      loadQuiz();
    } catch (e) {}
  }

  async function handleQuestionsAdded(questionIds) {
    try {
      // Récupérer les questions existantes du quiz
      let existingQuestions = quiz.questions || [];
      const existingQuestionIds = existingQuestions.map(q => q.id);
      // Fusionner sans doublons
      const allQuestionIds = [...new Set([...existingQuestionIds, ...questionIds])];
      await fetchAddQuestionsToQuiz(quiz.id, allQuestionIds);
      setOpenQuestionsManager(false);
      loadQuiz();
    } catch (e) {}
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Chargement...</div>;
  }
  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Quiz introuvable</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <div className="max-w-[1200px] mx-auto p-6 flex gap-6">
        <Sidebar active="quiz" setActive={() => {}} />
        <main className="flex-1">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-indigo-600 hover:underline">
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-slate-600 mb-2">{quiz.description}</p>
              )}
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(quiz.difficulty_level)}`}>
                  {getDifficultyLabel(quiz.difficulty_level)}
                </span>
                <span className="text-sm text-slate-500">
                  Catégorie : <span className="font-medium text-slate-700">{getCategoryName(quiz.category_id)}</span>
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setOpenEdit(true)} className="p-2 hover:bg-slate-100 rounded-lg" title="Modifier le quiz">
                <Edit size={18} />
              </button>
              <button onClick={() => setOpenQuestionsManager(true)} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Plus size={16} /> Ajouter des questions
              </button>
            </div>
          </div>
          {quiz.description && <p className="mb-4 text-slate-600">{quiz.description}</p>}

          {/* Statistiques en cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <Clock size={28} className="text-indigo-500" />
              <div>
                <div className="text-xs text-slate-500">Temps limite</div>
                <div className="font-semibold text-lg">{quiz.time_limit > 0 ? `${Math.floor(quiz.time_limit / 60)} min` : "Pas de limite"}</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <Target size={28} className="text-indigo-500" />
              <div>
                <div className="text-xs text-slate-500">% de réussite</div>
                <div className="font-semibold text-lg">{quiz.passing_score}%</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <Users size={28} className="text-indigo-500" />
              <div>
                <div className="text-xs text-slate-500">Tentatives max</div>
                <div className="font-semibold text-lg">{quiz.max_attempts}</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <BarChart3 size={28} className="text-indigo-500" />
              <div>
                <div className="text-xs text-slate-500">Questions</div>
                <div className="font-semibold text-lg">{quiz.questions?.length || quiz.question_ids?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Liste des questions */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Questions du quiz</h2>
            {quiz.questions && quiz.questions.length > 0 ? (
              <div className="space-y-3">
                {quiz.questions.map((question, idx) => (
                  <div key={question.quiz_question_id || question.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Question {idx + 1}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{question.question_category_name}</span>
                    </div>
                    <h5 className="font-medium text-slate-800 mb-1">{question.title}</h5>
                    <p className="text-sm text-slate-600">{question.question_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">Aucune question n'a été ajoutée à ce quiz.</div>
            )}
          </div>

          {/* Modal modification quiz */}
          <Modal open={openEdit} onClose={() => setOpenEdit(false)} title="Modifier le quiz" sizeClass="w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6">
            <QuizForm
              onClose={() => setOpenEdit(false)}
              onSave={handleEditQuiz}
              initialData={quiz}
            />
          </Modal>

          {/* Modal ajout questions */}
          <Modal open={openQuestionsManager} onClose={() => setOpenQuestionsManager(false)} title="Ajouter des questions" sizeClass="w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6">
            <QuizQuestionsManager
              quiz={quiz}
              onClose={() => setOpenQuestionsManager(false)}
              onQuestionsAdded={handleQuestionsAdded}
            />
          </Modal>
        </main>
      </div>
    </div>
  );
}
