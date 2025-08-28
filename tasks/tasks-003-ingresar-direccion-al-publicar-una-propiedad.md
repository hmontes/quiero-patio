## Archivos relevantes

- `src/components/property-form.tsx` - Componente principal del formulario de publicación de propiedades que necesita ser modificado para incluir el mapa y la entrada de dirección.
- `src/components/location-autocomplete.tsx` - Componente existente de autocompletado de ubicaciones que puede necesitar ajustes para integrarse con el nuevo mapa.
- `src/components/map-selector.tsx` - Nuevo componente que se creará para manejar la selección de ubicación mediante mapa.
- `src/lib/zones.ts` - Funciones de utilidad para buscar ubicaciones que se usarán para geocodificación inversa.
- `src/app/api/geocode/route.ts` - Nuevo endpoint API que se creará para geocodificación de direcciones.
- `src/app/api/reverse-geocode/route.ts` - Nuevo endpoint API que se creará para geocodificación inversa.
- `src/app/publicar-propiedad/page.tsx` - Página de publicación de propiedad que puede necesitar ajustes para el nuevo componente.

## Tareas

- [ ] 1.0 Configurar biblioteca de mapas y crear componente de mapa
  - [ ] 1.1 Investigar e instalar biblioteca de mapas ligera (maplibre-gl-js o leaflet con react-leaflet) que no requiera clave de API costosa
  - [ ] 1.2 Configurar las credenciales de mapa en variables de entorno si es necesario
  - [ ] 1.3 Crear componente `MapSelector` que muestre un mapa interactivo centrado en México por defecto
  - [ ] 1.4 Implementar funcionalidad para colocar y arrastrar un pin en el mapa
  - [ ] 1.5 Añadir controles de zoom al mapa
  - [ ] 1.6 Implementar eventos para detectar cuando el usuario mueve el pin

- [ ] 2.0 Implementar entrada de dirección y geocodificación
  - [ ] 2.1 Agregar campo de entrada de dirección al formulario de propiedad como campo obligatorio
  - [ ] 2.2 Crear endpoint API `/api/geocode` que use un servicio gratuito de geocodificación (Nominatim, OpenCage, etc.)
  - [ ] 2.3 Implementar función de utilidad para geocodificación de direcciones ingresadas por el usuario
  - [ ] 2.4 Crear endpoint API `/api/reverse-geocode` para obtener dirección a partir de coordenadas
  - [ ] 2.5 Implementar geocodificación inversa cuando el usuario mueve el pin en el mapa
  - [ ] 2.6 Manejar errores de geocodificación y mostrar mensajes apropiados al usuario

- [ ] 3.0 Integrar selección de ubicación con el formulario existente
  - [ ] 3.1 Modificar el componente `PropertyForm` para incluir el nuevo componente `MapSelector`
  - [ ] 3.2 Reemplazar el componente `LocationAutocomplete` actual con el nuevo sistema de selección
  - [ ] 3.3 Sincronizar la entrada de dirección con la posición del pin en el mapa
  - [ ] 3.4 Actualizar el estado, municipio y colonia cuando el usuario ingresa una dirección o mueve el pin
  - [ ] 3.5 Implementar lógica para convertir coordenadas geográficas en ubicación administrativa (estado, municipio, colonia)
  - [ ] 3.6 Asegurar que los datos de ubicación se envíen correctamente al endpoint de creación de propiedad

- [ ] 4.0 Implementar validación y manejo de errores
  - [ ] 4.1 Validar que la dirección ingresada sea válida y se pueda geocodificar correctamente
  - [ ] 4.2 Verificar que la ubicación seleccionada esté dentro de los límites geográficos permitidos (México)
  - [ ] 4.3 Mostrar errores claros cuando la geocodificación falle o la ubicación sea inválida
  - [ ] 4.4 Implementar validación para asegurar que se haya seleccionado correctamente estado, municipio y colonia
  - [ ] 4.5 Manejar casos donde la geocodificación no encuentre una colonia exacta
  - [ ] 4.6 Asegurar que la ubicación seleccionada en el mapa se traduzca correctamente a IDs de estado, municipio y colonia

- [ ] 5.0 Pruebas y refinamiento
  - [ ] 5.1 Probar la funcionalidad completa de selección de dirección con diferentes tipos de entradas (direcciones completas, parciales, inexistentes)
  - [ ] 5.2 Verificar que la ubicación seleccionada se almacene correctamente en la base de datos con sus referencias a estado, municipio y colonia
  - [ ] 5.3 Probar el comportamiento cuando el usuario mueve el pin en diferentes ubicaciones
  - [ ] 5.4 Verificar que la interfaz sea responsive y funcione correctamente en dispositivos móviles
  - [ ] 5.5 Ajustar la UI/UX para una experiencia de usuario fluida y responsiva
  - [ ] 5.6 Probar casos límite como direcciones ambiguas o ubicaciones fuera de México