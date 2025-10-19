import { SkinProblem, SkinProblemType } from "./skinAnalysis";
import { ProductKey } from "@/store/useAppStore";

// Import dynamique de MediaPipe
let FaceDetection: any = null;
let FilesetResolver: any = null;

if (typeof window !== "undefined") {
  import("@mediapipe/tasks-vision").then((module) => {
    FaceDetection = module.FaceDetector;
    FilesetResolver = module.FilesetResolver;
  });
}

export async function simulateAfter(
  source: HTMLImageElement | HTMLCanvasElement,
  productKey: ProductKey,
  skinProblems?: SkinProblem[]
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context non disponible");

  canvas.width = source.width;
  canvas.height = source.height;
  ctx.drawImage(source, 0, 0);

  try {
    console.log("🎨 Utilisation de l'API AILab Tools pour le lissage de peau...");

    // Convertir le canvas en blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      }, 'image/jpeg', 0.95);
    });

    // Créer un FormData pour envoyer à notre API
    const formData = new FormData();
    formData.append('image', blob, 'photo.jpg');

    // Appeler notre API route
    const response = await fetch('/api/beauty-filter', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.imageUrl) {
      // Charger l'image retouchée
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load processed image"));
        img.src = data.imageUrl;
      });

      // Dessiner l'image retouchée sur le canvas
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      console.log("✅ Image traitée avec succès par AILab Tools");
    } else {
      throw new Error("Invalid response from API");
    }
  } catch (error) {
    console.error("❌ Erreur AILab API, utilisation du filtre local:", error);

    // Fallback : utiliser le filtre local si l'API échoue
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let faceMask: Float32Array | null = null;

    try {
      faceMask = await detectFaceWithMediaPipe(source, canvas.width, canvas.height);
      console.log("✅ Visage détecté avec MediaPipe");
    } catch (error) {
      console.log("⚠️ MediaPipe non disponible, utilisation de la détection de peau classique");
      faceMask = detectSkinTone(data, canvas.width, canvas.height);
    }

    applyGentleSkinSmoothing(data, canvas.width, canvas.height, faceMask);
    ctx.putImageData(imageData, 0, 0);

    const blurredCanvas = document.createElement("canvas");
    const blurredCtx = blurredCanvas.getContext("2d");
    if (blurredCtx) {
      blurredCanvas.width = canvas.width;
      blurredCanvas.height = canvas.height;
      blurredCtx.filter = "blur(2px)";
      blurredCtx.drawImage(canvas, 0, 0);
      blurredCtx.filter = "none";

      const blurredData = blurredCtx.getImageData(0, 0, canvas.width, canvas.height);
      const finalData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < finalData.data.length; i += 4) {
        const pixelIndex = i / 4;
        const maskValue = faceMask[pixelIndex];
        const blendFactor = maskValue * 0.4;
        finalData.data[i] = finalData.data[i] * (1 - blendFactor) + blurredData.data[i] * blendFactor;
        finalData.data[i + 1] = finalData.data[i + 1] * (1 - blendFactor) + blurredData.data[i + 1] * blendFactor;
        finalData.data[i + 2] = finalData.data[i + 2] * (1 - blendFactor) + blurredData.data[i + 2] * blendFactor;
      }

      ctx.putImageData(finalData, 0, 0);
    }
  }

  // Ajouter le watermark
  ctx.font = "16px Inter, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.lineWidth = 2;
  const text = "AI Enhanced";
  const textWidth = ctx.measureText(text).width;
  const x = canvas.width - textWidth - 15;
  const y = canvas.height - 15;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);

  return canvas;
}

/**
 * Détecte le visage avec MediaPipe Face Detection
 * Retourne un masque du visage (1 = visage, 0 = autre)
 */
async function detectFaceWithMediaPipe(
  source: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number
): Promise<Float32Array> {
  if (!FaceDetection || !FilesetResolver) {
    throw new Error("MediaPipe not loaded");
  }

  // Créer le détecteur de visage
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const faceDetector = await FaceDetection.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
      delegate: "GPU"
    },
    runningMode: "IMAGE"
  });

  // Détecter le visage
  const detections = faceDetector.detect(source);

  // Créer le masque
  const mask = new Float32Array(width * height);

  if (detections.detections.length > 0) {
    const detection = detections.detections[0];
    const box = detection.boundingBox;

    // Convertir les coordonnées relatives en pixels
    const x = Math.floor(box.originX);
    const y = Math.floor(box.originY);
    const w = Math.floor(box.width);
    const h = Math.floor(box.height);

    // Agrandir légèrement la zone (15% de chaque côté)
    const expandX = Math.floor(w * 0.15);
    const expandY = Math.floor(h * 0.15);
    const startX = Math.max(0, x - expandX);
    const startY = Math.max(0, y - expandY);
    const endX = Math.min(width, x + w + expandX);
    const endY = Math.min(height, y + h + expandY);

    // Remplir le masque avec un gradient elliptique pour un effet naturel
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const radiusX = (endX - startX) / 2;
    const radiusY = (endY - startY) / 2;

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const idx = py * width + px;

        // Distance normalisée du centre (forme elliptique)
        const dx = (px - centerX) / radiusX;
        const dy = (py - centerY) / radiusY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gradient doux (1 au centre, 0 aux bords)
        if (dist < 1.0) {
          mask[idx] = 1.0 - (dist * dist); // Gradient quadratique pour plus de douceur
        } else {
          mask[idx] = 0.0;
        }
      }
    }
  }

  faceDetector.close();
  return mask;
}

/**
 * Détecte les zones de peau dans l'image
 * Retourne un masque binaire (1 = peau, 0 = autre)
 */
function detectSkinTone(data: Uint8ClampedArray, width: number, height: number): Float32Array {
  const mask = new Float32Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Algorithme de détection de peau (RGB)
    const maxRG = Math.max(r, g);
    const minRG = Math.min(r, g);
    const diff = Math.abs(r - g);

    // Critères pour identifier la peau
    const isSkin =
      r > 95 && g > 40 && b > 20 &&
      maxRG - minRG > 15 &&
      r > g && r > b &&
      diff > 15;

    mask[i / 4] = isSkin ? 1.0 : 0.0;
  }

  return mask;
}

/**
 * Lissage doux et naturel de la peau
 * Ajuste légèrement la luminosité sans modifier les couleurs
 */
function applyGentleSkinSmoothing(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  skinMask: Float32Array
) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const maskValue = skinMask[y * width + x];

      if (maskValue < 0.1) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Légère augmentation de la luminosité (5% max)
      const brightness = 1.0 + (0.05 * maskValue);

      data[idx] = Math.min(255, r * brightness);
      data[idx + 1] = Math.min(255, g * brightness);
      data[idx + 2] = Math.min(255, b * brightness);
    }
  }
}

/**
 * Applique un effet "soft glow" pour une peau plus lisse et lumineuse
 */
function applySoftGlow(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Augmenter légèrement la luminosité dans les tons moyens
    const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    // Courbe de correction douce (S-curve)
    let factor = 1.0;
    if (luminance > 0.3 && luminance < 0.7) {
      factor = 1.08; // Éclaircir les tons moyens
    } else if (luminance >= 0.7) {
      factor = 1.03; // Légèrement éclaircir les hautes lumières
    }

    data[i] = Math.min(255, r * factor);
    data[i + 1] = Math.min(255, g * factor);
    data[i + 2] = Math.min(255, b * factor);
  }
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
    // Éclaircir et uniformiser - Effet anti-taches et éclat
    const brightness = 1 + (0.18 * intensity); // Augmenté pour plus d'effet
    const rednessReduction = 0.80 + (0.20 * (1 - intensity)); // Plus agressif

    // Réduire les rougeurs
    let newR = r * rednessReduction * brightness;
    let newG = g * brightness;
    let newB = b * brightness;

    // Uniformisation de teint plus marquée
    const avg = (newR + newG + newB) / 3;
    const uniformFactor = 0.2 * intensity; // Plus d'uniformisation
    newR = newR * (1 - uniformFactor) + avg * uniformFactor;
    newG = newG * (1 - uniformFactor) + avg * uniformFactor;
    newB = newB * (1 - uniformFactor) + avg * uniformFactor;

    // Légère correction vers les tons plus froids (peau plus saine)
    data[idx] = Math.min(255, newR * 0.98);
    data[idx + 1] = Math.min(255, newG * 1.02);
    data[idx + 2] = Math.min(255, newB * 1.02);
  } else {
    // Apaiser et hydrater - Effet anti-rougeurs
    const brightness = 1 + (0.12 * intensity);
    const rednessReduction = 0.75 + (0.25 * (1 - intensity)); // Encore plus agressif sur les rougeurs

    // Réduire fortement les rougeurs
    let newR = r * rednessReduction * brightness;
    let newG = g * brightness * 1.08; // Augmenter légèrement le vert pour compenser
    let newB = b * brightness * 1.05;

    // Uniformisation douce
    const avg = (newR + newG + newB) / 3;
    const uniformFactor = 0.18 * intensity;
    newR = newR * (1 - uniformFactor) + avg * uniformFactor;
    newG = newG * (1 - uniformFactor) + avg * uniformFactor;
    newB = newB * (1 - uniformFactor) + avg * uniformFactor;

    data[idx] = Math.min(255, newR);
    data[idx + 1] = Math.min(255, newG);
    data[idx + 2] = Math.min(255, newB);
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
    acne: { strength: productKey === "duo-eclat" ? 1.5 : 1.2 }, // Augmenté
    wrinkle: { strength: 1.0 }, // Augmenté
    dark_circle: { strength: 1.3 }, // Augmenté
    pore: { strength: productKey === "duo-eclat" ? 1.4 : 1.1 }, // Augmenté
    dark_spot: { strength: productKey === "duo-eclat" ? 1.6 : 1.2 }, // Augmenté
    redness: { strength: productKey === "repairing-serum" ? 1.5 : 1.1 }, // Augmenté
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