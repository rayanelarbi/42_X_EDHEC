import { SkinProblem, SkinProblemType } from "./skinAnalysis";

export function simulateAfter(
  source: HTMLImageElement | HTMLCanvasElement,
  productKey: "duo-eclat" | "repairing-serum",
  skinProblems?: SkinProblem[]
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context non disponible");

  canvas.width = source.width;
  canvas.height = source.height;

  ctx.drawImage(source, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Si on a des problèmes détectés, appliquer un filtre intelligent ciblé
  if (skinProblems && skinProblems.length > 0) {
    applyTargetedFilters(data, canvas.width, canvas.height, skinProblems, productKey);
  } else {
    // Sinon, appliquer le filtre global de base
    applyBasicFilter(data, productKey);
  }

  ctx.putImageData(imageData, 0, 0);

  // Appliquer un léger flou pour lisser
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return canvas;

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.filter = "blur(0.8px)";
  tempCtx.drawImage(canvas, 0, 0);

  // Ajouter le watermark
  tempCtx.filter = "none";
  tempCtx.font = "16px Inter, sans-serif";
  tempCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
  tempCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  tempCtx.lineWidth = 2;
  const text = "AI Enhanced";
  const textWidth = tempCtx.measureText(text).width;
  const x = tempCanvas.width - textWidth - 15;
  const y = tempCanvas.height - 15;
  tempCtx.strokeText(text, x, y);
  tempCtx.fillText(text, x, y);

  return tempCanvas;
}

/**
 * Applique des filtres ciblés sur les zones détectées
 */
function applyTargetedFilters(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  problems: SkinProblem[],
  productKey: "duo-eclat" | "repairing-serum"
) {
  // Créer une carte d'intensité de traitement pour chaque pixel
  const treatmentMap = new Float32Array(width * height);
  treatmentMap.fill(0);

  // Pour chaque problème détecté, augmenter l'intensité du traitement dans cette zone
  problems.forEach(problem => {
    const x = Math.floor((problem.location.x / 100) * width);
    const y = Math.floor((problem.location.y / 100) * height);
    const w = Math.floor((problem.location.width / 100) * width);
    const h = Math.floor((problem.location.height / 100) * height);

    const intensity = problem.severity / 100;
    const filterType = getFilterTypeForProblem(problem.type, productKey);

    // Remplir la zone avec un gradient pour un effet naturel
    for (let py = Math.max(0, y); py < Math.min(height, y + h); py++) {
      for (let px = Math.max(0, x); px < Math.min(width, x + w); px++) {
        const idx = py * width + px;

        // Distance du centre de la zone (pour effet de gradient)
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const distX = (px - centerX) / (w / 2);
        const distY = (py - centerY) / (h / 2);
        const dist = Math.sqrt(distX * distX + distY * distY);
        const gradient = Math.max(0, 1 - dist);

        treatmentMap[idx] = Math.max(treatmentMap[idx], intensity * gradient * filterType.strength);
      }
    }
  });

  // Appliquer les traitements pixel par pixel selon la carte d'intensité
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const dataIdx = idx * 4;
      const intensity = treatmentMap[idx];

      if (intensity > 0.05) {
        // Appliquer le traitement avec l'intensité calculée
        applyPixelTreatment(data, dataIdx, intensity, productKey);
      }
    }
  }
}

/**
 * Applique un traitement sur un pixel spécifique
 */
function applyPixelTreatment(
  data: Uint8ClampedArray,
  idx: number,
  intensity: number,
  productKey: "duo-eclat" | "repairing-serum"
) {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];

  if (productKey === "duo-eclat") {
    // Éclaircir et uniformiser
    const brightness = 1 + (0.12 * intensity);
    const rednessReduction = 0.85 + (0.15 * (1 - intensity));

    data[idx] = Math.min(255, r * rednessReduction * brightness);
    data[idx + 1] = Math.min(255, g * brightness);
    data[idx + 2] = Math.min(255, b * brightness);

    // Uniformisation
    const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    const uniformFactor = 0.1 * intensity;
    data[idx] = data[idx] * (1 - uniformFactor) + avg * uniformFactor;
    data[idx + 1] = data[idx + 1] * (1 - uniformFactor) + avg * uniformFactor;
    data[idx + 2] = data[idx + 2] * (1 - uniformFactor) + avg * uniformFactor;
  } else {
    // Apaiser et hydrater
    const brightness = 1 + (0.08 * intensity);
    const rednessReduction = 0.88 + (0.12 * (1 - intensity));

    data[idx] = Math.min(255, r * rednessReduction * brightness);
    data[idx + 1] = Math.min(255, g * brightness);
    data[idx + 2] = Math.min(255, b * brightness);

    // Uniformisation plus douce
    const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    const uniformFactor = 0.15 * intensity;
    data[idx] = data[idx] * (1 - uniformFactor) + avg * uniformFactor;
    data[idx + 1] = data[idx + 1] * (1 - uniformFactor) + avg * uniformFactor;
    data[idx + 2] = data[idx + 2] * (1 - uniformFactor) + avg * uniformFactor;
  }
}

/**
 * Retourne le type de filtre à appliquer selon le type de problème
 */
function getFilterTypeForProblem(
  problemType: SkinProblemType,
  productKey: "duo-eclat" | "repairing-serum"
): { strength: number } {
  const filters = {
    acne: { strength: productKey === "duo-eclat" ? 1.2 : 1.0 },
    wrinkle: { strength: 0.8 },
    dark_circle: { strength: 1.0 },
    pore: { strength: productKey === "duo-eclat" ? 1.1 : 0.9 },
    dark_spot: { strength: productKey === "duo-eclat" ? 1.3 : 1.0 },
    redness: { strength: productKey === "repairing-serum" ? 1.2 : 1.0 },
  };

  return filters[problemType];
}

/**
 * Applique le filtre de base (ancien système)
 */
function applyBasicFilter(data: Uint8ClampedArray, productKey: "duo-eclat" | "repairing-serum") {
  if (productKey === "duo-eclat") {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = r * 0.88;

      const brightnessFactor = 1.08;
      data[i] = Math.min(255, data[i] * brightnessFactor);
      data[i + 1] = Math.min(255, g * brightnessFactor);
      data[i + 2] = Math.min(255, b * brightnessFactor);

      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] * 0.95 + avg * 0.05;
      data[i + 1] = data[i + 1] * 0.95 + avg * 0.05;
      data[i + 2] = data[i + 2] * 0.95 + avg * 0.05;
    }
  } else {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = r * 0.82;

      const brightnessFactor = 1.04;
      data[i] = Math.min(255, data[i] * brightnessFactor);
      data[i + 1] = Math.min(255, g * brightnessFactor);
      data[i + 2] = Math.min(255, b * brightnessFactor);

      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] * 0.9 + avg * 0.1;
      data[i + 1] = data[i + 1] * 0.9 + avg * 0.1;
      data[i + 2] = data[i + 2] * 0.9 + avg * 0.1;
    }
  }
}