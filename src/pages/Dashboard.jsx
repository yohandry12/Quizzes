import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { fetchQuestionsList } from "../services/QuestionService";
import { fetchQuizList } from "../services/QuizServices";
import {
  fetchListerBusinessSectors,
  fetchStatsBusinessSectors,
} from "../services/BusinessSectorService";
import {
  fetchCategoriesList,
  fetchStatsCategories,
} from "../services/QuestionCategorieService";
import { Grid, Layers, Folder, PieChart } from "lucide-react";

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [TotalItems, setTotalItems] = useState({ totalItems: 0 });
  const [filter, setFilter] = useState("");
  const [profile, setProfile] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Totaux pour dashboard
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalSectors, setTotalSectors] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  // Statistiques secteurs et catégories
  const [sectorStats, setSectorStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);


  // Charger le nombre total de questions créées (totalItems)
  useEffect(() => {
    async function loadTotalQuestions() {
      try {
        const response = await fetchQuestionsList(1, 1); // On ne veut qu'une page, mais on veut le total
        if (response && response.success) {
          setTotalItems({ totalItems: response.pagination?.totalItems ?? 0 });
        } else {
          setTotalItems({ totalItems: 0 });
        }
      } catch (e) {
        setTotalItems({ totalItems: 0 });
      }
    }
    loadTotalQuestions();
  }, []);

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
        const catResp = await fetchCategoriesList();
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

  // Charger les statistiques secteurs et catégories
  useEffect(() => {
    async function loadSectorAndCategoryStats() {
      // Statistiques secteurs
      try {
        const sectorResp = await fetchListerBusinessSectors();
        if (
          sectorResp &&
          sectorResp.success &&
          Array.isArray(sectorResp.data)
        ) {
          const statsPromises = sectorResp.data.map(async (sector) => {
            try {
              const statResp = await fetchStatsBusinessSectors(sector.id);
              if (statResp && statResp.success) {
                // stats peuvent être dans statResp.data.stats ou statResp.data
                const statsData = statResp.data?.stats || statResp.data;
                return {
                  ...sector,
                  stats: statsData,
                };
              }
            } catch (e) {}
            return {
              ...sector,
              stats: null,
            };
          });
          const stats = await Promise.all(statsPromises);
          setSectorStats(stats);
        } else {
          setSectorStats([]);
        }
      } catch (e) {
        setSectorStats([]);
      }

      // Statistiques catégories
      try {
        const catResp = await fetchCategoriesList();
        let categoriesArr = [];
        if (catResp && catResp.success) {
          if (Array.isArray(catResp.data)) {
            categoriesArr = catResp.data;
          } else if (Array.isArray(catResp.data?.categories)) {
            categoriesArr = catResp.data.categories;
          }
        }
        if (categoriesArr.length > 0) {
          const statsPromises = categoriesArr.map(async (cat) => {
            try {
              const statResp = await fetchStatsCategories(cat.id);
              if (statResp && statResp.success) {
                // stats peuvent être dans statResp.data.stats ou statResp.data
                const statsData = statResp.data?.stats || statResp.data;
                return {
                  ...cat,
                  stats: statsData,
                };
              }
            } catch (e) {}
            return {
              ...cat,
              stats: null,
            };
          });
          const stats = await Promise.all(statsPromises);
          setCategoryStats(stats);
        } else {
          setCategoryStats([]);
        }
      } catch (e) {
        setCategoryStats([]);
      }
    }
    loadSectorAndCategoryStats();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  function handleSearch(q) {
    setFilter(q);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <div className="flex">
        <Sidebar active={active} setActive={setActive} />

        <main className="flex-1 flex flex-col min-h-screen">
          <div className="mb-6">
            <Topbar
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
                  value={TotalItems.totalItems}
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

              {/* Statistiques Secteurs d'activité et Catégories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tableau des Statistiques par Secteur */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Utilisation par secteur d'activité
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="py-2 px-2 text-left font-semibold text-slate-600">
                            Secteur
                          </th>
                          <th className="py-2 px-2 text-left font-semibold text-slate-600">
                            Quiz Associés
                          </th>
                          <th className="py-2 px-2 text-left font-semibold text-slate-600">
                            Questions Associées
                          </th>
                          <th className="py-2 px-2 text-left font-semibold text-slate-600">
                            Total sessions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectorStats.map((sector) => (
                          <tr
                            key={sector.id}
                            className="border-b last:border-none hover:bg-slate-50"
                          >
                            <td className="py-2 px-2 font-medium">
                              {sector.name}
                            </td>
                            <td className="py-2 px-2">
                              {sector.stats?.total_quizzes ?? "0"}
                            </td>
                            <td className="py-2 px-2">
                              {sector.stats?.total_questions ?? "0"}
                            </td>
                            <td className="py-2 px-2">
                              {sector.stats?.total_sessions ?? "0"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tableau des Statistiques par Catégorie */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Utilisation par catégorie
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="py-2 px-2 text-left font-semibold text-slate-600">
                            Catégorie
                          </th>
                          <th className="py-2 px-2 text-left font-semibold text-slate-600">
                            Quiz Associés
                          </th>
                          <th className="py-2 px-2 text-left font-semibold text-slate-600">
                            Questions Associées
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryStats.map((cat) => (
                          <tr
                            key={cat.id}
                            className="border-b last:border-none hover:bg-slate-50"
                          >
                            <td className="py-2 px-2 font-medium">
                              {cat.name}
                            </td>
                            <td className="py-2 px-2">
                              {cat.stats?.used_in_quizzes ?? "0"}
                            </td>
                            <td className="py-2 px-2">
                              {cat.stats?.total_questions ?? "0"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            <div className="p-6">
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
