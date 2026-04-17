-- =========================================================
-- TABLE: questions
-- Matches exactly what the application code expects
-- =========================================================
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_text text not null,
  options jsonb not null,                  -- string[]
  correct_option int not null,             -- 0-based index
  explanation text,
  difficulty text not null,
  question_index int not null,
  answered boolean not null default false,
  user_answer int,                         -- 0-based index, -1 = skipped
  is_correct boolean,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;

create policy "questions_select_own" on public.questions
  for select using (auth.uid() = user_id);

create policy "questions_insert_own" on public.questions
  for insert with check (auth.uid() = user_id);

create policy "questions_update_own" on public.questions
  for update using (auth.uid() = user_id);
