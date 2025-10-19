"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { ShoppingCart, Trash2, Plus, Minus, Sparkles, Camera, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/productDataTranslations";
import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const result = useAppStore((state) => state.result);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const photos = useAppStore((state) => state.photos);
  const quiz = useAppStore((state) => state.quiz);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const clearCart = useAppStore((state) => state.clearCart);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const products = getProducts("en");

  // Check if user has completed quiz and taken/uploaded a photo
  const hasCompletedQuiz = result && quiz && Object.keys(quiz).length > 0;
  const hasPhoto = (photoBase64 && photoBase64.length > 0) || (photos && photos.length > 0);
  const canViewProducts = hasCompletedQuiz && hasPhoto;

  // Migrate old results to new product system AND update when gender changes
  React.useEffect(() => {
    if (result && quiz) {
      const isFemale = quiz.sex === "female";
      const expectedProducts = isFemale
        ? ["vitamin-c-moisturizer" as const, "bha-exfoliant" as const]
        : ["repairing-serum" as const, "rescue-repair-moisturizer" as const];

      // Check if products don't match current gender or are missing
      const needsUpdate = !result.recommendedProducts ||
        JSON.stringify(result.recommendedProducts) !== JSON.stringify(expectedProducts);

      if (needsUpdate) {
        console.log('🔄 Updating products for gender:', quiz.sex);
        const newProductKey = isFemale ? "vitamin-c-moisturizer" as const : "repairing-serum" as const;

        useAppStore.setState((state) => ({
          result: state.result ? {
            ...state.result,
            productKey: newProductKey,
            recommendedProducts: expectedProducts
          } : null
        }));
      }
    }
  }, [result, quiz, quiz?.sex]);

  // Debug logs
  console.log('🛒 Cart Debug:', {
    hasCompletedQuiz,
    hasPhoto,
    canViewProducts,
    result: result ? {
      productKey: result.productKey,
      recommendedProducts: result.recommendedProducts,
      hasRecommendedProducts: !!result.recommendedProducts
    } : null,
    quiz: quiz ? { sex: quiz.sex } : null,
    products: Object.keys(products)
  });

  // Show empty state if no quiz or photo
  if (!canViewProducts && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="p-8 max-w-2xl w-full text-center border-2 border-orange-200 shadow-xl">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-orange-600" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Personalized Recommendations
          </h2>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Complete the questionnaire and take a photo to unlock personalized product recommendations tailored to your skin.
          </p>

          <div className="bg-orange-50 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Why we need this information:</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Our AI analyzes your skin type, concerns, and photo to recommend the most suitable products for your unique needs.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  hasCompletedQuiz ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {hasCompletedQuiz ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-white text-xs font-bold">1</span>
                  )}
                </div>
                <p className={`text-sm font-semibold ${hasCompletedQuiz ? "text-green-700" : "text-gray-700"}`}>
                  {hasCompletedQuiz ? "Questionnaire completed ✓" : "Complete the questionnaire"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  hasPhoto ? "bg-green-500" : "bg-gray-300"
                }`}>
                  {hasPhoto ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-white text-xs font-bold">2</span>
                  )}
                </div>
                <p className={`text-sm font-semibold ${hasPhoto ? "text-green-700" : "text-gray-700"}`}>
                  {hasPhoto ? "Photo taken ✓" : "Take or upload a photo"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!hasCompletedQuiz && (
              <Button
                onClick={() => router.push("/quiz")}
                size="lg"
                className="bg-[#0065B7] hover:bg-[#004a8a] text-white px-8 py-6 text-lg font-semibold shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Questionnaire
              </Button>
            )}

            {hasCompletedQuiz && !hasPhoto && (
              <Button
                onClick={() => router.push("/camera")}
                size="lg"
                className="bg-[#0065B7] hover:bg-[#004a8a] text-white px-8 py-6 text-lg font-semibold shadow-lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
            )}

            <Button
              onClick={() => router.push("/")}
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:border-[#0065B7] px-8 py-6 text-lg font-semibold"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            100% personalized • Science-based recommendations • All data stored locally
          </p>
        </Card>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Recommended Products Section */}
          {result && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {result.recommendedProducts && result.recommendedProducts.length > 0 ? (
                  result.recommendedProducts.map((productId) => {
                    const prod = products[productId];
                    if (!prod) return null;
                    return (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        showDetails={false}
                      />
                    );
                  })
                ) : (
                  // Fallback pour les anciens résultats sans recommendedProducts
                  Object.values(products)
                    .filter((p) => p.targetGender === quiz.sex || p.targetGender === "all")
                    .map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        showDetails={prod.id === result.productKey}
                      />
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Products & Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 text-sm font-semibold hover:text-red-700"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Section - Left Side (2/3) */}
          <div className="md:col-span-2 space-y-6">
            {/* My Cart Items */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Cart ({cart.length})</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-[#0065B7] font-bold text-lg mb-2">
                          ${item.price.toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Products */}
            {result && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                </div>
                <div className="grid gap-4">
                  {result.recommendedProducts && result.recommendedProducts.length > 0 ? (
                    result.recommendedProducts.map((productId) => {
                      const prod = products[productId];
                      if (!prod) return null;
                      return (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          showDetails={false}
                        />
                      );
                    })
                  ) : (
                    // Fallback pour les anciens résultats sans recommendedProducts
                    Object.values(products)
                      .filter((p) => p.targetGender === quiz.sex || p.targetGender === "all")
                      .map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          showDetails={prod.id === result.productKey}
                        />
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Section - Right Side (1/3) */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#0065B7]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">
                      {total >= 50 ? "FREE" : "$5.99"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#0065B7]">
                        ${(total + (total >= 50 ? 0 : 5.99)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#0065B7] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#004a8a] transition shadow-lg mb-3">
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment • Free shipping over $50
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
