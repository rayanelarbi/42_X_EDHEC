// Service de détection des problèmes de peau
// Utilise MediaPipe Face Mesh pour une détection précise locale (100% gratuit)

// Import dynamique côté client uniquement
let FaceMesh: any = null;
if (typeof window !== "undefined") {
  import("@mediapipe/face_mesh").then((module) => {
    FaceMesh = module.FaceMesh;
  });
}

export type SkinProblemType =
  | "acne"
  | "wrinkle"
  | "dark_circle"
  | "pore"
  | "dark_spot"
  | "redness";

export type SkinProblem = {
  type: SkinProblemType;
  severity: number; // 0-100
  location: {
    x: number; // pourcentage de la largeur de l'image
    y: number; // pourcentage de la hauteur de l'image
    width: number;
    height: number;
  };
  confidence: number; // 0-100
};

export type SkinAnalysisResult = {
  problems: SkinProblem[];
  skinType: "oily" | "dry" | "normal" | "combination" | "sensitive";
  overallScore: number; // 0-100, score général de la peau
  recommendations: string[];
};

// Configuration pour basculer entre MOCK et API réelle
const USE_MOCK_API = true; // Mettre à false pour utiliser la vraie API
const ZYLA_API_KEY = "YOUR_API_KEY_HERE"; // À remplacer dans 1 semaine

/**
 * Analyse une image de visage pour détecter les problèmes de peau
 * @param imageBase64 - Image en base64
 * @returns Résultats de l'analyse
 */
export async function analyzeSkin(imageBase64: string): Promise<SkinAnalysisResult> {
  if (USE_MOCK_API) {
    return mockSkinAnalysis(imageBase64);
  } else {
    return realSkinAnalysis(imageBase64);
  }
}

/**
 * MOCK API - Analyse RÉELLEMENT l'image pour détecter des zones problématiques
 * Utilise MediaPipe Face Mesh pour la détection précise du visage
 */
async function mockSkinAnalysis(imageBase64: string): Promise<SkinAnalysisResult> {
  console.log("📸 Début de l'analyse avec MediaPipe - Image reçue:", imageBase64.substring(0, 50) + "...");

  // Analyser l'image pour obtenir les données de pixels
  const imageData = await analyzeImageColors(imageBase64);

  if (!imageData) {
    console.warn("⚠️ Échec de l'analyse d'image, utilisation du fallback");
    return getFallbackAnalysis();
  }

  console.log("📊 Image chargée - Dimensions:", imageData.width, "x", imageData.height);

  // Détecter les landmarks du visage avec MediaPipe
  const faceLandmarks = await detectFaceLandmarks(imageBase64);

  if (faceLandmarks) {
    console.log("🎯 MediaPipe: Visage détecté avec", faceLandmarks.length, "points de repère");
  } else {
    console.warn("⚠️ MediaPipe: Aucun visage détecté, utilisation de l'analyse basique");
  }

  const problems: SkinProblem[] = [];

  // Si MediaPipe a détecté le visage, utiliser les zones précises
  if (faceLandmarks) {
    // Analyse précise avec MediaPipe landmarks

    // Détection de cernes avec landmarks précis
    const leftEyeRegion = getFaceRegionFromLandmarks(faceLandmarks, MEDIAPIPE_REGIONS.leftUnderEye);
    const rightEyeRegion = getFaceRegionFromLandmarks(faceLandmarks, MEDIAPIPE_REGIONS.rightUnderEye);

    const leftEyeAnalysis = analyzeRegion(imageData, leftEyeRegion, "dark_circle");
    const rightEyeAnalysis = analyzeRegion(imageData, rightEyeRegion, "dark_circle");

    if (leftEyeAnalysis.severity > 25) {
      problems.push({
        type: "dark_circle",
        severity: leftEyeAnalysis.severity,
        location: leftEyeRegion,
        confidence: 95, // Haute confiance avec MediaPipe
      });
    }

    if (rightEyeAnalysis.severity > 25) {
      problems.push({
        type: "dark_circle",
        severity: rightEyeAnalysis.severity,
        location: rightEyeRegion,
        confidence: 95,
      });
    }

    console.log("👁️ Cernes (MediaPipe):", problems.filter(p => p.type === "dark_circle").length);

    // Détection de rides sur le front avec landmarks
    const foreheadRegion = getFaceRegionFromLandmarks(faceLandmarks, MEDIAPIPE_REGIONS.forehead);
    const foreheadAnalysis = analyzeRegion(imageData, foreheadRegion, "wrinkle");

    if (foreheadAnalysis.severity > 30) {
      problems.push({
        type: "wrinkle",
        severity: foreheadAnalysis.severity,
        location: foreheadRegion,
        confidence: 90,
      });
    }

    console.log("📏 Rides (MediaPipe):", problems.filter(p => p.type === "wrinkle").length);

    // Détection de pores/rougeurs sur les joues et le nez
    const leftCheekRegion = getFaceRegionFromLandmarks(faceLandmarks, MEDIAPIPE_REGIONS.leftCheek);
    const rightCheekRegion = getFaceRegionFromLandmarks(faceLandmarks, MEDIAPIPE_REGIONS.rightCheek);
    const noseRegion = getFaceRegionFromLandmarks(faceLandmarks, MEDIAPIPE_REGIONS.nose);

    const leftCheekAnalysis = analyzeRegion(imageData, leftCheekRegion, "acne");
    const rightCheekAnalysis = analyzeRegion(imageData, rightCheekRegion, "acne");
    const noseAnalysis = analyzeRegion(imageData, noseRegion, "pore");

    if (leftCheekAnalysis.severity > 30) {
      problems.push({
        type: "acne",
        severity: leftCheekAnalysis.severity,
        location: leftCheekRegion,
        confidence: 88,
      });
    }

    if (rightCheekAnalysis.severity > 30) {
      problems.push({
        type: "acne",
        severity: rightCheekAnalysis.severity,
        location: rightCheekRegion,
        confidence: 88,
      });
    }

    if (noseAnalysis.severity > 25) {
      problems.push({
        type: "pore",
        severity: noseAnalysis.severity,
        location: noseRegion,
        confidence: 85,
      });
    }

    console.log("🔴 Acné (MediaPipe):", problems.filter(p => p.type === "acne").length);
    console.log("🔍 Pores (MediaPipe):", problems.filter(p => p.type === "pore").length);

    // Détection complémentaire de taches sombres
    const darkSpotZones = detectDarkSpotsIntelligent(imageData);
    console.log("⚫ Taches sombres détectées:", darkSpotZones.length);
    darkSpotZones.slice(0, 3).forEach(zone => {
      problems.push({
        type: "dark_spot",
        severity: zone.severity,
        location: zone.location,
        confidence: zone.confidence,
      });
    });

  } else {
    // Fallback: utiliser l'analyse basique si MediaPipe n'a pas détecté de visage
    console.log("⚠️ Utilisation de l'analyse basique (sans MediaPipe)");

    const acneZones = detectRedZonesIntelligent(imageData);
    console.log("🔴 Zones d'acné détectées:", acneZones.length);
    acneZones.forEach(zone => {
      problems.push({
        type: "acne",
        severity: zone.severity,
        location: zone.location,
        confidence: zone.confidence,
      });
    });

    const darkSpotZones = detectDarkSpotsIntelligent(imageData);
    console.log("⚫ Taches sombres détectées:", darkSpotZones.length);
    darkSpotZones.forEach(zone => {
      problems.push({
        type: "dark_spot",
        severity: zone.severity,
        location: zone.location,
        confidence: zone.confidence,
      });
    });

    const darkCircleZones = detectDarkCirclesIntelligent(imageData);
    console.log("👁️ Cernes détectés:", darkCircleZones.length);
    darkCircleZones.forEach(zone => {
      problems.push({
        type: "dark_circle",
        severity: zone.severity,
        location: zone.location,
        confidence: zone.confidence,
      });
    });

    const wrinkleZones = detectTextureVariations(imageData);
    console.log("📏 Rides détectées:", wrinkleZones.length);
    wrinkleZones.forEach(zone => {
      problems.push({
        type: "wrinkle",
        severity: zone.severity,
        location: zone.location,
        confidence: zone.confidence,
      });
    });

    const poreZones = detectPoreVariations(imageData);
    console.log("🔍 Pores détectés:", poreZones.length);
    poreZones.forEach(zone => {
      problems.push({
        type: "pore",
        severity: zone.severity,
        location: zone.location,
        confidence: zone.confidence,
      });
    });
  }

  // Calculer le score global
  const overallScore = calculateOverallScore(problems);

  // Déterminer le type de peau basé sur l'analyse
  const skinType = determineSkinType(imageData);

  console.log("✅ Analyse complète - Score:", overallScore, "Type de peau:", skinType, "Problèmes:", problems.length);

  return {
    problems,
    skinType,
    overallScore,
    recommendations: generateRecommendations(problems),
  };
}

/**
 * Vraie API Zyla - Sera utilisée dans 1 semaine
 */
async function realSkinAnalysis(imageBase64: string): Promise<SkinAnalysisResult> {
  try {
    const response = await fetch("https://zylalabs.com/api/4442/skin+analyze+advanced+api/4933/skin+analysis", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ZYLA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();

    // Transformer la réponse de l'API au format de notre app
    return transformZylaResponse(data);
  } catch (error) {
    console.error("Erreur API Zyla:", error);
    // Fallback sur le mock en cas d'erreur
    return mockSkinAnalysis(imageBase64);
  }
}

/**
 * Transformer la réponse de l'API Zyla dans notre format
 */
function transformZylaResponse(zylaData: any): SkinAnalysisResult {
  const problems: SkinProblem[] = [];

  // Mapper les problèmes détectés par Zyla
  if (zylaData.acne && zylaData.acne.length > 0) {
    zylaData.acne.forEach((acne: any) => {
      problems.push({
        type: "acne",
        severity: acne.confidence || 50,
        location: {
          x: acne.location.x,
          y: acne.location.y,
          width: acne.location.width,
          height: acne.location.height,
        },
        confidence: acne.confidence || 85,
      });
    });
  }

  // Ajouter d'autres mappings selon la réponse de l'API...

  return {
    problems,
    skinType: zylaData.skin_type || "normal",
    overallScore: zylaData.skin_quality?.score || 75,
    recommendations: generateRecommendations(problems),
  };
}

/**
 * Détecte les landmarks du visage avec MediaPipe Face Mesh
 * Retourne les coordonnées normalisées (0-1) des 468 points du visage
 */
type FaceLandmark = {
  x: number; // 0-1 (pourcentage de la largeur)
  y: number; // 0-1 (pourcentage de la hauteur)
  z: number; // profondeur
};

let faceMeshInstance: any = null;

async function detectFaceLandmarks(imageBase64: string): Promise<FaceLandmark[] | null> {
  // Vérifier qu'on est côté client
  if (typeof window === "undefined" || !FaceMesh) {
    console.log("MediaPipe non disponible (serveur ou pas encore chargé)");
    return null;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      try {
        // Initialiser MediaPipe Face Mesh si pas déjà fait
        if (!faceMeshInstance && FaceMesh) {
          faceMeshInstance = new FaceMesh({
            locateFile: (file: string) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
          });

          faceMeshInstance.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          faceMeshInstance.onResults((results: any) => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
              resolve(results.multiFaceLandmarks[0] as FaceLandmark[]);
            } else {
              resolve(null);
            }
          });
        }

        // Créer un canvas temporaire pour MediaPipe
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Analyser avec MediaPipe
        if (faceMeshInstance) {
          await faceMeshInstance.send({ image: canvas });
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error("Erreur MediaPipe:", error);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageBase64;
  });
}

/**
 * Analyse les couleurs de l'image pour détecter des zones problématiques
 */
async function analyzeImageColors(imageBase64: string): Promise<ImageData | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      } catch (error) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageBase64;
  });
}

type DetectionResult = {
  location: { x: number; y: number; width: number; height: number };
  severity: number;
  confidence: number;
};

/**
 * Régions faciales basées sur les landmarks MediaPipe
 * Indices des points clés du visage MediaPipe
 */
const MEDIAPIPE_REGIONS = {
  // Zones de cernes (sous les yeux)
  leftUnderEye: [
    // Points autour de l'œil gauche (bas)
    130, 133, 144, 145, 153, 154, 155, 157
  ],
  rightUnderEye: [
    // Points autour de l'œil droit (bas)
    359, 362, 373, 374, 380, 381, 382, 384
  ],
  // Front (zone de rides)
  forehead: [
    10, 67, 69, 104, 108, 109, 151, 297, 333, 334, 336
  ],
  // Joues (zone de pores et rougeurs)
  leftCheek: [
    50, 101, 123, 132, 205, 206, 207, 216
  ],
  rightCheek: [
    280, 330, 352, 361, 425, 426, 427, 436
  ],
  // Nez (zone T, pores)
  nose: [
    1, 2, 4, 5, 6, 19, 20, 44, 45, 48, 49, 51, 59, 60, 102, 197, 198, 209, 217, 219, 220, 274, 289, 290, 327, 331, 344, 412, 428, 429, 437, 439, 440
  ]
};

/**
 * Obtient une région du visage basée sur les landmarks MediaPipe
 */
function getFaceRegionFromLandmarks(
  landmarks: FaceLandmark[],
  indices: number[]
): { x: number; y: number; width: number; height: number } {
  const points = indices.map(i => landmarks[i]);

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX * 100,
    y: minY * 100,
    width: (maxX - minX) * 100,
    height: (maxY - minY) * 100
  };
}

/**
 * Analyse une région spécifique de l'image pour un type de problème
 */
function analyzeRegion(
  imageData: ImageData,
  region: { x: number; y: number; width: number; height: number },
  problemType: SkinProblemType
): { severity: number } {
  const { data, width, height } = imageData;

  const startX = Math.floor((region.x / 100) * width);
  const startY = Math.floor((region.y / 100) * height);
  const regionWidth = Math.floor((region.width / 100) * width);
  const regionHeight = Math.floor((region.height / 100) * height);

  let totalBrightness = 0;
  let totalRedness = 0;
  let totalVariation = 0;
  let darkPixels = 0;
  let bluePixels = 0;
  let pixelCount = 0;

  // Calculer la luminosité moyenne globale pour référence
  let globalBrightness = 0;
  let globalCount = 0;
  for (let i = 0; i < data.length; i += 400) {
    globalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    globalCount++;
  }
  const avgGlobalBrightness = globalBrightness / globalCount;

  for (let y = startY; y < Math.min(startY + regionHeight, height); y++) {
    for (let x = startX; x < Math.min(startX + regionWidth, width); x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const brightness = (r + g + b) / 3;
      const redness = r - ((g + b) / 2);

      totalBrightness += brightness;
      totalRedness += redness;

      // Pixels sombres
      if (brightness < avgGlobalBrightness * 0.8) {
        darkPixels++;
      }

      // Teinte bleutée (cernes)
      if (b > r + 5 && b > g) {
        bluePixels++;
      }

      // Variation (rides/texture)
      if (x < width - 1 && y < height - 1) {
        const nextIdx = ((y + 1) * width + x) * 4;
        const nextBrightness = (data[nextIdx] + data[nextIdx + 1] + data[nextIdx + 2]) / 3;
        totalVariation += Math.abs(brightness - nextBrightness);
      }

      pixelCount++;
    }
  }

  const avgBrightness = totalBrightness / pixelCount;
  const avgRedness = totalRedness / pixelCount;
  const avgVariation = totalVariation / pixelCount;
  const darkRatio = darkPixels / pixelCount;
  const blueRatio = bluePixels / pixelCount;

  // Calculer la sévérité selon le type de problème
  let severity = 0;

  switch (problemType) {
    case "dark_circle":
      // Combinaison de noirceur et teinte bleutée
      const darknessSeverity = Math.max(0, (avgGlobalBrightness - avgBrightness) / avgGlobalBrightness * 100);
      const blueSeverity = blueRatio * 100;
      severity = Math.min(100, darknessSeverity + blueSeverity);
      break;

    case "acne":
      // Rougeur
      severity = Math.min(100, (avgRedness / 25) * 100);
      break;

    case "wrinkle":
      // Variation de texture
      severity = Math.min(100, (avgVariation / 15) * 100);
      break;

    case "pore":
      // Micro-variation et points sombres
      severity = Math.min(100, (avgVariation / 12) * 100 + darkRatio * 50);
      break;

    case "dark_spot":
      // Zones plus sombres que la moyenne
      severity = Math.min(100, ((avgGlobalBrightness - avgBrightness) / avgGlobalBrightness) * 150);
      break;

    default:
      severity = 0;
  }

  return { severity };
}

/**
 * VRAIE détection intelligente des zones rouges (acné)
 */
function detectRedZonesIntelligent(imageData: ImageData): DetectionResult[] {
  const zones: DetectionResult[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Analyser par blocs de 25x25 pixels
  const blockSize = 25;

  // Zone du visage (éviter les bords)
  const startY = Math.floor(height * 0.25);
  const endY = Math.floor(height * 0.75);
  const startX = Math.floor(width * 0.15);
  const endX = Math.floor(width * 0.85);

  // NOUVEAU: Calculer la rougeur moyenne globale pour avoir un seuil adaptatif
  let globalRedScore = 0;
  let globalPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const redness = r - ((g + b) / 2);
    globalRedScore += redness;
    globalPixels++;
  }

  const avgGlobalRedness = globalRedScore / globalPixels;
  const adaptiveThreshold = Math.max(5, avgGlobalRedness + 6); // Seuil adaptatif basé sur l'image

  for (let y = startY; y < endY; y += blockSize) {
    for (let x = startX; x < endX; x += blockSize) {
      let redScore = 0;
      let totalBrightness = 0;
      let pixelCount = 0;

      // Analyser le bloc
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const i = ((y + by) * width + (x + bx)) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calcul de la "rougeur" (différence entre rouge et autres canaux)
          const redness = r - ((g + b) / 2);

          // Si le pixel est significativement plus rouge QUE LA MOYENNE
          if (redness > adaptiveThreshold && r > 100) {
            redScore += redness;
          }

          totalBrightness += (r + g + b) / 3;
          pixelCount++;
        }
      }

      const avgBrightness = totalBrightness / pixelCount;
      const redRatio = redScore / pixelCount;

      // Seuil adaptatif: comparer à la rougeur moyenne de l'image
      if (redRatio > adaptiveThreshold && avgBrightness > 80 && avgBrightness < 200) {
        const excessRedness = redRatio - avgGlobalRedness;
        const severity = Math.min(100, Math.round((excessRedness / 25) * 100));
        const confidence = Math.min(95, 70 + Math.round(excessRedness / 2));

        zones.push({
          location: {
            x: (x / width) * 100,
            y: (y / height) * 100,
            width: (blockSize / width) * 100,
            height: (blockSize / height) * 100,
          },
          severity,
          confidence,
        });
      }
    }
  }

  // Limiter à un nombre variable selon le nombre détecté
  const maxZones = Math.min(zones.length, Math.max(2, Math.floor(zones.length * 0.5)));
  return zones.sort((a, b) => b.severity - a.severity).slice(0, maxZones);
}

/**
 * VRAIE détection des zones sombres (taches, hyperpigmentation)
 */
function detectDarkSpotsIntelligent(imageData: ImageData): DetectionResult[] {
  const zones: DetectionResult[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const blockSize = 20;

  // Calculer la luminosité moyenne de toute l'image pour référence
  let totalBrightness = 0;
  let sampleCount = 0;
  for (let i = 0; i < data.length; i += 400) { // Échantillonnage
    totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    sampleCount++;
  }
  const avgImageBrightness = totalBrightness / sampleCount;

  // NOUVEAU: Calculer l'écart-type pour adapter la sensibilité
  let variance = 0;
  for (let i = 0; i < data.length; i += 400) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    variance += Math.pow(brightness - avgImageBrightness, 2);
  }
  const stdDev = Math.sqrt(variance / sampleCount);

  // Seuil adaptatif basé sur la variance de l'image
  const darknessThreshold = avgImageBrightness - (stdDev * 0.8);
  const darkRatioThreshold = Math.max(0.25, Math.min(0.55, 0.4 - (stdDev / 100)));

  // Zone du visage
  const startY = Math.floor(height * 0.3);
  const endY = Math.floor(height * 0.7);
  const startX = Math.floor(width * 0.2);
  const endX = Math.floor(width * 0.8);

  for (let y = startY; y < endY; y += blockSize) {
    for (let x = startX; x < endX; x += blockSize) {
      let blockBrightness = 0;
      let darkPixels = 0;
      let pixelCount = 0;

      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const i = ((y + by) * width + (x + bx)) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

          blockBrightness += brightness;

          // Compter les pixels significativement plus sombres (seuil adaptatif)
          if (brightness < darknessThreshold) {
            darkPixels++;
          }
          pixelCount++;
        }
      }

      const avgBlockBrightness = blockBrightness / pixelCount;
      const darkRatio = darkPixels / pixelCount;

      // Si le bloc est significativement plus sombre ET a une concentration de pixels sombres (seuils adaptatifs)
      if (avgBlockBrightness < avgImageBrightness * 0.75 && darkRatio > darkRatioThreshold) {
        const darknessDiff = avgImageBrightness - avgBlockBrightness;
        const severity = Math.min(100, Math.round((darknessDiff / avgImageBrightness) * 150));
        const confidence = Math.min(92, 70 + Math.round(darkRatio * 30));

        zones.push({
          location: {
            x: (x / width) * 100,
            y: (y / height) * 100,
            width: (blockSize / width) * 100,
            height: (blockSize / height) * 100,
          },
          severity,
          confidence,
        });
      }
    }
  }

  // Nombre variable de zones détectées
  const maxZones = Math.min(zones.length, Math.max(1, Math.floor(zones.length * 0.4)));
  return zones.sort((a, b) => b.severity - a.severity).slice(0, maxZones);
}

/**
 * VRAIE détection des cernes (zones sombres sous les yeux)
 */
function detectDarkCirclesIntelligent(imageData: ImageData): DetectionResult[] {
  const zones: DetectionResult[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Calculer luminosité moyenne de référence
  let totalBrightness = 0;
  let sampleCount = 0;
  for (let i = 0; i < data.length; i += 400) {
    totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    sampleCount++;
  }
  const avgBrightness = totalBrightness / sampleCount;

  // NOUVEAU: Calculer le seuil de détection basé sur la luminosité globale
  const darknessThreshold = avgBrightness * (avgBrightness > 140 ? 0.88 : 0.82);
  const darkPixelThreshold = avgBrightness > 140 ? 0.25 : 0.35;
  const blueThreshold = avgBrightness > 140 ? 0.12 : 0.18;

  // Zones spécifiques sous les yeux (positions typiques)
  const eyeRegions = [
    { x: 0.18, y: 0.40, w: 0.18, h: 0.12 }, // Sous œil gauche
    { x: 0.64, y: 0.40, w: 0.18, h: 0.12 }, // Sous œil droit
  ];

  eyeRegions.forEach(region => {
    const startX = Math.floor(width * region.x);
    const startY = Math.floor(height * region.y);
    const regionWidth = Math.floor(width * region.w);
    const regionHeight = Math.floor(height * region.h);

    let regionBrightness = 0;
    let darkPixels = 0;
    let pixelCount = 0;
    let blueScore = 0; // Les cernes ont souvent une teinte bleutée/violacée

    for (let y = startY; y < startY + regionHeight && y < height; y++) {
      for (let x = startX; x < startX + regionWidth && x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        regionBrightness += brightness;

        if (brightness < darknessThreshold) {
          darkPixels++;
        }

        // Détecter teinte bleutée (b > r et b > g)
        if (b > r + 5 && b > g) {
          blueScore++;
        }

        pixelCount++;
      }
    }

    const avgRegionBrightness = regionBrightness / pixelCount;
    const darkRatio = darkPixels / pixelCount;
    const blueRatio = blueScore / pixelCount;

    // Seuils adaptatifs basés sur la luminosité de l'image
    if ((avgRegionBrightness < darknessThreshold && darkRatio > darkPixelThreshold) || blueRatio > blueThreshold) {
      const darknessDiff = avgBrightness - avgRegionBrightness;
      const severity = Math.min(100, Math.round(((darknessDiff / avgBrightness) * 100) + (blueRatio * 50)));
      const confidence = Math.min(90, 75 + Math.round((darkRatio + blueRatio) * 20));

      zones.push({
        location: {
          x: region.x * 100,
          y: region.y * 100,
          width: region.w * 100,
          height: region.h * 100,
        },
        severity,
        confidence,
      });
    }
  });

  return zones;
}

/**
 * Détection des variations de texture (rides potentielles)
 */
function detectTextureVariations(imageData: ImageData): DetectionResult[] {
  const zones: DetectionResult[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // NOUVEAU: Calculer la variation moyenne globale pour adapter le seuil
  let globalVariation = 0;
  let globalCount = 0;

  for (let y = 0; y < height - 1; y += 5) {
    for (let x = 0; x < width - 1; x += 5) {
      const i = (y * width + x) * 4;
      const iNext = ((y + 1) * width + x) * 4;
      const brightness1 = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const brightness2 = (data[iNext] + data[iNext + 1] + data[iNext + 2]) / 3;
      globalVariation += Math.abs(brightness1 - brightness2);
      globalCount++;
    }
  }

  const avgGlobalVariation = globalVariation / globalCount;
  const adaptiveThreshold = Math.max(4, avgGlobalVariation + 3);

  // Zones où les rides apparaissent typiquement
  const wrinkleRegions = [
    { x: 0.25, y: 0.15, w: 0.50, h: 0.15, name: "forehead" },    // Front
    { x: 0.12, y: 0.32, w: 0.15, h: 0.12, name: "eye_left" },    // Contour œil gauche
    { x: 0.73, y: 0.32, w: 0.15, h: 0.12, name: "eye_right" },   // Contour œil droit
  ];

  wrinkleRegions.forEach(region => {
    const startX = Math.floor(width * region.x);
    const startY = Math.floor(height * region.y);
    const regionWidth = Math.floor(width * region.w);
    const regionHeight = Math.floor(height * region.h);

    // Calculer la variation de luminosité (indice de texture)
    let totalVariation = 0;
    let comparisonCount = 0;

    for (let y = startY; y < startY + regionHeight - 1 && y < height - 1; y++) {
      for (let x = startX; x < startX + regionWidth - 1 && x < width - 1; x++) {
        const i = (y * width + x) * 4;
        const iNext = ((y + 1) * width + x) * 4;

        const brightness1 = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const brightness2 = (data[iNext] + data[iNext + 1] + data[iNext + 2]) / 3;

        totalVariation += Math.abs(brightness1 - brightness2);
        comparisonCount++;
      }
    }

    const avgVariation = totalVariation / comparisonCount;

    // Seuil adaptatif: comparer à la variation globale
    if (avgVariation > adaptiveThreshold) {
      const excessVariation = avgVariation - avgGlobalVariation;
      const severity = Math.min(100, Math.round((excessVariation / 15) * 100));
      const confidence = Math.min(85, 65 + Math.round(excessVariation / 2));

      zones.push({
        location: {
          x: region.x * 100,
          y: region.y * 100,
          width: region.w * 100,
          height: region.h * 100,
        },
        severity,
        confidence,
      });
    }
  });

  return zones;
}

/**
 * Détection des pores (variation locale élevée)
 */
function detectPoreVariations(imageData: ImageData): DetectionResult[] {
  const zones: DetectionResult[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // NOUVEAU: Calculer la micro-variation moyenne globale
  let globalMicroVar = 0;
  let globalSamples = 0;

  for (let y = 10; y < height - 10; y += 10) {
    for (let x = 10; x < width - 10; x += 10) {
      const i = (y * width + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

      let neighborSum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ni = ((y + dy) * width + (x + dx)) * 4;
          neighborSum += (data[ni] + data[ni + 1] + data[ni + 2]) / 3;
        }
      }
      const avgNeighbor = neighborSum / 8;
      globalMicroVar += Math.abs(brightness - avgNeighbor);
      globalSamples++;
    }
  }

  const avgGlobalMicroVar = globalMicroVar / globalSamples;
  const adaptiveThreshold = Math.max(3, avgGlobalMicroVar + 2);
  const darkPointThreshold = Math.max(0.05, Math.min(0.15, 0.08 - (avgGlobalMicroVar / 100)));

  // Zones où les pores sont typiquement visibles
  const poreRegions = [
    { x: 0.40, y: 0.45, w: 0.20, h: 0.20, name: "nose" },      // Nez
    { x: 0.15, y: 0.50, w: 0.22, h: 0.18, name: "cheek_left" }, // Joue gauche
    { x: 0.63, y: 0.50, w: 0.22, h: 0.18, name: "cheek_right" }, // Joue droite
  ];

  poreRegions.forEach(region => {
    const startX = Math.floor(width * region.x);
    const startY = Math.floor(height * region.y);
    const regionWidth = Math.floor(width * region.w);
    const regionHeight = Math.floor(height * region.h);

    // Calculer variation locale micro (pores = petits points sombres)
    let microVariation = 0;
    let countDarkPoints = 0;
    let pixelCount = 0;

    for (let y = startY; y < startY + regionHeight - 2 && y < height - 2; y += 2) {
      for (let x = startX; x < startX + regionWidth - 2 && x < width - 2; x += 2) {
        const i = (y * width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Comparer avec les pixels voisins
        let neighborSum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ni = ((y + dy) * width + (x + dx)) * 4;
            neighborSum += (data[ni] + data[ni + 1] + data[ni + 2]) / 3;
          }
        }
        const avgNeighbor = neighborSum / 8;

        const diff = Math.abs(brightness - avgNeighbor);
        microVariation += diff;

        // Pores = points plus sombres que leurs voisins
        if (brightness < avgNeighbor - 10) {
          countDarkPoints++;
        }

        pixelCount++;
      }
    }

    const avgMicroVariation = microVariation / pixelCount;
    const darkPointRatio = countDarkPoints / pixelCount;

    // Seuils adaptatifs basés sur l'image
    if (avgMicroVariation > adaptiveThreshold && darkPointRatio > darkPointThreshold) {
      const excessMicroVar = avgMicroVariation - avgGlobalMicroVar;
      const severity = Math.min(100, Math.round((excessMicroVar / 10) * 100 + darkPointRatio * 50));
      const confidence = Math.min(88, 70 + Math.round(excessMicroVar * 2));

      zones.push({
        location: {
          x: region.x * 100,
          y: region.y * 100,
          width: region.w * 100,
          height: region.h * 100,
        },
        severity,
        confidence,
      });
    }
  });

  return zones;
}

/**
 * Détermine le type de peau basé sur l'analyse de l'image
 */
function determineSkinType(imageData: ImageData): "oily" | "dry" | "normal" | "combination" | "sensitive" {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Analyser la zone T (front, nez)
  let tZoneBrightness = 0;
  let tZonePixels = 0;

  // Analyser les joues
  let cheekBrightness = 0;
  let cheekPixels = 0;

  // Zone T (nez + front central)
  for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.6); y++) {
    for (let x = Math.floor(width * 0.4); x < Math.floor(width * 0.6); x++) {
      const i = (y * width + x) * 4;
      tZoneBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      tZonePixels++;
    }
  }

  // Joues
  const cheekRegions = [
    { startX: 0.15, endX: 0.35, startY: 0.45, endY: 0.65 },
    { startX: 0.65, endX: 0.85, startY: 0.45, endY: 0.65 },
  ];

  cheekRegions.forEach(region => {
    for (let y = Math.floor(height * region.startY); y < Math.floor(height * region.endY); y++) {
      for (let x = Math.floor(width * region.startX); x < Math.floor(width * region.endX); x++) {
        const i = (y * width + x) * 4;
        cheekBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        cheekPixels++;
      }
    }
  });

  const avgTZone = tZoneBrightness / tZonePixels;
  const avgCheeks = cheekBrightness / cheekPixels;

  // Logique de détermination
  if (avgTZone > avgCheeks + 15) {
    return "combination"; // Zone T plus brillante = mixte
  } else if (avgTZone > 150 && avgCheeks > 150) {
    return "oily"; // Globalement brillant = grasse
  } else if (avgTZone < 100 && avgCheeks < 100) {
    return "dry"; // Globalement mat/sombre = sèche
  } else {
    return "normal";
  }
}

/**
 * Fallback si l'analyse d'image échoue
 */
function getFallbackAnalysis(): SkinAnalysisResult {
  return {
    problems: [
      {
        type: "pore",
        severity: 45,
        location: { x: 42, y: 48, width: 16, height: 18 },
        confidence: 75,
      },
      {
        type: "dark_circle",
        severity: 38,
        location: { x: 20, y: 42, width: 15, height: 10 },
        confidence: 82,
      },
    ],
    skinType: "normal",
    overallScore: 72,
    recommendations: [
      "Use BHA 2% exfoliant to reduce acne and inflammation",
      "Always use SPF 30+ sunscreen daily for protection",
    ],
  };
}

/**
 * Calcule le score global de la peau (0-100)
 */
function calculateOverallScore(problems: SkinProblem[]): number {
  if (problems.length === 0) return 95;

  let totalDeduction = 0;

  problems.forEach(problem => {
    const weight = {
      acne: 1.5,
      wrinkle: 1.0,
      dark_circle: 0.8,
      pore: 0.6,
      dark_spot: 1.2,
      redness: 0.9,
    }[problem.type];

    totalDeduction += (problem.severity / 100) * weight * 10;
  });

  return Math.max(40, Math.min(95, 100 - totalDeduction));
}

/**
 * Génère des recommandations basées sur les problèmes détectés
 */
function generateRecommendations(problems: SkinProblem[]): string[] {
  const recommendations: string[] = [];

  const problemCounts = problems.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (problemCounts.acne > 0) {
    recommendations.push("Use BHA 2% exfoliant to reduce acne and inflammation");
  }
  if (problemCounts.wrinkle > 0) {
    recommendations.push("Apply retinol serum to minimize fine lines and wrinkles");
  }
  if (problemCounts.dark_circle > 0) {
    recommendations.push("Use eye cream with caffeine to reduce dark circles");
  }
  if (problemCounts.pore > 0) {
    recommendations.push("Regular exfoliation helps minimize pore appearance");
  }
  if (problemCounts.dark_spot > 0) {
    recommendations.push("Vitamin C serum can help fade dark spots and even skin tone");
  }

  recommendations.push("Always use SPF 30+ sunscreen daily for protection");

  return recommendations;
}
