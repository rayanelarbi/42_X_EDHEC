"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simulateAfter } from "@/lib/imageFilters";

type BeforeAfterProps = {
  photoBase64: string;
};

export default function BeforeAfter({ photoBase64 }: BeforeAfterProps) {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Canvas "Avant"
      if (beforeCanvasRef.current) {
        const beforeCtx = beforeCanvasRef.current.getContext("2d");
        if (beforeCtx) {
          beforeCanvasRef.current.width = img.width;
          beforeCanvasRef.current.height = img.height;
          beforeCtx.drawImage(img, 0, 0);
        }
      }

      // Canvas "Après" avec filtres
      if (afterCanvasRef.current) {
        const afterCanvas = simulateAfter(img);
        const afterCtx = afterCanvasRef.current.getContext("2d");
        if (afterCtx) {
          afterCanvasRef.current.width = afterCanvas.width;
          afterCanvasRef.current.height = afterCanvas.height;
          afterCtx.drawImage(afterCanvas, 0, 0);
        }
      }

      setProcessed(true);
    };
    img.src = photoBase64;
  }, [photoBase64]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Avant / Après</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-center">Avant</h4>
            <canvas
              ref={beforeCanvasRef}
              className="w-full rounded-lg border"
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-center">Après (simulation)</h4>
            <canvas
              ref={afterCanvasRef}
              className="w-full rounded-lg border"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          ⚠️ Simulation illustrative. Ceci n'est pas un avis médical. Les résultats
          peuvent varier selon les individus.
        </p>
      </CardContent>
    </Card>
  );
}