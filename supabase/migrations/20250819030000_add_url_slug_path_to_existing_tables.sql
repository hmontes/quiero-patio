-- Añadir columna url_slug_path a las tablas existentes

-- Añadir columna a states
ALTER TABLE public.states ADD COLUMN IF NOT EXISTS url_slug_path TEXT UNIQUE;

-- Añadir columna a municipalities
ALTER TABLE public.municipalities ADD COLUMN IF NOT EXISTS url_slug_path TEXT UNIQUE;

-- Añadir columna a neighborhoods
ALTER TABLE public.neighborhoods ADD COLUMN IF NOT EXISTS url_slug_path TEXT UNIQUE;

-- Crear índices para las columnas url_slug_path si no existen
CREATE INDEX IF NOT EXISTS idx_states_url_slug_path ON public.states USING btree (url_slug_path);
CREATE INDEX IF NOT EXISTS idx_municipalities_url_slug_path ON public.municipalities USING btree (url_slug_path);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_url_slug_path ON public.neighborhoods USING btree (url_slug_path);