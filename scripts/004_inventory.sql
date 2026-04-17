-- =========================================================
-- TABLE: inventory_items
-- Power-up items owned by each player
-- =========================================================
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null
    check (item_type in ('extra_life', 'fifty_fifty', 'skip_question', 'double_xp', 'hint')),
  item_name text not null,
  item_description text,
  quantity int not null default 1,
  icon text not null default '⚡',
  created_at timestamptz not null default now(),
  constraint inventory_items_user_type_unique unique (user_id, item_type)
);

alter table public.inventory_items enable row level security;

create policy "inventory_items_select_own" on public.inventory_items
  for select using (auth.uid() = user_id);

create policy "inventory_items_insert_own" on public.inventory_items
  for insert with check (auth.uid() = user_id);

create policy "inventory_items_update_own" on public.inventory_items
  for update using (auth.uid() = user_id);

create policy "inventory_items_delete_own" on public.inventory_items
  for delete using (auth.uid() = user_id);
