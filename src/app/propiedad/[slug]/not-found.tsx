import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <Search className="mx-auto h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Propiedad no encontrada</h1>
        <p className="text-xl text-gray-600 mb-8">
          Lo sentimos, no pudimos encontrar la propiedad que estás buscando.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <Link href="/casas-en-renta">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Ver propiedades
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}