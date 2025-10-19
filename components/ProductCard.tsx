"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Product } from "@/lib/productData";
import { ShoppingCart, ArrowRight, Sparkles, Info } from "lucide-react";

export type ProductCardProps = {
  product: Product;
  showDetails?: boolean;
};

export default function ProductCard({ product, showDetails = false }: ProductCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const addToCart = useAppStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleViewDetails = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 bg-white relative group cursor-pointer ${
        showDetails
          ? "border-2 border-blue-500 shadow-xl hover:shadow-2xl"
          : "border border-gray-200 hover:shadow-lg"
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleViewDetails}
    >
      {/* Badge "Recommended for you" */}
      {showDetails && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Recommended for you
        </div>
      )}

      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="absolute top-4 right-4 z-10 bg-white border-2 border-blue-500 text-blue-700 px-3 py-1.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Click for details
        </div>
      )}

      <CardContent className="p-0">
        <div className="relative h-80 bg-gray-50 flex items-center justify-center border-b border-gray-200">
          {product.image && product.image.startsWith('http') ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-6"
            />
          ) : (
            <div className="text-center p-6">
              <div className="w-48 h-48 mx-auto bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-gray-100">
                <span className="text-7xl">🧴</span>
              </div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                Product image
              </p>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-900 leading-tight">{product.name}</h3>
            <p className="text-2xl font-bold text-[#0065B7]">
              {product.price.toFixed(2)}€
            </p>
          </div>

          <button
            onClick={handleViewDetails}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0065B7] hover:text-[#004a8a] hover:gap-3 transition-all duration-200"
          >
            View all details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-[#0065B7] hover:bg-[#004a8a] text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 rounded py-6"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add
        </Button>
        <Button
          onClick={handleViewDetails}
          variant="outline"
          className="flex-1 border-2 border-[#0065B7] text-[#0065B7] hover:bg-blue-50 font-medium shadow-sm transition-all duration-200 rounded py-6"
          size="lg"
        >
          <ArrowRight className="mr-2 h-5 w-5" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}