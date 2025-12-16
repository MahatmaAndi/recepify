-- Enable UUID helpers
create extension if not exists "pgcrypto";

create table if not exists public.recipe (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    meal_type text,
    difficulty text,
    prep_time text,
    cook_time text,
    total_time text,
    servings text,
    nutrition_calories text,
    nutrition_protein text,
    nutrition_carbs text,
    nutrition_fat text,
    chef_notes text,
    source_platform text not null,
    source_url text not null,
    source_domain text,
    imported_at timestamptz not null default timezone('utc'::text, now()),
    media_video_url text,
    media_image_url text,
    media_local_path text
);

create table if not exists public.ingredient (
    id uuid primary key default gen_random_uuid(),
    recipe_id uuid not null references public.recipe(id) on delete cascade,
    line text not null,
    amount text,
    name text
);
create index if not exists idx_ingredient_recipe on public.ingredient(recipe_id);

create table if not exists public.instruction_step (
    id uuid primary key default gen_random_uuid(),
    recipe_id uuid not null references public.recipe(id) on delete cascade,
    step_number integer not null,
    text text not null
);
create index if not exists idx_instruction_recipe on public.instruction_step(recipe_id);

create table if not exists public.recipe_tag (
    id uuid primary key default gen_random_uuid(),
    recipe_id uuid not null references public.recipe(id) on delete cascade,
    name text not null
);
create index if not exists idx_recipe_tag_recipe on public.recipe_tag(recipe_id);
