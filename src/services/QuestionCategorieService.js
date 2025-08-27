const BASE_URL = "https://hardcore-ramanujan.37-148-206-126.plesk.page";

// Service pour créer une catégorie de question
export async function fetchCreateCategories(data) {
  try {
    const response = await fetch(`${BASE_URL}/api/question-categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Backend error details:", result);
      throw new Error(
        result?.message || "Erreur lors de la création du secteur"
      );
    }
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error; // ⚠️ ne pas renvoyer [] sinon tu perds l’erreur
  }
}

// Service pour rechercher des catégories de question
export async function fetchCategoriesSearch() {
  try {
    const response = await fetch(`${BASE_URL}/api/question-categories/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok)
      throw new Error("Erreur lors de la recherche des catégories");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour lister des catégories de question
export async function fetchCategoriesList() {
  try {
    const response = await fetch(`${BASE_URL}/api/question-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Backend error details:", result);
      throw new Error(
        result?.message || "Erreur lors de la création du secteur"
      );
    }
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error; // ⚠️ ne pas renvoyer [] sinon tu perds l’erreur
  }
}

// Service pour recupérer une catégorie de question par son ID
export async function fetchCategoriesId(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/question-categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Backend error details:", result);
      throw new Error(
        result?.message || "Erreur lors de la création du secteur"
      );
    }
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error; // ⚠️ ne pas renvoyer [] sinon tu perds l’erreur
  }
}

// Service pour mettre à jour une catégorie de question
export async function fetchPutCategories(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/api/question-categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Backend error details:", result);
      throw new Error(
        result?.message || "Erreur lors de la création du secteur"
      );
    }
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error; // ⚠️ ne pas renvoyer [] sinon tu perds l’erreur
  }
}

// Service pour mettre à la corbeille une catégorie de question
export async function fetchSoftDeleteCategories(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/question-categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la suppression de la catégorie par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchTrashedCategoriesList(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/question-categories/trashed?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la suppression de la catégorie par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

//  Service pour récupérer les statistiques d'une catégorie de question
export async function fetchStatsCategories(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/question-categories/${id}/stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la récupération des statistiques de la categorie par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour restaurer une catégorie de question depuis la corbeille
export async function fetchRestoreCategories(id, data) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/question-categories/${id}/restore`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Erreur lors de la restauration de la catégorie"
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour supprimer définitivement une catégorie de question
export async function fetchDeletePermanentCategories(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/question-categories/${id}/permanent`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la suppression définitive de la catégorie par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
