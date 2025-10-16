"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { determinePersonaAndProduct } from "@/lib/scoring";
import { buildRoutine } from "@/lib/routine";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BeforeAfter from "@/components/BeforeAfter";
import RoutineCard from "@/components/RoutineCard";
import IngredientCard from "@/components/IngredientCard";
import { AlertCircle, RefreshCw, Trash2, Calendar, Download } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import { PRODUCTS } from "@/lib/productData";
import { translations } from "@/lib/translations";

const productInfo = {
  "duo-eclat": {
    name: "Duo Éclat & Protection",
    description:
      "Combinaison BHA 2% + Vitamine C + SPF pour une peau éclatante, pores resserrés et protection optimale.",
    persona: "Élise, 30 ans - Peau mixte/grasse",
  },
  "repairing-serum": {
    name: "Repairing Serum & Intensive Moisturiser",
    description:
      "Duo réparateur peptides + niacinamide pour apaiser, hydrater et renforcer la barrière cutanée post-rasage.",
    persona: "Marc, 36 ans - Peau sensible",
  },
};

const skinTypeLabels: Record<string, string> = {
  dry: "Sèche",
  normal: "Normale",
  oily: "Grasse",
  combination: "Mixte",
  sensitive: "Sensible",
};

export default function ResultPage() {
  const router = useRouter();
  const quiz = useAppStore((state) => state.quiz);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const result = useAppStore((state) => state.result);
  const setResult = useAppStore((state) => state.setResult);
  const clearAll = useAppStore((state) => state.clearAll);
  const language = useAppStore((state) => state.language);
  const t = translations[language];

  useEffect(() => {
    if (!result && quiz?.sex && quiz?.skinType) {
      const scoring = determinePersonaAndProduct(quiz as any);
      const routine = buildRoutine(scoring.productKey);

      queueMicrotask(() => {
        setResult({
          persona: scoring.persona,
          productKey: scoring.productKey,
          routine,
          ingredients: scoring.ingredients,
          irritationGuard: scoring.irritationGuard,
          summary: {
            skinType: quiz.skinType,
            mainConcerns: quiz.skinConcerns || [],
            objectives: quiz.objectives || [],
          },
        });
      });
    }
  }, [quiz, result, setResult]);

  const handleRestart = () => {
    router.push("/");
  };

  const handleDeleteData = () => {
    const message = language === "fr"
      ? "Êtes-vous sûr de vouloir supprimer toutes vos données ?"
      : "Are you sure you want to delete all your data?";
    if (confirm(message)) {
      clearAll();
      router.push("/");
    }
  };

  const handleExportCalendar = () => {
    const message = language === "fr"
      ? "Fonctionnalité à venir : Export vers Google Calendar, iCal, etc."
      : "Coming soon: Export to Google Calendar, iCal, etc.";
    alert(message);
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>{t.common.loading}</CardTitle>
            <CardDescription>
              {language === "fr" ? "Génération de votre routine personnalisée" : "Generating your personalized routine"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const product = productInfo[result.productKey];
  const morningSteps = result.routine.steps.filter((s) => s.time === "morning");
  const eveningSteps = result.routine.steps.filter((s) => s.time === "evening");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg" />
            <span className="font-bold text-lg tracking-tight">Paula's Choice</span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="border-2 hover:border-purple-600 hover:text-purple-600"
          >
            {language === "fr" ? "Accueil" : "Home"}
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.result.title}
          </h1>
          <p className="text-lg text-gray-700">
            {language === "fr" ? "Votre routine science-based sur-mesure" : "Your science-based personalized routine"}
          </p>
        </div>

        <Alert className="mb-6 border-2 border-amber-200 bg-amber-50/80 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-900">Important</AlertTitle>
          <AlertDescription className="text-amber-800">
            {language === "fr"
              ? "Simulation illustrative. Ceci n'est pas un avis médical. Consultez un dermatologue pour un diagnostic professionnel."
              : "Illustrative simulation. This is not medical advice. Consult a dermatologist for professional diagnosis."}
          </AlertDescription>
        </Alert>

        {/* Résumé */}
        <Card className="mb-6 border-2 border-blue-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t.result.yourProfile}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-1">{t.result.skinType}</p>
                <p className="font-bold text-lg text-blue-700">
                  {skinTypeLabels[result.summary.skinType] || result.summary.skinType}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-sm font-semibold text-purple-900 mb-1">{t.result.mainConcerns}</p>
                <p className="font-bold text-lg text-purple-700">
                  {Array.isArray(result.summary.mainConcerns)
                    ? result.summary.mainConcerns.join(", ")
                    : (language === "fr" ? "Non spécifié" : "Not specified")}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                <p className="text-sm font-semibold text-pink-900 mb-1">{t.result.objectives}</p>
                <p className="font-bold text-lg text-pink-700">
                  {Array.isArray(result.summary.objectives)
                    ? result.summary.objectives.slice(0, 3).join(", ")
                    : (language === "fr" ? "Non spécifié" : "Not specified")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produit recommandé */}
        <Card className="mb-6 border-2 border-purple-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t.result.recommendedProduct}</CardTitle>
            <CardDescription className="text-base">
              {language === "fr" ? `Personnalisé pour ${product.persona}` : `Personalized for ${product.persona}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-bold text-xl mb-3 text-purple-700">{product.name}</h3>
            <p className="text-gray-700 text-base">{product.description}</p>
          </CardContent>
        </Card>

        {/* Avant/Après */}
        {photoBase64 && (
          <BeforeAfter photoBase64={photoBase64} productKey={result.productKey} />
        )}

        {/* Irritation Guard */}
        <Card className="mb-6 border-2 border-amber-200 bg-amber-50/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              {language === "fr" ? "Irritation Guard - Conseils d'utilisation" : "Irritation Guard - Usage tips"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.irritationGuard.map((tip, idx) => (
                <li key={idx} className="text-base flex items-start gap-3">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span className="text-gray-800">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Transparence Ingrédients */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.result.ingredients}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.ingredients.map((ingredient, idx) => (
              <IngredientCard key={idx} ingredient={ingredient} />
            ))}
          </div>
        </div>

        {/* Routine Planning */}
        <Card className="mb-6 border-2 border-pink-100 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{language === "fr" ? "Votre routine quotidienne" : "Your daily routine"}</CardTitle>
            <CardDescription className="text-base">
              {language === "fr" ? "Planning matin & soir personnalisé" : "Personalized morning & evening routine"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-600">{t.result.morning}</h3>
                <div className="space-y-4">
                  {morningSteps.map((step, idx) => (
                    <RoutineCard key={idx} step={step} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-purple-600">{t.result.evening}</h3>
                <div className="space-y-4">
                  {eveningSteps.map((step, idx) => (
                    <RoutineCard key={idx} step={step} />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-gray-200">
              <Button
                onClick={handleExportCalendar}
                variant="outline"
                className="w-full border-2 hover:border-purple-600 hover:text-purple-600"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {language === "fr" ? "Enregistrer dans mon calendrier (à venir)" : "Save to my calendar (coming soon)"}
              </Button>
              <p className="text-sm text-gray-600 text-center mt-3">
                {language === "fr"
                  ? "Bientôt : export Google Calendar, iCal, rappels quotidiens"
                  : "Coming soon: Google Calendar export, iCal, daily reminders"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {language === "fr" ? "Produits recommandés" : "Recommended products"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ProductCard product={PRODUCTS[result.productKey]} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleRestart}
            variant="outline"
            className="flex-1 border-2 hover:border-blue-600 hover:text-blue-600 py-6 text-base"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            {language === "fr" ? "Recommencer" : "Start over"}
          </Button>
          <Button
            onClick={handleDeleteData}
            variant="destructive"
            className="flex-1 py-6 text-base hover:shadow-lg"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            {language === "fr" ? "Supprimer mes données" : "Delete my data"}
          </Button>
        </div>
      </div>

      {/* NOUVEAU : Panier flottant */}
      <Cart />
    </div>
  );
}