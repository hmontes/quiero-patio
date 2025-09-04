

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."search_locations"("query" "text") RETURNS TABLE("id" integer, "name" "text", "level" "text", "full_location" "text", "url_slug_path" "text", "state_id" integer, "municipality_id" integer, "neighborhood_id" integer)
    LANGUAGE "sql"
    AS $$
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
$$;


ALTER FUNCTION "public"."search_locations"("query" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."municipalities" (
    "id" integer NOT NULL,
    "code" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "state_id" integer NOT NULL,
    "url_slug_path" "text"
);


ALTER TABLE "public"."municipalities" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."municipalities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."municipalities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."municipalities_id_seq" OWNED BY "public"."municipalities"."id";



CREATE TABLE IF NOT EXISTS "public"."neighborhoods" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "municipality_id" integer NOT NULL,
    "url_slug_path" "text"
);


ALTER TABLE "public"."neighborhoods" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."neighborhoods_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."neighborhoods_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."neighborhoods_id_seq" OWNED BY "public"."neighborhoods"."id";



CREATE TABLE IF NOT EXISTS "public"."properties" (
    "id" integer NOT NULL,
    "operation_type" character varying(10) NOT NULL,
    "title" character varying(60) NOT NULL,
    "description" "text" NOT NULL,
    "price" bigint NOT NULL,
    "currency" character varying(3) DEFAULT 'MXN'::character varying NOT NULL,
    "total_surface" numeric(10,2) NOT NULL,
    "constructed_surface" numeric(10,2) NOT NULL,
    "bathrooms" integer,
    "bedrooms" integer,
    "state_id" integer NOT NULL,
    "municipality_id" integer,
    "neighborhood_id" integer,
    "slug" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "property_type_id" integer NOT NULL,
    CONSTRAINT "properties_currency_check" CHECK ((("currency")::"text" = ANY ((ARRAY['MXN'::character varying, 'USD'::character varying])::"text"[]))),
    CONSTRAINT "properties_operation_type_check" CHECK ((("operation_type")::"text" = ANY ((ARRAY['venta'::character varying, 'renta'::character varying])::"text"[])))
);


ALTER TABLE "public"."properties" OWNER TO "postgres";


COMMENT ON TABLE "public"."properties" IS 'Tabla que almacena las propiedades publicadas en el portal';



COMMENT ON COLUMN "public"."properties"."operation_type" IS 'Tipo de operación: venta o renta';



COMMENT ON COLUMN "public"."properties"."title" IS 'Título de la propiedad (1-60 caracteres)';



COMMENT ON COLUMN "public"."properties"."description" IS 'Descripción de la propiedad (10-5000 caracteres)';



COMMENT ON COLUMN "public"."properties"."price" IS 'Precio de la propiedad en centavos o cents';



COMMENT ON COLUMN "public"."properties"."currency" IS 'Moneda del precio: MXN (pesos) o USD (dólares)';



COMMENT ON COLUMN "public"."properties"."total_surface" IS 'Superficie total del terreno en metros cuadrados';



COMMENT ON COLUMN "public"."properties"."constructed_surface" IS 'Superficie construida en metros cuadrados';



COMMENT ON COLUMN "public"."properties"."bathrooms" IS 'Número de baños (opcional)';



COMMENT ON COLUMN "public"."properties"."bedrooms" IS 'Número de habitaciones (opcional)';



COMMENT ON COLUMN "public"."properties"."state_id" IS 'ID del estado donde se encuentra la propiedad';



COMMENT ON COLUMN "public"."properties"."municipality_id" IS 'ID del municipio donde se encuentra la propiedad';



COMMENT ON COLUMN "public"."properties"."neighborhood_id" IS 'ID de la colonia donde se encuentra la propiedad';



COMMENT ON COLUMN "public"."properties"."slug" IS 'Slug único para la URL de la propiedad';



CREATE SEQUENCE IF NOT EXISTS "public"."properties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."properties_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."properties_id_seq" OWNED BY "public"."properties"."id";



CREATE TABLE IF NOT EXISTS "public"."property_types" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."property_types" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."property_types_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."property_types_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."property_types_id_seq" OWNED BY "public"."property_types"."id";



CREATE TABLE IF NOT EXISTS "public"."states" (
    "id" integer NOT NULL,
    "code" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "url_slug_path" "text"
);


ALTER TABLE "public"."states" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."states_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."states_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."states_id_seq" OWNED BY "public"."states"."id";



ALTER TABLE ONLY "public"."municipalities" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."municipalities_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."neighborhoods" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."neighborhoods_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."properties" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."properties_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."property_types" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."property_types_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."states" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."states_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."municipalities"
    ADD CONSTRAINT "municipalities_code_state_id_key" UNIQUE ("code", "state_id");



ALTER TABLE ONLY "public"."municipalities"
    ADD CONSTRAINT "municipalities_name_state_id_key" UNIQUE ("name", "state_id");



ALTER TABLE ONLY "public"."municipalities"
    ADD CONSTRAINT "municipalities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."municipalities"
    ADD CONSTRAINT "municipalities_url_slug_path_key" UNIQUE ("url_slug_path");



ALTER TABLE ONLY "public"."neighborhoods"
    ADD CONSTRAINT "neighborhoods_name_municipality_id_key" UNIQUE ("name", "municipality_id");



ALTER TABLE ONLY "public"."neighborhoods"
    ADD CONSTRAINT "neighborhoods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."neighborhoods"
    ADD CONSTRAINT "neighborhoods_url_slug_path_key" UNIQUE ("url_slug_path");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."property_types"
    ADD CONSTRAINT "property_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."property_types"
    ADD CONSTRAINT "property_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_url_slug_path_key" UNIQUE ("url_slug_path");



CREATE INDEX "idx_municipalities_name" ON "public"."municipalities" USING "btree" ("name");



CREATE INDEX "idx_municipalities_state_id" ON "public"."municipalities" USING "btree" ("state_id");



CREATE INDEX "idx_municipalities_url_slug_path" ON "public"."municipalities" USING "btree" ("url_slug_path");



CREATE INDEX "idx_neighborhoods_municipality_id" ON "public"."neighborhoods" USING "btree" ("municipality_id");



CREATE INDEX "idx_neighborhoods_name" ON "public"."neighborhoods" USING "btree" ("name");



CREATE INDEX "idx_neighborhoods_url_slug_path" ON "public"."neighborhoods" USING "btree" ("url_slug_path");



CREATE INDEX "idx_properties_municipality_id" ON "public"."properties" USING "btree" ("municipality_id");



CREATE INDEX "idx_properties_neighborhood_id" ON "public"."properties" USING "btree" ("neighborhood_id");



CREATE INDEX "idx_properties_slug" ON "public"."properties" USING "btree" ("slug");



CREATE INDEX "idx_properties_state_id" ON "public"."properties" USING "btree" ("state_id");



CREATE INDEX "idx_states_name" ON "public"."states" USING "btree" ("name");



CREATE INDEX "idx_states_url_slug_path" ON "public"."states" USING "btree" ("url_slug_path");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "fk_properties_municipality_id" FOREIGN KEY ("municipality_id") REFERENCES "public"."municipalities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "fk_properties_neighborhood_id" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."neighborhoods"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "fk_properties_property_type_id" FOREIGN KEY ("property_type_id") REFERENCES "public"."property_types"("id");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "fk_properties_state_id" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."municipalities"
    ADD CONSTRAINT "municipalities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."neighborhoods"
    ADD CONSTRAINT "neighborhoods_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "public"."municipalities"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";































































































































































GRANT ALL ON FUNCTION "public"."search_locations"("query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_locations"("query" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_locations"("query" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."municipalities" TO "anon";
GRANT ALL ON TABLE "public"."municipalities" TO "authenticated";
GRANT ALL ON TABLE "public"."municipalities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."municipalities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."municipalities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."municipalities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."neighborhoods" TO "anon";
GRANT ALL ON TABLE "public"."neighborhoods" TO "authenticated";
GRANT ALL ON TABLE "public"."neighborhoods" TO "service_role";



GRANT ALL ON SEQUENCE "public"."neighborhoods_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."neighborhoods_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."neighborhoods_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."properties" TO "anon";
GRANT ALL ON TABLE "public"."properties" TO "authenticated";
GRANT ALL ON TABLE "public"."properties" TO "service_role";



GRANT ALL ON SEQUENCE "public"."properties_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."properties_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."properties_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."property_types" TO "anon";
GRANT ALL ON TABLE "public"."property_types" TO "authenticated";
GRANT ALL ON TABLE "public"."property_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."property_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."property_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."property_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."states" TO "anon";
GRANT ALL ON TABLE "public"."states" TO "authenticated";
GRANT ALL ON TABLE "public"."states" TO "service_role";



GRANT ALL ON SEQUENCE "public"."states_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."states_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."states_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
