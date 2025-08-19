import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Configurar el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Validar que se haya proporcionado un parámetro de consulta
  if (!query) {
    return NextResponse.json(
      { error: 'Parámetro de consulta "q" es requerido' },
      { status: 400 }
    )
  }

  try {
    // Llamar a la función search_locations que creamos en Supabase
    const { data, error } = await supabase.rpc('search_locations', {
      query: query
    })

    if (error) {
      console.error('Error al buscar ubicaciones:', error)
      return NextResponse.json(
        { error: 'Error al buscar ubicaciones' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error inesperado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}