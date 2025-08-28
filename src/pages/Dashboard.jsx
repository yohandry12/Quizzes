import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
// Nettoyage: pas de gestion des questions sur le dashboard

import { fetchProfileAdmin } from "../services/loginAdminService";
import { fetchQuestionsList } from "../services/QuestionService";
// Pas d'import de services de Questions sur le dashboard
import { fetchQuizList } from "../services/QuizServices";
import { fetchListerBusinessSectors } from "../services/BusinessSectorService";

import { fetchCategoriesList } from "../services/QuestionCategorieService";
import { Grid, Layers, Folder, PieChart } from "lucide-react";

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

  // Totaux pour dashboard
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalSectors, setTotalSectors] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

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

  // Charger les totaux (quiz, secteurs, catégories)
  useEffect(() => {
    async function loadSummaryCounts() {
      try {
        // Quiz
        const quizResp = await fetchQuizList(1, 10);
        if (quizResp && quizResp.success) {
          const total =
            quizResp.pagination?.totalItems ??
            (quizResp.data?.quizzes?.length || quizResp.data?.length || 0);
          setTotalQuizzes(total);
        }

        // Secteurs d'activité (pas de pagination fournie → longueur filtrée)
        const sectorResp = await fetchListerBusinessSectors();
        if (sectorResp && sectorResp.success) {
          setTotalSectors((sectorResp.data || []).length);
        }

        // Catégories
        const catResp = await fetchCategoriesList(1, 10);
        if (catResp && catResp.success) {
          const totalCat =
            catResp.pagination?.totalItems ??
            (catResp.data?.categories?.length || catResp.data?.length || 0);
          setTotalCategories(totalCat);
        }
      } catch (e) {}
    }
    loadSummaryCounts();
  }, []);

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
      <div className="flex">
        <Sidebar active={active} setActive={setActive} />

        <main className="flex-1 flex flex-col min-h-screen">
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
            <div className="p-6 space-y-6">
              {/* Tuiles de statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard
                  title="Questions"
                  value={questions.length}
                  icon={PieChart}
                />
                <StatCard title="Total Quiz" value={totalQuizzes} icon={Grid} />
                <StatCard
                  title="Secteurs d'activité"
                  value={totalSectors}
                  icon={Layers}
                />
                <StatCard
                  title="Catégories"
                  value={totalCategories}
                  icon={Folder}
                />
              </div>

              {/* Deux panneaux: Activité récente et Statistiques rapides */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Activité récente
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                      <div>
                        <div className="font-medium">Nouveau quiz créé</div>
                        <div className="text-slate-500">
                          Quiz JavaScript Avancé · il y a 2h
                        </div>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
                      <div>
                        <div className="font-medium">Nouvelle catégorie</div>
                        <div className="text-slate-500">
                          DevOps et Cloud · hier
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Statistiques rapides
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        Quiz les plus populaires
                      </span>
                      <span className="font-medium">
                        JavaScript (42 sessions)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        Taux de réussite moyen
                      </span>
                      <span className="font-medium">76%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        Quiz les plus difficiles
                      </span>
                      <span className="font-medium">
                        Algorithmique (45% réussite)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        Sessions aujourd'hui
                      </span>
                      <span className="font-medium">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === "users" && (
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              (Page utilisateurs — À implémenter)
            </div>
          )}

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
    </div>
  );
}
