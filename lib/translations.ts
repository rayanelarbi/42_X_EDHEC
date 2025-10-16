export const translations = {
  fr: {
    // Home page
    home: {
      title: "Trouvez votre routine skincare idéale",
      subtitle: "Répondez à notre quiz personnalisé et découvrez les produits adaptés à votre peau",
      startQuiz: "Commencer le quiz",
    },

    // Quiz
    quiz: {
      title: "Quiz personnalisé",
      next: "Suivant",
      previous: "Précédent",
      submit: "Terminer",
      questions: {
        sex: "Sexe",
        ageRange: "Tranche d'âge",
        location: "Environnement",
        skinType: "Type de peau",
        skinConcerns: "Préoccupations cutanées",
        objectives: "Objectifs",
        dermaConditions: "Conditions dermatologiques",
        currentRoutineLevel: "Niveau de routine actuel",
        productsUsed: "Produits utilisés",
        sunExposure: "Exposition au soleil",
        stressLevel: "Niveau de stress",
        preferences: "Préférences",
        budget: "Budget mensuel",
        photoConsent: "Consentement photo",
      },
      options: {
        male: "Homme",
        female: "Femme",
        city: "Ville",
        countryside: "Campagne",
        humid: "Humide",
        dry: "Sec",
        normal: "Normal",
        combination: "Mixte",
        oily: "Grasse",
        sensitive: "Sensible",
        none: "Aucune",
        low: "Faible",
        medium: "Moyen",
        high: "Élevé",
      },
    },

    // Camera
    camera: {
      title: "Prenez une photo de votre peau",
      takePicture: "Prendre une photo",
      retake: "Reprendre",
      continue: "Continuer",
    },

    // Result
    result: {
      title: "Votre routine personnalisée",
      yourProfile: "Votre profil",
      skinType: "Type de peau",
      mainConcerns: "Préoccupations principales",
      objectives: "Objectifs",
      recommendedProduct: "Produit recommandé",
      routine: "Routine",
      morning: "Matin",
      evening: "Soir",
      ingredients: "Ingrédients clés",
      whatItDoes: "Ce qu'il fait",
      whatItDoesNot: "Ce qu'il ne fait pas",
      alternatives: "Alternatives",
      irritationGuard: "Protection contre les irritations",
      addToCart: "Ajouter au panier",
      startNewQuiz: "Recommencer",
      beforeAfter: "Avant / Après",
    },

    // Cart
    cart: {
      title: "Panier",
      empty: "Votre panier est vide",
      total: "Total",
      checkout: "Commander",
      remove: "Retirer",
    },

    // Product Card
    product: {
      addToCart: "Ajouter au panier",
      learnMore: "En savoir plus",
    },

    // Common
    common: {
      loading: "Chargement...",
      error: "Une erreur est survenue",
      close: "Fermer",
      save: "Enregistrer",
      cancel: "Annuler",
    },
  },

  en: {
    // Home page
    home: {
      title: "Find your ideal skincare routine",
      subtitle: "Answer our personalized quiz and discover products adapted to your skin",
      startQuiz: "Start the quiz",
    },

    // Quiz
    quiz: {
      title: "Personalized Quiz",
      next: "Next",
      previous: "Previous",
      submit: "Finish",
      questions: {
        sex: "Sex",
        ageRange: "Age range",
        location: "Environment",
        skinType: "Skin type",
        skinConcerns: "Skin concerns",
        objectives: "Objectives",
        dermaConditions: "Dermatological conditions",
        currentRoutineLevel: "Current routine level",
        productsUsed: "Products used",
        sunExposure: "Sun exposure",
        stressLevel: "Stress level",
        preferences: "Preferences",
        budget: "Monthly budget",
        photoConsent: "Photo consent",
      },
      options: {
        male: "Male",
        female: "Female",
        city: "City",
        countryside: "Countryside",
        humid: "Humid",
        dry: "Dry",
        normal: "Normal",
        combination: "Combination",
        oily: "Oily",
        sensitive: "Sensitive",
        none: "None",
        low: "Low",
        medium: "Medium",
        high: "High",
      },
    },

    // Camera
    camera: {
      title: "Take a picture of your skin",
      takePicture: "Take a picture",
      retake: "Retake",
      continue: "Continue",
    },

    // Result
    result: {
      title: "Your personalized routine",
      yourProfile: "Your profile",
      skinType: "Skin type",
      mainConcerns: "Main concerns",
      objectives: "Objectives",
      recommendedProduct: "Recommended product",
      routine: "Routine",
      morning: "Morning",
      evening: "Evening",
      ingredients: "Key ingredients",
      whatItDoes: "What it does",
      whatItDoesNot: "What it doesn't do",
      alternatives: "Alternatives",
      irritationGuard: "Irritation protection",
      addToCart: "Add to cart",
      startNewQuiz: "Start over",
      beforeAfter: "Before / After",
    },

    // Cart
    cart: {
      title: "Cart",
      empty: "Your cart is empty",
      total: "Total",
      checkout: "Checkout",
      remove: "Remove",
    },

    // Product Card
    product: {
      addToCart: "Add to cart",
      learnMore: "Learn more",
    },

    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      close: "Close",
      save: "Save",
      cancel: "Cancel",
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.fr;
