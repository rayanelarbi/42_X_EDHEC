import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SkinAnalysisResult } from "@/lib/skinAnalysis";

export type QuizData = {
  sex: "male" | "female";
  ageRange: "18-25" | "26-35" | "36-45" | "46+";
  location: "city" | "countryside" | "humid" | "dry";
  skinType: "dry" | "normal" | "combination" | "oily" | "sensitive";
  skinConcerns: string[];
  objectives: string[];
  dermaConditions: string[];
  currentRoutineLevel: "none" | "1-2" | "3-4" | "5+";
  productsUsed: string[];
  sunExposure: "low" | "medium" | "high";
  stressLevel: "low" | "medium" | "high";
  preferences: string[];
  budget: "<20" | "20-40" | "40-60" | "60+";
  photoConsent: boolean;
};

export type Persona = "elise" | "marc";
export type ProductKey = "vitamin-c-moisturizer" | "bha-exfoliant" | "rescue-repair-moisturizer" | "repairing-serum";

export type RoutineStep = {
  time: "morning" | "evening";
  order: number;
  title: string;
  details: string;
  warning?: string;
};

export type Routine = {
  productKey: ProductKey;
  steps: RoutineStep[];
};

export type IngredientCard = {
  name: string;
  concentration?: string;
  whatItDoes: string;
  whatItDoesNot: string;
  alternatives?: string;
};

export type PhotoEntry = {
  date: string; // ISO string
  photoBase64: string; // Photo originale (compressée)
  enhancedBase64?: string; // Photo retouchée "after" (compressée)
  note?: string;
  analysis?: any; // SkinAnalysisResult from lib/skinAnalysis
};

export type Result = {
  persona: Persona;
  productKey: ProductKey;
  recommendedProducts?: ProductKey[]; // Liste de tous les produits recommandés
  routine: Routine;
  ingredients: IngredientCard[];
  irritationGuard: string[];
  summary: {
    skinType: string;
    mainConcerns: string[];
    objectives: string[];
  };
  startDate?: string; // ISO string - date de début de la routine
  endDate?: string; // ISO string - date de fin estimée (12 semaines par défaut)
};

// NOUVEAU : Types pour le panier
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type AppStore = {
  language: "en" | "fr";
  quiz: Partial<QuizData>;
  photoBase64: string | null;
  photos: PhotoEntry[]; // Historique des photos
  skinAnalysis: SkinAnalysisResult | null; // Résultat de l'analyse de peau
  result: Result | null;
  cart: CartItem[];
  photoConsent: boolean; // Consent pour la caméra
  setLanguage: (language: "en" | "fr") => void;
  setQuiz: (data: Partial<QuizData>) => void;
  setPhoto: (photo: string | null) => void;
  addPhotoToHistory: (photo: string, note?: string, analysis?: any, enhancedBase64?: string) => void;
  removePhotoFromHistory: (index: number) => void;
  setSkinAnalysis: (analysis: SkinAnalysisResult | null) => void;
  updatePhotoAnalysis: (index: number, analysis: any) => void;
  setResult: (result: Result | null) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearAll: () => void;
  reset: () => void;
  setPhotoConsent: (consent: boolean) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      language: "en",
      quiz: {},
      photoBase64: null,
      photos: [],
      skinAnalysis: null,
      result: null,
      cart: [],
      photoConsent: false,

      setLanguage: (language) => set({ language }),
      setQuiz: (data) => set((state) => ({ quiz: { ...state.quiz, ...data } })),
      setPhoto: (photo) => set({ photoBase64: photo, skinAnalysis: null }), // Réinitialiser l'analyse quand on change de photo
      addPhotoToHistory: (photo, note, analysis, enhancedBase64) =>
        set((state) => {
          // Vérifier si la photo existe déjà
          const existingIndex = state.photos.findIndex(p => p.photoBase64 === photo);

          if (existingIndex !== -1) {
            // Mettre à jour la photo existante avec l'analyse et l'enhanced
            const updatedPhotos = [...state.photos];
            updatedPhotos[existingIndex] = {
              ...updatedPhotos[existingIndex],
              analysis: analysis || updatedPhotos[existingIndex].analysis,
              enhancedBase64: enhancedBase64 || updatedPhotos[existingIndex].enhancedBase64,
              note: note !== undefined ? note : updatedPhotos[existingIndex].note,
            };
            return { photos: updatedPhotos };
          }

          // Ajouter une nouvelle photo
          return {
            photos: [
              ...state.photos,
              {
                date: new Date().toISOString(),
                photoBase64: photo,
                enhancedBase64,
                note,
                analysis,
              },
            ],
          };
        }),
      removePhotoFromHistory: (index) =>
        set((state) => ({
          photos: state.photos.filter((_, i) => i !== index),
        })),
      setSkinAnalysis: (analysis) => set({ skinAnalysis: analysis }),
      updatePhotoAnalysis: (index, analysis) =>
        set((state) => ({
          photos: state.photos.map((p, i) => i === index ? { ...p, analysis } : p),
        })),
      setResult: (result) => {
        // Quand on set un nouveau result, ajouter les dates si pas présentes
        if (result && !result.startDate) {
          const startDate = new Date().toISOString();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 84); // 12 semaines = 84 jours
          result.startDate = startDate;
          result.endDate = endDate.toISOString();
        }
        set({ result });
      },

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            cart: [...state.cart, { ...item, quantity: 1 }],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ),
        })),

      clearCart: () => set({ cart: [] }),

      clearAll: () => set({ quiz: {}, photoBase64: null, skinAnalysis: null, result: null, cart: [] }),

      reset: () => set({ language: "en", quiz: {}, photoBase64: null, photos: [], skinAnalysis: null, result: null, cart: [], photoConsent: false }),

      setPhotoConsent: (consent) => set({ photoConsent: consent }),
    }),
    {
      name: "paulaschoice-storage",
    }
  )
);