const BASE_URL = "https://hardcore-ramanujan.37-148-206-126.plesk.page";

// GET /api/public/quiz/{id}/info
export async function getPublicQuizInfo(quizId) {
  try {
    const response = await fetch(`${BASE_URL}/api/public/quiz/${quizId}/info`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur getPublicQuizInfo:", error);
    return null;
  }
}

// POST /api/public/quiz/{id}/start
export async function startPublicQuizSession(quizId, candidate = {}) {
  try {
    // Normaliser les champs attendus par l'API (spécifique aux docs backend)
    const normalizedCandidate = {
      candidate_name:
        candidate.candidate_name ||
        candidate.name ||
        candidate.fullname ||
        candidate.nom ||
        "",
      candidate_email:
        candidate.candidate_email || candidate.email || candidate.mail || "",
      candidate_phone:
        candidate.candidate_phone ||
        candidate.phone ||
        candidate.telephone ||
        "",
      access_password:
        candidate.access_password || candidate.password || candidate.code || "",
    };

    const response = await fetch(
      `${BASE_URL}/api/public/quiz/${quizId}/start`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedCandidate),
      }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur startPublicQuizSession:", error);
    return null;
  }
}

// GET /api/public/quiz/session/{token}/questions
export async function getSessionQuestions(token) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/public/quiz/session/${token}/questions`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur getSessionQuestions:", error);
    return null;
  }
}

// POST /api/public/quiz/session/{token}/answer
export async function submitSessionAnswer(token, questionId, answerData) {
  try {
    const payload = {
      question_id: questionId,
      answer_data: answerData,
    };

    const response = await fetch(
      `${BASE_URL}/api/public/quiz/session/${token}/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    // It's better to check the response before returning
    if (!response.ok) {
      const errorResult = await response.json().catch(() => null);
      console.error("API Error on answer submission:", errorResult);
      throw new Error(errorResult?.message || "Failed to submit answer.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in submitSessionAnswer service:", error);
    throw error; // Propagate the error
  }
}

// POST /api/public/quiz/session/{token}/submit
export async function submitSession(token) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/public/quiz/session/${token}/submit`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur submitSession:", error);
    return null;
  }
}

// GET /api/public/quiz/session/{token}/results
export async function getSessionResults(token) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/public/quiz/session/${token}/results`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur getSessionResults:", error);
    return null;
  }
}

// ----------------------
// Affichage liste publique (Image 2)
// ----------------------

// Helper: construire une liste à partir d'une liste d'IDs publics
export async function getPublicQuizzesByIds(ids = []) {
  try {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const results = await Promise.all(ids.map((id) => getPublicQuizInfo(id)));
    return results
      .filter(Boolean)
      .map((res) => res?.data?.quiz || res?.quiz || res?.data || res)
      .filter(Boolean)
      .map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.time_limit || quiz.duration || 15,
        questions_count: quiz.total_questions || quiz.questions_count || 0,
        difficulty: quiz.difficulty_level || quiz.difficulty || 3,
        requires_code: quiz.requires_code ?? false,
      }));
  } catch (error) {
    console.error("Erreur getPublicQuizzesByIds:", error);
    return [];
  }
}

// ----------------------
// Alias de compatibilité pour l'UI actuelle
// ----------------------

export const fetchPublicQuizById = getPublicQuizInfo;
export const fetchPublicSessionQuestions = getSessionQuestions;
export const submitPublicAnswer = submitSessionAnswer;
export const finalizePublicQuiz = submitSession;
export const fetchPublicSessionResults = getSessionResults;
export const fetchPublicQuizzesByIds = getPublicQuizzesByIds;

// Ancienne fonction utilisée par QuizPlayer: démarre une session puis charge les questions
export async function fetchPublicQuizQuestions(quizId, candidate = {}) {
  const session = await startPublicQuizSession(quizId, candidate);
  if (!session?.token) return null;
  const questions = await getSessionQuestions(session.token);
  if (questions && Array.isArray(questions.data)) return questions;
  if (Array.isArray(questions)) return { data: questions };
  return questions;
}
