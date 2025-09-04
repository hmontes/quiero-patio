import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Home, DollarSign, Ruler, Bed, Bath } from "lucide-react"
import { FeatureItem } from "@/components/property/feature-item"
import { DateInfo } from "@/components/property/date-info"
import { PropertyLocation } from "@/components/property-location"

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
  // Coordenadas para el mapa
  latitude?: number | null
  longitude?: number | null
}

interface PropertyDetailsProps {
  property: Property
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  // Formatear el precio con separadores de miles
  const formattedPrice = new Intl.NumberFormat('es-MX').format(property.price)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Información principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Descripción */}
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {property.description}
            </p>
          </CardContent>
        </Card>
        
        {/* Características principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Características principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FeatureItem 
                  label="Tipo de operación" 
                  value={property.operation_type === 'venta' ? 'Venta' : 'Renta'} 
                  badge 
                  capitalize 
                />
                
                <FeatureItem 
                  label="Tipo de propiedad" 
                  value={property.property_type?.name} 
                  badge 
                />
                
                <div>
                  <p className="text-sm text-gray-600">Precio</p>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="font-bold text-2xl text-green-600">
                      {property.currency} {formattedPrice}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Superficies</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{property.total_surface} m²</span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{property.constructed_surface} m²</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {property.bedrooms && (
                    <div>
                      <p className="text-sm text-gray-600">Habitaciones</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Bed className="h-4 w-4 text-orange-600" />
                        <p className="font-medium text-lg">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div>
                      <p className="text-sm text-gray-600">Baños</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Bath className="h-4 w-4 text-teal-600" />
                        <p className="font-medium text-lg">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mapa de ubicación */}
            {property.latitude && property.longitude && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación en el mapa
                </h3>
                <PropertyLocation 
                  latitude={property.latitude} 
                  longitude={property.longitude} 
                  address={
                    property.neighborhood 
                      ? `${property.neighborhood.name}, ${property.municipality.name}, ${property.state.name}`
                      : property.municipality 
                      ? `${property.municipality.name}, ${property.state.name}`
                      : property.state 
                      ? property.state.name
                      : ''
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Información adicional */}
      <div className="lg:col-span-1 space-y-6">
        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {property.neighborhood && (
                  <p className="font-medium text-lg">{property.neighborhood.name}</p>
                )}
                {property.municipality && (
                  <p className="font-medium text-lg">{property.municipality.name}</p>
                )}
                {property.state && (
                  <p className="font-medium text-lg">{property.state.name}</p>
                )}
              </div>
              
              {/* Mapa de ubicación */}
              {property.latitude && property.longitude && (
                <PropertyLocation 
                  latitude={property.latitude} 
                  longitude={property.longitude} 
                  address={
                    property.neighborhood 
                      ? `${property.neighborhood.name}, ${property.municipality.name}, ${property.state.name}`
                      : property.municipality 
                      ? `${property.municipality.name}, ${property.state.name}`
                      : property.state 
                      ? property.state.name
                      : ''
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Fechas */}
        <DateInfo 
          createdAt={property.created_at} 
          updatedAt={property.updated_at} 
        />
        
        {/* Información técnica */}
        <Card>
          <CardHeader>
            <CardTitle>Información técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <FeatureItem 
                label="ID de propiedad" 
                value={property.id.toString()} 
              />
              
              <Separator />
              
              <FeatureItem 
                label="URL" 
                value={`/propiedad/${property.slug}`} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}