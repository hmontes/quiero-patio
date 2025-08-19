'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { searchLocations } from '@/lib/zones'

interface Location {
  id: number
  name: string
  level: string
  full_location: string
  url_slug_path: string
  state_id: number
  municipality_id: number | null
  neighborhood_id: number | null
}

interface LocationAutocompleteProps {
  onSelect: (location: Location) => void
}

export function LocationAutocomplete({ onSelect }: LocationAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Location[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastValidQuery, setLastValidQuery] = useState('') // Para almacenar la última búsqueda válida
  const containerRef = useRef<HTMLDivElement>(null)

  // Verificar si un query contiene caracteres alfabéticos
  const hasAlphabeticCharacters = (text: string) => {
    return /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(text);
  }

  // Extraer solo las letras del query para resaltar coincidencias
  const extractLettersForHighlight = (query: string) => {
    // Extraer solo caracteres alfabéticos (incluyendo acentuados y ñ/Ñ)
    return query.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  }

  // Implementar debounce
  useEffect(() => {
    // Si el query está vacío, limpiar resultados y cerrar
    if (query.length === 0) {
      setResults([])
      setIsOpen(false)
      setLastValidQuery('')
      return
    }

    // Verificar si el query tiene caracteres alfabéticos
    const hasLetters = hasAlphabeticCharacters(query);

    // Si no hay letras, mantener los resultados actuales
    if (!hasLetters) {
      // Mantener los resultados abiertos pero sin hacer nueva búsqueda
      if (results.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    // Si el query es una extensión del último query válido (solo se agregaron caracteres especiales al final)
    // no hacer una nueva búsqueda
    if (lastValidQuery && query.startsWith(lastValidQuery) && 
        !hasAlphabeticCharacters(query.substring(lastValidQuery.length))) {
      // Mantener los resultados actuales
      setIsOpen(true);
      return;
    }

    // Si llegamos aquí, necesitamos hacer una nueva búsqueda
    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await searchLocations(query)
        setResults(data)
        setIsOpen(true)
        // Actualizar el último query válido solo si tiene letras
        if (hasAlphabeticCharacters(query)) {
          setLastValidQuery(query)
        }
      } catch (error) {
        console.error('Error al buscar ubicaciones:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms de debounce

    return () => clearTimeout(timeoutId)
  }, [query, lastValidQuery, results.length])

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Resaltar texto coincidente en negritas
  const highlightMatch = (text: string, query: string) => {
    // Extraer solo las letras para la comparación
    const lettersOnlyQuery = extractLettersForHighlight(query);
    
    if (!lettersOnlyQuery) return text;
    
    // Escapar caracteres especiales en la consulta
    const escapedQuery = lettersOnlyQuery.replace(/[.*+?^${}()|[\\]]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return text.replace(regex, '<span class="font-bold">$1</span>');
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        type="text"
        placeholder="Ingresa la ubicación"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Buscando...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No se encontraron resultados</div>
          ) : (
            <div className="py-1">
              {results.map((location) => (
                <button
                  key={`${location.level}-${location.id}`}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    onSelect(location)
                    setQuery(location.full_location)
                    setIsOpen(false)
                    setLastValidQuery('') // Resetear al seleccionar
                  }}
                >
                  <span 
                    dangerouslySetInnerHTML={{ 
                      __html: highlightMatch(location.full_location, query) 
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}