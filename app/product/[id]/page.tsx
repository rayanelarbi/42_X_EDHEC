"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { getProducts } from "@/lib/productDataTranslations";
import { scoringTranslations } from "@/lib/scoringTranslations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Sparkles, AlertCircle, ExternalLink } from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const addToCart = useAppStore((state) => state.addToCart);
  const result = useAppStore((state) => state.result);

  const products = getProducts("en");
  const product = Object.values(products).find((p) => p.id === productId);

  // Déterminer si c'est le produit recommandé pour afficher les ingrédients
  const isRecommended = result?.productKey === productId;
  const scoringData = isRecommended
    ? scoringTranslations["en"][productId === "duo-eclat" ? "duoEclat" : "repairingSerum"]
    : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <p className="text-center text-gray-700">
            Product not found
          </p>
          <Button onClick={() => router.back()} className="w-full mt-4">
            Go back
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.shortName,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-[#0065B7] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">
                Back
              </span>
            </button>
            <span className="font-bold text-xl tracking-tight text-gray-900">Paula's Choice</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Badge recommandé */}
        {isRecommended && (
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <span className="font-bold text-lg">
              ✨ Recommended for you
            </span>
          </div>
        )}

        {/* Product Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
            <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center">
              <span className="text-9xl">🧴</span>
            </div>
          </div>

          {/* Info principale */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-[#0065B7] mb-6">
                {product.price.toFixed(2)}€
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-[#0065B7] hover:bg-[#004a8a] text-white font-bold py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to cart
              </Button>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full border-2 border-[#0065B7] text-[#0065B7] hover:bg-blue-50 font-bold py-6 rounded-xl transition-all"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View on website
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Ingrédients clés - uniquement si recommandé */}
        {isRecommended && scoringData && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Key ingredients
                </h2>
              </div>

              <div className="space-y-6">
                {scoringData.ingredients.map((ingredient, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-xl text-gray-900">{ingredient.name}</h3>
                          {ingredient.concentration && (
                            <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                              {ingredient.concentration}
                            </span>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold text-lg">✓</span>
                            <div>
                              <p className="font-semibold text-sm text-gray-700 uppercase tracking-wide mb-1">
                                What it does
                              </p>
                              <p className="text-gray-900">{ingredient.whatItDoes}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold text-lg">⚠️</span>
                            <div>
                              <p className="font-semibold text-sm text-gray-700 uppercase tracking-wide mb-1">
                                What it doesn't do
                              </p>
                              <p className="text-gray-700 italic">{ingredient.whatItDoesNot}</p>
                            </div>
                          </div>
                          {ingredient.alternatives && (
                            <div className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold text-lg">💡</span>
                              <div>
                                <p className="font-semibold text-sm text-gray-700 uppercase tracking-wide mb-1">
                                  Alternatives
                                </p>
                                <p className="text-gray-700">{ingredient.alternatives}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Irritation Guard */}
              {scoringData.irritationGuard && scoringData.irritationGuard.length > 0 && (
                <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-900">
                      Irritation Guard - Usage tips
                    </h3>
                  </div>
                  <ul className="space-y-3 ml-13">
                    {scoringData.irritationGuard.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-amber-700 font-bold text-lg mt-0.5">•</span>
                        <span className="text-gray-800 text-base leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Traçabilité & Transparence */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Traceability & Transparency
          </h2>

          <div className="space-y-6">
            {/* Origine */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                Ingredients origin
              </h3>
              <ul className="space-y-2">
                {product.traceability.origin.map((item, idx) => (
                  <li key={idx} className="text-gray-800 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* INCI */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Complete INCI list
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {product.traceability.inci.join(", ")}
              </p>
            </div>

            {/* Certifications */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Certifications
              </h3>
              <ul className="space-y-2">
                {product.traceability.certifications.map((cert, idx) => (
                  <li key={idx} className="text-gray-800 flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fabrication */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🏭</span>
                Manufacturing
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {product.traceability.manufacturing}
              </p>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-12 bg-gradient-to-r from-[#0065B7] to-[#0088cc] rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to try?
          </h3>
          <Button
            onClick={handleAddToCart}
            className="bg-white text-[#0065B7] hover:bg-gray-100 font-bold py-6 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Add to cart - {product.price.toFixed(2)}€
          </Button>
        </div>
      </div>
    </div>
  );
}
