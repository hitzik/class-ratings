-- =====================================================================
-- Class Ratings: database setup.
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run once on a fresh project.
-- =====================================================================

-- ---------- Tables ----------
create table teachers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  active     boolean not null default true,      -- deactivate instead of delete, keeps history
  created_at timestamptz not null default now()
);

create table classes (
  id                  uuid primary key default gen_random_uuid(),
  grade               text not null,              -- 'ז׳', 'י״א', ...
  number              int  not null,              -- parallel class number
  homeroom_teacher_id uuid references teachers(id),
  school_year         text not null,              -- '2026-2027'
  unique (grade, number, school_year)
);

create table ratings (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references classes(id),
  teacher_id  uuid not null references teachers(id),
  score       int  not null check (score between 1 and 10),
  comment     text not null default '' check (length(comment) <= 1000),
  school_year text not null,
  status      text not null default 'new',        -- reserved for homeroom-teacher actions
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index ratings_class_idx   on ratings (class_id, created_at desc);
create index ratings_teacher_idx on ratings (teacher_id, created_at desc);

-- ---------- Access rules (Row Level Security) ----------
-- The app uses name-only login, so the public (anon) key may:
--   read teachers / classes / ratings, and add new ratings.
-- It may NOT edit or delete anything, or change teachers/classes.
grant select         on teachers, classes to anon;
grant select, insert on ratings           to anon;

alter table teachers enable row level security;
alter table classes  enable row level security;
alter table ratings  enable row level security;

create policy "read teachers" on teachers for select to anon using (active);
create policy "read classes"  on classes  for select to anon using (true);
create policy "read ratings"  on ratings  for select to anon using (true);
create policy "add ratings"   on ratings  for insert to anon with check (status = 'new');

-- ---------- SAMPLE data (will be replaced with the real lists) ----------
insert into teachers (name) values
  ('אורטל כהן'), ('מיכל לוי'), ('דני אברהם'), ('רונית מזרחי'),
  ('יוסי פרץ'), ('שירה ביטון'), ('נועה דהן'), ('אבי שושן');

insert into classes (grade, number, homeroom_teacher_id, school_year)
select c.grade, c.number, t.id, '2026-2027'
from (values
  ('ז׳', 1, 'אורטל כהן'),
  ('ז׳', 2, 'מיכל לוי'),
  ('ז׳', 3, 'דני אברהם'),
  ('ח׳', 1, 'רונית מזרחי'),
  ('ח׳', 2, 'יוסי פרץ'),
  ('ט׳', 1, 'שירה ביטון'),
  ('ט׳', 2, null)
) as c(grade, number, homeroom)
left join teachers t on t.name = c.homeroom;
