const BASE_URL = "https://hardcore-ramanujan.37-148-206-126.plesk.page";

// Service public pour récupérer la liste des quiz (sans authentification)
export async function fetchPublicQuizList(page = 1, limit = 50) {
  try {
    // Utiliser directement l'endpoint standard sans authentification
    const response = await fetch(
      `${BASE_URL}/api/quiz?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      console.error("Erreur lors de la récupération des quiz publics");
      // En cas d'erreur, on retourne null pour déclencher le fallback
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur réseau lors de la récupération des quiz:", error);
    // En cas d'erreur réseau, on retourne null pour déclencher le fallback
    return null;
  }
}

// Service public pour récupérer un quiz par ID (sans authentification)
export async function fetchPublicQuizById(id) {
  try {
    // Utiliser directement l'endpoint standard sans authentification
    const response = await fetch(`${BASE_URL}/api/quiz/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      console.error(`Erreur lors de la récupération du quiz ${id}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur réseau lors de la récupération du quiz:", error);
    return null;
  }
}

// Service public pour récupérer les questions d'un quiz (sans authentification)
export async function fetchPublicQuizQuestions(id) {
  try {
    // Utiliser directement l'endpoint standard sans authentification
    const response = await fetch(`${BASE_URL}/api/quiz/${id}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      console.error(`Erreur lors de la récupération des questions du quiz ${id}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur réseau lors de la récupération des questions:", error);
    return null;
  }
}

// Service public pour rechercher des quiz (sans authentification)
export async function fetchPublicQuizSearch(query = "") {
  try {
    // Utiliser directement l'endpoint standard sans authentification
    const response = await fetch(
      `${BASE_URL}/api/quiz/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      console.error("Erreur lors de la recherche des quiz");
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur réseau lors de la recherche:", error);
    return null;
  }
}
