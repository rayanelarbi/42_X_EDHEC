import { QuizData, Persona, ProductKey, IngredientCard } from "@/store/useAppStore";

export function determinePersonaAndProduct(quiz: QuizData): {
  persona: Persona;
  productKey: ProductKey;
  recommendedProducts: ProductKey[];
  ingredients: IngredientCard[];
  irritationGuard: string[];
} {
  const isElise = quiz.sex === "female";

  if (isElise) {
    return {
      persona: "elise",
      productKey: "vitamin-c-moisturizer",
      recommendedProducts: ["vitamin-c-moisturizer", "bha-exfoliant"],
      ingredients: [
        {
          name: "Acide BHA (Salicylique)",
          concentration: "2%",
          whatItDoes: "Exfolie en profondeur, désobstrue les pores, réduit les imperfections et lisse la texture de la peau.",
          whatItDoesNot: "Ne traite pas les rides profondes, ne remplace pas un traitement médical contre l'acné sévère.",
          alternatives: "AHA (acide glycolique) pour une exfoliation de surface, acide azélaïque pour les rougeurs.",
        },
        {
          name: "Vitamine C",
          whatItDoes: "Antioxydant puissant qui unifie le teint, illumine et protège contre les radicaux libres.",
          whatItDoesNot: "Ne traite pas l'acné active, nécessite une utilisation régulière pour des résultats visibles.",
        },
        {
          name: "SPF",
          concentration: "30+",
          whatItDoes: "Protège contre les UVA/UVB, prévient le vieillissement prématuré et les taches pigmentaires.",
          whatItDoesNot: "Ne traite pas les problèmes de peau existants, doit être réappliqué toutes les 2h en exposition.",
        },
      ],
      irritationGuard: [
        "Commencez 1 jour sur 2 pour tester la tolérance",
        "Une quantité noisette suffit pour l'ensemble du visage",
        "Arrêtez immédiatement si picotements intenses ou rougeurs persistantes",
        "SPF obligatoire chaque matin (minimum SPF 30)",
        "Ne pas combiner avec d'autres actifs puissants (rétinol, AHA) au début",
      ],
    };
  } else {
    return {
      persona: "marc",
      productKey: "repairing-serum",
      recommendedProducts: ["repairing-serum", "rescue-repair-moisturizer"],
      ingredients: [
        {
          name: "Peptides",
          whatItDoes: "Renforcent la barrière cutanée, apaisent les irritations post-rasage et améliorent la fermeté.",
          whatItDoesNot: "N'éliminent pas les rides instantanément, résultats progressifs sur plusieurs semaines.",
        },
        {
          name: "Acide Hyaluronique",
          whatItDoes: "Hydrate intensément, repulpe la peau et réduit la sensation de tiraillement.",
          whatItDoesNot: "Ne remplace pas une crème hydratante, ne traite pas les problèmes de peau sous-jacents.",
        },
        {
          name: "Niacinamide (Vitamine B3)",
          concentration: "5%",
          whatItDoes: "Apaise les rougeurs, régule le sébum, renforce la barrière cutanée.",
          whatItDoesNot: "Ne traite pas la rosacée sévère, ne remplace pas un traitement dermatologique.",
          alternatives: "Acide azélaïque pour les rougeurs intenses, centella asiatica pour l'apaisement.",
        },
      ],
      irritationGuard: [
        "Appliquer une fine couche matin et/ou soir",
        "Idéal après le rasage pour apaiser la peau",
        "SPF recommandé le matin pour protéger la peau fragilisée",
        "Peut être utilisé quotidiennement, très bonne tolérance",
        "Attendre que le sérum pénètre avant d'appliquer la crème hydratante",
      ],
    };
  }
}