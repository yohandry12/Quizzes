const BASE_URL = "https://hardcore-ramanujan.37-148-206-126.plesk.page";

// Service pour créer une question
export async function fetchCreateQuestions(data) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions`, {
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

// Service pour rechercher des questions
export async function fetchQuestionsSearch(query, page = 1, limit = 10) {
  try {
    // Construire l'URL avec les paramètres de recherche
    const url = new URL(`${BASE_URL}/api/questions/search`);
    url.searchParams.append("q", query || ""); // Le terme de recherche
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la recherche des questions");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans fetchQuestionsSearch:", error);
    return {
      success: false,
      data: [],
      message: error.message,
    };
  }
}

// Service pour lister des questions
export async function fetchQuestionsList(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/questions?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    if (!response.ok) throw new Error("Erreur lors de la liste des questions");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchTrashedQuestionsList(page = 1, limit = 10) {
  try {
    // Note : L'URL peut varier. '/api/questions/trashed' est une convention courante.
    const response = await fetch(
      `${BASE_URL}/api/questions/trashed?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération de la corbeille");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Service pour récupérer une question par son ID
export async function fetchQuestionsId(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok)
      throw new Error(
        "Erreur lors de la récupération de la question par son ID: " + id
      );
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour mettre à jour une question
export async function fetchPutQuestions(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({})); // On récupère la réponse même en cas d'erreur

    if (!response.ok) {
      // ON AFFICHE LE MESSAGE D'ERREUR DU BACKEND
      console.error("Backend validation error:", result);
      throw new Error(
        result.message || "Erreur lors de la mise à jour d'une question"
      );
    }
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error; // On propage l'erreur
  }
}

// Service pour mettre à la corbeille une question
export async function fetchSoftDeleteQuestions(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok)
      throw new Error(
        `Erreur lors de la suppression de la question par l'ID ${id}`
      );
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

//  Service pour récupérer les statistiques d'une question
export async function fetchStatsQuestions(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/${id}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok)
      throw new Error(
        `Erreur lors de la récupération des statistiques d'une question par l'ID ${id}`
      );
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour restaurer une question depuis la corbeille
export async function fetchRestoreQuestions(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/${id}/restore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error("Erreur lors de la restauration de la question");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour supprimer définitivement une question
export async function fetchDeletePermanentQuestions(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/${id}/permanent`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    if (!response.ok)
      throw new Error(
        `Erreur lors de la suppression définitive de la question par l'ID ${id}`
      );
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Service pour dupliquer une question
export async function fetchDuplicateQuestions(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/${id}/duplicate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error("Erreur lors de la duplication d'une question");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
