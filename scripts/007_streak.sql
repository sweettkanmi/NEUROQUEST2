-- =========================================================
-- scripts/007_streak.sql
-- Daily Streak System for NEUROQUEST2
-- Run AFTER 001_profiles.sql
-- =========================================================

-- ── 1. Add streak columns to profiles ────────────────────
alter table public.profiles
  add column if not exists current_streak   int         not null default 0,
  add column if not exists longest_streak   int         not null default 0,
  add column if not exists last_activity_date date       null,
  add column if not exists streak_updated_at timestamptz null;

comment on column public.profiles.current_streak    is 'Number of consecutive days the user completed at least one quiz or study module';
comment on column public.profiles.longest_streak    is 'All-time longest streak achieved by this user';
comment on column public.profiles.last_activity_date is 'UTC date of the last qualifying activity (quiz/module completion)';
comment on column public.profiles.streak_updated_at  is 'Timestamp of the last streak write — used for idempotency';

-- ── 2. Server-side function: update_user_streak() ────────
-- This function is called by both API routes (game/answer and
-- subjects/complete-quiz) after a session is finished.
-- It is SECURITY DEFINER so the anon/service key can call it
-- from the API without needing direct UPDATE on profiles.
--
-- Logic:
--   • TODAY  = current_date in UTC
--   • If last_activity_date IS NULL            → first ever activity, streak = 1
--   • If last_activity_date = TODAY            → already counted today, no-op
--   • If last_activity_date = TODAY - 1        → consecutive day, streak + 1
--   • If last_activity_date < TODAY - 1        → gap detected, reset to 1
--   • longest_streak is updated whenever current_streak exceeds it
--
-- Returns a JSON object:
--   { "current_streak": N, "longest_streak": N, "already_counted": bool }
-- ─────────────────────────────────────────────────────────
create or replace function public.update_user_streak(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today              date := current_date;  -- UTC date
  v_last_date          date;
  v_current_streak     int;
  v_longest_streak     int;
  v_already_counted    boolean := false;
  v_new_streak         int;
  v_new_longest        int;
begin
  -- Fetch current values with a row-level lock to prevent race conditions
  select
    last_activity_date,
    current_streak,
    longest_streak
  into
    v_last_date,
    v_current_streak,
    v_longest_streak
  from public.profiles
  where id = p_user_id
  for update;

  -- Guard: profile row must exist
  if not found then
    raise exception 'Profile not found for user %', p_user_id;
  end if;

  -- ── Decision tree ──────────────────────────────────────
  if v_last_date is null then
    -- First ever activity
    v_new_streak := 1;

  elsif v_last_date = v_today then
    -- Already recorded today — idempotent, do nothing
    v_already_counted := true;
    v_new_streak := v_current_streak;

  elsif v_last_date = v_today - interval '1 day' then
    -- Consecutive day
    v_new_streak := v_current_streak + 1;

  else
    -- Missed one or more days → reset
    v_new_streak := 1;

  end if;

  -- Update longest streak record
  v_new_longest := greatest(v_longest_streak, v_new_streak);

  -- Persist (skip write if nothing changed)
  if not v_already_counted then
    update public.profiles
    set
      current_streak     = v_new_streak,
      longest_streak     = v_new_longest,
      last_activity_date = v_today,
      streak_updated_at  = now()
    where id = p_user_id;
  end if;

  return jsonb_build_object(
    'current_streak',  v_new_streak,
    'longest_streak',  v_new_longest,
    'already_counted', v_already_counted
  );
end;
$$;

-- Allow authenticated users to call this function via RPC
grant execute on function public.update_user_streak(uuid) to authenticated;

-- ── 3. Helper view: streak_status (optional, for analytics) ──
-- Returns per-user streak info with a computed boolean
-- "active_today" so the frontend can query with a single RPC call.
create or replace view public.streak_status as
select
  id                                            as user_id,
  current_streak,
  longest_streak,
  last_activity_date,
  (last_activity_date = current_date)           as active_today,
  streak_updated_at
from public.profiles;

-- RLS on the view is inherited from profiles; no extra policy needed.-- =========================================================
-- scripts/007_streak.sql
-- Daily Streak System for NEUROQUEST2
-- Run AFTER 001_profiles.sql
-- =========================================================

-- ── 1. Add streak columns to profiles ────────────────────
alter table public.profiles
  add column if not exists current_streak   int         not null default 0,
  add column if not exists longest_streak   int         not null default 0,
  add column if not exists last_activity_date date       null,
  add column if not exists streak_updated_at timestamptz null;

comment on column public.profiles.current_streak    is 'Number of consecutive days the user completed at least one quiz or study module';
comment on column public.profiles.longest_streak    is 'All-time longest streak achieved by this user';
comment on column public.profiles.last_activity_date is 'UTC date of the last qualifying activity (quiz/module completion)';
comment on column public.profiles.streak_updated_at  is 'Timestamp of the last streak write — used for idempotency';

-- ── 2. Server-side function: update_user_streak() ────────
-- This function is called by both API routes (game/answer and
-- subjects/complete-quiz) after a session is finished.
-- It is SECURITY DEFINER so the anon/service key can call it
-- from the API without needing direct UPDATE on profiles.
--
-- Logic:
--   • TODAY  = current_date in UTC
--   • If last_activity_date IS NULL            → first ever activity, streak = 1
--   • If last_activity_date = TODAY            → already counted today, no-op
--   • If last_activity_date = TODAY - 1        → consecutive day, streak + 1
--   • If last_activity_date < TODAY - 1        → gap detected, reset to 1
--   • longest_streak is updated whenever current_streak exceeds it
--
-- Returns a JSON object:
--   { "current_streak": N, "longest_streak": N, "already_counted": bool }
-- ─────────────────────────────────────────────────────────
create or replace function public.update_user_streak(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today              date := current_date;  -- UTC date
  v_last_date          date;
  v_current_streak     int;
  v_longest_streak     int;
  v_already_counted    boolean := false;
  v_new_streak         int;
  v_new_longest        int;
begin
  -- Fetch current values with a row-level lock to prevent race conditions
  select
    last_activity_date,
    current_streak,
    longest_streak
  into
    v_last_date,
    v_current_streak,
    v_longest_streak
  from public.profiles
  where id = p_user_id
  for update;

  -- Guard: profile row must exist
  if not found then
    raise exception 'Profile not found for user %', p_user_id;
  end if;

  -- ── Decision tree ──────────────────────────────────────
  if v_last_date is null then
    -- First ever activity
    v_new_streak := 1;

  elsif v_last_date = v_today then
    -- Already recorded today — idempotent, do nothing
    v_already_counted := true;
    v_new_streak := v_current_streak;

  elsif v_last_date = v_today - interval '1 day' then
    -- Consecutive day
    v_new_streak := v_current_streak + 1;

  else
    -- Missed one or more days → reset
    v_new_streak := 1;

  end if;

  -- Update longest streak record
  v_new_longest := greatest(v_longest_streak, v_new_streak);

  -- Persist (skip write if nothing changed)
  if not v_already_counted then
    update public.profiles
    set
      current_streak     = v_new_streak,
      longest_streak     = v_new_longest,
      last_activity_date = v_today,
      streak_updated_at  = now()
    where id = p_user_id;
  end if;

  return jsonb_build_object(
    'current_streak',  v_new_streak,
    'longest_streak',  v_new_longest,
    'already_counted', v_already_counted
  );
end;
$$;

-- Allow authenticated users to call this function via RPC
grant execute on function public.update_user_streak(uuid) to authenticated;

-- ── 3. Helper view: streak_status (optional, for analytics) ──
-- Returns per-user streak info with a computed boolean
-- "active_today" so the frontend can query with a single RPC call.
create or replace view public.streak_status as
select
  id                                            as user_id,
  current_streak,
  longest_streak,
  last_activity_date,
  (last_activity_date = current_date)           as active_today,
  streak_updated_at
from public.profiles;

-- RLS on the view is inherited from profiles; no extra policy needed.-- =========================================================
-- scripts/007_streak.sql
-- Daily Streak System for NEUROQUEST2
-- Run AFTER 001_profiles.sql
-- =========================================================

-- ── 1. Add streak columns to profiles ────────────────────
alter table public.profiles
  add column if not exists current_streak   int         not null default 0,
  add column if not exists longest_streak   int         not null default 0,
  add column if not exists last_activity_date date       null,
  add column if not exists streak_updated_at timestamptz null;

comment on column public.profiles.current_streak    is 'Number of consecutive days the user completed at least one quiz or study module';
comment on column public.profiles.longest_streak    is 'All-time longest streak achieved by this user';
comment on column public.profiles.last_activity_date is 'UTC date of the last qualifying activity (quiz/module completion)';
comment on column public.profiles.streak_updated_at  is 'Timestamp of the last streak write — used for idempotency';

-- ── 2. Server-side function: update_user_streak() ────────
-- This function is called by both API routes (game/answer and
-- subjects/complete-quiz) after a session is finished.
-- It is SECURITY DEFINER so the anon/service key can call it
-- from the API without needing direct UPDATE on profiles.
--
-- Logic:
--   • TODAY  = current_date in UTC
--   • If last_activity_date IS NULL            → first ever activity, streak = 1
--   • If last_activity_date = TODAY            → already counted today, no-op
--   • If last_activity_date = TODAY - 1        → consecutive day, streak + 1
--   • If last_activity_date < TODAY - 1        → gap detected, reset to 1
--   • longest_streak is updated whenever current_streak exceeds it
--
-- Returns a JSON object:
--   { "current_streak": N, "longest_streak": N, "already_counted": bool }
-- ─────────────────────────────────────────────────────────
create or replace function public.update_user_streak(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today              date := current_date;  -- UTC date
  v_last_date          date;
  v_current_streak     int;
  v_longest_streak     int;
  v_already_counted    boolean := false;
  v_new_streak         int;
  v_new_longest        int;
begin
  -- Fetch current values with a row-level lock to prevent race conditions
  select
    last_activity_date,
    current_streak,
    longest_streak
  into
    v_last_date,
    v_current_streak,
    v_longest_streak
  from public.profiles
  where id = p_user_id
  for update;

  -- Guard: profile row must exist
  if not found then
    raise exception 'Profile not found for user %', p_user_id;
  end if;

  -- ── Decision tree ──────────────────────────────────────
  if v_last_date is null then
    -- First ever activity
    v_new_streak := 1;

  elsif v_last_date = v_today then
    -- Already recorded today — idempotent, do nothing
    v_already_counted := true;
    v_new_streak := v_current_streak;

  elsif v_last_date = v_today - interval '1 day' then
    -- Consecutive day
    v_new_streak := v_current_streak + 1;

  else
    -- Missed one or more days → reset
    v_new_streak := 1;

  end if;

  -- Update longest streak record
  v_new_longest := greatest(v_longest_streak, v_new_streak);

  -- Persist (skip write if nothing changed)
  if not v_already_counted then
    update public.profiles
    set
      current_streak     = v_new_streak,
      longest_streak     = v_new_longest,
      last_activity_date = v_today,
      streak_updated_at  = now()
    where id = p_user_id;
  end if;

  return jsonb_build_object(
    'current_streak',  v_new_streak,
    'longest_streak',  v_new_longest,
    'already_counted', v_already_counted
  );
end;
$$;

-- Allow authenticated users to call this function via RPC
grant execute on function public.update_user_streak(uuid) to authenticated;

-- ── 3. Helper view: streak_status (optional, for analytics) ──
-- Returns per-user streak info with a computed boolean
-- "active_today" so the frontend can query with a single RPC call.
create or replace view public.streak_status as
select
  id                                            as user_id,
  current_streak,
  longest_streak,
  last_activity_date,
  (last_activity_date = current_date)           as active_today,
  streak_updated_at
from public.profiles;

-- RLS on the view is inherited from profiles; no extra policy needed.