import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PropertyDetails } from '@/components/property/property-details'
import { getPropertyBySlug } from '@/lib/properties'
import { getPropertyTypeForUrl, getOperationForUrl } from '@/lib/utils'

interface Property {
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
}

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

// Función para generar metadatos dinámicos
export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  // Validar que el slug tenga el formato correcto (slug-id)
  const resolvedParams = await Promise.resolve(params);
  const slugParts = resolvedParams.slug.split('-')
  const idPart = slugParts[slugParts.length - 1]
  
  // Verificar que el ID sea un número válido
  if (!idPart || isNaN(parseInt(idPart))) {
    return {
      title: 'Propiedad no encontrada',
      description: 'La propiedad que buscas no existe o no está disponible',
    }
  }
  
  // Obtener la propiedad de la base de datos
  const property: Property | null = await getPropertyBySlug(resolvedParams.slug)
  
  // Si no se encuentra la propiedad, devolver metadatos por defecto
  if (!property) {
    return {
      title: 'Propiedad no encontrada',
      description: 'La propiedad que buscas no existe o no está disponible',
    }
  }
  
  // Formatear el precio con separadores de miles
  const formattedPrice = new Intl.NumberFormat('es-MX').format(property.price)
  
  // Construir el título SEO
  const propertyType = property.property_type?.name || 'Propiedad'
  const operationType = property.operation_type === 'venta' ? 'en Venta' : 'en Renta'
  const location = property.neighborhood 
    ? `${property.neighborhood.name}, ${property.municipality.name}, ${property.state.name}`
    : property.municipality 
    ? `${property.municipality.name}, ${property.state.name}`
    : property.state 
    ? property.state.name
    : ''
  
  const title = `${property.title} | ${propertyType} ${operationType} ${location ? `en ${location}` : ''} - QuieroPatio`
  
  // Construir la descripción SEO
  const description = `${propertyType} ${operationType} por ${property.currency} ${formattedPrice} en ${location}. ${property.description.substring(0, 150)}${property.description.length > 150 ? '...' : ''}`
  
  // Construir la URL canónica
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quieropatio.com'
  const canonicalUrl = `${baseUrl}/propiedad/${property.slug}`
  
  // Tipos de propiedad y operación para URLs
  const propertyTypeForUrl = getPropertyTypeForUrl(property.property_type?.name || '')
  const operationTypeForUrl = getOperationForUrl(property.operation_type)
  
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'QuieroPatio',
    },
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  // Validar que el slug tenga el formato correcto (slug-id)
  const resolvedParams = await Promise.resolve(params);
  const slugParts = resolvedParams.slug.split('-')
  const idPart = slugParts[slugParts.length - 1]
  
  // Verificar que el ID sea un número válido
  if (!idPart || isNaN(parseInt(idPart))) {
    notFound()
  }
  
  // Obtener la propiedad de la base de datos
  const property: Property | null = await getPropertyBySlug(resolvedParams.slug)
  
  // Si no se encuentra la propiedad, mostrar página 404
  if (!property) {
    notFound()
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
        <PropertyDetails property={property} />
      </div>
    </div>
  )
}