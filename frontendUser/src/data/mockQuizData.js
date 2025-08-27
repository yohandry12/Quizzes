// Données fictives pour tester le template de quiz

export const mockQuizzes = [
  {
    id: 1,
    title: "Histoire de France",
    description: "Testez vos connaissances en histoire de France, de la préhistoire à nos jours. Un quiz complet pour tous les passionnés d'histoire.",
    password: "histoire2024",
    duration: 20,
    difficulty: 4,
    participants: 1247,
    questions_count: 15,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Culture Générale",
    description: "Un quiz varié couvrant la littérature, les sciences, l'art et la géographie. Parfait pour tester votre culture générale.",
    password: "culture2024",
    duration: 15,
    difficulty: 3,
    participants: 2156,
    questions_count: 12,
    created_at: "2024-01-10T14:20:00Z"
  },
  {
    id: 3,
    title: "Formation Sécurité",
    description: "Quiz obligatoire pour tous les employés. Testez vos connaissances en matière de sécurité au travail.",
    password: "securite2024",
    duration: 30,
    difficulty: 2,
    participants: 89,
    questions_count: 20,
    created_at: "2024-01-20T09:15:00Z"
  },
  {
    id: 4,
    title: "Géographie Mondiale",
    description: "Découvrez le monde à travers ce quiz de géographie. Capitales, pays, montagnes et océans n'auront plus de secrets.",
    password: "Géo2024",
    duration: 18,
    difficulty: 3,
    participants: 892,
    questions_count: 14,
    created_at: "2024-01-12T16:45:00Z"
  },
  {
    id: 5,
    title: "Sciences et Technologies",
    description: "Plongez dans l'univers des sciences et des technologies. De la physique quantique aux dernières innovations.",
    password: "science2024",
    duration: 25,
    difficulty: 5,
    participants: 456,
    questions_count: 18,
    created_at: "2024-01-18T11:30:00Z"
  },
  {
    id: 6,
    title: "Littérature Classique",
    description: "Un voyage à travers les plus grandes œuvres de la littérature mondiale. De Shakespeare à Proust.",
    password: null,
    duration: 12,
    difficulty: 4,
    participants: 678,
    questions_count: 10,
    created_at: "2024-01-14T13:20:00Z"
  }
];

export const mockQuestions = {
  1: [ // Questions pour "Histoire de France"
    {
      id: 1,
      question_text: "Quel roi de France était surnommé 'le Roi Soleil' ?",
      image_url: null,
      answers: [
        { id: 1, answer_text: "Louis XIV", is_correct: true },
        { id: 2, answer_text: "Louis XIII", is_correct: false },
        { id: 3, answer_text: "Louis XV", is_correct: false },
        { id: 4, answer_text: "Louis XVI", is_correct: false }
      ]
    },
    {
      id: 2,
      question_text: "En quelle année a eu lieu la Révolution française ?",
      image_url: null,
      answers: [
        { id: 5, answer_text: "1789", is_correct: true },
        { id: 6, answer_text: "1799", is_correct: false },
        { id: 7, answer_text: "1779", is_correct: false },
        { id: 8, answer_text: "1809", is_correct: false }
      ]
    },
    {
      id: 3,
      question_text: "Qui était le premier empereur des Français ?",
      image_url: null,
      answers: [
        { id: 9, answer_text: "Napoléon Bonaparte", is_correct: true },
        { id: 10, answer_text: "Napoléon III", is_correct: false },
        { id: 11, answer_text: "Louis-Napoléon", is_correct: false },
        { id: 12, answer_text: "Charles de Gaulle", is_correct: false }
      ]
    }
  ],
  2: [ // Questions pour "Culture Générale"
    {
      id: 4,
      question_text: "Quel est le plus grand océan du monde ?",
      image_url: null,
      answers: [
        { id: 13, answer_text: "L'océan Pacifique", is_correct: true },
        { id: 14, answer_text: "L'océan Atlantique", is_correct: false },
        { id: 15, answer_text: "L'océan Indien", is_correct: false },
        { id: 16, answer_text: "L'océan Arctique", is_correct: false }
      ]
    },
    {
      id: 5,
      question_text: "Qui a peint la Joconde ?",
      image_url: null,
      answers: [
        { id: 17, answer_text: "Léonard de Vinci", is_correct: true },
        { id: 18, answer_text: "Michel-Ange", is_correct: false },
        { id: 19, answer_text: "Raphaël", is_correct: false },
        { id: 20, answer_text: "Botticelli", is_correct: false }
      ]
    },
    {
      id: 6,
      question_text: "Quel est le plus grand désert du monde ?",
      image_url: null,
      answers: [
        { id: 21, answer_text: "Le Sahara", is_correct: true },
        { id: 22, answer_text: "Le désert de Gobi", is_correct: false },
        { id: 23, answer_text: "Le désert d'Arabie", is_correct: false },
        { id: 24, answer_text: "Le désert du Kalahari", is_correct: false }
      ]
    }
  ],
  3: [ // Questions pour "Formation Sécurité"
    {
      id: 7,
      question_text: "Quelle est la première action à effectuer en cas d'incendie ?",
      image_url: null,
      answers: [
        { id: 25, answer_text: "Évacuer immédiatement", is_correct: true },
        { id: 26, answer_text: "Essayer d'éteindre le feu", is_correct: false },
        { id: 27, answer_text: "Prendre ses affaires", is_correct: false },
        { id: 28, answer_text: "Appeler les pompiers", is_correct: false }
      ]
    },
    {
      id: 8,
      question_text: "Quelle couleur indique un danger immédiat sur les panneaux de sécurité ?",
      image_url: null,
      answers: [
        { id: 29, answer_text: "Rouge", is_correct: true },
        { id: 30, answer_text: "Jaune", is_correct: false },
        { id: 31, answer_text: "Bleu", is_correct: false },
        { id: 32, answer_text: "Vert", is_correct: false }
      ]
    },
    {
      id: 9,
      question_text: "Quel équipement de protection est obligatoire sur un chantier ?",
      image_url: null,
      answers: [
        { id: 33, answer_text: "Un casque", is_correct: true },
        { id: 34, answer_text: "Des gants", is_correct: false },
        { id: 35, answer_text: "Des lunettes", is_correct: false },
        { id: 36, answer_text: "Des chaussures de sécurité", is_correct: false }
      ]
    }
  ]
};

// Fonction pour simuler l'API
export const mockApi = {
  // Simuler fetchQuizList
  fetchQuizList: async (page = 1, limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuler le délai réseau
    return {
      data: mockQuizzes.slice((page - 1) * limit, page * limit),
      total: mockQuizzes.length,
      page,
      limit
    };
  },

  // Simuler fetchQuizId
  fetchQuizId: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockQuizzes.find(quiz => quiz.id === parseInt(id)) || null;
  },

  // Simuler fetchQuizQuestions
  fetchQuizQuestions: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      data: mockQuestions[id] || []
    };
  }
};
