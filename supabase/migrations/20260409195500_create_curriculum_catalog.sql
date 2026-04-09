create extension if not exists pgcrypto;

create table if not exists public.academic_programs (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  faculty text not null default 'IT Faculty',
  degree text not null default 'Bachelor',
  language text not null default 'EN',
  source_title text,
  source_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.elective_groups (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  scope text not null default 'it-faculty',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_courses (
  id uuid primary key default gen_random_uuid(),
  source_hash text not null unique,
  source_kind text not null default 'catalog',
  is_placeholder boolean not null default false,
  course_code text not null,
  course_name text not null,
  theory_hours integer not null default 0,
  practice_hours_raw text not null default '0+0',
  credits integer not null default 0,
  description text,
  teachers jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  grading_components jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_courses_teachers_is_array check (jsonb_typeof(teachers) = 'array'),
  constraint catalog_courses_outcomes_is_array check (jsonb_typeof(outcomes) = 'array'),
  constraint catalog_courses_grading_components_is_array check (jsonb_typeof(grading_components) = 'array')
);

create index if not exists catalog_courses_course_code_idx on public.catalog_courses (course_code);
create index if not exists catalog_courses_course_name_idx on public.catalog_courses (course_name);

create table if not exists public.curriculum_offerings (
  id uuid primary key default gen_random_uuid(),
  source_hash text not null unique,
  catalog_course_id uuid not null references public.catalog_courses(id) on delete cascade,
  grade smallint not null check (grade between 1 and 4),
  semester_in_grade smallint not null check (semester_in_grade in (1, 2)),
  overall_semester smallint not null check (overall_semester between 1 and 8),
  row_number integer,
  semester_total_credits integer,
  notes_raw text,
  elective_group_id uuid references public.elective_groups(id) on delete set null,
  is_marked boolean not null default false,
  is_elective_slot boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists curriculum_offerings_grade_idx on public.curriculum_offerings (grade);
create index if not exists curriculum_offerings_semester_idx on public.curriculum_offerings (overall_semester);
create index if not exists curriculum_offerings_course_idx on public.curriculum_offerings (catalog_course_id);
create index if not exists curriculum_offerings_elective_group_idx on public.curriculum_offerings (elective_group_id);

create table if not exists public.offering_audiences (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.curriculum_offerings(id) on delete cascade,
  program_id uuid not null references public.academic_programs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (offering_id, program_id)
);

create index if not exists offering_audiences_program_idx on public.offering_audiences (program_id);
create index if not exists offering_audiences_offering_idx on public.offering_audiences (offering_id);

create table if not exists public.elective_group_courses (
  id uuid primary key default gen_random_uuid(),
  elective_group_id uuid not null references public.elective_groups(id) on delete cascade,
  course_id uuid not null references public.catalog_courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (elective_group_id, course_id)
);

create table if not exists public.offering_option_courses (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.curriculum_offerings(id) on delete cascade,
  course_id uuid not null references public.catalog_courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (offering_id, course_id)
);

create or replace view public.catalog_offerings_v1 as
with shared_programs as (
  select
    oa.offering_id,
    array_agg(ap.code order by ap.code) as shared_program_codes,
    array_agg(ap.name order by ap.code) as shared_program_names
  from public.offering_audiences oa
  join public.academic_programs ap on ap.id = oa.program_id
  group by oa.offering_id
),
option_courses as (
  select
    ooc.offering_id,
    array_agg(cc.course_code order by cc.course_code) as option_course_codes,
    array_agg(cc.course_name order by cc.course_code) as option_course_names
  from public.offering_option_courses ooc
  join public.catalog_courses cc on cc.id = ooc.course_id
  group by ooc.offering_id
)
select
  oa.id as audience_id,
  oa.offering_id,
  ap.id as program_id,
  ap.code as program_code,
  ap.name as program_name,
  co.grade,
  case co.grade
    when 1 then '1st Grade'
    when 2 then '2nd Grade'
    when 3 then '3rd Grade'
    when 4 then '4th Grade'
    else concat(co.grade::text, 'th Grade')
  end as grade_label,
  co.semester_in_grade,
  co.overall_semester,
  cc.id as course_id,
  cc.source_kind,
  cc.is_placeholder,
  cc.course_code,
  cc.course_name,
  cc.theory_hours,
  cc.practice_hours_raw,
  cc.credits,
  cc.description,
  cc.teachers,
  cc.outcomes,
  cc.grading_components,
  co.notes_raw,
  co.is_marked,
  co.is_elective_slot,
  eg.code as elective_group_code,
  eg.name as elective_group_name,
  sp.shared_program_codes,
  sp.shared_program_names,
  coalesce(array_length(sp.shared_program_codes, 1), 0) as shared_program_count,
  oc.option_course_codes,
  oc.option_course_names
from public.offering_audiences oa
join public.curriculum_offerings co on co.id = oa.offering_id
join public.academic_programs ap on ap.id = oa.program_id
join public.catalog_courses cc on cc.id = co.catalog_course_id
left join public.elective_groups eg on eg.id = co.elective_group_id
left join shared_programs sp on sp.offering_id = co.id
left join option_courses oc on oc.offering_id = co.id;

grant select on public.academic_programs to anon, authenticated;
grant select on public.elective_groups to anon, authenticated;
grant select on public.catalog_courses to anon, authenticated;
grant select on public.curriculum_offerings to anon, authenticated;
grant select on public.offering_audiences to anon, authenticated;
grant select on public.elective_group_courses to anon, authenticated;
grant select on public.offering_option_courses to anon, authenticated;
grant select on public.catalog_offerings_v1 to anon, authenticated;
