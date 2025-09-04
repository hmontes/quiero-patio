"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from 'react'

interface PropertySuccessPageProps {
  searchParams: Promise<{ slug?: string }> | { slug?: string }
}

export default function PropertySuccessPage({ searchParams }: PropertySuccessPageProps) {
  const [slug, setSlug] = useState<string | undefined>(undefined)

  // Extraer el slug de searchParams
  useEffect(() => {
    Promise.resolve(searchParams).then((params) => {
      setSlug(params?.slug)
    })
  }, [searchParams])

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">¡Propiedad publicada exitosamente!</CardTitle>
            <CardDescription>
              Tu propiedad ha sido publicada correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              Gracias por confiar en QuieroPatio para publicar tu propiedad. 
              Hemos recibido toda la información y está ahora disponible en nuestro portal.
            </p>
            
            {slug ? (
              <div className="flex justify-center pt-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href={`/propiedad/${slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver mi propiedad
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex justify-center pt-4">
                <Button asChild>
                  <Link href="/">
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}