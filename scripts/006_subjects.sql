-- =========================================================
-- scripts/006_subjects.sql
-- Subjects system: progress tracking + medals
-- Run AFTER 004_inventory.sql (medals use inventory_items)
-- =========================================================

-- ── user_subject_progress ──────────────────────────────────
-- Tracks per-user progress through subjects, modules and sections
create table if not exists public.user_subject_progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,

  -- subject level
  subject_id          text not null,
  diagnostic_passed   boolean not null default false,
  subject_completed   boolean not null default false,

  -- granular unlock tracking (stored as JSON arrays of IDs)
  -- e.g. unlocked_modules: ["english-m1", "english-m2"]
  unlocked_modules    jsonb not null default '[]'::jsonb,
  -- e.g. unlocked_sections: ["english-m1-s1", "english-m1-s2"]
  unlocked_sections   jsonb not null default '[]'::jsonb,
  -- e.g. completed_sections: ["english-m1-s1"]
  completed_sections  jsonb not null default '[]'::jsonb,
  -- e.g. completed_modules: ["english-m1"]
  completed_modules   jsonb not null default '[]'::jsonb,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint user_subject_progress_unique unique (user_id, subject_id)
);

alter table public.user_subject_progress enable row level security;

create policy "progress_select_own" on public.user_subject_progress
  for select using (auth.uid() = user_id);

create policy "progress_insert_own" on public.user_subject_progress
  for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.user_subject_progress
  for update using (auth.uid() = user_id);

-- ── subject_game_sessions ──────────────────────────────────
-- Links a quiz (game_session) to its origin within a subject
-- so the game-over callback knows where to redirect and what to unlock
create table if not exists public.subject_game_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  session_id   uuid not null references public.game_sessions(id) on delete cascade,

  subject_id   text not null,
  module_id    text,              -- null → diagnostic test
  section_id   text,             -- null → diagnostic test
  quiz_type    text not null      -- 'diagnostic' | 'section'
                 check (quiz_type in ('diagnostic', 'section')),

  created_at   timestamptz not null default now(),

  constraint subject_game_sessions_session_unique unique (session_id)
);

alter table public.subject_game_sessions enable row level security;

create policy "sgs_select_own" on public.subject_game_sessions
  for select using (auth.uid() = user_id);

create policy "sgs_insert_own" on public.subject_game_sessions
  for insert with check (auth.uid() = user_id);