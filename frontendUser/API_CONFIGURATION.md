# Configuration API FrontendUser

## Architecture

Le frontendUser utilise une approche hybride :
- **Vraie API** pour récupérer les quiz et questions du backend
- **Mocks** pour l'authentification par mot de passe des quiz

## Services

### 1. PublicQuizServices.js
Service pour récupérer les données publiques depuis le backend :
- `fetchPublicQuizList()` - Liste des quiz
- `fetchPublicQuizById()` - Détails d'un quiz
- `fetchPublicQuizQuestions()` - Questions d'un quiz
- `fetchPublicQuizSearch()` - Recherche de quiz

**Endpoints utilisés :**
- `GET /api/quiz` - Liste des quiz (sans authentification)
- `GET /api/quiz/{id}` - Détails d'un quiz (sans authentification)
- `GET /api/quiz/{id}/questions` - Questions d'un quiz (sans authentification)
- `GET /api/quiz/search?q={query}` - Recherche de quiz (sans authentification)

### 2. QuizAuthService.js
Service mock pour l'authentification par mot de passe :
- `verifyQuizPassword(quizId, password)` - Vérification du mot de passe
- `isQuizProtected(quizId)` - Vérifier si un quiz est protégé
- `getProtectedQuizzes()` - Liste des quiz protégés

**Mots de passe configurés :**
- Quiz ID 1: `histoire2024`
- Quiz ID 3: `securite2024`
- Quiz ID 5: `science2024`

## Fallback System

Si l'API backend n'est pas disponible, le système utilise automatiquement les mocks :
1. Tentative de connexion à l'API
2. Si échec → Utilisation des données mock
3. Logs dans la console pour le debugging

## Configuration Backend

Pour que le frontendUser fonctionne, le backend doit permettre l'accès public à ces endpoints :

```javascript
// Endpoints requis (sans authentification)
GET /api/quiz
GET /api/quiz/{id}
GET /api/quiz/{id}/questions
GET /api/quiz/search
```

**Note :** Ces endpoints existent déjà dans le backend mais nécessitent actuellement une authentification admin. Pour le frontendUser, ils doivent être accessibles sans authentification.

## Structure de données attendue

### Quiz
```javascript
{
  id: 1,
  title: "Titre du quiz",
  description: "Description du quiz",
  duration: 20, // minutes
  difficulty: 3, // 1-5
  participants: 100,
  questions_count: 15,
  password: "motdepasse", // optionnel
  created_at: "2024-01-01T00:00:00Z"
}
```

### Questions
```javascript
{
  data: [
    {
      id: 1,
      question_text: "Question ?",
      image_url: "url_image", // optionnel
      answers: [
        { id: 1, answer_text: "Réponse 1", is_correct: true },
        { id: 2, answer_text: "Réponse 2", is_correct: false }
      ]
    }
  ]
}
```

## Test

1. Démarrez le backend avec les endpoints publics
2. Démarrez le frontendUser : `npm run dev`
3. Testez l'accès aux quiz avec/sans mot de passe
4. Vérifiez les logs dans la console pour le debugging
