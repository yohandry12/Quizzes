const BASE_URL = "https://hardcore-ramanujan.37-148-206-126.plesk.page";
export async function fetchCreateQuiz(data) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz`, {
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
          result?.message || "Erreur lors de la création du quiz"
        );
      }
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error; // ⚠️ ne pas renvoyer [] sinon tu perds l’erreur
    }
  }

  export async function fetchQuizId(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok)
        throw new Error(
          "Erreur lors de la récupération du quiz par son ID: " + id
        );
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  export async function fetchQuizList(page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/quiz?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Erreur lors de la liste des quiz");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  export async function fetchPutQuiz(id, data) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}`, {
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
          result?.message || "Erreur lors de la modification du quiz"
        );
      }
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  }

  export async function fetchAddQuestionsToQuiz(quizId, questionIds) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${quizId}/questions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ question_ids: questionIds }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Backend error details:", result);
        throw new Error(
          result?.message || "Erreur lors de l'ajout des questions au quiz"
        );
      }
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  }

  // Service pour rechercher des quiz
  export async function fetchQuizSearch(query = "") {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors de la recherche des quiz");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Service pour supprimer un quiz (soft delete)
  export async function fetchSoftDeleteQuiz(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur lors de la suppression du quiz par l'ID ${id}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Service pour obtenir les statistiques d'un quiz
  export async function fetchQuizStats(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur lors de la récupération des statistiques du quiz par l'ID ${id}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Service pour obtenir les questions d'un quiz
  export async function fetchQuizQuestions(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}/questions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur lors de la récupération des questions du quiz par l'ID ${id}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Service pour gérer les questions d'un quiz (PUT)
  export async function fetchUpdateQuizQuestions(quizId, questionIds) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${quizId}/questions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ question_ids: questionIds }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Backend error details:", result);
        throw new Error(
          result?.message || "Erreur lors de la mise à jour des questions du quiz"
        );
      }
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  }

  // Service pour dupliquer un quiz
  export async function fetchDuplicateQuiz(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Erreur lors de la duplication du quiz"
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Service pour restaurer un quiz supprimé
  export async function fetchRestoreQuiz(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Erreur lors de la restauration du quiz"
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Service pour supprimer définitivement un quiz
  export async function fetchDeletePermanentQuiz(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/quiz/${id}/permanent`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur lors de la suppression définitive du quiz par l'ID ${id}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }