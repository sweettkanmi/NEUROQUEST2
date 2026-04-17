-- =========================================================
-- TABLE: chests
-- Cofres ganados por el jugador al completar partidas
-- =========================================================
create table if not exists public.chests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_session_id uuid references public.game_sessions(id) on delete set null,
  opened boolean not null default false,
  opened_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.chests enable row level security;

create policy "chests_select_own" on public.chests
  for select using (auth.uid() = user_id);

create policy "chests_insert_own" on public.chests
  for insert with check (auth.uid() = user_id);

create policy "chests_update_own" on public.chests
  for update using (auth.uid() = user_id);

create policy "chests_delete_own" on public.chests
  for delete using (auth.uid() = user_id);