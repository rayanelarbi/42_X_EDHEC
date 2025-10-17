"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simulateAfter } from "@/lib/imageFilters";
import { ProductKey } from "@/store/useAppStore";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/lib/translations";

type BeforeAfterProps = {
  photoBase64: string;
  productKey: ProductKey;
};

export default function BeforeAfter({ photoBase64, productKey }: BeforeAfterProps) {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const t = translations["en"].result;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (beforeCanvasRef.current) {
        const beforeCtx = beforeCanvasRef.current.getContext("2d");
        if (beforeCtx) {
          beforeCanvasRef.current.width = img.width;
          beforeCanvasRef.current.height = img.height;
          beforeCtx.drawImage(img, 0, 0);
        }
      }

      if (afterCanvasRef.current) {
        const afterCanvas = simulateAfter(img, productKey);
        const afterCtx = afterCanvasRef.current.getContext("2d");
        if (afterCtx) {
          afterCanvasRef.current.width = afterCanvas.width;
          afterCanvasRef.current.height = afterCanvas.height;
          afterCtx.drawImage(afterCanvas, 0, 0);
        }
      }
    };
    img.src = photoBase64;
  }, [photoBase64, productKey]);

  return (
    <Card className="mb-6 border border-gray-200 bg-white shadow-sm">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-900">{t.beforeAfter}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-bold text-center text-base text-gray-700 uppercase tracking-wide">{t.before}</h4>
            <canvas ref={beforeCanvasRef} className="w-full rounded border border-gray-300" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-center text-base text-gray-700 uppercase tracking-wide">{t.after}</h4>
            <canvas ref={afterCanvasRef} className="w-full rounded border border-gray-300" />
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center mt-6 p-4 bg-amber-50 rounded border border-amber-200">
          {t.simulationWarning}
        </p>
      </CardContent>
    </Card>
  );
}
