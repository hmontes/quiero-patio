import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

interface DateInfoProps {
  createdAt: string
  updatedAt: string
}

export function DateInfo({ createdAt, updatedAt }: DateInfoProps) {
  // Formatear las fechas
  const createdDate = new Date(createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const updatedDate = new Date(updatedAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Fechas importantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Publicado</p>
              <p className="font-medium">{createdDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Última actualización</p>
              <p className="font-medium">{updatedDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}