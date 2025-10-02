import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuizData = {
  sex: "male" | "female" | "other";
  ageRange: "18-25" | "26-35" | "36-45" | "46+";
  skinType: "dry" | "oily" | "combination" | "sensitive";
  mainConcern: "acne" | "pores" | "redness" | "texture" | "wrinkles" | "dullness";
  severity: 1 | 2 | 3 | 4 | 5;
  sensitivities: string[];
  currentRoutineLevel: "none" | "basic" | "intermediate" | "advanced";
  desiredSimplicity: "minimal" | "moderate" | "comprehensive";
  budget: "affordable" | "moderate" | "premium";
  photoConsent: boolean;
};

export type Persona = "adrien" | "lina";
export type ProductKey = "bha2" | "azelaic10";

export type RoutineStep = {
  time: "morning" | "evening";
  order: number;
  title: string;
  details: string;
};

export type Routine = {
  productKey: ProductKey;
  steps: RoutineStep[];
};

export type Result = {
  persona: Persona;
  productKey: ProductKey;
  routine: Routine;
  summary: {
    skinType: string;
    mainConcern: string;
    severity: number;
  };
};

type AppStore = {
  quiz: Partial<QuizData>;
  photoBase64: string | null;
  result: Result | null;
  setQuiz: (data: Partial<QuizData>) => void;
  setPhoto: (photo: string | null) => void;
  setResult: (result: Result | null) => void;
  clearAll: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      quiz: {},
      photoBase64: null,
      result: null,
      setQuiz: (data) => set((state) => ({ quiz: { ...state.quiz, ...data } })),
      setPhoto: (photo) => set({ photoBase64: photo }),
      setResult: (result) => set({ result }),
      clearAll: () => set({ quiz: {}, photoBase64: null, result: null }),
    }),
    {
      name: "polarchoice-storage",
    }
  )
);