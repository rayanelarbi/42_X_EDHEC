import { QuizData, Persona, ProductKey } from "@/store/useAppStore";

export function determinePersonaAndProduct(quiz: QuizData): {
  persona: Persona;
  productKey: ProductKey;
} {
  const { skinType, mainConcern } = quiz;

  // Mapping Adrien: peau mixte/grasse + acné/pores → BHA 2%
  if (
    (skinType === "oily" || skinType === "combination") &&
    (mainConcern === "acne" || mainConcern === "pores")
  ) {
    return { persona: "adrien", productKey: "bha2" };
  }

  // Mapping Lina: peau sèche/sensible + rougeurs/texture → Azelaic 10%
  if (
    (skinType === "dry" || skinType === "sensitive") &&
    (mainConcern === "redness" || mainConcern === "texture")
  ) {
    return { persona: "lina", productKey: "azelaic10" };
  }

  // Fallback: priorité type de peau
  if (skinType === "oily" || skinType === "combination") {
    return { persona: "adrien", productKey: "bha2" };
  }

  if (skinType === "dry" || skinType === "sensitive") {
    return { persona: "lina", productKey: "azelaic10" };
  }

  // Default
  return { persona: "adrien", productKey: "bha2" };
}