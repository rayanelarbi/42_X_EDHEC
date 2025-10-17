"use client";

import { useAppStore } from "@/store/useAppStore";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore();

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 hover:border-teal-600 shadow-md hover:shadow-lg transition-all duration-200"
    >
      <Globe className="w-4 h-4 text-teal-600" />
      <span className="font-semibold text-sm text-gray-900">
        {language === "fr" ? "EN" : "FR"}
      </span>
    </button>
  );
}
