Como: propietario que quiero publicar mi propiedad en el portal inmobiliario
Quiero: agregar la dirección de forma rápida y precisa
Para: que los compradores potenciales puedan encontrar y ubicar mi propiedad correctamente

## Descripción del problema

Actualmente se puede publicar una propiedad en el portal pero no se puede agregar la dirección. Esto es un problema porque necesitamos saber la dirección exacta de la propiedad, incluyendo estado, municipio y colonia.

## Descripción de la solución
Al publicar la propiedad, se debería mostrar un input donde la persona ingese una dirección. Al ingresarla, se debería poder mover el pin en el mapa. Una vez hecho esto, se debería mostrar el estado, municipio y colonia de la ubicación de la propiedad.

## Criterios de aceptación

- Se tiene que mostrar un input junto con un mapa
  - Al colocarla dirección, debe mostrarse el estado, municipio y colonia al que pertenece la ubicación ingresada.
  - La dirección es un campo obligatorio
  - Se tendrá la opción de mover el pin

## Sugerencias técnicas

- Para el mapa NO usar Google Maps ya que es carisimo. Se sugiere usar mapbox o, en su defecto, react-map-gl (que usa Maplibre-gl) o una solución similar.
