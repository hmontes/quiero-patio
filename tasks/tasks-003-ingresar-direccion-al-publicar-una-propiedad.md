## Archivos relevantes

- `src/components/property-form.tsx` - Componente principal del formulario de publicación de propiedades modificado para incluir el mapa y la entrada de dirección.
- `src/components/map-selector.tsx` - Nuevo componente creado para manejar la selección de ubicación mediante mapa.
- `src/app/api/geocode/route.ts` - Nuevo endpoint API creado para geocodificación de direcciones.
- `src/app/api/reverse-geocode/route.ts` - Nuevo endpoint API creado para geocodificación inversa.

## Tareas

- [x] 1.0 Configurar biblioteca de mapas y crear componente de mapa

  - [x] 1.1 Investigar e instalar biblioteca de mapas ligera (maplibre-gl-js o leaflet con react-leaflet) que no requiera clave de API costosa
  - [x] 1.2 Configurar las credenciales de mapa en variables de entorno si es necesario
  - [x] 1.3 Crear componente `MapSelector` que muestre un mapa interactivo centrado en México por defecto
  - [x] 1.4 Implementar funcionalidad para colocar y arrastrar un pin en el mapa
  - [x] 1.5 Añadir controles de zoom al mapa
  - [x] 1.6 Implementar eventos para detectar cuando el usuario mueve el pin

- [x] 2.0 Implementar entrada de dirección y geocodificación

  - [x] 2.1 Agregar campo de entrada de dirección al formulario de propiedad como campo obligatorio
  - [x] 2.2 Crear endpoint API `/api/geocode` que use un servicio gratuito de geocodificación (Nominatim, OpenCage, etc.)
  - [x] 2.3 Implementar función de utilidad para geocodificación de direcciones ingresadas por el usuario
  - [x] 2.4 Crear endpoint API `/api/reverse-geocode` para obtener dirección a partir de coordenadas
  - [x] 2.5 Implementar geocodificación inversa cuando el usuario mueve el pin en el mapa
  - [x] 2.6 Manejar errores de geocodificación y mostrar mensajes apropiados al usuario

- [x] 3.0 Integrar selección de ubicación con el formulario existente

  - [x] 3.1 Modificar el componente `PropertyForm` para incluir el nuevo componente `MapSelector`
  - [x] 3.2 Reemplazar el componente `LocationAutocomplete` actual con el nuevo sistema de selección
  - [x] 3.3 Sincronizar la entrada de dirección con la posición del pin en el mapa
  - [x] 3.4 Actualizar el estado, municipio y colonia cuando el usuario ingresa una dirección o mueve el pin
  - [x] 3.5 Implementar lógica para convertir coordenadas geográficas en ubicación administrativa (estado, municipio, colonia)
  - [x] 3.6 Asegurar que los datos de ubicación se envíen correctamente al endpoint de creación de propiedad

- [x] 4.0 Implementar validación y manejo de errores
  - [x] 4.1 Validar que la dirección ingresada sea válida y se pueda geocodificar correctamente
  - [x] 4.2 Verificar que la ubicación seleccionada esté dentro de los límites geográficos permitidos (México)
  - [x] 4.3 Mostrar errores claros cuando la geocodificación falle o la ubicación sea inválida
  - [x] 4.4 Implementar validación para asegurar que se haya seleccionado correctamente estado, municipio y colonia
  - [x] 4.5 Manejar casos donde la geocodificación no encuentre una colonia exacta
  - [x] 4.6 Asegurar que la ubicación seleccionada en el mapa se traduzca correctamente a IDs de estado, municipio y colonia
