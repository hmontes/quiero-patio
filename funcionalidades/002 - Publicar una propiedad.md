Como: Vendedor
Quiero: Publicar propiedades en el portal
Para: Encontrar posibles compradores de mi propiedad

## Descripción del problema

Actualmente en el portal no existe una forma de publicar propiedades.

## Descripción de la solución
Se necesita implementar un sistema para poder publicar propiedades de forma online. Esto consiste en preguntar diversos datos de la propiedad a subir para luego cargarla en sl sistema y así aparezca en los resultados de búsqueda.

## Criterios de aceptación

- Los items a pedir serán
  - Tipo de operación
    - Venta o Renta
  - Tipo de Inmueble
    - Casa o Terreno
  - Titulo
    - Es obligatorio
    - Tiene un mínimo de 1 caracter y un máximo de 60 caracteres
  - Descripción
    - Debe tener como minimo 10 caracteres y máximo 5000 caracteres
  - Precio, superficie total y superficie construida
    - El precio debe tener la opción de eelgir entre pesos o dolares.
    - No se pueden ingresar caracteres distintos a numeros
      - Por ende, no se deben aceptar decimales
    - Al terminar de ingresar el numero, se debe colocar el separador de miles en caso de ser necesario
    - La superficie construida debe ser mayor que cero (por ende es obligatoria)
    - El precio es obligatorio
  - Baños y habitaciones
    - Ambos son optativos
  - Se debe poder elegir el estado, municipio y colonia
    - Estos datos son obligatorios, exceptuando los municipios que no tengan colonia (aun)
- Debe existir una landing para ver la propiedad
  - Debe ser de url /propiedad/slug-[id]
    - El slug es el titulo de la propiedad convertido en slug
  - La landing debe ser atractiva para buscar una propiedad
- Al terminar de subir una propiedad, debe aparecer una landing de éxito
  - Esta landing debe tener un CTA que lleve a la propiedad
