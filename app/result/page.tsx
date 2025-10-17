"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { determinePersonaAndProduct } from "@/lib/scoring";
import { buildRoutine } from "@/lib/routineTranslations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import BeforeAfter from "@/components/BeforeAfter";
import { RefreshCw, Calendar, User, ChevronDown, Camera, FileText, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import { translations } from "@/lib/translations";
import { getProducts } from "@/lib/productDataTranslations";

export default function ResultPage() {
  const router = useRouter();
  const quiz = useAppStore((state) => state.quiz);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const result = useAppStore((state) => state.result);
  const setResult = useAppStore((state) => state.setResult);
  const t = translations["en"];

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Toujours calculer ces valeurs pour éviter les problèmes de hooks
  const products = getProducts("en");

  useEffect(() => {
    if (!result && quiz?.sex && quiz?.skinType) {
      const scoring = determinePersonaAndProduct(quiz as any);
      const routine = buildRoutine(scoring.productKey, "en");

      queueMicrotask(() => {
        setResult({
          persona: scoring.persona,
          productKey: scoring.productKey,
          routine,
          ingredients: scoring.ingredients,
          irritationGuard: scoring.irritationGuard,
          summary: {
            skinType: quiz.skinType || "normal",
            mainConcerns: quiz.skinConcerns || [],
            objectives: quiz.objectives || [],
          },
        });
      });
    }
  }, [quiz, result, setResult]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>{t.common.loading}</CardTitle>
            <CardDescription>
              Generating your personalized routine
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Compact Header with Profile Menu */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-2xl tracking-tight text-gray-900">Paula's Choice</span>
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-green-100 rounded-full">
                <Sparkles className="w-4 h-4 text-green-700 mr-1.5" />
                <span className="text-xs font-semibold text-green-700">
                  Results ready
                </span>
              </div>
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 hover:border-[#0065B7] hover:bg-blue-50 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#0065B7] to-[#0088cc] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="hidden sm:inline font-semibold text-gray-900">
                  My profile
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                    <p className="text-sm font-bold text-gray-900">
                      My Profile
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push("/routine");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                  >
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        My routine
                      </p>
                      <p className="text-xs text-gray-600">
                        Calendar and tracking
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push("/photos");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                  >
                    <Camera className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        My photos
                      </p>
                      <p className="text-xs text-gray-600">
                        Skin evolution
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push("/profile");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                  >
                    <FileText className="w-5 h-5 text-[#0065B7]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Edit questionnaire
                      </p>
                      <p className="text-xs text-gray-600">
                        Refine your answers
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push("/");
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Start over
                      </p>
                      <p className="text-xs text-gray-600">
                        New analysis
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Compact Hero */}
        <div className="py-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 text-center">
            Your recommended products
          </h1>
        </div>

        {/* PRODUCTS FIRST - Main Focus */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.values(products).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                showDetails={prod.id === result.productKey}
              />
            ))}
          </div>
        </div>

        {/* Before/After Photo if available */}
        {photoBase64 && (
          <div className="mb-8">
            <BeforeAfter photoBase64={photoBase64} productKey={result.productKey} />
          </div>
        )}

        {/* Routine Section - Redirect to dedicated page */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/routine")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl border-2 border-blue-400 transition-all p-8 shadow-lg hover:shadow-xl group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    📅 Your daily routine
                  </h2>
                  <p className="text-sm text-purple-100">
                    Calendar, tracking and reminders to stay consistent
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white">
                <span className="font-semibold">
                  View calendar
                </span>
                <ChevronDown className="w-6 h-6 -rotate-90 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

      </div>

      {/* NOUVEAU : Panier flottant */}
      <Cart />
    </div>
  );
}