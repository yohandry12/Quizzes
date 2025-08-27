// Configuration pour le template de quiz

export const QUIZ_CONFIG = {
  // Mode démo (true) ou production (false)
  DEMO_MODE: true,
  
  // Configuration des animations
  ANIMATIONS: {
    DURATION: 0.3,
    STAGGER_DELAY: 0.1,
    EASE: "easeOut"
  },
  
  // Configuration du timer
  TIMER: {
    DEFAULT_DURATION: 15, // minutes
    WARNING_THRESHOLD: 300, // secondes (5 minutes)
    UPDATE_INTERVAL: 1000 // millisecondes
  },
  
  // Configuration de l'interface
  UI: {
    MAX_QUESTIONS_PER_PAGE: 50,
    SEARCH_DEBOUNCE: 300,
    MODAL_BACKDROP_BLUR: 8
  },
  
  // Configuration des couleurs
  COLORS: {
    PRIMARY: {
      FROM: "#667eea",
      TO: "#764ba2"
    },
    SUCCESS: {
      FROM: "#10b981",
      TO: "#059669"
    },
    ERROR: {
      FROM: "#ef4444",
      TO: "#dc2626"
    },
    WARNING: {
      FROM: "#f59e0b",
      TO: "#d97706"
    }
  },
  
  // Configuration des messages
  MESSAGES: {
    LOADING: "Chargement...",
    ERROR: "Une erreur est survenue",
    SUCCESS: "Opération réussie",
    VALIDATION: {
      EMAIL_REQUIRED: "L'email est requis",
      PHONE_REQUIRED: "Le numéro de téléphone est requis",
      PASSWORD_REQUIRED: "Le mot de passe du quiz est requis",
      INVALID_PASSWORD: "Mot de passe incorrect"
    }
  },
  
  // Configuration des breakpoints responsive
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280
  }
};

// Fonction pour obtenir la configuration selon le mode
export const getQuizConfig = () => {
  return {
    ...QUIZ_CONFIG,
    isDemoMode: QUIZ_CONFIG.DEMO_MODE
  };
};

// Fonction pour basculer entre les modes
export const toggleDemoMode = () => {
  QUIZ_CONFIG.DEMO_MODE = !QUIZ_CONFIG.DEMO_MODE;
  return QUIZ_CONFIG.DEMO_MODE;
};

// Configuration des routes
export const ROUTES = {
  QUIZ_HOME: "/quiz-player",
  QUIZ_DEMO: "/quiz-demo",
  QUIZ_PLAYER: "/quiz-player/:id"
};

// Configuration des localStorage keys
export const STORAGE_KEYS = {
  USER_DATA: "quiz_user_data",
  QUIZ_PROGRESS: "quiz_progress",
  QUIZ_ANSWERS: "quiz_answers"
};

// Configuration des API endpoints (pour le mode production)
export const API_ENDPOINTS = {
  QUIZ_LIST: "/api/quiz",
  QUIZ_DETAIL: "/api/quiz/:id",
  QUIZ_QUESTIONS: "/api/quiz/:id/questions",
  QUIZ_SUBMIT: "/api/quiz/:id/submit"
};
