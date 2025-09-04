import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Configurar el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const municipalityId = searchParams.get('municipalityId')

  // Validar que se haya proporcionado un ID de municipio
  if (!municipalityId) {
    return NextResponse.json(
      { error: 'Parámetro "municipalityId" es requerido' },
      { status: 400 }
    )
  }

  try {
    // Verificar si el municipio tiene colonias asociadas
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('id')
      .eq('municipality_id', municipalityId)
      .limit(1)

    if (error) {
      console.error('Error al verificar colonias del municipio:', error)
      return NextResponse.json(
        { error: 'Error al verificar colonias del municipio' },
        { status: 500 }
      )
    }

    // Si hay al menos una colonia, devolver true, de lo contrario false
    const hasNeighborhoods = data.length > 0

    return NextResponse.json({ hasNeighborhoods })
  } catch (error) {
    console.error('Error inesperado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}