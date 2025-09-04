import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte un string en un slug URL-amigable
 * @param text - Texto a convertir en slug
 * @returns Slug generado
 */
export function slugify(text: string): string {
  // Manejar casos nulos o indefinidos
  if (text === null || text === undefined) {
    return '';
  }
  
  // Convertir a string si no lo es
  const str = String(text);
  
  // Manejar strings vacíos
  if (str.length === 0) {
    return '';
  }
  
  // Mapeo de caracteres acentuados a sus equivalentes sin acento
  const accentsMap: Record<string, string> = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U',
    'ñ': 'n', 'Ñ': 'N'
  };
  
  // Reemplazar caracteres acentuados
  let result = str.replace(/[áéíóúüÁÉÍÓÚÜñÑ]/g, match => accentsMap[match] || match);
  
  // Convertir a minúsculas, trim y reemplazar espacios con guiones
  result = result
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con -
    .replace(/[^a-z0-9\-]+/g, '') // Remover caracteres no válidos (solo letras, números y guiones)
    .replace(/\-\-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-+/, '') // Remover guiones del inicio
    .replace(/-+$/, ''); // Remover guiones del final
  
  return result;
}

/**
 * Genera un slug único verificando que no exista en la base de datos
 * @param title - Título para generar el slug
 * @param checkSlugExists - Función para verificar si un slug ya existe
 * @returns Promise con el slug único generado
 */
export async function generateUniqueSlug(
  title: string, 
  checkSlugExists: (slug: string) => Promise<boolean>
): Promise<string> {
  // Generar el slug base
  let baseSlug = slugify(title);
  
  // Si el título está vacío o resulta en un slug vacío, usar un valor por defecto
  if (!baseSlug) {
    baseSlug = 'propiedad';
  }
  
  let slug = baseSlug;
  let counter = 1;
  let attempts = 0;
  const maxAttempts = 1000; // Límite para evitar bucles infinitos
  
  // Verificar si el slug ya existe y generar uno único
  while (await checkSlugExists(slug) && attempts < maxAttempts) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    attempts++;
  }
  
  // Si después de muchos intentos no se encontró un slug único, lanzar un error
  if (attempts >= maxAttempts) {
    throw new Error('No se pudo generar un slug único después de múltiples intentos');
  }
  
  return slug;
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
 * Convierte un tipo de propiedad al formato para la URL
 * @param propertyType - El tipo de propiedad (casa, terreno)
 * @returns El tipo de propiedad para la URL (casa, terreno)
 */
export function getPropertyTypeForUrl(propertyType: string): string {
  const propertyTypeMap: Record<string, string> = {
    casa: "casa",
    terreno: "terreno",
  }
  
  return propertyTypeMap[propertyType.toLowerCase()] || propertyType.toLowerCase()
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
  
  // Construye la URL con el formato correcto: [propType]-en-[operation][-en-location]
  if (location && location.url_slug_path) {
    return `/${propertyTypeSlug}-en-${operationSlug}-en-${location.url_slug_path}`
  } else {
    // Si no hay ubicación, la URL solo contiene tipo de propiedad y operación
    return `/${propertyTypeSlug}-en-${operationSlug}`
  }
}
