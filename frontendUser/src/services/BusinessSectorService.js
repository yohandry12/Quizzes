const BASE_URL = "https://hardcore-ramanujan.37-148-206-126.plesk.page";

// Service pour rechercher des secteurs d'activité
// Utilisation : import { fetchBusinessSectors } from './BusinessSectorService';

export async function fetchBusinessSectors() {
  try {
    const response = await fetch(`${BASE_URL}/api/business-sectors/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Erreur lors de la récupération des secteurs",
      }));
      throw new Error(
        errorData.message || "Erreur lors de la récupération des secteurs"
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Service pour créer un secteur d'activité
export async function fetchCreateBusinessSectors(data) {
  try {
    const response = await fetch(`${BASE_URL}/api/business-sectors`, {
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

// Service pour lister les secteurs d'activité
export async function fetchListerBusinessSectors() {
  try {
    const response = await fetch(`${BASE_URL}/api/business-sectors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Erreur lors du listage des secteurs",
      }));
      throw new Error(
        errorData.message || "Erreur lors du listage des secteurs"
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Service pour récupérer un secteur d'activité par son ID
export async function fetchIdBusinessSectors(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/business-sectors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erreur lors de la récupération du secteur par l'ID ${id}`,
      }));
      throw new Error(
        errorData.message ||
          `Erreur lors de la récupération du secteur par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Service pour mettre à jour un secteur d'activité
export async function fetchPutBusinessSectors(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/api/business-sectors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Erreur lors de la mise à jour du secteur",
      }));
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour du secteur"
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Service pour corbeille un secteur d'activité
export async function fetchDeleteBusinessSectors(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/business-sectors/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erreur lors de la suppression du secteur par l'ID ${id}`,
      }));
      throw new Error(
        errorData.message ||
          `Erreur lors de la suppression du secteur par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Service pour récupérer les statistiques d'un secteur d'activité
export async function fetchStatsBusinessSectors(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/business-sectors/${id}/stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erreur lors de la récupération des statistiques du secteur par l'ID ${id}`,
      }));
      throw new Error(
        errorData.message ||
          `Erreur lors de la récupération des statistiques du secteur par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Service pour restaurer un secteur d'activité depuis la corbeille
export async function fetchRestoreBusinessSectors(id, data) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/business-sectors/${id}/restore`,
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
      const errorData = await response.json().catch(() => ({
        message: "Erreur lors de la restauration du secteur",
      }));
      throw new Error(
        errorData.message || "Erreur lors de la restauration du secteur"
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour supprimer définitivement un secteur d'activité
export async function fetchDeletePermanentBusinessSectors(id) {
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
      const errorData = await response.json().catch(() => ({
        message: `Erreur lors de la suppression définitive du secteur par l'ID ${id}`,
      }));
      throw new Error(
        errorData.message ||
          `Erreur lors de la suppression définitive du secteur par l'ID ${id}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
