"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ClipboardList, Camera, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/lib/translations";

export default function Home() {
  const { language } = useAppStore();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-8 mb-20">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Paula's Choice
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full" />
          </div>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
            {t.home.subtitle}
          </p>
          <Link href="/quiz">
            <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              {t.home.startQuiz}
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{language === "fr" ? "1. Questionnaire détaillé" : "1. Detailed questionnaire"}</CardTitle>
              <CardDescription className="text-base">
                {language === "fr"
                  ? "12 questions pour comprendre votre peau, vos habitudes et vos objectifs"
                  : "12 questions to understand your skin, habits and objectives"}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">{language === "fr" ? "2. Photo (optionnelle)" : "2. Photo (optional)"}</CardTitle>
              <CardDescription className="text-base">
                {language === "fr"
                  ? "Capturez une photo pour une simulation avant/après (traitement 100% local)"
                  : "Capture a photo for a before/after simulation (100% local processing)"}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle className="text-xl">{language === "fr" ? "3. Routine personnalisée" : "3. Personalized routine"}</CardTitle>
              <CardDescription className="text-base">
                {language === "fr"
                  ? "Un produit héros adapté + routine complète matin/soir + transparence totale"
                  : "A tailored hero product + complete morning/evening routine + total transparency"}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-2 border-blue-100 shadow-xl backdrop-blur-sm">
          <CardContent className="pt-8 pb-6">
            <h3 className="font-bold text-xl mb-4 text-gray-800">
              {language === "fr" ? "Confidentialité & Transparence" : "Privacy & Transparency"}
            </h3>
            <ul className="text-base text-gray-700 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>{language === "fr"
                  ? "Traitement local uniquement - aucune donnée transmise"
                  : "Local processing only - no data transmitted"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>{language === "fr"
                  ? "Transparence totale sur les ingrédients et leur action"
                  : "Total transparency on ingredients and their action"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>{language === "fr"
                  ? "Dosage progressif recommandé (Irritation Guard)"
                  : "Progressive dosage recommended (Irritation Guard)"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>{language === "fr"
                  ? "Maximum 1 produit actif pour éviter la surconsommation"
                  : "Maximum 1 active product to avoid overconsumption"}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}