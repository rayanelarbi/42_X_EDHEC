"use client";

import { useAppStore } from "@/store/useAppStore";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore();

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <Globe className="w-4 h-4 text-blue-600" />
      <span className="font-semibold text-sm text-gray-700">
        {language === "fr" ? "EN" : "FR"}
      </span>
    </button>
  );
}
