import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Appeler l'API AILab Tools pour vérifier les crédits
    const response = await fetch('https://www.ailabapi.com/api/common/query-balance', {
      method: 'GET',
      headers: {
        'ailabapi-api-key': process.env.AILABTOOLS_API_KEY || '',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AILab API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to check credits', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      credits: data,
    });
  } catch (error) {
    console.error('Check credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
