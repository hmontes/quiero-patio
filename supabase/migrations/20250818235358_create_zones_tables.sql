create sequence "public"."municipalities_id_seq";

create sequence "public"."neighborhoods_id_seq";

create sequence "public"."states_id_seq";


  create table "public"."municipalities" (
    "id" integer not null default nextval('municipalities_id_seq'::regclass),
    "code" integer not null,
    "name" character varying(255) not null,
    "state_id" integer not null
      );



  create table "public"."neighborhoods" (
    "id" integer not null default nextval('neighborhoods_id_seq'::regclass),
    "name" character varying(255) not null,
    "municipality_id" integer not null
      );



  create table "public"."states" (
    "id" integer not null default nextval('states_id_seq'::regclass),
    "code" integer not null,
    "name" character varying(255) not null
      );


alter sequence "public"."municipalities_id_seq" owned by "public"."municipalities"."id";

alter sequence "public"."neighborhoods_id_seq" owned by "public"."neighborhoods"."id";

alter sequence "public"."states_id_seq" owned by "public"."states"."id";

CREATE INDEX idx_municipalities_name ON public.municipalities USING btree (name);

CREATE INDEX idx_municipalities_state_id ON public.municipalities USING btree (state_id);

CREATE INDEX idx_neighborhoods_municipality_id ON public.neighborhoods USING btree (municipality_id);

CREATE INDEX idx_neighborhoods_name ON public.neighborhoods USING btree (name);

CREATE INDEX idx_states_name ON public.states USING btree (name);

CREATE UNIQUE INDEX municipalities_code_state_id_key ON public.municipalities USING btree (code, state_id);

CREATE UNIQUE INDEX municipalities_name_state_id_key ON public.municipalities USING btree (name, state_id);

CREATE UNIQUE INDEX municipalities_pkey ON public.municipalities USING btree (id);

CREATE UNIQUE INDEX neighborhoods_name_municipality_id_key ON public.neighborhoods USING btree (name, municipality_id);

CREATE UNIQUE INDEX neighborhoods_pkey ON public.neighborhoods USING btree (id);

CREATE UNIQUE INDEX states_code_key ON public.states USING btree (code);

CREATE UNIQUE INDEX states_name_key ON public.states USING btree (name);

CREATE UNIQUE INDEX states_pkey ON public.states USING btree (id);

alter table "public"."municipalities" add constraint "municipalities_pkey" PRIMARY KEY using index "municipalities_pkey";

alter table "public"."neighborhoods" add constraint "neighborhoods_pkey" PRIMARY KEY using index "neighborhoods_pkey";

alter table "public"."states" add constraint "states_pkey" PRIMARY KEY using index "states_pkey";

alter table "public"."municipalities" add constraint "municipalities_code_state_id_key" UNIQUE using index "municipalities_code_state_id_key";

alter table "public"."municipalities" add constraint "municipalities_name_state_id_key" UNIQUE using index "municipalities_name_state_id_key";

alter table "public"."municipalities" add constraint "municipalities_state_id_fkey" FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE not valid;

alter table "public"."municipalities" validate constraint "municipalities_state_id_fkey";

alter table "public"."neighborhoods" add constraint "neighborhoods_municipality_id_fkey" FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE CASCADE not valid;

alter table "public"."neighborhoods" validate constraint "neighborhoods_municipality_id_fkey";

alter table "public"."neighborhoods" add constraint "neighborhoods_name_municipality_id_key" UNIQUE using index "neighborhoods_name_municipality_id_key";

alter table "public"."states" add constraint "states_code_key" UNIQUE using index "states_code_key";

alter table "public"."states" add constraint "states_name_key" UNIQUE using index "states_name_key";

grant delete on table "public"."municipalities" to "anon";

grant insert on table "public"."municipalities" to "anon";

grant references on table "public"."municipalities" to "anon";

grant select on table "public"."municipalities" to "anon";

grant trigger on table "public"."municipalities" to "anon";

grant truncate on table "public"."municipalities" to "anon";

grant update on table "public"."municipalities" to "anon";

grant delete on table "public"."municipalities" to "authenticated";

grant insert on table "public"."municipalities" to "authenticated";

grant references on table "public"."municipalities" to "authenticated";

grant select on table "public"."municipalities" to "authenticated";

grant trigger on table "public"."municipalities" to "authenticated";

grant truncate on table "public"."municipalities" to "authenticated";

grant update on table "public"."municipalities" to "authenticated";

grant delete on table "public"."municipalities" to "service_role";

grant insert on table "public"."municipalities" to "service_role";

grant references on table "public"."municipalities" to "service_role";

grant select on table "public"."municipalities" to "service_role";

grant trigger on table "public"."municipalities" to "service_role";

grant truncate on table "public"."municipalities" to "service_role";

grant update on table "public"."municipalities" to "service_role";

grant delete on table "public"."neighborhoods" to "anon";

grant insert on table "public"."neighborhoods" to "anon";

grant references on table "public"."neighborhoods" to "anon";

grant select on table "public"."neighborhoods" to "anon";

grant trigger on table "public"."neighborhoods" to "anon";

grant truncate on table "public"."neighborhoods" to "anon";

grant update on table "public"."neighborhoods" to "anon";

grant delete on table "public"."neighborhoods" to "authenticated";

grant insert on table "public"."neighborhoods" to "authenticated";

grant references on table "public"."neighborhoods" to "authenticated";

grant select on table "public"."neighborhoods" to "authenticated";

grant trigger on table "public"."neighborhoods" to "authenticated";

grant truncate on table "public"."neighborhoods" to "authenticated";

grant update on table "public"."neighborhoods" to "authenticated";

grant delete on table "public"."neighborhoods" to "service_role";

grant insert on table "public"."neighborhoods" to "service_role";

grant references on table "public"."neighborhoods" to "service_role";

grant select on table "public"."neighborhoods" to "service_role";

grant trigger on table "public"."neighborhoods" to "service_role";

grant truncate on table "public"."neighborhoods" to "service_role";

grant update on table "public"."neighborhoods" to "service_role";

grant delete on table "public"."states" to "anon";

grant insert on table "public"."states" to "anon";

grant references on table "public"."states" to "anon";

grant select on table "public"."states" to "anon";

grant trigger on table "public"."states" to "anon";

grant truncate on table "public"."states" to "anon";

grant update on table "public"."states" to "anon";

grant delete on table "public"."states" to "authenticated";

grant insert on table "public"."states" to "authenticated";

grant references on table "public"."states" to "authenticated";

grant select on table "public"."states" to "authenticated";

grant trigger on table "public"."states" to "authenticated";

grant truncate on table "public"."states" to "authenticated";

grant update on table "public"."states" to "authenticated";

grant delete on table "public"."states" to "service_role";

grant insert on table "public"."states" to "service_role";

grant references on table "public"."states" to "service_role";

grant select on table "public"."states" to "service_role";

grant trigger on table "public"."states" to "service_role";

grant truncate on table "public"."states" to "service_role";

grant update on table "public"."states" to "service_role";


