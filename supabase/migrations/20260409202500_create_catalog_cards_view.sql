create or replace view public.catalog_cards_v1 as
with regular_offerings as (
  select
    'offering:' || co.id::text as browse_id,
    'offering'::text as source_type,
    co.id as offering_id,
    cc.id as course_id,
    cc.source_kind,
    cc.is_placeholder,
    false as is_elective,
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
    array_agg(distinct ap.code order by ap.code) as program_codes,
    array_agg(distinct ap.name order by ap.name) as program_names,
    count(distinct ap.code) as shared_program_count,
    eg.code as elective_group_code,
    eg.name as elective_group_name
  from public.curriculum_offerings co
  join public.catalog_courses cc on cc.id = co.catalog_course_id
  join public.offering_audiences oa on oa.offering_id = co.id
  join public.academic_programs ap on ap.id = oa.program_id
  left join public.elective_groups eg on eg.id = co.elective_group_id
  where co.is_elective_slot = false
  group by co.id, cc.id, eg.code, eg.name
),
elective_cards as (
  select
    'elective:' || cc.id::text || ':grade:' || co.grade::text as browse_id,
    'elective_option'::text as source_type,
    null::uuid as offering_id,
    cc.id as course_id,
    cc.source_kind,
    cc.is_placeholder,
    true as is_elective,
    cc.course_code,
    cc.course_name,
    cc.theory_hours,
    cc.practice_hours_raw,
    cc.credits,
    cc.description,
    cc.teachers,
    cc.outcomes,
    cc.grading_components,
    string_agg(distinct co.notes_raw, ' | ' order by co.notes_raw) filter (where co.notes_raw is not null) as notes_raw,
    co.grade,
    case co.grade
      when 1 then '1st Grade'
      when 2 then '2nd Grade'
      when 3 then '3rd Grade'
      when 4 then '4th Grade'
      else concat(co.grade::text, 'th Grade')
    end as grade_label,
    min(co.semester_in_grade) as semester_in_grade,
    min(co.overall_semester) as overall_semester,
    array_agg(distinct ap.code order by ap.code) as program_codes,
    array_agg(distinct ap.name order by ap.name) as program_names,
    count(distinct ap.code) as shared_program_count,
    min(eg.code) as elective_group_code,
    min(eg.name) as elective_group_name
  from public.offering_option_courses ooc
  join public.catalog_courses cc on cc.id = ooc.course_id
  join public.curriculum_offerings co on co.id = ooc.offering_id
  join public.offering_audiences oa on oa.offering_id = co.id
  join public.academic_programs ap on ap.id = oa.program_id
  left join public.elective_groups eg on eg.id = co.elective_group_id
  where cc.is_placeholder = false
  group by cc.id, cc.source_kind, cc.is_placeholder, cc.course_code, cc.course_name, cc.theory_hours, cc.practice_hours_raw, cc.credits, cc.description, cc.teachers, cc.outcomes, cc.grading_components, co.grade
)
select *
from regular_offerings
union all
select *
from elective_cards;

grant select on public.catalog_cards_v1 to anon, authenticated;
