import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, Archive } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Modal from "../components/Modal";
import QuestionsTable from "../components/QuestionsTable";
import QuestionWizard from "../components/QuestionForm";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import {
  fetchQuestionsList,
  fetchCreateQuestions,
  fetchSoftDeleteQuestions,
  fetchQuestionsId,
  fetchPutQuestions,
  fetchDeletePermanentQuestions,
  fetchRestoreQuestions,
  fetchTrashedQuestionsList,
  fetchQuestionsSearch,
} from "../services/QuestionService";

export default function Questions() {
  // États principaux
  const [questions, setQuestions] = useState([]);
  const [trashedQuestions, setTrashedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // États pour les modals
  const [openCreate, setOpenCreate] = useState(false);
  const [editingQuestionData, setEditingQuestionData] = useState(null);
  const [confirmAction, setConfirmAction] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // États pour les filtres et vues
  const [filter, setFilter] = useState("");
  const [isTrashView, setIsTrashView] = useState(false);

  // Profil utilisateur
  const [profile] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Chargement des données
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchFunction = isTrashView
        ? fetchTrashedQuestionsList
        : fetchQuestionsList;
      const response = await fetchFunction(currentPage, 10);

      if (response?.success) {
        const data = response.data || [];
        if (isTrashView) {
          setTrashedQuestions(data);
        } else {
          setQuestions(data);
        }
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setQuestions([]);
        setTrashedQuestions([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Erreur lors du chargement des données");
      setQuestions([]);
      setTrashedQuestions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, isTrashView]);

  // Effects
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [isTrashView]);

  // Gestion de la recherche
  const handleSearch = async (searchTerm) => {
    setFilter(searchTerm);

    // Si le terme de recherche est vide, recharger toutes les données
    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    try {
      setLoading(true);
      setError(""); // Réinitialiser les erreurs

      const response = await fetchQuestionsSearch(searchTerm, 1, 10);

      if (response?.success) {
        const searchResults = response.data?.questions || response.data || [];
        setQuestions(searchResults);

        // Mettre à jour la pagination si disponible
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setCurrentPage(1); // Retour à la première page lors d'une recherche
        }
      } else {
        // Si pas de résultats ou erreur de l'API
        setQuestions([]);
        setTotalPages(1);
        if (response?.message) {
          setError(response.message);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      setError("Erreur lors de la recherche. Veuillez réessayer.");
      setQuestions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateOrUpdate = async (data) => {
    try {
      // Créer une copie des données pour éviter de modifier l'état directement
      const payload = { ...data };

      // Si la question est de type texte, elle ne doit pas avoir d'options.
      // On supprime donc ce champ avant de l'envoyer à l'API.
      if (
        payload.question_type === "short_text" ||
        payload.question_type === "long_text"
      ) {
        delete payload.options;
      }

      if (payload.id) {
        // Utiliser les données nettoyées (payload) pour la mise à jour
        await fetchPutQuestions(payload.id, payload);
      } else {
        // Utiliser les données nettoyées (payload) pour la création
        await fetchCreateQuestions({ ...payload, published: true });
        if (currentPage !== 1) setCurrentPage(1);
      }

      setOpenCreate(false);
      setEditingQuestionData(null);
      loadData();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError("Erreur lors de la sauvegarde");
    }
  };

  const handleEditQuestion = async (question) => {
    try {
      setOpenCreate(true);
      setEditingQuestionData(null);

      const response = await fetchQuestionsId(question.id);
      if (response?.success) {
        setEditingQuestionData(response.data.question);
      } else {
        setError("Impossible de charger les détails de la question");
        setOpenCreate(false);
      }
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError("Erreur lors du chargement des détails");
      setOpenCreate(false);
    }
  };

  const handleSoftDeleteQuestion = (question) => {
    setConfirmAction({
      isOpen: true,
      title: "Mettre à la corbeille",
      message: `Êtes-vous sûr de vouloir supprimer la question : "${question.title}" ?`,
      onConfirm: async () => {
        try {
          await fetchSoftDeleteQuestions(question.id);
          loadData();
          setConfirmAction({ isOpen: false });
        } catch (err) {
          console.error("Erreur lors de la suppression:", err);
          setError("Erreur lors de la suppression");
        }
      },
    });
  };

  const handleRestoreQuestion = (question) => {
    setConfirmAction({
      isOpen: true,
      title: "Restaurer la question",
      message: `Êtes-vous sûr de vouloir restaurer la question : "${question.title}" ?`,
      onConfirm: async () => {
        try {
          await fetchRestoreQuestions(question.id);
          loadData();
          setConfirmAction({ isOpen: false });
        } catch (err) {
          console.error("Erreur lors de la restauration:", err);
          setError("Erreur lors de la restauration");
        }
      },
    });
  };

  const handlePermanentDeleteQuestion = (question) => {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer définitivement",
      message: `Êtes-vous sûr de vouloir supprimer définitivement la question : "${question.title}" ? Cette action est irréversible.`,
      onConfirm: async () => {
        try {
          await fetchDeletePermanentQuestions(question.id);
          loadData();
          setConfirmAction({ isOpen: false });
        } catch (err) {
          console.error("Erreur lors de la suppression définitive:", err);
          setError("Erreur lors de la suppression définitive");
        }
      },
    });
  };

  // Fonction de filtrage
  const getFilteredQuestions = () => {
    const currentQuestions = isTrashView ? trashedQuestions : questions;
    if (!filter.trim()) return currentQuestions;

    return currentQuestions.filter((q) =>
      q.title.toLowerCase().includes(filter.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Layout principal */}
      <div className="flex">
        <Sidebar active="questions" setActive={() => {}} />

        <main className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <div className="mb-6">
            <Topbar
              profile={profile}
              onSearch={handleSearch}
              onOpenCreate={() => setOpenCreate(true)}
            />
          </div>

          {/* Contenu principal */}
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Header de la page */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Gestion des Questions
                    </h1>
                    <p className="text-slate-600 mt-1">
                      "Créez, modifiez et organisez vos questions de quiz"
                    </p>
                  </div>

                  {/* Actions principales */}
                  <div className="flex items-center gap-3">
                    {!isTrashView && (
                      <button
                        onClick={() => setOpenCreate(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Nouvelle Question
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtres et navigation */}
                <div className="flex items-center justify-between mt-6">
                  {/* Barre de recherche */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une question..."
                      value={filter}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 w-80 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                    />
                  </div>

                  {/* Boutons de vue */}
                  {/* <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <button
                      onClick={() => setIsTrashView(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        !isTrashView
                          ? "bg-white text-indigo-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Archive className="w-4 h-4" />
                      Questions actives
                    </button>
                    <button
                      onClick={() => setIsTrashView(true)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isTrashView
                          ? "bg-white text-red-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Corbeille
                    </button>
                  </div> */}
                </div>
              </div>

              {/* Table des questions */}
              <div className="overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-slate-600">Chargement...</span>
                  </div>
                ) : (
                  <QuestionsTable
                    questions={getFilteredQuestions()}
                    onEdit={handleEditQuestion}
                    onSoftDelete={handlePermanentDeleteQuestion}
                    onRestore={handleRestoreQuestion}
                    // onPermanentDelete={handlePermanentDeleteQuestion}
                    isTrash={isTrashView}
                  />
                )}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="p-6 border-t border-slate-100">
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

      {/* Modals */}

      {/* Modal de création/édition */}
      <Modal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setEditingQuestionData(null);
          setError("");
        }}
        title=""
        sizeClass="w-[800px] max-w-[95vw] p-6"
      >
        <QuestionWizard
          onClose={() => {
            setOpenCreate(false);
            setEditingQuestionData(null);
          }}
          onSave={handleCreateOrUpdate}
          initialData={editingQuestionData}
        />
      </Modal>

      {/* Modal de confirmation */}
      <ConfirmationModal
        open={confirmAction.isOpen}
        title={confirmAction.title}
        onConfirm={() => {
          console.log("🔴 Bouton Confirmer cliqué dans la modal");
          if (typeof confirmAction.onConfirm === "function") {
            confirmAction.onConfirm();
          }
        }}
        onClose={() => {
          console.log("🔴 Bouton Annuler cliqué dans la modal");
          setConfirmAction({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => {},
          });
        }}
      >
        {confirmAction.message}
      </ConfirmationModal>
    </div>
  );
}
