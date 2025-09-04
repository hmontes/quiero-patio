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

#### Navegación a resultados de búsqueda
- Crear función para generar URLs con el formato especificado
- Implementar lógica para convertir tipos de operación y propiedad a formato URL
- Crear función para generar slug de ubicación según nivel (estado, municipio, colonia)
- Implementar la lógica de redirección al hacer clic en "Buscar"
- Manejar caso especial cuando no se selecciona ubicación
- Crear página de resultados dinámica

#### SEO y metadatos para la página principal
- Actualizar el título de la página
- Agregar meta tag description
- Implementar tag canonical que apunte al home del sitio
- Crear objeto Metadata de Next.js para la página principal

#### Página de resultados de búsqueda dummy
- Crear estructura de página dinámica para resultados de búsqueda
- Implementar componente que muestre el tipo de propiedad, operación y ubicación
- Manejar diferentes niveles de ubicación
- Implementar lógica para parsear parámetros de la URL
- Crear función para convertir slugs a texto legible
- Mostrar mensaje apropiado cuando no hay ubicación especificada

### 2. Implementación de publicación de propiedades

Hemos avanzado significativamente en la implementación de la funcionalidad de publicación de propiedades:

#### Estructura de base de datos
- Diseño del esquema de tabla para almacenar propiedades con todos los campos requeridos
- Creación de relaciones con ubicaciones (estados, municipios, colonias) usando foreign keys
- Agregar columna para el slug de la propiedad con constraint único
- Agregar timestamps para created_at y updated_at

#### Formulario de publicación de propiedades
- Crear página de publicación de propiedad en la ruta `/publicar-propiedad`
- Implementar selección de tipo de operación (Venta o Renta) usando componente Select
- Implementar selección de tipo de inmueble (Casa o Terreno) usando componente Select
- Desarrollar componente de formulario con campo de título (1-60 caracteres, obligatorio) con validación en tiempo real
- Implementar campo de descripción (10-5000 caracteres, obligatorio) con contador de caracteres
- Crear componentes para campos numéricos: precio (obligatorio), superficie total (obligatorio), superficie construida (obligatorio, >0)
- Implementar validaciones del lado del cliente para campos numéricos (solo números enteros, sin decimales)
- Crear funcionalidad para formateo automático de números con separadores de miles mientras el usuario escribe
- Implementar selección de moneda (pesos/dólares) para el precio usando componente Select
- Agregar campos opcionales para baños y habitaciones con validaciones apropiadas
- Integrar selección de ubicación (estado, municipio, colonia) obligatoria usando componente existente de autocompletado
- Manejar caso especial de municipios sin colonias permitiendo publicar sin seleccionar colonia
- Implementar estado de loading durante el envío del formulario
- Mostrar mensajes de error claros cuando las validaciones fallan

#### API endpoint para guardar propiedades
- Desarrollar endpoint POST en `/api/properties` para recibir datos del formulario con método HTTP apropiado
- Implementar validaciones del lado del servidor replicando las del cliente para seguridad
- Conectar con base de datos para almacenar propiedad y relacionarla con ubicaciones mediante foreign keys
- Manejar errores apropiadamente y devolver respuestas consistentes con códigos HTTP correctos
- Generar slug único para la propiedad basado en el título usando una función de utilidad
- Implementar lógica para evitar duplicados de slugs añadiendo sufijos numéricos si es necesario
- Devolver el ID y slug de la propiedad creada para redirección

#### Página de detalle de propiedad
- Implementar página dinámica para mostrar propiedad (/propiedad/[slug]) usando dynamic routing de Next.js
- Crear componente para mostrar información de propiedad
- Implementar obtención de datos de propiedad desde la base de datos por slug
- Manejar casos de propiedad no encontrada con página 404 apropiada
- Mostrar todos los detalles de la propiedad de forma clara y organizada

### 3. Implementación de ingreso de dirección al publicar una propiedad

Hemos comenzado el análisis y planificación para implementar la funcionalidad de ingreso de dirección al publicar una propiedad:

#### Planificación y análisis
- Crear tarea técnica detallada para la implementación de la funcionalidad
- Identificar bibliotecas de mapas adecuadas que no requieran costosas claves API
- Analizar la integración con el formulario de publicación de propiedades existente
- Planificar la geocodificación directa e inversa para convertir direcciones en coordenadas y viceversa
- Definir validaciones necesarias para asegurar que las direcciones sean válidas y estén dentro de los límites permitidos

#### Componentes a desarrollar
- Componente de mapa interactivo que permita al usuario seleccionar una ubicación mediante un pin
- Campo de entrada de dirección que se sincronice con la posición del pin en el mapa
- Endpoints API para geocodificación y geocodificación inversa
- Validaciones para asegurar datos de ubicación correctos

#### Integración con funcionalidad existente
- Reemplazar el componente actual de selección de ubicación con el nuevo sistema de mapa
- Asegurar que los datos de ubicación (estado, municipio, colonia) se obtengan correctamente a partir de la dirección o coordenadas
- Mantener compatibilidad con la estructura de base de datos existente

## Qwen Added Memories
- Hemos implementado la funcionalidad de ingreso de dirección al publicar una propiedad usando un mapa interactivo con React-Leaflet. La implementación incluye:

1. Componente MapSelector que permite ingresar direcciones o seleccionar ubicaciones en el mapa
2. Endpoints de API para geocodificación (dirección → coordenadas) y geocodificación inversa (coordenadas → dirección)
3. Actualizaciones en el formulario de propiedades para integrar el nuevo selector de mapas
4. Agregamos columnas de coordenadas (latitude, longitude) a la tabla de propiedades en Supabase
5. Creamos un componente PropertyLocation para mostrar la ubicación en la ficha de propiedades, que inicialmente muestra una imagen estática y al hacer clic carga el mapa interactivo
6. Solucionamos problemas de hidratación SSR con Leaflet usando dynamic imports
7. Movimos el mapa debajo de "Características principales" en la ficha de propiedades
8. Corregimos la visualización del pin en el mapa interactivo

La implementación optimiza el uso de recursos cargando el mapa interactivo solo cuando el usuario lo solicita, manteniendo inicialmente una imagen estática que consume menos recursos.
