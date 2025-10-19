import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Créer un FormData pour l'API AILab Tools
    const formData = new FormData();

    // Convertir base64 en Blob
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');
    const blob = new Blob([binaryData], { type: 'image/jpeg' });

    formData.append('image', blob, 'image.jpg');

    // Appeler l'API AILab Tools Skin Analysis Advanced
    const response = await fetch('https://www.ailabapi.com/api/portrait/analysis/skin-analysis-advanced', {
      method: 'POST',
      headers: {
        'ailabapi-api-key': process.env.AILABTOOLS_API_KEY || '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AILab API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to analyze image', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transformer la réponse de l'API au format de notre app
    const transformedResult = transformAILabResponse(data);

    return NextResponse.json({
      success: true,
      result: transformedResult,
    });
  } catch (error) {
    console.error('Skin analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Transformer la réponse de l'API AILab Tools au format de notre app
 */
function transformAILabResponse(aiLabData: any): any {
  console.log('AILab Response:', JSON.stringify(aiLabData, null, 2));

  const problems: any[] = [];

  // Extraire les données de l'API
  const result = aiLabData.result || aiLabData.data || {};

  // Mapper les problèmes détectés par AILab
  // Seuil abaissé à 0.15 (15%) pour détecter plus de problèmes
  const detectionThreshold = 0.15;

  // Acné - Créer plusieurs zones si sévérité élevée
  if (result.acne && result.acne.value >= detectionThreshold) {
    const acneSeverity = Math.round(result.acne.value * 100);
    const acneCount = acneSeverity > 50 ? 2 : 1;

    const acneLocations = [
      { x: 25, y: 50, width: 18, height: 18 }, // Joue gauche
      { x: 57, y: 50, width: 18, height: 18 }, // Joue droite
      { x: 42, y: 40, width: 16, height: 16 }, // Nez
    ];

    for (let i = 0; i < Math.min(acneCount, acneLocations.length); i++) {
      problems.push({
        type: 'acne',
        severity: acneSeverity - (i * 5),
        location: acneLocations[i],
        confidence: Math.round((result.acne.confidence || 0.85) * 100) - (i * 3),
      });
    }
  }

  // Rides - Créer plusieurs zones
  if (result.wrinkle && result.wrinkle.value >= detectionThreshold) {
    const wrinkleSeverity = Math.round(result.wrinkle.value * 100);
    const wrinkleCount = wrinkleSeverity > 40 ? 2 : 1;

    const wrinkleLocations = [
      { x: 25, y: 15, width: 50, height: 12 }, // Front
      { x: 18, y: 38, width: 15, height: 8 },  // Contour œil gauche
      { x: 67, y: 38, width: 15, height: 8 },  // Contour œil droit
    ];

    for (let i = 0; i < Math.min(wrinkleCount, wrinkleLocations.length); i++) {
      problems.push({
        type: 'wrinkle',
        severity: wrinkleSeverity - (i * 5),
        location: wrinkleLocations[i],
        confidence: Math.round((result.wrinkle.confidence || 0.85) * 100) - (i * 3),
      });
    }
  }

  // Cernes - Toujours créer 2 zones (gauche et droite)
  if (result.dark_circle && result.dark_circle.value >= detectionThreshold) {
    const circleSeverity = Math.round(result.dark_circle.value * 100);

    const circleLocations = [
      { x: 20, y: 42, width: 15, height: 10 }, // Œil gauche
      { x: 65, y: 42, width: 15, height: 10 }, // Œil droit
    ];

    circleLocations.forEach((location, i) => {
      problems.push({
        type: 'dark_circle',
        severity: circleSeverity - (i * 2),
        location,
        confidence: Math.round((result.dark_circle.confidence || 0.88) * 100),
      });
    });
  }

  // Pores - Créer plusieurs zones
  if (result.pore && result.pore.value >= detectionThreshold) {
    const poreSeverity = Math.round(result.pore.value * 100);
    const poreCount = poreSeverity > 45 ? 2 : 1;

    const poreLocations = [
      { x: 42, y: 48, width: 16, height: 18 }, // Nez
      { x: 28, y: 52, width: 14, height: 14 }, // Joue gauche
      { x: 58, y: 52, width: 14, height: 14 }, // Joue droite
    ];

    for (let i = 0; i < Math.min(poreCount, poreLocations.length); i++) {
      problems.push({
        type: 'pore',
        severity: poreSeverity - (i * 5),
        location: poreLocations[i],
        confidence: Math.round((result.pore.confidence || 0.82) * 100) - (i * 3),
      });
    }
  }

  // Taches sombres
  if (result.dark_spot && result.dark_spot.value >= detectionThreshold) {
    const spotSeverity = Math.round(result.dark_spot.value * 100);

    problems.push({
      type: 'dark_spot',
      severity: spotSeverity,
      location: { x: 30, y: 48, width: 12, height: 12 },
      confidence: Math.round((result.dark_spot.confidence || 0.80) * 100),
    });
  }

  // Rougeurs
  if (result.redness && result.redness.value >= detectionThreshold) {
    const rednessSeverity = Math.round(result.redness.value * 100);

    problems.push({
      type: 'redness',
      severity: rednessSeverity,
      location: { x: 38, y: 54, width: 24, height: 16 },
      confidence: Math.round((result.redness.confidence || 0.78) * 100),
    });
  }

  // Si on a moins de 3 détections, ajouter des problèmes synthétiques basés sur les valeurs faibles
  if (problems.length < 3) {
    console.log('⚠️ Pas assez de détections, ajout de problèmes complémentaires');

    // Ajouter des détections pour les valeurs même très faibles
    const syntheticProblems = [];

    if (result.pore && result.pore.value > 0 && !problems.find(p => p.type === 'pore')) {
      syntheticProblems.push({
        type: 'pore',
        severity: Math.max(25, Math.round(result.pore.value * 100)),
        location: { x: 42, y: 48, width: 16, height: 18 },
        confidence: 70,
      });
    }

    if (result.dark_circle && result.dark_circle.value > 0 && problems.filter(p => p.type === 'dark_circle').length < 2) {
      syntheticProblems.push({
        type: 'dark_circle',
        severity: Math.max(20, Math.round(result.dark_circle.value * 100)),
        location: { x: 20, y: 42, width: 15, height: 10 },
        confidence: 72,
      });
    }

    if (result.wrinkle && result.wrinkle.value > 0 && !problems.find(p => p.type === 'wrinkle')) {
      syntheticProblems.push({
        type: 'wrinkle',
        severity: Math.max(22, Math.round(result.wrinkle.value * 100)),
        location: { x: 25, y: 15, width: 50, height: 12 },
        confidence: 68,
      });
    }

    problems.push(...syntheticProblems.slice(0, 3 - problems.length));
  }

  // Déterminer le type de peau
  let skinType: 'oily' | 'dry' | 'normal' | 'combination' | 'sensitive' = 'normal';

  if (result.skin_type) {
    const skinTypeValue = result.skin_type.type || result.skin_type.value;
    if (typeof skinTypeValue === 'string') {
      skinType = skinTypeValue.toLowerCase() as any;
    } else if (typeof skinTypeValue === 'number') {
      // Mapper les valeurs numériques aux types de peau
      if (skinTypeValue === 0) skinType = 'oily';
      else if (skinTypeValue === 1) skinType = 'dry';
      else if (skinTypeValue === 2) skinType = 'normal';
      else if (skinTypeValue === 3) skinType = 'combination';
      else if (skinTypeValue === 4) skinType = 'sensitive';
    }
  }

  // Calculer le score global
  const overallScore = calculateOverallScore(problems);

  return {
    problems,
    skinType,
    overallScore,
    recommendations: generateRecommendations(problems),
  };
}

/**
 * Calcule le score global de la peau (0-100)
 */
function calculateOverallScore(problems: any[]): number {
  if (problems.length === 0) return 95;

  let totalDeduction = 0;

  problems.forEach((problem: any) => {
    const weight: Record<string, number> = {
      acne: 1.5,
      wrinkle: 1.0,
      dark_circle: 0.8,
      pore: 0.6,
      dark_spot: 1.2,
      redness: 0.9,
    };

    totalDeduction += (problem.severity / 100) * (weight[problem.type] || 1.0) * 10;
  });

  return Math.max(40, Math.min(95, 100 - totalDeduction));
}

/**
 * Génère des recommandations basées sur les problèmes détectés
 */
function generateRecommendations(problems: any[]): string[] {
  const recommendations: string[] = [];

  const problemCounts = problems.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (problemCounts.acne > 0) {
    recommendations.push('Use BHA 2% exfoliant to reduce acne and inflammation');
  }
  if (problemCounts.wrinkle > 0) {
    recommendations.push('Apply retinol serum to minimize fine lines and wrinkles');
  }
  if (problemCounts.dark_circle > 0) {
    recommendations.push('Use eye cream with caffeine to reduce dark circles');
  }
  if (problemCounts.pore > 0) {
    recommendations.push('Regular exfoliation helps minimize pore appearance');
  }
  if (problemCounts.dark_spot > 0) {
    recommendations.push('Vitamin C serum can help fade dark spots and even skin tone');
  }
  if (problemCounts.redness > 0) {
    recommendations.push('Use soothing products with niacinamide to reduce redness');
  }

  recommendations.push('Always use SPF 30+ sunscreen daily for protection');

  return recommendations;
}
