-- =========================================================
-- scripts/010_tutorial.sql
-- Tutorial onboarding fields for profiles
-- Run AFTER 001_profiles.sql
-- =========================================================

alter table public.profiles
  add column if not exists tutorial_completed    boolean     not null default false,
  add column if not exists tutorial_skipped      boolean     not null default false,
  add column if not exists tutorial_completed_at timestamptz          null;

comment on column public.profiles.tutorial_completed    is 'True when the user has finished the full onboarding tutorial';
comment on column public.profiles.tutorial_skipped      is 'True when the user explicitly chose to skip the tutorial';
comment on column public.profiles.tutorial_completed_at is 'Timestamp of when the tutorial was completed';