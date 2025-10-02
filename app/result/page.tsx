"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { determinePersonaAndProduct } from "@/lib/scoring";
import { buildRoutine } from "@/lib/routine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BeforeAfter from "@/components/BeforeAfter";
import RoutineCard from "@/components/RoutineCard";
import { AlertCircle, RefreshCw, Trash2 } from "lucide-react";

const productInfo = {
  bha2: {
    name: "PolarChoice Clear 2% BHA Exfoliant",
    description:
      "Aide à désobstruer les pores et lisser la texture. Utilisation progressive (1x/j) selon tolérance.",
    persona: "Adrien, 28 ans - Peau mixte/grasse",
  },
  azelaic10: {
    name: "PolarChoice Arctic Azelaic 10% Booster",
    description:
      "Aide à atténuer les rougeurs et uniformiser le teint. Utilisation progressive (1x/j) selon tolérance.",
    persona: "Lina, 34 ans - Peau sèche/sensible",
  },
};

const skinTypeLabels: Record<string, string> = {
  dry: "Sèche",
  oily: "Grasse",
  combination: "Mixte",
  sensitive: "Sensible",
};

const concernLabels: Record<string, string> = {
  acne: "Acné",
  pores: "Pores dilatés",
  redness: "Rougeurs",
  texture: "Texture irrégulière",
  wrinkles: "Rides",
  dullness: "Teint terne",
};

export default function ResultPage() {
  const router = useRouter();
  const quiz = useAppStore((state) => state.quiz);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const result = useAppStore((state) => state.result);
  const setResult = useAppStore((state) => state.setResult);
  const clearAll = useAppStore((state) => state.clearAll);

  useEffect(() => {
    // Calculer le résultat si pas déjà fait
    if (!result && quiz.skinType && quiz.mainConcern && quiz.severity) {
      const { persona, productKey } = determinePersonaAndProduct(quiz as any);
      const routine = buildRoutine(productKey);

      setResult({
        persona,
        productKey,
        routine,
        summary: {
          skinType: quiz.skinType,
          mainConcern: quiz.mainConcern,
          severity: quiz.severity,
        },
      });
    }
  }, [quiz, result, setResult]);

  const handleRestart = () => {
    router.push("/");
  };

  const handleDeleteData = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer toutes vos données ?")) {
      clearAll();
      router.push("/");
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
            <CardDescription>Génération de votre routine personnalisée</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const product = productInfo[result.productKey];
  const morningSteps = result.routine.steps.filter((s) => s.time === "morning");
  const eveningSteps = result.routine.steps.filter((s) => s.time === "evening");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vos résultats personnalisés</h1>
          <p className="text-slate-600">
            Voici votre routine sur-mesure basée sur votre profil
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Simulation illustrative. Ceci n'est pas un avis médical. Consultez un
            dermatologue pour un diagnostic professionnel.
          </AlertDescription>
        </Alert>

        {/* Résumé */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type de peau</p>
                <p className="font-medium">
                  {skinTypeLabels[result.summary.skinType] || result.summary.skinType}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Préoccupation principale</p>
                <p className="font-medium">
                  {concernLabels[result.summary.mainConcern] ||
                    result.summary.mainConcern}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Intensité</p>
                <p className="font-medium">{result.summary.severity}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produit recommandé */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Produit recommandé</CardTitle>
            <CardDescription>Personnalisé pour {product.persona}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-slate-600">{product.description}</p>
          </CardContent>
        </Card>

        {/* Routine */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Votre routine quotidienne</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <RoutineCard time="morning" steps={morningSteps} />
            <RoutineCard time="evening" steps={eveningSteps} />
          </div>
        </div>

        {/* Avant/Après */}
        {photoBase64 ? (
          <BeforeAfter photoBase64={photoBase64} />
        ) : (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aucune photo</AlertTitle>
            <AlertDescription>
              Vous n'avez pas capturé de photo. Retournez à l'étape précédente pour
              obtenir une simulation avant/après.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button onClick={handleRestart} variant="outline" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Recommencer
          </Button>
          <Button
            onClick={handleDeleteData}
            variant="destructive"
            className="flex-1"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer mes données
          </Button>
        </div>
      </div>
    </div>
  );
}