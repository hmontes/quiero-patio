Como: Visitante del portal
Quiero: Ver los resultados del buscador de propiedades por ubicación, tipo y operación
Para: Encontrar inmuebles que coincidan con mis criterios de búsqueda

## Descripción del problema

El portal actualmente tiene un sistema de búsqueda pero, al usarlo, muestra como resultado una página dummy. No existe una landing que muestre las propiedades ubicadas en la zona buscada.

## Descripción de la solución
Se necesita implementar una landing que debe mostrar los resultados de búsqueda. Esto es, mostrar las propiedades existentes en ciertas zonas dependiendo del lugar donde se encuentren, el tipo de operación y el tipo de propiedad.

Estas propiedades deben tener la opción de que, al pincharlas, se abra una landing con la ficha de la propiedad (que será una página dummy)

## Criterios de aceptación

- La estructura principal de la página será la siguiente
- Debe tener un titulo que muestre el tipo de propidad, tipo de operación y la ubicación con el nivel anterior, exceptuando que se trate de un estado.
  - Ej. Si busqué casas para rentar en benito juarez de ciudad de méxico, debería decir: "Casas en renta en Benito Juarez, Ciudad de México" en la landing.
  - Ej. Si busqué casas para comprar sin ubicación, debería decir: "casas en venta"
- La url será en base a la que vimos en la búsqueda del home. Es decir, un slug con las siguientes propiedades
  - [tipo de propiedad]-en-[tipo-de-operacion]-[ubicacion]
  - En ubicación, la estructura es la siguiente
    - Si busqué un estado. Mostrar solo estado
      - Ej. Ciudad de México. ciudad-de-mexico
    - Si busqué un municipio, debo mostrar el municipio con el estado
      - Ej. Cuauhtémoc. cuauhtemoc-ciudad-de-mexico
    - Si busqué una colonia, debo mostrar el municipio con la colonia
      - Ej. Roma. roma-cuahtemoc-ciudad-de-mexico
  - En tipo de operacion
    - Si es rentar, debe decir renta
    - Si es comprar, debe decir venta
  - En tipo de propiedad
    - Debe aparecer en plural
      - Ej. Si es casa, debería decir casas
  - Si el usuario no selecciono ubicación y coloca buscar, debería ser la url sin ubicación para mostrar, teoricamente, todas las propiedades del tipo de operacón y ubicación
    - Ej. casas-en-venta
- Debe mostrar, cómo máximo 30 propiedades por página
- Sobre las cards con las propiedades
  - Punto 1
- En caso de existir más de 30 propiedades, debe existir un paginador. Este debe contener lo siguiente

## SEO

- Titulo
- Meta tags
- Canonical

## Información

## Sugerencias técnicas

- Se deben crear propiedades dummy en diferentes partes de México. Cómo motivo de prueba, vamos a probar creando 70 propiedades en la colonia de Condesa en Ciudad de México con el municipio correspondiente. 30 propiedades deben estar en ubicaciones aleatorias haciendo un total de 100.

- Para los metadata. Al ser estatico, se puede usar el objeto Metadata de next.js o, aprovechando que se llama generateMetadata para el tag canonico, usar generateMetadata en vez de Metadata.
