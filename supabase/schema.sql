-- Supabase (PostgreSQL) schema for the class-ratings app.
-- Run in Supabase → SQL Editor once we move off localStorage.

create table teachers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  active     boolean not null default true,      -- deactivate instead of delete, keeps history
  created_at timestamptz not null default now()
);

create table classes (
  id                   uuid primary key default gen_random_uuid(),
  grade                text not null,             -- 'ז׳', 'י״א', ...
  number               int  not null,             -- parallel class number
  homeroom_teacher_id  uuid references teachers(id),
  school_year          text not null,             -- '2026-2027' (homeroom assignment can change yearly)
  unique (grade, number, school_year)
);

create table ratings (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references classes(id),
  teacher_id  uuid not null references teachers(id),
  score       int  not null check (score between 1 and 10),
  comment     text not null default '',
  school_year text not null,
  status      text not null default 'new',       -- reserved for homeroom-teacher actions (e.g. 'handled')
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index ratings_class_idx   on ratings (class_id, created_at desc);
create index ratings_teacher_idx on ratings (teacher_id, created_at desc);
