-- sayedHelth — progress sharing database
-- Paste this whole file into Supabase → SQL Editor → New query → Run. Safe to run more than once.
--
-- Who can see what:
--   * Everyone sees and edits only their own data.
--   * Two people become connected when one enters the other's invite code. The link is mutual.
--   * Connected people can read each other's name and daily progress. Nobody else can.
--   * Meal choices are only uploaded when the owner turns on "share my meal choices" in the app.

-- ---------- Profiles ----------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text not null check (char_length(display_name) between 1 and 40),
  invite_code   text not null unique,
  share_choices boolean not null default false,
  updated_at    timestamptz not null default now()
);

-- ---------- Connections (stored both ways: A→B and B→A) ----------
create table if not exists public.connections (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  friend_id  uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

-- ---------- One row per person per day ----------
create table if not exists public.daily_progress (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  day        date not null,
  meals_done smallint not null default 0 check (meals_done between 0 and 5),
  ins_done   smallint not null default 0 check (ins_done between 0 and 9),
  done       jsonb not null default '{}'::jsonb,   -- which meals are eaten
  ins        jsonb not null default '{}'::jsonb,   -- which instructions are ticked
  sel        jsonb,                                -- chosen options; null unless the owner shares them
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- ---------- Helper: is the current user connected to this person? ----------
create or replace function public.is_connected(other uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from connections where user_id = auth.uid() and friend_id = other);
$$;

-- ---------- Row level security ----------
alter table public.profiles enable row level security;
alter table public.connections enable row level security;
alter table public.daily_progress enable row level security;

drop policy if exists "profiles: read self or connected" on public.profiles;
create policy "profiles: read self or connected" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_connected(id));
drop policy if exists "profiles: insert self" on public.profiles;
create policy "profiles: insert self" on public.profiles
  for insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles: update self" on public.profiles;
create policy "profiles: update self" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "connections: read own" on public.connections;
create policy "connections: read own" on public.connections
  for select to authenticated using (user_id = auth.uid());
-- Connections are created only through connect_with_code() and removed through disconnect().

drop policy if exists "progress: read self or connected" on public.daily_progress;
create policy "progress: read self or connected" on public.daily_progress
  for select to authenticated using (user_id = auth.uid() or public.is_connected(user_id));
drop policy if exists "progress: write self" on public.daily_progress;
create policy "progress: write self" on public.daily_progress
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "progress: update self" on public.daily_progress;
create policy "progress: update self" on public.daily_progress
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "progress: delete self" on public.daily_progress;
create policy "progress: delete self" on public.daily_progress
  for delete to authenticated using (user_id = auth.uid());

-- ---------- Create my profile with a fresh invite code ----------
create or replace function public.ensure_profile(name text)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare
  p public.profiles;
  code text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into p from profiles where id = auth.uid();
  if found then
    if name is not null and char_length(trim(name)) between 1 and 40 and p.display_name <> trim(name) then
      update profiles set display_name = trim(name), updated_at = now() where id = auth.uid() returning * into p;
    end if;
    return p;
  end if;
  loop
    -- 6 characters, no look-alikes (0/O, 1/I)
    code := (select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '')
             from generate_series(1, 6));
    exit when not exists (select 1 from profiles where invite_code = code);
  end loop;
  insert into profiles (id, display_name, invite_code)
  values (auth.uid(), coalesce(nullif(trim(name), ''), 'sayedHelth'), code)
  returning * into p;
  return p;
end;
$$;

-- ---------- Connect with someone's invite code (mutual) ----------
create or replace function public.connect_with_code(code text)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare
  other public.profiles;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into other from profiles where invite_code = upper(trim(code));
  if not found then raise exception 'code_not_found'; end if;
  if other.id = auth.uid() then raise exception 'own_code'; end if;
  insert into connections (user_id, friend_id) values (auth.uid(), other.id) on conflict do nothing;
  insert into connections (user_id, friend_id) values (other.id, auth.uid()) on conflict do nothing;
  return other;
end;
$$;

-- ---------- Remove a connection (both ways) ----------
create or replace function public.disconnect(other uuid)
returns void language sql security definer set search_path = public as $$
  delete from connections
  where (user_id = auth.uid() and friend_id = other) or (user_id = other and friend_id = auth.uid());
$$;

-- ---------- Make a new invite code (old one stops working; existing connections stay) ----------
create or replace function public.new_invite_code()
returns text language plpgsql security definer set search_path = public as $$
declare code text;
begin
  loop
    code := (select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '')
             from generate_series(1, 6));
    exit when not exists (select 1 from profiles where invite_code = code);
  end loop;
  update profiles set invite_code = code, updated_at = now() where id = auth.uid();
  return code;
end;
$$;

revoke execute on function public.ensure_profile(text), public.connect_with_code(text),
  public.disconnect(uuid), public.new_invite_code(), public.is_connected(uuid) from public, anon;
grant execute on function public.ensure_profile(text), public.connect_with_code(text),
  public.disconnect(uuid), public.new_invite_code(), public.is_connected(uuid) to authenticated;
