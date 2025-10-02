import { ProductKey, Routine, RoutineStep } from "@/store/useAppStore";

export function buildRoutine(productKey: ProductKey): Routine {
  const baseSteps: RoutineStep[] = [
    // Matin
    {
      time: "morning",
      order: 1,
      title: "Nettoyant doux",
      details: "Nettoyez votre visage avec un nettoyant doux adapté à votre type de peau.",
    },
    {
      time: "morning",
      order: 2,
      title: "Hydratant léger",
      details: "Appliquez un hydratant léger pour maintenir l'équilibre hydrique de votre peau.",
    },
    {
      time: "morning",
      order: 3,
      title: "Protection solaire SPF",
      details: "Terminez par une protection solaire à large spectre (SPF 30 minimum).",
    },
    // Soir
    {
      time: "evening",
      order: 1,
      title: "Nettoyant doux",
      details: "Nettoyez votre visage pour éliminer les impuretés de la journée.",
    },
  ];

  // Produit spécifique selon persona
  const productStep: RoutineStep =
    productKey === "bha2"
      ? {
          time: "evening",
          order: 2,
          title: "PolarChoice Clear 2% BHA Exfoliant",
          details:
            "Appliquez sur peau sèche. Aide à désobstruer les pores et lisser la texture. Utilisation progressive (1x/j) selon tolérance.",
        }
      : {
          time: "evening",
          order: 2,
          title: "PolarChoice Arctic Azelaic 10% Booster",
          details:
            "Appliquez sur peau sèche. Aide à atténuer les rougeurs et uniformiser le teint. Utilisation progressive (1x/j) selon tolérance.",
        };

  const finalStep: RoutineStep = {
    time: "evening",
    order: 3,
    title: "Crème barrière",
    details: "Scellez l'hydratation avec une crème réparatrice de la barrière cutanée.",
  };

  return {
    productKey,
    steps: [...baseSteps, productStep, finalStep],
  };
}