import { createPublicSupabaseClient } from "@/lib/supabase/public-client";
import type { Json } from "@/types/database";
import type { Database } from "@/types/database";

import type { Course, CourseComponent, Department, StudyGrade } from "./types";

type CatalogCardRow = Database["public"]["Views"]["catalog_cards_v1"]["Row"];

const KNOWN_DEPARTMENTS: Department[] = [
  "MATMIE",
  "COMFCI",
  "COMCEH",
  "COMSE",
  "MATDAIS",
  "IEMIT",
  "Elective",
];

function isDepartment(value: string): value is Department {
  return KNOWN_DEPARTMENTS.includes(value as Department);
}

function parseStringArray(value: Json | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function parseCourseComponents(value: Json | null | undefined): CourseComponent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const name = typeof item.name === "string" ? item.name.trim() : "";
    const weight = typeof item.weight === "number" ? item.weight : Number(item.weight);

    if (!name || !Number.isFinite(weight)) {
      return [];
    }

    return [{ name, weight }];
  });
}

function toStudyGradeLabel(value: number | null): StudyGrade {
  switch (value) {
    case 1:
      return "1st Grade";
    case 2:
      return "2nd Grade";
    case 3:
      return "3rd Grade";
    case 4:
    default:
      return "4th Grade";
  }
}

function toDepartments(programCodes: string[] | null | undefined, isElective: boolean) {
  const departments = (programCodes ?? []).filter(isDepartment).filter((code) => code !== "Elective");

  if (departments.length > 0) {
    return departments;
  }

  return isElective ? [] : (["Elective"] satisfies Department[]);
}

function buildCourseType(row: CatalogCardRow) {
  const hours = `T${row.theory_hours ?? 0} · Pr ${row.practice_hours_raw ?? "0+0"}`;

  if (row.is_elective) {
    return row.elective_group_code ? `${row.elective_group_code} elective · ${hours}` : `Elective · ${hours}`;
  }

  if (row.overall_semester) {
    return `Semester ${row.overall_semester} · ${hours}`;
  }

  return hours;
}

function buildDescription(row: CatalogCardRow, departmentCodes: Department[]) {
  if (row.description?.trim()) {
    return row.description.trim();
  }

  const audiences = departmentCodes.length > 0 ? departmentCodes.join(", ") : "selected COM programs";
  const semesterText = row.overall_semester ? `Semester ${row.overall_semester}` : "Curriculum";

  if (row.is_elective) {
    const groupLabel = row.elective_group_name ?? row.elective_group_code ?? "Elective";
    return `${groupLabel} option available for ${audiences} in ${row.grade_label?.toLowerCase() ?? "the selected grade"}.`;
  }

  return `${semesterText} curriculum course for ${audiences}.`;
}

export async function loadCatalogCards(): Promise<CatalogCardRow[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("catalog_cards_v1")
    .select("*")
    .order("is_elective", { ascending: true })
    .order("grade", { ascending: true })
    .order("overall_semester", { ascending: true })
    .order("course_code", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export function mapCatalogCardToCourse(row: CatalogCardRow): Course {
  const isElective = Boolean(row.is_elective);
  const departments = toDepartments(row.program_codes, isElective);
  const teachers = parseStringArray(row.teachers);
  const outcomes = parseStringArray(row.outcomes);
  const components = parseCourseComponents(row.grading_components);

  return {
    id: row.browse_id ?? row.course_id ?? crypto.randomUUID(),
    offeringId: row.offering_id,
    code: row.course_code ?? undefined,
    dept: isElective ? "Elective" : departments[0] ?? "Elective",
    departments,
    isElective,
    grade: toStudyGradeLabel(row.grade),
    name: row.course_name ?? "Untitled course",
    teachers,
    credits: row.credits ?? 0,
    type: buildCourseType(row),
    outcomes,
    components,
    description: buildDescription(row, departments),
    semester: row.overall_semester,
    electiveGroupCode: row.elective_group_code,
  };
}

export async function loadCatalogCourses() {
  const rows = await loadCatalogCards();
  return rows.map(mapCatalogCardToCourse);
}
