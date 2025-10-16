"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Product } from "@/lib/productData";
import { ShoppingCart, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [showTraceability, setShowTraceability] = useState(false);
  const addToCart = useAppStore((state) => state.addToCart);
  const language = useAppStore((state) => state.language);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.shortName,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Card className="overflow-hidden border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative h-72 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-40 h-40 mx-auto bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 shadow-xl">
              <span className="text-6xl">🧴</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {language === "fr" ? "Image produit" : "Product image"}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-bold text-xl mb-2 text-gray-800">{product.name}</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {product.price.toFixed(2)}€
            </p>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base font-semibold text-purple-600 hover:text-purple-700 hover:gap-3 transition-all duration-200"
          >
            {language === "fr" ? "Voir la page produit" : "See product page"}
            <ExternalLink className="h-5 w-5" />
          </a>

          <div className="border-t-2 pt-4">
            <button
              onClick={() => setShowTraceability(!showTraceability)}
              className="flex items-center justify-between w-full text-base font-bold hover:text-purple-600 transition-colors"
            >
              <span>{language === "fr" ? "Traçabilité & Transparence" : "Traceability & Transparency"}</span>
              {showTraceability ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {showTraceability && (
              <div className="mt-4 space-y-5 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-bold mb-2 text-gray-800">
                    🌍 {language === "fr" ? "Origine des ingrédients" : "Ingredients origin"}
                  </h4>
                  <ul className="space-y-1">
                    {product.traceability.origin.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-bold mb-2 text-gray-800">
                    📋 {language === "fr" ? "Liste INCI complète" : "Complete INCI list"}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {product.traceability.inci.join(", ")}
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-bold mb-2 text-gray-800">
                    ✓ {language === "fr" ? "Certifications" : "Certifications"}
                  </h4>
                  <ul className="space-y-1">
                    {product.traceability.certifications.map((cert, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        ✓ {cert}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-pink-50 rounded-lg">
                  <h4 className="font-bold mb-2 text-gray-800">
                    🏭 {language === "fr" ? "Fabrication" : "Manufacturing"}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {product.traceability.manufacturing}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {language === "fr" ? "Ajouter au panier" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}