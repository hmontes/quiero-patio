import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeatureItemProps {
  label: string
  value: string | number | null
  badge?: boolean
  capitalize?: boolean
}

export function FeatureItem({ label, value, badge = false, capitalize = false }: FeatureItemProps) {
  // Si no hay valor, no renderizar el elemento
  if (value === null || value === undefined || value === '') {
    return null
  }
  
  // Convertir el valor a string si es necesario
  const stringValue = typeof value === 'string' ? value : String(value)
  
  // Aplicar capitalización si es necesario
  const displayValue = capitalize ? 
    stringValue.charAt(0).toUpperCase() + stringValue.slice(1) : 
    stringValue
  
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      {badge ? (
        <Badge variant="secondary" className="mt-1 capitalize">
          {displayValue}
        </Badge>
      ) : (
        <p className="font-medium">{displayValue}</p>
      )}
    </div>
  )
}