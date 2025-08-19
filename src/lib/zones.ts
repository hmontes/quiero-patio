interface Location {
  id: number
  name: string
  level: string
  full_location: string
  url_slug_path: string
  state_id: number
  municipality_id: number | null
  neighborhood_id: number | null
}

/**
 * Busca ubicaciones usando el API endpoint
 * @param query - Texto a buscar
 * @returns Promise con array de ubicaciones encontradas
 */
export async function searchLocations(query: string): Promise<Location[]> {
  try {
    const response = await fetch(`/api/search-locations?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`Error al buscar ubicaciones: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al buscar ubicaciones:', error)
    return []
  }
}