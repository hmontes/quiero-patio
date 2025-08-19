Como: Visitante del portal
Quiero: Buscar propiedades por ubicación, tipo y operación
Para: Encontrar inmuebles que coincidan con mis criterios de búsqueda

## Descripción del problema

Actualmente en el portal no existe una forma de hacer una búsqueda de propiedades en el sitio.

## Descripción de la solución
Se necesita implementar un buscador que funcionará en el home del sitio. Este debe poder indicar el tipo de propiedad que se busca, el tipo de operación (Compra o renta) junto con las ubicaciones de México.

Al buscar debe existir una lista en base a la búsqueda hecha. Una vez seleccionada la ubicación, debe llevar a una url donde se deberían mostrar los resultados de búsqueda.

## Criterios de aceptación

- Tiene que tener tres inputs alineados en el centro de la página.
  - [Tipo_de_operacion] [Tipo de propiedad] [Input de búsqueda] [Botón]
- En tipo de operación, debe ser un select con las opciones de Comprar y Rentar
  - Por defecto debe estar la opción de rentar
- Los tipos de propiedad se deben seleccionar mediante un select. Las opciones son: Casa y Terreno
  - Casa será la opción por defecto
- Sobre el input de búsqueda
  - El Placeholder debe decir: Ingresa la ubicación
  - Al ingresar una letra, deben aparecer los resultados de búsqueda que coincidan con lo que se busca (fuzzy search)
  - En los resultados, deben aparece las ubicaciones concatenatas
    - Colonia, Municipio, Estado
    - Si, por ejemplo, busco solo el estado, este aparece solo sin municipio ni colonia
  - Deben mostrarse como máximo 10 resultados. 5 aparecen y con scroll se debería llegar a las 5 de abajo.
  - Las letras que use en la búsqueda deben aparecer en negrita
    - Ej. Si puse "ciu" y aparece "Ciudad de México", "CIU" debería aparecer en negrita
    - Ej. Si puse "a" y aparece "Ciudad de México", todas las "a" de esa frase deben estar en negrita.
    - Si al final del input coloco caracteres raros (no letras), no se debe cerrar el selector pero si deben dejar de existir negritas (ya que dejarían de coincidir)
    - Si no hay resultados de búsqueda (no existen las palabras en la DB), simplemente no se deería mostrar nada.
    - Tiene que existir un "debounce", vale decir, un tiempo pequeño entre que ingreso las letras y empiece la búsqueda. Así, si busco "Las" me busca todas las que ubicaciones que tengan "las" y no "l", después "a" y después "s".
    - Si se abren los resultados de búsqueda y pincho fuera, este se debe cerrar.
- Tiene que haber un CTA que dice "Buscar"
- Al pinchar el botón, deben cargarse los resultados de búsqueda en la misma tab.
- La estructura de la URL, que es tipo slug, es la siguiente
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
- Sobre la página de resultados
  - Será una "dummy page" con solo un texto que muestre el tipo de propidad, tipo de operación y la ubicación con el nivel anterior, exceptuando que se trate de un estado
    - Ej. Si busqué casas para rentar en benito juarez de ciudad de méxico, debería decir: "Casas en renta en Benito Juarez, Ciudad de México" en la landing.
    - Ej. Si busqué casas para comprar sin ubicación, debería decir: "casas en venta"

## SEO

- El tag Title de la página debe decir: "Casas y terrenos en renta y venta a lo largo de todo México - QuieroPatio
- El meta tag description de la página debe decir: "Encuentra casas, terrenos y otros inmuebles en renta y venta. Espacios pensados para disfrutar la vida en QuieroPatio"
- Debe existir un tag canonico (link rel="canonical") que apunte al home del sitio.

## Información

- En la carpeta recursos hay un archivo llamado zonas-mexico.csv con un listado de estados, municipios y colonias de México. Solo incluí, por ahora, las colonias de ciudad de méxico.

## Sugerencias técnicas

- En la base de datos, deberían existir las zonas. Una forma de implementarlas es colocandolas en tablas distintas con nombres l0, l1 y l2 respectivamente para representar "niveles" geográficos y así hacerla escalable a distintos países.

- Para los metadata y el canonical del home. Al ser estatico, se puede usar el objeto Metadata de next.js.
