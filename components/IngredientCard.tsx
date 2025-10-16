"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IngredientCard as IngredientType } from "@/store/useAppStore";
import { Check, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

type IngredientCardProps = {
  ingredient: IngredientType;
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const language = useAppStore((state) => state.language);

  return (
    <Card className="border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardTitle className="text-lg flex items-baseline gap-2 text-gray-800">
          {ingredient.name}
          {ingredient.concentration && (
            <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
              {ingredient.concentration}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Check className="h-6 w-6 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">
                {language === "fr" ? "Ce que ça fait" : "What it does"}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{ingredient.whatItDoes}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <X className="h-6 w-6 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">
                {language === "fr" ? "Ce que ça ne fait pas" : "What it doesn't do"}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{ingredient.whatItDoesNot}</p>
            </div>
          </div>
        </div>

        {ingredient.alternatives && (
          <div className="pt-3 border-t-2 border-gray-100">
            <p className="text-sm text-gray-700">
              <span className="font-bold">{language === "fr" ? "Alternatives :" : "Alternatives:"}</span>{" "}
              {ingredient.alternatives}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}