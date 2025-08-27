// Service mock pour l'authentification par mot de passe des quiz

// Mots de passe mock pour les quiz protégés
const QUIZ_PASSWORDS = {
  1: "histoire2024",    // Quiz Histoire de France
  3: "securite2024",    // Quiz Formation Sécurité
  5: "science2024",     // Quiz Sciences et Technologies
  // Ajoutez d'autres quiz protégés ici
};

// Service pour vérifier le mot de passe d'un quiz
export async function verifyQuizPassword(quizId, password) {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const expectedPassword = QUIZ_PASSWORDS[quizId];
    
    if (!expectedPassword) {
      // Quiz non protégé
      return {
        success: true,
        message: "Quiz accessible"
      };
    }
    
    if (password === expectedPassword) {
      return {
        success: true,
        message: "Mot de passe correct"
      };
    } else {
      return {
        success: false,
        message: "Mot de passe incorrect"
      };
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe:", error);
    return {
      success: false,
      message: "Erreur lors de la vérification"
    };
  }
}

// Service pour vérifier si un quiz nécessite un mot de passe
export function isQuizProtected(quizId) {
  return QUIZ_PASSWORDS.hasOwnProperty(quizId);
}

// Service pour obtenir la liste des quiz protégés
export function getProtectedQuizzes() {
  return Object.keys(QUIZ_PASSWORDS).map(id => parseInt(id));
}
