"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Eye } from "lucide-react"
import Link from "next/link"
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPropertyBySlug } from '@/lib/properties'

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

interface PropertySuccessPageProps {
  searchParams: { slug?: string }
}

export default function PropertySuccessPage({ searchParams }: PropertySuccessPageProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [propertyError, setPropertyError] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [redirecting, setRedirecting] = useState(false)

  // Si se proporciona un slug, intentar obtener los datos de la propiedad
  useEffect(() => {
    if (searchParams?.slug) {
      getPropertyBySlug(searchParams.slug)
        .then(data => {
          setProperty(data)
        })
        .catch(error => {
          console.error('Error al obtener la propiedad:', error)
          setPropertyError(true)
        })
    }
  }, [searchParams?.slug])

  // Si se esperaba una propiedad pero no se pudo obtener, mostrar error
  useEffect(() => {
    if (searchParams?.slug && (!property || propertyError)) {
      notFound()
    }
  }, [searchParams?.slug, property, propertyError])

  // Lógica de redirección automática
  useEffect(() => {
    if (property && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    } else if (property && countdown === 0 && !redirecting) {
      setRedirecting(true)
      window.location.href = `/propiedad/${property.slug}`
    }
  }, [countdown, property, redirecting])

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">¡Propiedad publicada exitosamente!</CardTitle>
            <CardDescription>
              Tu propiedad ha sido publicada correctamente y ya está disponible para que los interesados puedan verla.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              Gracias por confiar en QuieroPatio para publicar tu propiedad. 
              Hemos recibido toda la información y está ahora disponible en nuestro portal.
            </p>
            
            {property && (
              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="text-xl">Detalles de tu propiedad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Título</h3>
                      <p className="text-gray-700">{property.title}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Tipo de propiedad</h3>
                      <p className="text-gray-700">{property.property_type?.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Operación</h3>
                      <p className="text-gray-700">{property.operation_type === 'venta' ? 'Venta' : 'Renta'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Precio</h3>
                      <p className="text-gray-700">
                        {property.currency} {new Intl.NumberFormat('es-MX').format(property.price)}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Superficie total</h3>
                      <p className="text-gray-700">{property.total_surface} m²</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Superficie construida</h3>
                      <p className="text-gray-700">{property.constructed_surface} m²</p>
                    </div>
                    {property.bedrooms && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Habitaciones</h3>
                        <p className="text-gray-700">{property.bedrooms}</p>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Baños</h3>
                        <p className="text-gray-700">{property.bathrooms}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">Ubicación</h3>
                    <p className="text-gray-700">
                      {property.neighborhood ? `${property.neighborhood.name}, ` : ''}
                      {property.municipality?.name}, {property.state?.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">¿Qué sigue?</h3>
              <ul className="text-green-700 text-left space-y-1">
                <li>• Tu propiedad será revisada por nuestro equipo</li>
                <li>• Recibirás notificaciones sobre interesados</li>
                <li>• Podrás editar la información en cualquier momento</li>
              </ul>
            </div>
            
            {property && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-800 font-medium">
                  ¡Tu propiedad ya está disponible para que todos puedan verla!
                </p>
              </div>
            )}
            
            {property && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800">
                  Redirigiendo a tu propiedad en <span className="font-bold">{countdown}</span> segundos...
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Puedes cancelar la redirección haciendo clic en cualquiera de los botones de abajo
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Link>
              </Button>
              {property && (
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={redirecting}
                >
                  <Link href={`/propiedad/${property.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver mi propiedad
                  </Link>
                </Button>
              )}
            </div>
            
            {property && (
              <div className="pt-6">
                <h3 className="text-center text-gray-700 font-medium mb-4">¿Qué te gustaría hacer ahora?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link href={`/propiedad/${property.slug}/editar`}>
                      <span className="mr-2">✏️</span>
                      Editar propiedad
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/publicar-propiedad">
                      <span className="mr-2">➕</span>
                      Publicar otra propiedad
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}