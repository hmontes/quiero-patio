import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte un tipo de propiedad al formato plural para la URL
 * @param propertyType - El tipo de propiedad (casa, terreno)
 * @returns El tipo de propiedad en plural (casas, terrenos)
 */
export function getPropertyTypeForUrl(propertyType: string): string {
  const pluralMap: Record<string, string> = {
    casa: "casas",
    terreno: "terrenos",
    // Se pueden añadir más tipos de propiedad según se necesiten
  }
  
  return pluralMap[propertyType.toLowerCase()] || propertyType.toLowerCase()
}

/**
 * Convierte un tipo de operación al formato para la URL
 * @param operation - El tipo de operación (rentar, comprar)
 * @returns El tipo de operación para la URL (renta, venta)
 */
export function getOperationForUrl(operation: string): string {
  const operationMap: Record<string, string> = {
    rentar: "renta",
    comprar: "venta",
  }
  
  return operationMap[operation.toLowerCase()] || operation.toLowerCase()
}

/**
 * Genera una URL para los resultados de búsqueda
 * @param propertyType - El tipo de propiedad (casa, terreno)
 * @param operation - El tipo de operación (rentar, comprar)
 * @param location - La ubicación seleccionada (puede ser null si no se seleccionó)
 * @returns La URL generada para los resultados de búsqueda
 */
export function generateSearchResultsUrl(
  propertyType: string,
  operation: string,
  location: { 
    url_slug_path: string;
  } | null
): string {
  const propertyTypeSlug = getPropertyTypeForUrl(propertyType)
  const operationSlug = getOperationForUrl(operation)
  
  // Construye la URL
  if (location && location.url_slug_path) {
    return `/${propertyTypeSlug}/en/${operationSlug}/${location.url_slug_path}`
  } else {
    // Si no hay ubicación, la URL solo contiene tipo de propiedad y operación
    return `/${propertyTypeSlug}/en/${operationSlug}`
  }
}
