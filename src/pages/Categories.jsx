import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import { Plus, Edit, Trash2, RotateCcw, Search } from "lucide-react";
import {
  fetchCategoriesList,
  fetchCategoriesSearch,
  fetchCreateCategories,
  fetchPutCategories,
  fetchSoftDeleteCategories,
  fetchTrashedCategoriesList,
  fetchRestoreCategories,
  fetchDeletePermanentCategories,
} from "../services/QuestionCategorieService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [trashedCategories, setTrashedCategories] = useState([]);
  const [isTrashView, setIsTrashView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchFunction = isTrashView
        ? fetchTrashedCategoriesList
        : fetchCategoriesList;
      const response = await fetchFunction(currentPage, 10);
      if (response && response.success) {
        if (isTrashView) {
          setTrashedCategories(response.data || []);
        } else {
          setCategories(response.data || []);
        }
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setCategories([]);
        setTrashedCategories([]);
        setTotalPages(1);
      }
    } catch (error) {
      setCategories([]);
      setTrashedCategories([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [isTrashView, currentPage]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function handleSearch(q) {
    setFilter(q);
    if (q.trim()) {
      try {
        const response = await fetchCategoriesSearch(q);
        if (response && response.success) {
          setCategories(response.data.categories || response.data || []);
        }
      } catch (error) {}
    } else {
      loadCategories();
    }
  }

  async function handleCreateOrUpdate(data) {
    try {
      if (data.id) {
        await fetchPutCategories(data.id, data);
      } else {
        await fetchCreateCategories(data);
        if (currentPage !== 1) setCurrentPage(1);
      }
      setOpenCreate(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {}
  }

  function handleEditCategory(category) {
    setEditingCategory(category);
    setOpenCreate(true);
  }

  async function handleSoftDeleteCategory(category) {
    setConfirmAction({
      isOpen: true,
      title: "Mettre à la corbeille",
      message: `Êtes-vous sûr de vouloir supprimer la catégorie : "${category.name}" ?`,
      onConfirm: async () => {
        await fetchSoftDeleteCategories(category.id);
        loadCategories();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  async function handleRestoreCategory(category) {
    setConfirmAction({
      isOpen: true,
      title: "Restaurer la catégorie",
      message: `Êtes-vous sûr de vouloir restaurer la catégorie : "${category.name}" ?`,
      onConfirm: async () => {
        await fetchRestoreCategories(category.id, {});
        loadCategories();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  async function handlePermanentDeleteCategory(category) {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer définitivement",
      message: `Êtes-vous sûr de vouloir supprimer définitivement la catégorie : "${category.name}" ?`,
      onConfirm: async () => {
        await fetchDeletePermanentCategories(category.id);
        loadCategories();
        setConfirmAction({ isOpen: false });
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <div className="max-w-[1200px] mx-auto p-6 flex gap-6">
        <Sidebar active="category" setActive={() => {}} />
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">
                {isTrashView ? "Corbeille" : "Liste des catégories"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenCreate(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Créer une catégorie
                </button>
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
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-2 border-b">Titre</th>
                    <th className="text-left px-4 py-2 border-b">
                      Description
                    </th>
                    <th className="text-right px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(isTrashView ? trashedCategories : categories).map(
                    (category) => (
                      <tr
                        key={category.id}
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
                          {category.name}
                          <span className="text-xs text-slate-400">
                            (id: {category.id})
                          </span>
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          {category.description || "-"}
                        </td>
                        <td className="px-4 py-2 text-right flex justify-end gap-2">
                          {!isTrashView && (
                            <>
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-1 hover:bg-slate-200 rounded"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleSoftDeleteCategory(category)
                                }
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </>
                          )}
                          {isTrashView && (
                            <>
                              <button
                                onClick={() => handleRestoreCategory(category)}
                                className="p-1 hover:bg-green-100 rounded"
                              >
                                <RotateCcw
                                  size={16}
                                  className="text-green-500"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handlePermanentDeleteCategory(category)
                                }
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          <Modal
            open={openCreate}
            onClose={() => {
              setOpenCreate(false);
              setEditingCategory(null);
            }}
            title={
              editingCategory ? "Modifier la catégorie" : "Créer une catégorie"
            }
            sizeClass="w-[420px] max-w-[90vw] p-4"
          >
            <CategoryForm
              onSave={handleCreateOrUpdate}
              initialData={editingCategory}
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

// Formulaire de création/modification de catégorie
function CategoryForm({ onSave, initialData }) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData)
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
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
      if (!formData.name.trim()) throw new Error("Le titre est requis");
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
          Titre de la catégorie
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
