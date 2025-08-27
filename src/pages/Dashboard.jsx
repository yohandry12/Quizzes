import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import QuestionsTable from "../components/QuestionsTable";
import Modal from "../components/Modal";
import QuestionWizard from "../components/QuestionForm";

import Pagination from "../components/Pagination";
import { fetchProfileAdmin } from "../services/loginAdminService";
import ConfirmationModal from "../components/ConfirmationModal";

import {
  fetchQuestionsList,
  fetchCreateQuestions,
  fetchSoftDeleteQuestions,
  fetchQuestionsId,
  fetchPutQuestions,
  fetchDeletePermanentQuestions,
  fetchRestoreQuestions,
  fetchTrashedQuestionsList,
} from "../services/QuestionService";
import {
  PieChart,
  Users,
  Grid,
  Edit2,
  Settings,
  LogOut,
  PlusCircle,
  Search,
  Menu,
  Trash2,
  Edit,
  RotateCcw,
} from "lucide-react";

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editingQuestionData, setEditingQuestionData] = useState(null);
  const [openQuestionsFor, setOpenQuestionsFor] = useState(null);
  const [profile, setProfile] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmAction, setConfirmAction] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}, // Fonction à exécuter si on confirme
  });
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trashedQuestions, setTrashedQuestions] = useState([]);
  const [isTrashView, setIsTrashView] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchFunction = isTrashView
        ? fetchTrashedQuestionsList
        : fetchQuestionsList;
      const response = await fetchFunction(currentPage, 10);

      if (response && response.success) {
        const setFunction = isTrashView ? setTrashedQuestions : setQuestions;
        setFunction(response.data || []);
        setTotalPages(response.pagination.totalPages || 1);
      } else {
        setQuestions([]);
        setTrashedQuestions([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setQuestions([]);
      setTrashedQuestions([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isTrashView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  function handleSearch(q) {
    setFilter(q);
  }

  function filtered() {
    if (!filter) return questions;
    return questions.filter((x) =>
      x.title.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Nouvelle fonction pour gérer création ET modification

  async function handleCreateOrUpdate(data) {
    try {
      if (data.id) {
        // Mode édition
        await fetchPutQuestions(data.id, data);
      } else {
        // Mode création
        await fetchCreateQuestions({ ...data, published: true });
        // Si on crée, on retourne à la page 1 pour voir le nouvel élément
        if (currentPage !== 1) {
          setCurrentPage(1);
        }
      }

      setOpenCreate(false);
      setEditingQuestionData(null);

      // On recharge la vue pour avoir toutes les données à jour, y compris le nom de la catégorie
      loadData();
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      // Ici, vous pourriez afficher une notification à l'utilisateur
      // avec le message `error.message`
    }
  }

  // MODIFICATION DE handleEdit
  async function handleEditQuestion(question) {
    try {
      // On affiche le modal immédiatement pour une meilleure UX
      setOpenCreate(true);
      setEditingQuestionData(null); // On vide les anciennes données

      // On va chercher les données complètes de la question
      const response = await fetchQuestionsId(question.id);

      if (response && response.success) {
        // Une fois les données complètes reçues, on les met dans l'état
        setEditingQuestionData(response.data.question);
      } else {
        console.error("Impossible de charger les détails de la question.");
        // Gérer l'erreur (ex: fermer le modal, afficher un message)
        setOpenCreate(false);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des détails pour l'édition:",
        error
      );
      setOpenCreate(false);
    }
  }
  async function handleRestoreQuestion(question) {
    setConfirmAction({
      isOpen: true,
      title: "Restaurer la question",
      message: `Êtes-vous sûr de vouloir restaurer la question : "${question.title}" ?`,
      onConfirm: async () => {
        await fetchRestoreQuestions(question.id);
        loadData(); // On recharge simplement les données
        setConfirmAction({ isOpen: false }); // Ferme le modal
      },
    });
  }

  async function handleSoftDeleteQuestion(question) {
    setConfirmAction({
      isOpen: true,
      title: "Mettre à la corbeille",
      message: `Êtes-vous sûr de vouloir supprimer la question : "${question.title}" ?`,
      onConfirm: async () => {
        await fetchSoftDeleteQuestions(question.id);
        loadData(); // On recharge simplement les données
        setConfirmAction({ isOpen: false }); // Ferme le modal
      },
    });
  }
  async function handlePermanentDeleteQuestion(question) {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer définitivement",
      message: `Êtes-vous sûr de vouloir supprimer définitivement la question : "${question.title}" ?`,
      onConfirm: async () => {
        await fetchDeletePermanentQuestions(question.id);
        loadData(); // On recharge simplement les données
        setConfirmAction({ isOpen: false }); // Ferme le modal
      },
    });
  }

  function handleManageQuestions(question) {
    setOpenQuestionsFor(question);
  }

  const filteredQuestions = filtered();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <div className="max-w-[1200px] mx-auto p-6 flex gap-6">
        <Sidebar active={active} setActive={setActive} />

        <main className="flex-1">
          <div className="mb-6">
            <Topbar
              onOpenCreate={() => {
                setEditing(null);
                setOpenCreate(true);
              }}
              onSearch={handleSearch}
              profile={profile}
            />
          </div>

          {active === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <StatCard
                  title="Questions"
                  value={questions.length}
                  delta={12}
                  icon={PieChart}
                />
                <StatCard
                  title="Utilisateurs actifs"
                  value={2540}
                  delta={8}
                  icon={Users}
                />
                <StatCard
                  title="Taux de complétion"
                  value={"72%"}
                  delta={3}
                  icon={Grid}
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">
                    {isTrashView ? "Corbeille" : "Dernières questions"}
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

                <QuestionsTable
                  questions={isTrashView ? trashedQuestions : filtered()}
                  onEdit={handleEditQuestion}
                  onSoftDelete={handleSoftDeleteQuestion}
                  onRestore={handleRestoreQuestion}
                  onPermanentDelete={handlePermanentDeleteQuestion}
                  isTrash={isTrashView}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}

          {active === "users" && (
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              (Page utilisateurs — À implémenter)
            </div>
          )}

          {/* {active === "quiz" && (
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">
                Gestion des Quiz
              </h2>
              <p className="text-slate-600 mb-4">
                Cette section permet de créer et gérer les quiz de l'application.
              </p>
              <div className="text-center py-8">
                <div className="text-slate-400 mb-4">
                  <PieChart size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Page Quiz
                </h3>
                <p className="text-slate-500 mb-4">
                  Cette fonctionnalité est maintenant disponible dans une page dédiée.
                </p>
                <button
                  onClick={() => setActive("dashboard")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Retour au Dashboard
                </button>
              </div>
            </div>
          )} */}

          {active === "settings" && (
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">
                Profil administrateur
              </h2>
              {profileLoading ? (
                <div className="text-slate-500 mb-2">
                  Chargement du profil...
                </div>
              ) : profileError ? (
                <div className="text-red-600 mb-2">{profileError}</div>
              ) : profile ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white font-bold text-xl">
                      {profile.firstname
                        ? profile.firstname[0].toUpperCase()
                        : "A"}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {profile.firstname && profile.lastname
                          ? `${profile.firstname} ${profile.lastname}`
                          : "Admin"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="text-slate-700">
                      <span className="font-medium">Email :</span>{" "}
                      {profile.email || ""}
                    </div>
                    <div className="text-slate-700">
                      <span className="font-medium">Mot de passe :</span>{" "}
                      •••••••••••••
                    </div>
                  </div>
                  {profile.role && (
                    <div className="text-sm text-slate-600">
                      Rôle : {profile.role}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-400">Aucun profil trouvé.</div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal avec le nouveau QuestionWizard */}
      <Modal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setEditingQuestionData(null);
        }}
        title="" // Le titre sera géré par le wizard
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

      <Modal
        open={!!openQuestionsFor}
        onClose={() => setOpenQuestionsFor(null)}
        title={openQuestionsFor ? `Questions — ${openQuestionsFor.title}` : ""}
        sizeClass="w-[560px] max-w-[90vw] max-h-[90vh] overflow-y-auto p-4"
      >
        {openQuestionsFor ? <QuestionsManager quiz={openQuestionsFor} /> : null}
      </Modal>
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
