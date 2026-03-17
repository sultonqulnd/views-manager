create table if not exists public.grid_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grid_id text not null,
  name text not null,
  config jsonb not null default '{}',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_grid_views_user_grid on public.grid_views(user_id, grid_id);

alter table public.grid_views enable row level security;

create policy "Users can manage own grid_views"
  on public.grid_views
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
