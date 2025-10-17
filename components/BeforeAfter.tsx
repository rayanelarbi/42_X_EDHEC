"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simulateAfter } from "@/lib/imageFilters";
import { ProductKey } from "@/store/useAppStore";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/lib/translations";
import { SkinProblem } from "@/lib/skinAnalysis";
import { Loader2, Eye, EyeOff } from "lucide-react";

type BeforeAfterProps = {
  photoBase64: string;
  productKey: ProductKey;
};

export default function BeforeAfter({ photoBase64, productKey }: BeforeAfterProps) {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const t = translations["en"].result;
  const skinAnalysis = useAppStore((state) => state.skinAnalysis);

  const [showMarkers, setShowMarkers] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (beforeCanvasRef.current) {
        const beforeCtx = beforeCanvasRef.current.getContext("2d");
        if (beforeCtx) {
          beforeCanvasRef.current.width = img.width;
          beforeCanvasRef.current.height = img.height;
          beforeCtx.drawImage(img, 0, 0);

          // Dessiner les marqueurs sur l'image "avant" si disponibles
          if (showMarkers && skinAnalysis && overlayCanvasRef.current) {
            drawProblemMarkers(overlayCanvasRef.current, skinAnalysis.problems, img.width, img.height);
          }
        }
      }

      if (afterCanvasRef.current) {
        // Passer les problèmes détectés au filtre pour un traitement ciblé
        const afterCanvas = simulateAfter(img, productKey, skinAnalysis?.problems);
        const afterCtx = afterCanvasRef.current.getContext("2d");
        if (afterCtx) {
          afterCanvasRef.current.width = afterCanvas.width;
          afterCanvasRef.current.height = afterCanvas.height;
          afterCtx.drawImage(afterCanvas, 0, 0);
        }
      }
    };
    img.src = photoBase64;
  }, [photoBase64, productKey, skinAnalysis, showMarkers]);

  return (
    <Card className="mb-6 border-2 border-gray-200 bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900">{t.beforeAfter}</CardTitle>
          {skinAnalysis && (
            <button
              onClick={() => setShowMarkers(!showMarkers)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 hover:border-blue-500 rounded-lg transition-all"
            >
              {showMarkers ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-semibold">Hide detection</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="text-sm font-semibold">Show detection</span>
                </>
              )}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Skin Analysis Summary */}
        {skinAnalysis && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">AI Skin Analysis</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Skin Quality Score:</span>
                <span className={`text-2xl font-bold ${
                  skinAnalysis.overallScore >= 80 ? "text-green-600" :
                  skinAnalysis.overallScore >= 60 ? "text-yellow-600" :
                  "text-orange-600"
                }`}>
                  {skinAnalysis.overallScore}/100
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {getSkinProblemSummary(skinAnalysis.problems).map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border-2 border-blue-200 text-blue-800 rounded-full text-xs font-semibold"
                >
                  {item.count}x {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-bold text-center text-base text-gray-700 uppercase tracking-wide">{t.before}</h4>
            <div className="relative">
              <canvas ref={beforeCanvasRef} className="w-full rounded-lg border-2 border-gray-300" />
              {showMarkers && skinAnalysis && (
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg"
                />
              )}
            </div>
            {skinAnalysis && (
              <p className="text-xs text-center text-gray-600 italic">
                {skinAnalysis.problems.length} problem area{skinAnalysis.problems.length > 1 ? "s" : ""} detected
              </p>
            )}
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-center text-base text-gray-700 uppercase tracking-wide">{t.after}</h4>
            <canvas ref={afterCanvasRef} className="w-full rounded-lg border-2 border-green-300" />
            <p className="text-xs text-center text-green-700 font-semibold">
              ✨ AI-Enhanced Result
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {skinAnalysis && skinAnalysis.recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Personalized Recommendations</h3>
            <ul className="space-y-2">
              {skinAnalysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-sm text-gray-600 text-center mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
          {t.simulationWarning}
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Dessine les marqueurs de problèmes sur le canvas
 */
function drawProblemMarkers(
  canvas: HTMLCanvasElement,
  problems: SkinProblem[],
  width: number,
  height: number
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  problems.forEach((problem, idx) => {
    const x = (problem.location.x / 100) * width;
    const y = (problem.location.y / 100) * height;
    const w = (problem.location.width / 100) * width;
    const h = (problem.location.height / 100) * height;

    // Couleur selon le type de problème
    const colors = {
      acne: "#EF4444",
      wrinkle: "#F59E0B",
      dark_circle: "#8B5CF6",
      pore: "#3B82F6",
      dark_spot: "#EC4899",
      redness: "#F97316",
    };

    const color = colors[problem.type];

    // Dessiner un rectangle semi-transparent
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, w, h);

    // Dessiner un label
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 20, 60, 18);
    ctx.fillStyle = "white";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillText(problem.type.toUpperCase(), x + 4, y - 7);
  });
}

/**
 * Résume les problèmes détectés par type
 */
function getSkinProblemSummary(problems: SkinProblem[]): Array<{ label: string; count: number }> {
  const counts: Record<string, number> = {};

  problems.forEach(p => {
    counts[p.type] = (counts[p.type] || 0) + 1;
  });

  const labels: Record<string, string> = {
    acne: "Acne",
    wrinkle: "Wrinkles",
    dark_circle: "Dark Circles",
    pore: "Enlarged Pores",
    dark_spot: "Dark Spots",
    redness: "Redness",
  };

  return Object.entries(counts).map(([type, count]) => ({
    label: labels[type] || type,
    count,
  }));
}
