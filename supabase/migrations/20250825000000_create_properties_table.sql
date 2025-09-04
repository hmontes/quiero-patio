-- Crear tabla de tipos de propiedad
CREATE TABLE IF NOT EXISTS public.property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar los tipos de propiedad iniciales
INSERT INTO public.property_types (name) VALUES 
    ('casa'), 
    ('terreno')
ON CONFLICT (name) DO NOTHING;

-- Crear tabla de propiedades
CREATE TABLE IF NOT EXISTS public.properties (
    id SERIAL PRIMARY KEY,
    operation_type VARCHAR(10) NOT NULL CHECK (operation_type IN ('venta', 'renta')),
    property_type_id INTEGER NOT NULL,
    title VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    price BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'MXN' CHECK (currency IN ('MXN', 'USD')),
    total_surface DECIMAL(10, 2) NOT NULL,
    constructed_surface DECIMAL(10, 2) NOT NULL,
    bathrooms INTEGER,
    bedrooms INTEGER,
    state_id INTEGER NOT NULL,
    municipality_id INTEGER,
    neighborhood_id INTEGER,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar constraint de foreign key para property_type_id
ALTER TABLE public.properties
    ADD CONSTRAINT fk_properties_property_type_id
    FOREIGN KEY (property_type_id)
    REFERENCES public.property_types(id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties USING btree (slug);
CREATE INDEX IF NOT EXISTS idx_properties_state_id ON public.properties USING btree (state_id);
CREATE INDEX IF NOT EXISTS idx_properties_municipality_id ON public.properties USING btree (municipality_id);
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood_id ON public.properties USING btree (neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_type_id ON public.properties USING btree (property_type_id);

-- Agregar constraints de foreign key para ubicaciones
ALTER TABLE public.properties
    ADD CONSTRAINT fk_properties_state_id
    FOREIGN KEY (state_id)
    REFERENCES public.states(id)
    ON DELETE CASCADE;

ALTER TABLE public.properties
    ADD CONSTRAINT fk_properties_municipality_id
    FOREIGN KEY (municipality_id)
    REFERENCES public.municipalities(id)
    ON DELETE CASCADE;

ALTER TABLE public.properties
    ADD CONSTRAINT fk_properties_neighborhood_id
    FOREIGN KEY (neighborhood_id)
    REFERENCES public.neighborhoods(id)
    ON DELETE CASCADE;

-- Agregar comentarios para documentar la tabla
COMMENT ON TABLE public.properties IS 'Tabla que almacena las propiedades publicadas en el portal';
COMMENT ON COLUMN public.properties.operation_type IS 'Tipo de operación: venta o renta';
COMMENT ON COLUMN public.properties.property_type_id IS 'ID del tipo de inmueble';
COMMENT ON COLUMN public.properties.title IS 'Título de la propiedad (1-60 caracteres)';
COMMENT ON COLUMN public.properties.description IS 'Descripción de la propiedad (10-5000 caracteres)';
COMMENT ON COLUMN public.properties.price IS 'Precio de la propiedad en centavos o cents';
COMMENT ON COLUMN public.properties.currency IS 'Moneda del precio: MXN (pesos) o USD (dólares)';
COMMENT ON COLUMN public.properties.total_surface IS 'Superficie total del terreno en metros cuadrados';
COMMENT ON COLUMN public.properties.constructed_surface IS 'Superficie construida en metros cuadrados';
COMMENT ON COLUMN public.properties.bathrooms IS 'Número de baños (opcional)';
COMMENT ON COLUMN public.properties.bedrooms IS 'Número de habitaciones (opcional)';
COMMENT ON COLUMN public.properties.state_id IS 'ID del estado donde se encuentra la propiedad';
COMMENT ON COLUMN public.properties.municipality_id IS 'ID del municipio donde se encuentra la propiedad';
COMMENT ON COLUMN public.properties.neighborhood_id IS 'ID de la colonia donde se encuentra la propiedad';
COMMENT ON COLUMN public.properties.slug IS 'Slug único para la URL de la propiedad';