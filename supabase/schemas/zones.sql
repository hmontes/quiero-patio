-- Crear la tabla states
CREATE TABLE states (
  id SERIAL PRIMARY KEY, code INT UNIQUE NOT NULL, name VARCHAR(255) UNIQUE NOT NULL,
  url_slug_path TEXT UNIQUE
);

-- Crear la tabla municipalities
CREATE TABLE municipalities (
  id SERIAL PRIMARY KEY, code INT NOT NULL, name VARCHAR(255) NOT NULL,
  state_id INT NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  url_slug_path TEXT UNIQUE,
  UNIQUE(code, state_id),  UNIQUE(name, state_id)
);
-- Crear la tabla neighborhoods
CREATE TABLE neighborhoods ( id SERIAL PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  municipality_id INT NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
  url_slug_path TEXT UNIQUE,
  UNIQUE(name, municipality_id)
);

-- Crear índices para acelerar las búsquedas
CREATE INDEX idx_states_name ON states(name);
CREATE INDEX idx_municipalities_name ON municipalities(name);
CREATE INDEX idx_municipalities_state_id ON municipalities(state_id);
CREATE INDEX idx_neighborhoods_name ON neighborhoods(name);
CREATE INDEX idx_neighborhoods_municipality_id ON neighborhoods(municipality_id);

-- Crear índices para las columnas url_slug_path si no existen
CREATE INDEX IF NOT EXISTS idx_states_url_slug_path ON public.states USING btree (url_slug_path);
CREATE INDEX IF NOT EXISTS idx_municipalities_url_slug_path ON public.municipalities USING btree (url_slug_path);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_url_slug_path ON public.neighborhoods USING btree (url_slug_path);