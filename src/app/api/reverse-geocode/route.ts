import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Configurar el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Using OpenStreetMap Nominatim API for reverse geocoding
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // Validate that lat and lng parameters are provided
  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Parámetros "lat" y "lng" son requeridos' },
      { status: 400 }
    );
  }

  try {
    // Make request to Nominatim Reverse API
    const response = await fetch(
      `${NOMINATIM_REVERSE_URL}?lat=${lat}&lon=${lng}&format=json&addressdetails=1&countrycodes=MX`,
      {
        headers: {
          'User-Agent': 'QuieroPatio/1.0 (https://quieropatio.com)', // Required by Nominatim terms
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim Reverse API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if a result was found
    if (!data || !data.address) {
      return NextResponse.json(
        { error: 'No se encontró una dirección para las coordenadas proporcionadas' },
        { status: 404 }
      );
    }

    // Extract address components
    const address = data.address;
    const displayName = data.display_name;

    // Try to extract state, municipality, and neighborhood information
    // Note: OSM address structure can vary, so we need to check multiple possible fields
    const stateName = address.state || address.province || null;
    const municipalityName = address.city || address.town || address.village || address.municipality || null;
    const neighborhoodName = address.neighbourhood || address.suburb || address.quarter || null;

    // Create a simplified address string
    const addressParts = [neighborhoodName, municipalityName, stateName].filter(part => part !== null);
    const formattedAddress = addressParts.join(', ') || displayName;

    // Search for matching locations in our database
    let stateId = null;
    let municipalityId = null;
    let neighborhoodId = null;

    // Search for state
    if (stateName) {
      const { data: stateData, error: stateError } = await supabase
        .from('states')
        .select('id')
        .ilike('name', stateName)
        .single();

      if (!stateError && stateData) {
        stateId = stateData.id;
      }
    }

    // Search for municipality if state was found
    if (stateId && municipalityName) {
      const { data: municipalityData, error: municipalityError } = await supabase
        .from('municipalities')
        .select('id')
        .eq('state_id', stateId)
        .ilike('name', municipalityName)
        .single();

      if (!municipalityError && municipalityData) {
        municipalityId = municipalityData.id;
      }
    }

    // Search for neighborhood if municipality was found
    if (municipalityId && neighborhoodName) {
      const { data: neighborhoodData, error: neighborhoodError } = await supabase
        .from('neighborhoods')
        .select('id')
        .eq('municipality_id', municipalityId)
        .ilike('name', neighborhoodName)
        .single();

      if (!neighborhoodError && neighborhoodData) {
        neighborhoodId = neighborhoodData.id;
      }
    }

    // Prepare location data
    const locationData = {
      state: stateName,
      municipality: municipalityName,
      neighborhood: neighborhoodName,
      full_address: formattedAddress,
      state_id: stateId,
      municipality_id: municipalityId,
      neighborhood_id: neighborhoodId
    };

    return NextResponse.json({
      address: formattedAddress,
      location: locationData,
      raw_data: data // Include raw data for debugging
    });
  } catch (error) {
    console.error('Error reverse geocoding coordinates:', error);
    return NextResponse.json(
      { error: 'Error al obtener la dirección desde las coordenadas' },
      { status: 500 }
    );
  }
}