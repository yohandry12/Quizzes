import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Modal from "../components/Modal";
import QuizForm from "../components/QuizForm";
import QuizDetails from "../pages/QuizDetailsPage";
import QuizQuestionsManager from "../components/QuizQuestionsManager";
import Pagination from "../components/Pagination";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  fetchQuizList,
  fetchCreateQuiz,
  fetchQuizId,
  fetchPutQuiz,
  fetchAddQuestionsToQuiz,
  fetchQuizSearch,
  fetchSoftDeleteQuiz,
  fetchRestoreQuiz,
  fetchDeletePermanentQuiz,
  fetchDuplicateQuiz,
  fetchQuizStats,
  fetchQuizQuestions,
} from "../services/QuizServices";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Clock,
  Target,
  Users,
  BarChart3,
  Copy,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const [active, setActive] = useState("quiz");
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openQuestionsManager, setOpenQuestionsManager] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrashView, setIsTrashView] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [profile, setProfile] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loadQuizzes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchQuizList(currentPage, 10);
      if (response && response.success) {
        setQuizzes(response.data.quizzes || response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setQuizzes([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des quiz:", error);
      setQuizzes([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  async function handleSearch(q) {
    setFilter(q);
    if (q.trim()) {
      try {
        const response = await fetchQuizSearch(q);
        if (response && response.success) {
          setQuizzes(response.data.quizzes || response.data || []);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      }
    } else {
      loadQuizzes();
    }
  }

  function filteredQuizzes() {
    if (!filter) return quizzes;
    return quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(filter.toLowerCase())
    );
  }

  async function handleCreateOrUpdate(data) {
    try {
      if (data.id) {
        // Mode édition
        await fetchPutQuiz(data.id, data);
      } else {
        // Mode création
        await fetchCreateQuiz(data);
        if (currentPage !== 1) {
          setCurrentPage(1);
        }
      }

      setOpenCreate(false);
      setEditingQuiz(null);
      loadQuizzes();
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
    }
  }

  async function handleViewQuiz(quiz) {
    try {
      console.log("Chargement des détails du quiz:", quiz.id);
      // Récupérer les détails du quiz
      const quizResponse = await fetchQuizId(quiz.id);
      if (quizResponse && quizResponse.success) {
        const quizData = quizResponse.data.quiz;
        console.log("Détails du quiz:", quizData);

        // Récupérer les questions du quiz
        try {
          const questionsResponse = await fetchQuizQuestions(quiz.id);
          console.log("Réponse des questions:", questionsResponse);
          if (questionsResponse && questionsResponse.success) {
            quizData.questions = questionsResponse.data.questions;
            // Mettre à jour aussi question_ids pour la compatibilité
            quizData.question_ids = questionsResponse.data.questions.map(
              (q) => q.id
            );
            console.log("Questions ajoutées au quiz:", quizData.questions);
          }
        } catch (questionsError) {
          console.error(
            "Erreur lors du chargement des questions:",
            questionsError
          );
          quizData.questions = [];
          quizData.question_ids = [];
        }

        setSelectedQuiz(quizData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails du quiz:", error);
    }
  }

  function handleEditQuiz(quiz) {
    setEditingQuiz(quiz);
    setOpenCreate(true);
  }

  function handleAddQuestions(quiz) {
    setSelectedQuiz(quiz);
    setOpenQuestionsManager(true);
  }

  async function handleQuestionsAdded(questionIds) {
    try {
      if (selectedQuiz) {
        console.log("Questions à ajouter:", questionIds);

        // Récupérer les questions existantes du quiz
        let existingQuestions = [];
        try {
          const questionsResponse = await fetchQuizQuestions(selectedQuiz.id);
          if (questionsResponse && questionsResponse.success) {
            existingQuestions = questionsResponse.data.questions || [];
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des questions existantes:",
            error
          );
        }

        // Extraire les IDs des questions existantes
        const existingQuestionIds = existingQuestions.map((q) => q.id);
        console.log("Questions existantes:", existingQuestionIds);

        // Combiner les questions existantes avec les nouvelles (éviter les doublons)
        const allQuestionIds = [
          ...new Set([...existingQuestionIds, ...questionIds]),
        ];
        console.log("Toutes les questions (après fusion):", allQuestionIds);

        // Envoyer la liste complète des questions
        await fetchAddQuestionsToQuiz(selectedQuiz.id, allQuestionIds);

        // Attendre un peu pour que l'API traite la requête
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Recharger les détails du quiz avec les nouvelles questions
        await handleViewQuiz(selectedQuiz);
        // Recharger la liste des quiz pour mettre à jour le compteur
        loadQuizzes();
        // Fermer le modal de gestion des questions
        setOpenQuestionsManager(false);
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout des questions:", error);
    }
  }

  async function handleSoftDeleteQuiz(quiz) {
    setConfirmAction({
      isOpen: true,
      title: "Mettre à la corbeille",
      message: `Êtes-vous sûr de vouloir supprimer le quiz : "${quiz.title}" ?`,
      onConfirm: async () => {
        await fetchSoftDeleteQuiz(quiz.id);
        loadQuizzes();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  async function handleRestoreQuiz(quiz) {
    setConfirmAction({
      isOpen: true,
      title: "Restaurer le quiz",
      message: `Êtes-vous sûr de vouloir restaurer le quiz : "${quiz.title}" ?`,
      onConfirm: async () => {
        await fetchRestoreQuiz(quiz.id);
        loadQuizzes();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  async function handlePermanentDeleteQuiz(quiz) {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer définitivement",
      message: `Êtes-vous sûr de vouloir supprimer définitivement le quiz : "${quiz.title}" ?`,
      onConfirm: async () => {
        await fetchDeletePermanentQuiz(quiz.id);
        loadQuizzes();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  async function handleDuplicateQuiz(quiz) {
    try {
      await fetchDuplicateQuiz(quiz.id);
      loadQuizzes();
    } catch (error) {
      console.error("❌ Erreur lors de la duplication:", error);
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      case "expert":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "Facile";
      case "medium":
        return "Moyen";
      case "hard":
        return "Difficile";
      case "expert":
        return "Expert";
      default:
        return difficulty;
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <div className="max-w-[1200px] mx-auto p-6 flex gap-6">
        <Sidebar active={active} setActive={setActive} />

        <main className="flex-1">
          <div className="mb-6">
            <Topbar
              onOpenCreate={() => {
                setEditingQuiz(null);
                setOpenCreate(true);
              }}
              onSearch={handleSearch}
              profile={profile}
            />
          </div>

          <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">
                Gestion des Quiz
              </h1>
              <button
                onClick={() => {
                  setEditingQuiz(null);
                  setOpenCreate(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
              >
                <Plus size={16} />
                Créer un quiz
              </button>
            </div>

            {/* Liste des quiz */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold">
                  {isTrashView ? "Corbeille" : "Liste des quiz"}
                </div>
                {/* BOUTONS POUR BASCULER DE VUE */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTrashView(false)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      !isTrashView
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    Liste principale
                  </button>
                  <button
                    onClick={() => setIsTrashView(true)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      isTrashView
                        ? "bg-red-100 text-red-700"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    Corbeille
                  </button>
                </div>
              </div>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-slate-500">Chargement des quiz...</div>
                </div>
              ) : filteredQuizzes().length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <Plus size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Aucun quiz trouvé
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Commencez par créer votre premier quiz
                  </p>
                  <button
                    onClick={() => {
                      setEditingQuiz(null);
                      setOpenCreate(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Créer un quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuizzes().map((quiz) => (
                    <div
                      key={quiz.id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-800">
                              {quiz.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                                quiz.difficulty_level
                              )}`}
                            >
                              {getDifficultyLabel(quiz.difficulty_level)}
                            </span>
                          </div>

                          {quiz.description && (
                            <p className="text-slate-600 text-sm mb-3">
                              {quiz.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>
                                {quiz.time_limit > 0
                                  ? `${Math.floor(quiz.time_limit / 60)} min`
                                  : "Pas de limite"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target size={14} />
                              <span>{quiz.passing_score}% de réussite</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              <span>{quiz.max_attempts || 0} tentatives</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 size={14} />
                              <span>
                                {quiz.question_count ||
                                  quiz.question_ids?.length ||
                                  0}{" "}
                                questions
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                            className="p-2 hover:bg-slate-200 rounded-lg"
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                          </button>
                          {!isTrashView && (
                            <>
                              <button
                                onClick={() => handleEditQuiz(quiz)}
                                className="p-2 hover:bg-slate-200 rounded-lg"
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              {/* <button
                                onClick={() => handleAddQuestions(quiz)}
                                className="p-2 hover:bg-indigo-100 rounded-lg"
                                title="Ajouter des questions"
                              >
                                <Plus size={16} />
                              </button> */}
                              <button
                                onClick={() => handleDuplicateQuiz(quiz)}
                                className="p-2 hover:bg-green-100 rounded-lg"
                                title="Dupliquer"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => handleSoftDeleteQuiz(quiz)}
                                className="p-2 hover:bg-red-100 rounded-lg"
                                title="Mettre à la corbeille"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                          {isTrashView && (
                            <>
                              <button
                                onClick={() => handleRestoreQuiz(quiz)}
                                className="p-2 hover:bg-green-100 rounded-lg"
                                title="Restaurer"
                              >
                                <RotateCcw size={16} />
                              </button>
                              <button
                                onClick={() => handlePermanentDeleteQuiz(quiz)}
                                className="p-2 hover:bg-red-100 rounded-lg"
                                title="Supprimer définitivement"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de création/modification de quiz */}
      <Modal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setEditingQuiz(null);
        }}
        title={editingQuiz ? "Modifier le quiz" : "Créer un nouveau quiz"}
        sizeClass="w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6"
      >
        <QuizForm
          onClose={() => {
            setOpenCreate(false);
            setEditingQuiz(null);
          }}
          onSave={handleCreateOrUpdate}
          initialData={editingQuiz}
        />
      </Modal>

      {/* Modal des détails du quiz
      <Modal
        open={!!selectedQuiz && !openQuestionsManager}
        onClose={() => setSelectedQuiz(null)}
        title=""
        sizeClass="w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6"
      >
        {selectedQuiz && (
          <QuizDetails
            quiz={selectedQuiz}
            onClose={() => setSelectedQuiz(null)}
            onAddQuestions={handleAddQuestions}
            onEdit={handleEditQuiz}
          />
        )}
      </Modal> */}

      {/* Modal de gestion des questions
      <Modal
        open={openQuestionsManager}
        onClose={() => setOpenQuestionsManager(false)}
        title=""
        sizeClass="w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-6"
      >
        {selectedQuiz && (
          <QuizQuestionsManager
            quiz={selectedQuiz}
            onClose={() => setOpenQuestionsManager(false)}
            onQuestionsAdded={handleQuestionsAdded}
          />
        )}
      </Modal> */}

      {/* Modal de confirmation */}
      <ConfirmationModal
        open={confirmAction.isOpen}
        onClose={() => setConfirmAction({ isOpen: false })}
        onConfirm={confirmAction.onConfirm}
        title={confirmAction.title}
      >
        {confirmAction.message}
      </ConfirmationModal>
    </div>
  );
}
