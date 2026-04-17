-- =========================================================
-- TABLE: game_sessions
-- Matches exactly what the application code expects
-- =========================================================
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pdf_name text not null,
  difficulty text not null check (difficulty in ('easy', 'normal', 'hard')),
  total_questions int not null default 0,
  correct_answers int not null default 0,
  wrong_answers int not null default 0,
  lives_remaining int not null default 3,
  xp_earned int not null default 0,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'victory', 'defeat', 'abandoned')),
  current_question_index int not null default 0,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.game_sessions enable row level security;

create policy "game_sessions_select_own" on public.game_sessions
  for select using (auth.uid() = user_id);

create policy "game_sessions_insert_own" on public.game_sessions
  for insert with check (auth.uid() = user_id);

create policy "game_sessions_update_own" on public.game_sessions
  for update using (auth.uid() = user_id);

create policy "game_sessions_delete_own" on public.game_sessions
  for delete using (auth.uid() = user_id);
