# 🚀 Guide de Démarrage Rapide - Template Quiz

## Installation

1. **Cloner le projet** (si ce n'est pas déjà fait)
```bash
git clone <votre-repo>
cd admin-quiz
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

## 🎯 Utilisation du Template

### Mode Démo (Recommandé pour tester)
Accédez à `http://localhost:5173/quiz-demo` pour voir le template en action avec des données fictives.

### Mode Production
Accédez à `http://localhost:5173/quiz-player` pour utiliser le template avec votre API.

## 📁 Structure des Fichiers

```
src/
├── pages/
│   ├── QuizHome.jsx          # Page d'accueil des quiz
│   └── QuizPlayer.jsx        # Interface de quiz
├── components/
│   ├── QuizLoginModal.jsx    # Modal de connexion
│   ├── QuizNavigation.jsx    # Navigation entre les vues
│   └── QuizDemo.jsx          # Page de démonstration
├── services/
│   └── QuizServices.js       # Services API existants
├── data/
│   └── mockQuizData.js       # Données fictives pour la démo
├── config/
│   └── quizConfig.js         # Configuration du template
└── styles/
    └── quiz.css              # Styles personnalisés
```

## 🔧 Configuration

### Basculer entre Démo et Production
Modifiez `src/config/quizConfig.js` :
```javascript
export const QUIZ_CONFIG = {
  DEMO_MODE: true,  // true = démo, false = production
  // ...
};
```

### Personnaliser les Couleurs
Dans `src/config/quizConfig.js` :
```javascript
COLORS: {
  PRIMARY: {
    FROM: "#667eea",
    TO: "#764ba2"
  },
  // ...
}
```

## 🎨 Personnalisation

### Modifier les Styles
Éditez `src/styles/quiz.css` pour personnaliser l'apparence.

### Ajouter des Animations
Utilisez Framer Motion dans vos composants :
```javascript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Votre contenu
</motion.div>
```

## 🔌 Intégration avec votre API

### 1. Désactiver le Mode Démo
```javascript
// src/config/quizConfig.js
DEMO_MODE: false
```

### 2. Vérifier vos Services API
Assurez-vous que `src/services/QuizServices.js` pointe vers votre API.

### 3. Format des Données Attendues

**Quiz Object :**
```javascript
{
  id: 1,
  title: "Nom du Quiz",
  description: "Description...",
  password: "motdepasse", // optionnel
  duration: 15, // minutes
  difficulty: 3, // 1-5
  participants: 42,
  questions_count: 10
}
```

**Question Object :**
```javascript
{
  id: 1,
  question_text: "Question...",
  image_url: "url_image", // optionnel
  answers: [
    {
      id: 1,
      answer_text: "Réponse 1",
      is_correct: true
    }
  ]
}
```

## 🎮 Fonctionnalités Incluses

### ✅ Page d'Accueil
- Liste des quiz avec recherche
- Cartes interactives avec effets de survol
- Indicateurs de difficulté et durée
- Design responsive

### ✅ Modal de Connexion
- Authentification avec email, téléphone, mot de passe
- Validation en temps réel
- Animations fluides
- Gestion des erreurs

### ✅ Interface de Quiz
- Navigation fluide entre les questions
- Timer interactif avec pause/reprise
- Barre de progression animée
- Sélection de réponses avec feedback
- Navigation par points

### ✅ Page de Résultats
- Score visuel avec cercle de progression
- Messages personnalisés selon la performance
- Options de reprise ou retour à l'accueil

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement
Créez un fichier `.env` :
```env
VITE_API_URL=https://votre-api.com
VITE_DEMO_MODE=false
```

## 🐛 Dépannage

### Problème de Chargement
- Vérifiez que votre API est accessible
- Consultez la console pour les erreurs
- Vérifiez les données retournées par l'API

### Problème d'Affichage
- Vérifiez que Tailwind CSS est bien configuré
- Assurez-vous que les styles sont importés
- Vérifiez la compatibilité navigateur

### Problème d'Animations
- Vérifiez que Framer Motion est installé
- Assurez-vous que les animations ne sont pas désactivées
- Vérifiez la performance sur mobile

## 📞 Support

Pour toute question :
1. Consultez la documentation complète (`README_QUIZ_TEMPLATE.md`)
2. Vérifiez les exemples dans le code
3. Testez avec le mode démo
4. Contactez l'équipe de développement

---

**🎉 Votre template de quiz est prêt à être utilisé !**
