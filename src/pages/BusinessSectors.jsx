import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import { Plus, Edit, Trash2, RotateCcw, Search } from "lucide-react";
import {
  fetchListerBusinessSectors,
  fetchCreateBusinessSectors,
  fetchPutBusinessSectors,
  fetchDeleteBusinessSectors,
  fetchRestoreBusinessSectors,
  fetchDeletePermanentBusinessSectors,
  fetchSearchBusinessSectors,
} from "../services/BusinessSectorService";

export default function BusinessSectors() {
  const [sectors, setSectors] = useState([]);
  const [trashedSectors, setTrashedSectors] = useState([]);
  const [isTrashView, setIsTrashView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [confirmAction, setConfirmAction] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Chargement des secteurs (liste principale ou corbeille)
  const loadSectors = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (isTrashView) {
        // Pas d'endpoint /trashed, on filtre côté front (exemple)
        response = await fetchListerBusinessSectors();
        if (response && response.success) {
          setTrashedSectors((response.data || []).filter((s) => s.deleted_at));
        } else {
          setTrashedSectors([]);
        }
      } else {
        response = await fetchListerBusinessSectors();
        if (response && response.success) {
          setSectors((response.data || []).filter((s) => !s.deleted_at));
        } else {
          setSectors([]);
        }
      }
      setTotalPages(1); // À adapter si pagination backend
    } catch (error) {
      setSectors([]);
      setTrashedSectors([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [isTrashView, currentPage]);

  useEffect(() => {
    loadSectors();
  }, [loadSectors]);

  async function handleSearch(q) {
    setFilter(q);
    if (q.trim()) {
      try {
        const response = await fetchSearchBusinessSectors(q);
        if (response && response.success) {
          setSectors(response.data.sectors || response.data || []);
        }
      } catch (error) {}
    } else {
      loadSectors();
    }
  }

  async function handleCreateOrUpdate(data) {
    try {
      if (data.id) {
        await fetchPutBusinessSectors(data.id, data);
      } else {
        await fetchCreateBusinessSectors(data);
        if (currentPage !== 1) setCurrentPage(1);
      }
      setOpenCreate(false);
      setEditingSector(null);
      loadSectors();
    } catch (error) {}
  }

  function handleEditSector(sector) {
    setEditingSector(sector);
    setOpenCreate(true);
  }

  async function handleSoftDeleteSector(sector) {
    setConfirmAction({
      isOpen: true,
      title: "Mettre à la corbeille",
      message: `Êtes-vous sûr de vouloir supprimer le secteur : "${sector.name}" ?`,
      onConfirm: async () => {
        await fetchDeleteBusinessSectors(sector.id);
        loadSectors();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  async function handleRestoreSector(sector) {
    setConfirmAction({
      isOpen: true,
      title: "Restaurer le secteur",
      message: `Êtes-vous sûr de vouloir restaurer le secteur : "${sector.name}" ?`,
      onConfirm: async () => {
        await fetchRestoreBusinessSectors(sector.id, {});
        loadSectors();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  async function handlePermanentDeleteSector(sector) {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer définitivement",
      message: `Êtes-vous sûr de vouloir supprimer définitivement le secteur : "${sector.name}" ?`,
      onConfirm: async () => {
        await fetchDeletePermanentBusinessSectors(sector.id);
        loadSectors();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <div className="flex">
        <Sidebar active="sector_activity" setActive={() => {}} />
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
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-slate-900 font-semibold">
                    {isTrashView
                      ? "Corbeille"
                      : "Liste des secteurs d'activité"}
                  </div>
                  <p className="text-slate-600 text-sm mt-1">
                    {isTrashView
                      ? "Restaurez ou supprimez définitivement vos secteurs"
                      : "Créez, modifiez et organisez vos secteurs d'activité"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenCreate(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Créer un secteur
                  </button>
                  <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <button
                      onClick={() => setIsTrashView(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        !isTrashView
                          ? "bg-white text-indigo-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Liste principale
                    </button>
                    <button
                      onClick={() => setIsTrashView(true)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isTrashView
                          ? "bg-white text-red-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Corbeille
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="text-left px-4 py-2 border-b">Nom</th>
                      <th className="text-left px-4 py-2 border-b">
                        Description
                      </th>
                      <th className="text-right px-4 py-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(isTrashView ? trashedSectors : sectors).map((sector) => (
                      <tr
                        key={sector.id}
                        className={
                          isTrashView ? "hover:bg-red-50" : "hover:bg-slate-50"
                        }
                      >
                        <td
                          className={
                            isTrashView
                              ? "px-4 py-2 font-medium text-red-800"
                              : "px-4 py-2 font-medium text-slate-800"
                          }
                        >
                          {sector.name}
                          <span className="text-xs text-slate-400">
                            (id: {sector.id})
                          </span>
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          {sector.description || "-"}
                        </td>
                        <td className="px-4 py-2 text-right flex justify-end gap-2">
                          {!isTrashView && (
                            <>
                              <button
                                onClick={() => handleEditSector(sector)}
                                className="p-1 hover:bg-slate-200 rounded"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleSoftDeleteSector(sector)}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </>
                          )}
                          {isTrashView && (
                            <>
                              <button
                                onClick={() => handleRestoreSector(sector)}
                                className="p-1 hover:bg-green-100 rounded"
                              >
                                <RotateCcw
                                  size={16}
                                  className="text-green-500"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handlePermanentDeleteSector(sector)
                                }
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 pb-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
          <Modal
            open={openCreate}
            onClose={() => {
              setOpenCreate(false);
              setEditingSector(null);
            }}
            title={editingSector ? "Modifier le secteur" : "Créer un secteur"}
            sizeClass="w-[420px] max-w-[90vw] p-4"
          >
            <SectorForm
              onSave={handleCreateOrUpdate}
              initialData={editingSector}
            />
          </Modal>
          <ConfirmationModal
            open={confirmAction.isOpen}
            onClose={() => setConfirmAction({ isOpen: false })}
            onConfirm={confirmAction.onConfirm}
            title={confirmAction.title}
          >
            {confirmAction.message}
          </ConfirmationModal>
        </main>
      </div>
    </div>
  );
}

// Formulaire de création/modification de secteur
function SectorForm({ onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color_hex: "#cccccc",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData)
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        color_hex: initialData.color_hex || "#cccccc",
      });
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!formData.name.trim()) throw new Error("Le nom est requis");
      await onSave({ ...initialData, ...formData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nom du secteur
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {/* 3. AJOUTER L'INPUT POUR LA COULEUR DANS LE JSX */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Couleur
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={formData.color_hex}
            onChange={(e) => handleChange("color_hex", e.target.value)}
            className="w-10 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={formData.color_hex}
            onChange={(e) => handleChange("color_hex", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="définir la couleur"
          />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
