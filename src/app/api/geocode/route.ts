import { NextResponse } from 'next/server';

// Using OpenStreetMap Nominatim API for geocoding
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  // Validate that address parameter is provided
  if (!address) {
    return NextResponse.json(
      { error: 'Parámetro "address" es requerido' },
      { status: 400 }
    );
  }

  try {
    // Make request to Nominatim API
    const response = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1&countrycodes=MX`,
      {
        headers: {
          'User-Agent': 'QuieroPatio/1.0 (https://quieropatio.com)', // Required by Nominatim terms
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if any results were found
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron resultados para la dirección proporcionada' },
        { status: 404 }
      );
    }

    // Extract coordinates from first result
    const result = data[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    // Return coordinates
    return NextResponse.json({
      lat,
      lng,
      display_name: result.display_name,
      boundingbox: result.boundingbox,
    });
  } catch (error) {
    console.error('Error geocoding address:', error);
    return NextResponse.json(
      { error: 'Error al geocodificar la dirección' },
      { status: 500 }
    );
  }
}