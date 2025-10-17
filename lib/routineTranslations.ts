import { ProductKey, Routine, RoutineStep } from "@/store/useAppStore";

export function buildRoutine(productKey: ProductKey, language: "fr" | "en"): Routine {
  if (productKey === "duo-eclat") {
    const steps: RoutineStep[] = language === "fr" ? [
      {
        time: "morning",
        order: 1,
        title: "Nettoyant doux",
        details: "Nettoyez votre visage avec un nettoyant doux sans sulfates.",
      },
      {
        time: "morning",
        order: 2,
        title: "Sérum Vitamine C",
        details: "Appliquez quelques gouttes de vitamine C pour illuminer le teint.",
      },
      {
        time: "morning",
        order: 3,
        title: "Hydratant léger",
        details: "Hydratez avec une texture légère adaptée aux peaux mixtes.",
      },
      {
        time: "morning",
        order: 4,
        title: "Protection solaire SPF 30+",
        details: "OBLIGATOIRE : Appliquez généreusement un SPF à large spectre.",
        warning: "Ne jamais sauter cette étape, surtout avec l'usage de BHA.",
      },
      {
        time: "evening",
        order: 1,
        title: "Nettoyant doux",
        details: "Éliminez les impuretés et le maquillage de la journée.",
      },
      {
        time: "evening",
        order: 2,
        title: "Skin Perfecting 2% BHA Liquid",
        details: "Appliquez une fine couche sur peau sèche. Commencez 1 jour sur 2.",
        warning: "Introduire progressivement. Quantité noisette maximum.",
      },
      {
        time: "evening",
        order: 3,
        title: "Crème barrière",
        details: "Scellez l'hydratation avec une crème réparatrice riche.",
      },
    ] : [
      {
        time: "morning",
        order: 1,
        title: "Gentle Cleanser",
        details: "Cleanse your face with a gentle sulfate-free cleanser.",
      },
      {
        time: "morning",
        order: 2,
        title: "Vitamin C Serum",
        details: "Apply a few drops of vitamin C to brighten complexion.",
      },
      {
        time: "morning",
        order: 3,
        title: "Light Moisturizer",
        details: "Hydrate with a light texture suitable for combination skin.",
      },
      {
        time: "morning",
        order: 4,
        title: "Sun Protection SPF 30+",
        details: "MANDATORY: Apply generously a broad-spectrum SPF.",
        warning: "Never skip this step, especially when using BHA.",
      },
      {
        time: "evening",
        order: 1,
        title: "Gentle Cleanser",
        details: "Remove impurities and makeup from the day.",
      },
      {
        time: "evening",
        order: 2,
        title: "Skin Perfecting 2% BHA Liquid",
        details: "Apply a thin layer on dry skin. Start every other day.",
        warning: "Introduce gradually. Hazelnut amount maximum.",
      },
      {
        time: "evening",
        order: 3,
        title: "Barrier Cream",
        details: "Seal in hydration with a rich repairing cream.",
      },
    ];

    return { productKey, steps };
  } else {
    const steps: RoutineStep[] = language === "fr" ? [
      {
        time: "morning",
        order: 1,
        title: "Nettoyant doux",
        details: "Nettoyez délicatement, surtout après le rasage.",
      },
      {
        time: "morning",
        order: 2,
        title: "Resist Repairing Serum",
        details: "Appliquez 2-3 pompes sur peau légèrement humide. Apaise immédiatement.",
      },
      {
        time: "morning",
        order: 3,
        title: "Intensive Moisturiser",
        details: "Hydratation intense pour renforcer la barrière cutanée.",
      },
      {
        time: "morning",
        order: 4,
        title: "Protection solaire SPF 30+",
        details: "Protégez votre peau fragilisée par le rasage quotidien.",
      },
      {
        time: "evening",
        order: 1,
        title: "Nettoyant doux",
        details: "Nettoyez en douceur après la journée.",
      },
      {
        time: "evening",
        order: 2,
        title: "Resist Repairing Serum",
        details: "Appliquez pour une réparation nocturne optimale.",
      },
      {
        time: "evening",
        order: 3,
        title: "Intensive Moisturiser",
        details: "Hydratation nocturne pour une peau apaisée au réveil.",
      },
    ] : [
      {
        time: "morning",
        order: 1,
        title: "Gentle Cleanser",
        details: "Cleanse gently, especially after shaving.",
      },
      {
        time: "morning",
        order: 2,
        title: "Resist Repairing Serum",
        details: "Apply 2-3 pumps on slightly damp skin. Soothes immediately.",
      },
      {
        time: "morning",
        order: 3,
        title: "Intensive Moisturiser",
        details: "Intense hydration to strengthen skin barrier.",
      },
      {
        time: "morning",
        order: 4,
        title: "Sun Protection SPF 30+",
        details: "Protect your skin weakened by daily shaving.",
      },
      {
        time: "evening",
        order: 1,
        title: "Gentle Cleanser",
        details: "Cleanse gently after the day.",
      },
      {
        time: "evening",
        order: 2,
        title: "Resist Repairing Serum",
        details: "Apply for optimal night repair.",
      },
      {
        time: "evening",
        order: 3,
        title: "Intensive Moisturiser",
        details: "Night hydration for soothed skin in the morning.",
      },
    ];

    return { productKey, steps };
  }
}
