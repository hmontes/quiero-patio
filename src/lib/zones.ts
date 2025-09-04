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

/**
 * Verifica si un municipio tiene colonias asociadas
 * @param municipalityId - ID del municipio a verificar
 * @returns Promise con boolean indicando si tiene colonias
 */
export async function municipalityHasNeighborhoods(municipalityId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/municipality-has-neighborhoods?municipalityId=${municipalityId}`)
    
    if (!response.ok) {
      throw new Error(`Error al verificar colonias del municipio: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.hasNeighborhoods
  } catch (error) {
    console.error('Error al verificar colonias del municipio:', error)
    // En caso de error, asumimos que tiene colonias para no bloquear la publicación
    return true
  }
}