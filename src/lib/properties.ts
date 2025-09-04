import { createClient } from '@supabase/supabase-js'

// Configurar el cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Property {
  id: number
  operation_type: string
  title: string
  description: string
  price: number
  currency: string
  total_surface: number
  constructed_surface: number
  bathrooms: number | null
  bedrooms: number | null
  slug: string
  created_at: string
  updated_at: string
  property_type: {
    name: string
  }
  state: {
    name: string
  }
  municipality: {
    name: string
  }
  neighborhood: {
    name: string
  } | null
  // Coordenadas para el mapa
  latitude?: number | null
  longitude?: number | null
}

/**
 * Obtiene una propiedad por su slug
 * @param slug - Slug de la propiedad a buscar
 * @returns Promise con los datos de la propiedad o null si no se encuentra
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    // Validar que el slug tenga el formato correcto (slug-id)
    const slugParts = slug.split('-')
    const idPart = slugParts[slugParts.length - 1]
    
    // Verificar que el ID sea un número válido
    if (!idPart || isNaN(parseInt(idPart))) {
      console.warn('ID de propiedad no válido en el slug:', slug)
      return null
    }
    
    const id = parseInt(idPart)
    
    // Obtener la propiedad de la base de datos por ID
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id,
        operation_type,
        title,
        description,
        price,
        currency,
        total_surface,
        constructed_surface,
        bathrooms,
        bedrooms,
        slug,
        created_at,
        updated_at,
        latitude,
        longitude,
        property_type:property_types(name),
        state:states(name),
        municipality:municipalities(name),
        neighborhood:neighborhoods(name)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error al obtener la propiedad por slug:', error)
      return null
    }
    
    // Si no se encuentra la propiedad, retornar null
    if (!data) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error inesperado al obtener la propiedad por slug:', error)
    return null
  }
}

/**
 * Obtiene una propiedad por su ID
 * @param id - ID de la propiedad a buscar
 * @returns Promise con los datos de la propiedad o null si no se encuentra
 */
export async function getPropertyById(id: number): Promise<Property | null> {
  try {
    // Validar que el ID sea un número válido
    if (isNaN(id) || id <= 0) {
      console.warn('ID de propiedad no válido:', id)
      return null
    }
    
    // Obtener la propiedad de la base de datos por ID
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id,
        operation_type,
        title,
        description,
        price,
        currency,
        total_surface,
        constructed_surface,
        bathrooms,
        bedrooms,
        slug,
        created_at,
        updated_at,
        latitude,
        longitude,
        property_type:property_types(name),
        state:states(name),
        municipality:municipalities(name),
        neighborhood:neighborhoods(name)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error al obtener la propiedad por ID:', error)
      return null
    }
    
    // Si no se encuentra la propiedad, retornar null
    if (!data) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error inesperado al obtener la propiedad por ID:', error)
    return null
  }
}