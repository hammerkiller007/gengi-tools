-- Gengiai · migration 0002 · pitch/half-baked model, verdict notes, groups
-- Paste into Supabase → SQL Editor → Run.
-- Additive only — safe even if 0001 tables are non-empty, EXCEPT the two
-- "not null" columns added to ideas/votes below assume those tables are
-- currently empty (true for gengiai.com as of this migration: 0 pitches).
-- If you already have rows, backfill first or drop the "not null" / add a
-- default before running.

-- ---------- post kind + founder-reported outcome ----------
alter table ideas
  add column kind text not null default 'pitch' check (kind in ('pitch','half_baked')),
  add column outcome text check (outcome in ('built','pivoted','killed'));

-- half-baked posts use `problem` as the freeform thought and `who_pays` as
-- the "still figuring out" field — no schema change needed for that reuse.

-- ---------- groups (topical communities, separate from rooms) ----------
create table groups (
  slug text primary key,
  name text not null,
  sort int not null default 0
);
insert into groups (slug, name, sort) values
 ('consumer','Consumer & D2C',1),
 ('b2b','B2B & SaaS',2),
 ('hiring','Hiring & Talent',3),
 ('local','Local & Services',4),
 ('fundraising','Fundraising',5);

alter table ideas add column group_slug text references groups(slug);

alter table groups enable row level security;
create policy "groups read" on groups for select using (true);

-- ---------- verdicts need a sentence ----------
alter table votes
  add column note text not null default '' check (char_length(trim(note)) > 0);
alter table votes alter column note drop default;

-- ---------- helpful indexes ----------
create index ideas_kind_created on ideas (kind, created_at desc);
create index ideas_group_created on ideas (group_slug, created_at desc);
create index ideas_invest_count on ideas (invest_count desc);

-- ---------- refresh the public view to carry the new columns ----------
create or replace view ideas_public as
select i.id, i.room_slug, i.group_slug, i.kind, i.outcome, i.title, i.problem, i.who_pays,
       i.biggest_doubt, i.tags, i.visibility, i.evolution, i.invest_count, i.pivot_count,
       i.kill_count, i.created_at, i.updated_at,
       case when i.visibility = 'anonymous' then null else i.author_id end as author_id,
       case when i.visibility = 'anonymous' then 'Anonymous' else p.display_name end as author_name,
       case when i.visibility = 'anonymous' then null else p.handle end as author_handle
from ideas i join profiles p on p.id = i.author_id;
