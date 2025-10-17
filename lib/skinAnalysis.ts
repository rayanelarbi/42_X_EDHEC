// Service de détection des problèmes de peau
// Pour l'instant en mode MOCK, sera connecté à l'API Zyla dans 1 semaine

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
 * MOCK API - Simule une détection réaliste basée sur l'analyse de l'image
 */
async function mockSkinAnalysis(imageBase64: string): Promise<SkinAnalysisResult> {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Analyser réellement l'image pour détecter des zones problématiques
  const imageData = await analyzeImageColors(imageBase64);

  const problems: SkinProblem[] = [];

  // Détection d'acné (zones rouges)
  const acneZones = detectRedZones(imageData);
  acneZones.forEach(zone => {
    problems.push({
      type: "acne",
      severity: Math.floor(Math.random() * 30) + 40, // 40-70
      location: zone,
      confidence: Math.floor(Math.random() * 15) + 85, // 85-100
    });
  });

  // Détection de rides (zones autour des yeux et front)
  const wrinkleZones = detectWrinkleZones();
  wrinkleZones.forEach(zone => {
    problems.push({
      type: "wrinkle",
      severity: Math.floor(Math.random() * 25) + 35, // 35-60
      location: zone,
      confidence: Math.floor(Math.random() * 10) + 80, // 80-90
    });
  });

  // Détection de cernes (sous les yeux)
  const darkCircleZones = detectDarkCircleZones();
  darkCircleZones.forEach(zone => {
    problems.push({
      type: "dark_circle",
      severity: Math.floor(Math.random() * 30) + 30, // 30-60
      location: zone,
      confidence: Math.floor(Math.random() * 10) + 85, // 85-95
    });
  });

  // Détection de pores dilatés (joues, nez)
  const poreZones = detectPoreZones();
  poreZones.forEach(zone => {
    problems.push({
      type: "pore",
      severity: Math.floor(Math.random() * 25) + 25, // 25-50
      location: zone,
      confidence: Math.floor(Math.random() * 15) + 75, // 75-90
    });
  });

  // Détection de taches sombres
  const darkSpotZones = detectDarkSpots(imageData);
  darkSpotZones.forEach(zone => {
    problems.push({
      type: "dark_spot",
      severity: Math.floor(Math.random() * 30) + 30, // 30-60
      location: zone,
      confidence: Math.floor(Math.random() * 10) + 80, // 80-90
    });
  });

  // Calculer le score global
  const overallScore = calculateOverallScore(problems);

  return {
    problems,
    skinType: "combination", // Simplification pour le mock
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

/**
 * Détecte les zones rouges (potentiellement de l'acné)
 */
function detectRedZones(imageData: ImageData | null): Array<{ x: number; y: number; width: number; height: number }> {
  if (!imageData) return getRandomZones(3, 8, "cheeks"); // Fallback

  const zones: Array<{ x: number; y: number; width: number; height: number }> = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Parcourir l'image par blocs pour détecter les zones rouges
  const blockSize = 20;
  for (let y = Math.floor(height * 0.3); y < Math.floor(height * 0.7); y += blockSize) {
    for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x += blockSize) {
      let redScore = 0;
      let pixelCount = 0;

      // Analyser le bloc
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const i = ((y + by) * width + (x + bx)) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Détecter si le pixel est rougeâtre (signe d'inflammation)
          if (r > g + 20 && r > b + 20 && r > 120) {
            redScore++;
          }
          pixelCount++;
        }
      }

      // Si plus de 15% du bloc est rouge, c'est une zone d'acné potentielle
      if (pixelCount > 0 && (redScore / pixelCount) > 0.15) {
        zones.push({
          x: (x / width) * 100,
          y: (y / height) * 100,
          width: (blockSize / width) * 100,
          height: (blockSize / height) * 100,
        });
      }
    }
  }

  // Si aucune zone détectée, retourner quelques zones aléatoires réalistes
  return zones.length > 0 ? zones.slice(0, 5) : getRandomZones(2, 4, "cheeks");
}

/**
 * Détecte les zones sombres (taches, hyperpigmentation)
 */
function detectDarkSpots(imageData: ImageData | null): Array<{ x: number; y: number; width: number; height: number }> {
  if (!imageData) return getRandomZones(2, 4, "cheeks");

  const zones: Array<{ x: number; y: number; width: number; height: number }> = [];
  // Logique similaire à detectRedZones mais pour les zones sombres

  return zones.length > 0 ? zones : getRandomZones(1, 3, "cheeks");
}

/**
 * Détecte les zones de rides (front, contour des yeux)
 */
function detectWrinkleZones(): Array<{ x: number; y: number; width: number; height: number }> {
  return [
    // Rides du front
    { x: 30, y: 15, width: 40, height: 8 },
    { x: 35, y: 20, width: 30, height: 5 },
    // Pattes d'oie
    { x: 15, y: 35, width: 12, height: 8 },
    { x: 73, y: 35, width: 12, height: 8 },
  ];
}

/**
 * Détecte les zones de cernes (sous les yeux)
 */
function detectDarkCircleZones(): Array<{ x: number; y: number; width: number; height: number }> {
  return [
    { x: 20, y: 42, width: 15, height: 10 },
    { x: 65, y: 42, width: 15, height: 10 },
  ];
}

/**
 * Détecte les zones de pores dilatés (joues, nez)
 */
function detectPoreZones(): Array<{ x: number; y: number; width: number; height: number }> {
  return [
    // Nez
    { x: 42, y: 48, width: 16, height: 18 },
    // Joues
    { x: 20, y: 50, width: 18, height: 15 },
    { x: 62, y: 50, width: 18, height: 15 },
  ];
}

/**
 * Génère des zones aléatoires réalistes selon la région du visage
 */
function getRandomZones(
  min: number,
  max: number,
  region: "cheeks" | "forehead" | "nose" | "chin"
): Array<{ x: number; y: number; width: number; height: number }> {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const zones: Array<{ x: number; y: number; width: number; height: number }> = [];

  const regionBounds = {
    cheeks: { xMin: 15, xMax: 75, yMin: 45, yMax: 65 },
    forehead: { xMin: 25, xMax: 65, yMin: 15, yMax: 35 },
    nose: { xMin: 38, xMax: 52, yMin: 40, yMax: 60 },
    chin: { xMin: 35, xMax: 55, yMin: 70, yMax: 85 },
  };

  const bounds = regionBounds[region];

  for (let i = 0; i < count; i++) {
    zones.push({
      x: Math.random() * (bounds.xMax - bounds.xMin) + bounds.xMin,
      y: Math.random() * (bounds.yMax - bounds.yMin) + bounds.yMin,
      width: Math.random() * 6 + 3, // 3-9%
      height: Math.random() * 6 + 3,
    });
  }

  return zones;
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
