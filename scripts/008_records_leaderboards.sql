-- =========================================================
-- scripts/008_records_leaderboards.sql
-- RECORDS page leaderboards for NEUROQUEST2
-- Run AFTER 001_profiles.sql, 002_game_sessions.sql, 003_questions.sql and 007_streak.sql
-- =========================================================

create or replace function public.get_records_leaderboards(p_limit integer default 50)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_limit integer := least(greatest(coalesce(p_limit, 50), 1), 100);
begin
  return jsonb_build_object(
    'day_streak',
      coalesce((
        select jsonb_agg(to_jsonb(day_streak_rows))
        from (
          select
            (row_number() over (
              order by active_current_streak desc, longest_streak desc, username asc
            ))::integer as rank,
            username,
            active_current_streak::integer as value
          from (
            select
              coalesce(nullif(trim(display_name), ''), 'Aventurero') as username,
              case
                when last_activity_date is null then 0
                when last_activity_date >= current_date - 1 then greatest(current_streak, 0)
                else 0
              end as active_current_streak,
              greatest(longest_streak, 0) as longest_streak
            from public.profiles
          ) streak_source
          order by active_current_streak desc, longest_streak desc, username asc
          limit v_limit
        ) day_streak_rows
      ), '[]'::jsonb),

    'level',
      coalesce((
        select jsonb_agg(to_jsonb(level_rows))
        from (
          select
            (row_number() over (order by level desc, xp desc, username asc))::integer as rank,
            username,
            level::integer as value
          from (
            select
              coalesce(nullif(trim(display_name), ''), 'Aventurero') as username,
              greatest(level, 1) as level,
              greatest(xp, 0) as xp
            from public.profiles
          ) level_source
          order by level desc, xp desc, username asc
          limit v_limit
        ) level_rows
      ), '[]'::jsonb),

    'games_played',
      coalesce((
        select jsonb_agg(to_jsonb(games_rows))
        from (
          select
            (row_number() over (order by games_played desc, level desc, username asc))::integer as rank,
            username,
            games_played::integer as value
          from (
            select
              coalesce(nullif(trim(p.display_name), ''), 'Aventurero') as username,
              coalesce(count(gs.id), 0)::integer as games_played,
              greatest(p.level, 1) as level
            from public.profiles p
            left join public.game_sessions gs on gs.user_id = p.id
            group by p.id, p.display_name, p.level
          ) games_source
          order by games_played desc, level desc, username asc
          limit v_limit
        ) games_rows
      ), '[]'::jsonb),

    'correct_answers',
      coalesce((
        select jsonb_agg(to_jsonb(correct_rows))
        from (
          select
            (row_number() over (order by correct_answers desc, level desc, username asc))::integer as rank,
            username,
            correct_answers::integer as value
          from (
            select
              coalesce(nullif(trim(p.display_name), ''), 'Aventurero') as username,
              coalesce(count(q.id) filter (where q.is_correct is true), 0)::integer as correct_answers,
              greatest(p.level, 1) as level
            from public.profiles p
            left join public.questions q on q.user_id = p.id
            group by p.id, p.display_name, p.level
          ) correct_source
          order by correct_answers desc, level desc, username asc
          limit v_limit
        ) correct_rows
      ), '[]'::jsonb)
  );
end;
$$;

grant execute on function public.get_records_leaderboards(integer) to authenticated;

create index if not exists profiles_records_level_idx
  on public.profiles (level desc, xp desc);

create index if not exists profiles_records_streak_idx
  on public.profiles (current_streak desc, longest_streak desc, last_activity_date);

create index if not exists game_sessions_records_user_idx
  on public.game_sessions (user_id);

create index if not exists questions_records_correct_idx
  on public.questions (user_id, is_correct);