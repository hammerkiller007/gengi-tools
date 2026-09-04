-- Gengiai · migration 0001 · core tables
-- Paste into Supabase → SQL Editor → Run.

-- ---------- enums ----------
create type background as enum ('student','founder','operator','smb_owner');
create type visibility as enum ('public','anonymous','private');
create type vote_kind as enum ('invest','pivot','kill');

-- ---------- profiles (1:1 with auth.users) ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null check (handle ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null,
  background background not null default 'student',
  city text,
  skills text[] not null default '{}',
  bio text,
  karma int not null default 0,
  created_at timestamptz not null default now()
);

-- auto-create a profile row when a user signs up
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, handle, display_name)
  values (
    new.id,
    'u_' || substr(replace(new.id::text,'-',''),1,10),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New member')
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------- rooms ----------
create table rooms (
  slug text primary key,
  name text not null,
  description text,
  sort int not null default 0
);
insert into rooms (slug,name,description,sort) values
 ('pitch','Pitch','New ideas, in the template. This is the wall.',1),
 ('teardown','Tear it down','Four questions, specific and kind.',2),
 ('buildtogether','Build together','Sprints looking for members, prototypes, demo days.',3),
 ('askafounder','Ask a founder','Verified founders and operators answer weekly.',4),
 ('weeklyproblem','This week''s problem','The Idea Jam board. Resets every Monday.',5);

-- ---------- ideas ----------
create table ideas (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  room_slug text not null references rooms(slug) default 'pitch',
  title text not null check (char_length(title) between 5 and 140),
  problem text not null,
  who_pays text,
  biggest_doubt text,
  tags text[] not null default '{}',
  visibility visibility not null default 'public',
  evolution jsonb not null default '[]',      -- [{at, note}]
  invest_count int not null default 0,
  pivot_count int not null default 0,
  kill_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ideas_room_created on ideas (room_slug, created_at desc);
create index ideas_created on ideas (created_at desc);

-- ---------- votes (Invest / Pivot / Kill) ----------
create table votes (
  idea_id uuid not null references ideas(id) on delete cascade,
  voter_id uuid not null references profiles(id) on delete cascade,
  kind vote_kind not null,
  created_at timestamptz not null default now(),
  primary key (idea_id, voter_id)
);

-- keep counters on ideas in sync
create or replace function sync_vote_counts() returns trigger
language plpgsql as $$
declare iid uuid := coalesce(new.idea_id, old.idea_id);
begin
  update ideas set
    invest_count = (select count(*) from votes where idea_id = iid and kind='invest'),
    pivot_count  = (select count(*) from votes where idea_id = iid and kind='pivot'),
    kill_count   = (select count(*) from votes where idea_id = iid and kind='kill')
  where id = iid;
  return null;
end $$;
create trigger votes_sync after insert or update or delete on votes
  for each row execute procedure sync_vote_counts();

-- ---------- critiques (the four questions) ----------
create table critiques (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  anonymous boolean not null default false,
  real_customer text not null,
  biggest_risk text not null,
  would_pay text not null,
  change_one_thing text not null,
  conviction smallint not null check (conviction between 1 and 5),
  helpful_count int not null default 0,
  created_at timestamptz not null default now()
);
create index critiques_idea on critiques (idea_id, created_at desc);

create table critique_helpful (
  critique_id uuid references critiques(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (critique_id, user_id)
);

-- ---------- row-level security ----------
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table ideas enable row level security;
alter table votes enable row level security;
alter table critiques enable row level security;
alter table critique_helpful enable row level security;

-- profiles: everyone can read, you edit only yours
create policy "profiles read" on profiles for select using (true);
create policy "profiles update own" on profiles for update using (auth.uid() = id);

-- rooms: read-only for everyone
create policy "rooms read" on rooms for select using (true);

-- ideas: public/anonymous visible to all; private only to the author (groups extend this in 0002)
create policy "ideas read" on ideas for select
  using (visibility <> 'private' or auth.uid() = author_id);
create policy "ideas insert own" on ideas for insert with check (auth.uid() = author_id);
create policy "ideas update own" on ideas for update using (auth.uid() = author_id);
create policy "ideas delete own" on ideas for delete using (auth.uid() = author_id);

-- votes: readable, one per user per idea, editable by the voter
create policy "votes read" on votes for select using (true);
create policy "votes write own" on votes for insert with check (auth.uid() = voter_id);
create policy "votes update own" on votes for update using (auth.uid() = voter_id);
create policy "votes delete own" on votes for delete using (auth.uid() = voter_id);

-- critiques: readable on ideas you can see; write your own
create policy "critiques read" on critiques for select
  using (exists (select 1 from ideas i where i.id = idea_id
                 and (i.visibility <> 'private' or i.author_id = auth.uid())));
create policy "critiques insert own" on critiques for insert with check (auth.uid() = author_id);
create policy "critiques update own" on critiques for update using (auth.uid() = author_id);

create policy "helpful read" on critique_helpful for select using (true);
create policy "helpful write own" on critique_helpful for insert with check (auth.uid() = user_id);
create policy "helpful delete own" on critique_helpful for delete using (auth.uid() = user_id);

-- ---------- public view that hides authors of anonymous ideas ----------
create view ideas_public as
select i.id, i.room_slug, i.title, i.problem, i.who_pays, i.biggest_doubt, i.tags,
       i.visibility, i.evolution, i.invest_count, i.pivot_count, i.kill_count,
       i.created_at, i.updated_at,
       case when i.visibility = 'anonymous' then null else i.author_id end as author_id,
       case when i.visibility = 'anonymous' then 'Anonymous' else p.display_name end as author_name,
       case when i.visibility = 'anonymous' then null else p.handle end as author_handle
from ideas i join profiles p on p.id = i.author_id;
