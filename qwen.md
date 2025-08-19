# Quiero Patio - Portal Inmobiliario

## Descripción

Quiero Patio es un portal inmobiliario enfocado en casas donde:

- Los usuarios pueden publicar propiedades
- Los corredores inmobiliarios pueden participar en el proceso
- Al enviar el formulario de publicación, los datos llegan al vendedor

## Funcionalidades principales

1. Búsqueda de propiedades
2. Publicación de propiedades (usuarios y corredores)
3. Sistema de envío de datos al vendedor

## Tecnología

- Next.js 15
- TailwindCSS
- Shadcn
- Supabase (para backend y base de datos)

## Progreso del desarrollo

### 1. Implementación del buscador en la página principal

Hemos implementado la funcionalidad de búsqueda en la página principal con las siguientes características:

#### Estructura base del formulario
- Componente `SearchForm` con tres inputs alineados (operación, tipo de propiedad, ubicación)
- Select para operación con opciones "Rentar" (por defecto) y "Comprar"
- Select para tipo de propiedad con opciones "Casa" (por defecto) y "Terreno"
- Input de búsqueda con placeholder "Ingresa la ubicación"
- Botón de búsqueda "Buscar"

#### Autocompletado de ubicaciones
- Esquema de base de datos en Supabase para zonas geográficas (estados, municipios, colonias)
- Función SQL en Supabase para búsqueda fuzzy de ubicaciones con normalización de texto
- API endpoint usando Supabase para búsqueda de ubicaciones con parámetro de consulta
- Componente `LocationAutocomplete` para mostrar resultados con las siguientes características:
  - Búsqueda con debounce (300ms) para evitar búsquedas frecuentes
  - Formato de resultados "Colonia, Municipio, Estado"
  - Resaltado de texto coincidente en negritas
  - Límite de 10 resultados máximos con scroll
  - Cierre de resultados al hacer clic fuera del componente
  - Manejo de caracteres especiales (acentos, ñ) en la búsqueda
  - Manejo de casos especiales con caracteres no alfabéticos

#### Normalización de texto en búsquedas
- Implementación de normalización para manejar acentos y caracteres especiales como la "ñ"
- La búsqueda funciona correctamente incluso cuando hay diferencias en acentos
- Ejemplo: Buscar "ciudad de mex" encuentra "Ciudad de México"

#### Manejo de casos especiales
- Cuando el usuario ingresa caracteres no alfabéticos al final de la búsqueda, 
  el selector no se cierra y mantiene los resultados de la última búsqueda válida
- Solo se realizan nuevas búsquedas cuando se agregan letras después de caracteres especiales

## Próximos pasos

### 3. Implementar la navegación a resultados de búsqueda
- Crear función para generar URLs con el formato especificado
- Implementar lógica para convertir tipos de operación y propiedad a formato URL
- Crear función para generar slug de ubicación según nivel (estado, municipio, colonia)
- Implementar la lógica de redirección al hacer clic en "Buscar"
- Manejar caso especial cuando no se selecciona ubicación
- Crear página de resultados dinámica

### 4. Implementar SEO y metadatos para la página principal
- Actualizar el título de la página
- Agregar meta tag description
- Implementar tag canonical que apunte al home del sitio
- Crear objeto Metadata de Next.js para la página principal

### 5. Crear página de resultados de búsqueda dummy
- Crear estructura de página dinámica para resultados de búsqueda
- Implementar componente que muestre el tipo de propiedad, operación y ubicación
- Manejar diferentes niveles de ubicación
- Implementar lógica para parsear parámetros de la URL
- Crear función para convertir slugs a texto legible
- Mostrar mensaje apropiado cuando no hay ubicación especificada
