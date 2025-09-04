-- Agregar columnas de coordenadas a la tabla de propiedades
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);