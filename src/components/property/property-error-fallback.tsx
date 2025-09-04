import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

export function PropertyErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <AlertCircle className="mx-auto h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Error al cargar la propiedad</h1>
        <p className="text-lg text-gray-600 mb-8">
          Ocurrió un error al intentar cargar los detalles de la propiedad. Por favor, inténtalo de nuevo.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={onRetry} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}