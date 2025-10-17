"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IngredientCard as IngredientType } from "@/store/useAppStore";
import { Check, X } from "lucide-react";

type IngredientCardProps = {
  ingredient: IngredientType;
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="text-base flex items-baseline gap-2 text-gray-900">
          {ingredient.name}
          {ingredient.concentration && (
            <span className="text-xs font-semibold text-[#0065B7] bg-blue-50 px-2 py-1 rounded">
              {ingredient.concentration}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">
                What it does
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{ingredient.whatItDoes}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <X className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">
                What it doesn't do
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{ingredient.whatItDoesNot}</p>
            </div>
          </div>
        </div>

        {ingredient.alternatives && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Alternatives:</span>{" "}
              {ingredient.alternatives}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}