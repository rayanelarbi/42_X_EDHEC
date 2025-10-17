"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuizForm from "@/components/QuizForm";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/lib/translations";

export default function QuizPage() {
  const { language } = useAppStore();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">{language === "fr" ? "Retour à l'accueil" : "Back to home"}</span>
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-blue-700">
                {language === "fr" ? "Diagnostic personnalisé" : "Personalized Diagnosis"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t.quiz.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-2 max-w-2xl mx-auto">
              {language === "fr" 
                ? "Répondez à quelques questions pour obtenir une recommandation personnalisée"
                : "Answer a few questions to get a personalized recommendation"
              }
            </p>
          </div>
        </div>

        {/* Quiz Form */}
        <div className="animate-slide-up">
          <QuizForm />
        </div>
      </div>
    </div>
  );
}