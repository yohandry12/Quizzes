# Gestion des Quiz - Documentation

## Vue d'ensemble

La fonctionnalité Quiz permet de créer et gérer des quiz dans l'application d'administration. Chaque quiz peut contenir plusieurs questions et être configuré avec différents paramètres.

## Fonctionnalités principales

### 1. Création d'un Quiz

Pour créer un nouveau quiz, vous devez fournir les informations suivantes :

- **Titre** : Le nom du quiz (obligatoire)
- **Description** : Description détaillée du quiz (optionnel)
- **Catégorie** : Sélection d'une catégorie depuis la base de données (obligatoire)
- **Niveau de difficulté** : Facile, Moyen, Difficile, Expert
- **Limite de temps** : Durée en minutes (0 = pas de limite)
- **Score de passage** : Pourcentage minimum pour réussir le quiz (0-100%)
- **Nombre maximum de tentatives** : Limite du nombre de tentatives autorisées
- **Options** :
  - Mélanger les questions
  - Afficher les résultats

### 2. Gestion des Questions

Une fois le quiz créé, vous pouvez :

- **Voir les détails** : Afficher toutes les informations du quiz
- **Ajouter des questions** : Sélectionner des questions depuis la base de données
- **Modifier le quiz** : Changer les paramètres du quiz
- **Dupliquer le quiz** : Créer une copie du quiz avec toutes ses questions

### 3. Gestion du cycle de vie

- **Mettre à la corbeille** : Suppression logique (soft delete)
- **Restaurer** : Récupérer un quiz depuis la corbeille
- **Supprimer définitivement** : Suppression permanente (hard delete)
- **Rechercher** : Recherche par titre ou description

### 4. Sélection des Questions

Lors de l'ajout de questions à un quiz :

- **Filtrage par catégorie** : Filtrer les questions par catégorie
- **Recherche** : Rechercher par titre ou contenu de question
- **Sélection multiple** : Sélectionner plusieurs questions à la fois
- **Prévisualisation** : Voir les détails de chaque question avant sélection

## Structure des données

### Quiz
```json
{
  "title": "string",
  "description": "string",
  "category_id": 0,
  "difficulty_level": "easy|medium|hard|expert",
  "time_limit": 0,
  "passing_score": 100,
  "max_attempts": 10,
  "shuffle_questions": true,
  "show_results": true,
  "question_ids": [0]
}
```

### Niveaux de difficulté
- **easy** : Facile (vert)
- **medium** : Moyen (jaune)
- **hard** : Difficile (rouge)

## Navigation

1. **Dashboard** → Cliquer sur "Quiz" dans la sidebar
2. **Page Quiz** → Bouton "Créer un quiz"
3. **Formulaire** → Remplir les informations et créer
4. **Liste des quiz** → Voir, modifier ou ajouter des questions

## Workflow recommandé

1. **Créer des catégories** (si pas encore fait)
2. **Créer des questions** dans les catégories appropriées
3. **Créer un quiz** avec les paramètres souhaités
4. **Ajouter des questions** au quiz depuis la base de données
5. **Tester et ajuster** les paramètres si nécessaire

## Services API utilisés

### Services de base
- `fetchCreateQuiz()` : Créer un nouveau quiz
- `fetchQuizList()` : Lister tous les quiz avec pagination
- `fetchQuizId()` : Récupérer les détails d'un quiz
- `fetchPutQuiz()` : Modifier un quiz existant
- `fetchQuizSearch()` : Rechercher des quiz par titre/description

### Gestion des questions
- `fetchAddQuestionsToQuiz()` : Ajouter des questions à un quiz (PUT)
- `fetchUpdateQuizQuestions()` : Mettre à jour les questions d'un quiz (PUT)
- `fetchQuizQuestions()` : Récupérer les questions d'un quiz

### Gestion du cycle de vie
- `fetchSoftDeleteQuiz()` : Mettre à la corbeille un quiz (soft delete)
- `fetchRestoreQuiz()` : Restaurer un quiz depuis la corbeille
- `fetchDeletePermanentQuiz()` : Supprimer définitivement un quiz
- `fetchDuplicateQuiz()` : Dupliquer un quiz

### Statistiques
- `fetchQuizStats()` : Récupérer les statistiques d'un quiz

### Services auxiliaires
- `fetchCategoriesList()` : Lister les catégories pour le formulaire
- `fetchQuestionsList()` : Lister les questions pour la sélection

## Interface utilisateur

### Page Quiz
- Liste des quiz avec informations essentielles
- Boutons d'action : Voir, Modifier, Ajouter des questions, Dupliquer, Supprimer
- Pagination pour la navigation
- Recherche par titre/description
- Basculement entre vue normale et corbeille
- Confirmation pour les actions destructives

### Modal de création/modification
- Formulaire complet avec validation
- Sélection de catégorie dynamique
- Options configurables

### Modal de sélection de questions
- Interface de recherche et filtrage
- Sélection multiple avec prévisualisation
- Confirmation avant ajout

## Notes techniques

- Les quiz sont créés sans questions initialement
- Les questions sont ajoutées séparément via une interface dédiée
- La pagination est gérée côté serveur
- Les erreurs sont affichées de manière utilisateur-friendly
- L'interface est responsive et accessible
