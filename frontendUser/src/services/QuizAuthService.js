// Service d'authentification basé sur l'API publique (plus de mocks)
import {
  getPublicQuizInfo,
  startPublicQuizSession,
} from './PublicQuizServices';

// Vérifie si le mot de passe est requis et, si oui, s'il est correct
export async function verifyQuizPassword(quizId, password) {
  try {
    const info = await getPublicQuizInfo(quizId);
    if (!info) {
      return { success: false, message: "Quiz introuvable" };
    }

    const quiz = info?.data?.quiz || info?.quiz || info?.data || info;
    const requiresCode = Boolean(quiz?.requires_code);

    if (!requiresCode) {
      return { success: true, message: "Quiz accessible" };
    }

    // Tenter de démarrer une session avec le mot de passe fourni
    const probe = await startPublicQuizSession(quizId, { access_password: password });
    if (probe && (probe.success === true || probe.token)) {
      return { success: true, message: "Mot de passe correct" };
    }
    return { success: false, message: probe?.message || "Mot de passe incorrect" };
  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe:", error);
    return { success: false, message: "Erreur lors de la vérification" };
  }
}

// Indique si un quiz nécessite un mot de passe (via l'API publique)
export async function isQuizProtected(quizId) {
  const info = await getPublicQuizInfo(quizId);
  const quiz = info?.data?.quiz || info?.quiz || info?.data || info;
  return Boolean(quiz?.requires_code);
}

// Retourne les IDs des quiz protégés parmi ceux fournis (utile si on a une liste d'IDs publics)
export async function getProtectedQuizzes(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const infos = await Promise.all(ids.map((id) => getPublicQuizInfo(id)));
  return infos
    .map((res) => res?.data?.quiz || res?.quiz || res?.data || res)
    .filter((q) => q && q.requires_code)
    .map((q) => q.id);
}
