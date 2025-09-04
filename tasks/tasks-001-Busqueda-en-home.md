## Archivos relevantes

- `src/app/page.tsx` - Página principal donde se implementará el buscador.
- `src/components/search-form.tsx` - Componente reutilizable para el formulario de búsqueda.
- `src/lib/zones.ts` - Utilidades para manejar las zonas geográficas de México.
- `src/app/[propertyType]-en-[operation]-en-[location]/page.tsx` - Página dinámica para mostrar resultados de búsqueda.
- `src/lib/utils.ts` - Funciones utilitarias para formateo de texto y manejo de URLs.
- `src/components/ui/select.tsx` - Componente de selección personalizado.
- `src/components/ui/input.tsx` - Componente de input personalizado.
- `src/components/ui/button.tsx` - Componente de botón personalizado.
- `src/components/location-autocomplete.tsx` - Componente para el autocompletado de ubicaciones.
- `supabase/migrations/20250819010000_add_url_slug_path_to_zones.sql` - Migración para añadir url_slug_path a las tablas de zonas.
- `supabase/migrations/20250819020000_update_fuzzy_search_function.sql` - Migración para actualizar la función de búsqueda fuzzy.

## Tareas

- [x] 1.0 Crear la estructura base del formulario de búsqueda en la página principal

  - [x] 1.1 Crear componente SearchForm con los elementos básicos del formulario
  - [x] 1.2 Implementar el diseño del formulario con tres inputs alineados (operación, tipo de propiedad, ubicación)
  - [x] 1.3 Crear componente Select para operación con opciones "Rentar" (por defecto) y "Comprar"
  - [x] 1.4 Crear componente Select para tipo de propiedad con opciones "Casa" (por defecto) y "Terreno"
  - [x] 1.5 Implementar el input de búsqueda con placeholder "Ingresa la ubicación"
  - [x] 1.6 Agregar el botón de búsqueda "Buscar"
  - [x] 1.7 Integrar el formulario en la página principal (src/app/page.tsx)

- [x] 2.0 Implementar la funcionalidad de autocompletado para ubicaciones

  - [x] 2.1 Crear esquema de base de datos en Supabase para almacenar zonas geográficas (estados, municipios, colonias)
  - [x] 2.2 Crear script seed.sql para importar datos del archivo zonas-mexico.csv a la base de datos
  - [x] 2.3 Crear función SQL en Supabase para búsqueda fuzzy de ubicaciones
  - [x] 2.4 Crear API endpoint usando Supabase para búsqueda de ubicaciones con parámetro de consulta
  - [x] 2.5 Implementar componente LocationAutocomplete para mostrar resultados
  - [x] 2.6 Mostrar resultados de búsqueda con formato "Colonia, Municipio, Estado"
  - [x] 2.7 Implementar resaltado de texto coincidente en negritas
  - [x] 2.8 Agregar límite de 10 resultados máximos con scroll
  - [x] 2.9 Implementar debounce para evitar búsquedas frecuentes (300ms recomendado)
  - [x] 2.10 Implementar cierre de resultados al hacer clic fuera del componente
  - [x] 2.11 Manejar casos especiales con caracteres no alfabéticos
  - [x] 2.12 Implementar manejo de casos sin resultados
  - [x] 2.13 Normalizar texto en búsquedas para manejar acentos y caracteres especiales (ñ, etc.)

- [x] 3.0 Implementar la navegación a resultados de búsqueda

  - [x] 3.1 Crear función para generar URLs con el formato especificado [tipo de propiedad]-en-[tipo-de-operacion]-[ubicacion]
  - [x] 3.2 Implementar lógica para convertir tipos de operación a "renta" o "venta" en URL
  - [x] 3.3 Implementar lógica para convertir tipos de propiedad a plural en URL
  - [x] 3.4 Crear función para generar slug de ubicación según nivel (estado, municipio, colonia)
  - [x] 3.5 Implementar la lógica de redirección al hacer clic en "Buscar"
  - [x] 3.6 Manejar caso especial cuando no se selecciona ubicación
  - [x] 3.7 Crear página de resultados dinámica en src/app/[propertyType]-en-[operation]-en-[location]/page.tsx

- [x] 4.0 Implementar SEO y metadatos para la página principal

  - [x] 4.1 Actualizar el título de la página a "Casas y terrenos en renta y venta a lo largo de todo México - QuieroPatio"
  - [x] 4.2 Agregar meta tag description con el contenido especificado
  - [x] 4.3 Implementar tag canonical que apunte al home del sitio
  - [x] 4.4 Crear objeto Metadata de Next.js para la página principal
