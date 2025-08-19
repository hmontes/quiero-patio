-- Eliminar la función existente si existe
DROP FUNCTION IF EXISTS public.search_locations(TEXT);

-- Crear función para búsqueda fuzzy de ubicaciones
CREATE OR REPLACE FUNCTION public.search_locations(query TEXT)
RETURNS TABLE(
  id INT,
  name TEXT,
  level TEXT,
  full_location TEXT,
  url_slug_path TEXT,
  state_id INT,
  municipality_id INT,
  neighborhood_id INT
) 
LANGUAGE sql
AS $function$
  -- Función para normalizar texto quitando acentos y caracteres especiales
  WITH normalized_query AS (
    SELECT LOWER(
      TRANSLATE(
        LOWER(query),
        'áéíóúàèìòùâêîôûäëïöüãõåæçñýÿ',
        'aeiouaeiouaeiouaeiouaoaaceyny'
      )
    ) AS normalized_text
  )
  
  -- Buscar estados que coincidan con la consulta
  SELECT 
    s.id::INT,
    s.name::TEXT,
    'state'::TEXT as level,
    s.name::TEXT as full_location,
    s.url_slug_path::TEXT,
    s.id::INT as state_id,
    NULL::INT as municipality_id,
    NULL::INT as neighborhood_id
  FROM public.states s
  CROSS JOIN normalized_query nq
  WHERE LOWER(
    TRANSLATE(
      LOWER(s.name),
      'áéíóúàèìòùâêîôûäëïöüãõåæçñýÿ',
      'aeiouaeiouaeiouaeiouaoaaceyny'
    )
  ) ILIKE '%' || nq.normalized_text || '%'
  
  UNION ALL
  
  -- Buscar municipios que coincidan con la consulta
  SELECT 
    m.id::INT,
    m.name::TEXT,
    'municipality'::TEXT as level,
    CONCAT(m.name, ', ', s.name)::TEXT as full_location,
    m.url_slug_path::TEXT,
    s.id::INT as state_id,
    m.id::INT as municipality_id,
    NULL::INT as neighborhood_id
  FROM public.municipalities m
  JOIN public.states s ON m.state_id = s.id
  CROSS JOIN normalized_query nq
  WHERE LOWER(
    TRANSLATE(
      LOWER(m.name),
      'áéíóúàèìòùâêîôûäëïöüãõåæçñýÿ',
      'aeiouaeiouaeiouaeiouaoaaceyny'
    )
  ) ILIKE '%' || nq.normalized_text || '%'
  
  UNION ALL
  
  -- Buscar colonias que coincidan con la consulta
  SELECT 
    n.id::INT,
    n.name::TEXT,
    'neighborhood'::TEXT as level,
    CONCAT(n.name, ', ', m.name, ', ', s.name)::TEXT as full_location,
    n.url_slug_path::TEXT,
    s.id::INT as state_id,
    m.id::INT as municipality_id,
    n.id::INT as neighborhood_id
  FROM public.neighborhoods n
  JOIN public.municipalities m ON n.municipality_id = m.id
  JOIN public.states s ON m.state_id = s.id
  CROSS JOIN normalized_query nq
  WHERE LOWER(
    TRANSLATE(
      LOWER(n.name),
      'áéíóúàèìòùâêîôûäëïöüãõåæçñýÿ',
      'aeiouaeiouaeiouaeiouaoaaceyny'
    )
  ) ILIKE '%' || nq.normalized_text || '%'
  
  -- Limitar resultados a 10
  LIMIT 10;
$function$;