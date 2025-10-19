import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Créer un FormData pour l'API AILab Tools
    const aiLabFormData = new FormData();
    aiLabFormData.append('image', image);
    aiLabFormData.append('retouch_degree', '1.0'); // Intensité du lissage (0-1.5)
    aiLabFormData.append('whitening_degree', '0.3'); // Éclaircissement léger (0-1.5)

    // Appeler l'API AILab Tools
    const response = await fetch('https://www.ailabapi.com/api/portrait/effects/smart-skin', {
      method: 'POST',
      headers: {
        'ailabapi-api-key': process.env.AILABTOOLS_API_KEY || '',
      },
      body: aiLabFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AILab API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process image', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // L'API retourne une URL temporaire de l'image traitée
    if (data.data && data.data.image_url) {
      return NextResponse.json({
        success: true,
        imageUrl: data.data.image_url,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid response from AILab API', details: data },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Beauty filter error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
