import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const dataDir = path.join(repoRoot, "supabase", "data", "iteration-1");
const envPath = path.join(repoRoot, ".env.local");

const PROGRAM_META = {
  COMCEH: {
    code: "COMCEH",
    name: "Cybersecurity and Ethical Hacking",
    faculty: "IT Faculty",
    degree: "Bachelor",
    language: "EN",
    file: "COMCEH.md",
  },
  COMFCI: {
    code: "COMFCI",
    name: "Foundations of Creative Industries",
    faculty: "IT Faculty",
    degree: "Bachelor",
    language: "EN",
    file: "COMFCI.md",
  },
  COMSE: {
    code: "COMSE",
    name: "Software Engineering",
    faculty: "IT Faculty",
    degree: "Bachelor",
    language: "EN",
    file: "COMSE.md",
  },
};

const ELECTIVE_GROUP_NAMES = {
  AE: "Area Elective",
  NAE: "Non-area Elective",
  NTE: "Non Theoretical Elective",
};

function parseEnv(text) {
  const env = {};

  for (const line of text.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const index = line.indexOf("=");

    if (index === -1) {
      continue;
    }

    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    env[key] = value;
  }

  return env;
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function hashKey(value) {
  return createHash("sha256").update(value).digest("hex");
}

function parseInteger(value) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseTableRow(line) {
  if (!line.startsWith("|")) {
    return null;
  }

  const cells = line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());

  if (cells.length < 6) {
    return null;
  }

  if (cells[0] === "No" || cells.every((cell) => /^:?-+:?$/.test(cell) || cell === "---")) {
    return null;
  }

  return cells;
}

function parseNotes(rawNotes) {
  const notes = normalizeText(rawNotes || "");
  const electiveGroupCode = notes.match(/\[(AE|NAE|NTE)\]/)?.[1] ?? null;
  const optionsChunk = notes.match(/options:\s*(.+)$/i)?.[1] ?? "";
  const optionCodes = optionsChunk
    ? optionsChunk
        .split(",")
        .map((item) => normalizeText(item))
        .filter(Boolean)
    : [];

  return {
    raw: notes || null,
    electiveGroupCode,
    optionCodes,
  };
}

function parseProgramMarkdown(content, programMeta) {
  const lines = content.split(/\r?\n/);
  const sourceTitle = lines.find((line) => line.startsWith("# "))?.replace(/^#\s+/, "") ?? programMeta.name;
  const sourceStatus = lines.find((line) => line.startsWith("Status:"))?.replace(/^Status:\s*/, "") ?? null;

  let currentGrade = null;
  let currentSemesterInGrade = null;
  let currentOverallSemester = null;
  let currentSemesterRows = [];
  const rows = [];

  for (const line of lines) {
    const gradeMatch = line.match(/^##\s+Grade\s+(\d+)/i);
    if (gradeMatch) {
      currentGrade = Number.parseInt(gradeMatch[1], 10);
      continue;
    }

    const semesterMatch = line.match(/^###\s+Semester\s+(\d+)\s+\(Overall Semester\s+(\d+)\)/i);
    if (semesterMatch) {
      currentSemesterInGrade = Number.parseInt(semesterMatch[1], 10);
      currentOverallSemester = Number.parseInt(semesterMatch[2], 10);
      currentSemesterRows = [];
      continue;
    }

    const totalMatch = line.match(/^\*\*Semester Total Credits:\*\*\s*(\d+)/i);
    if (totalMatch) {
      const semesterTotalCredits = Number.parseInt(totalMatch[1], 10);
      for (const row of currentSemesterRows) {
        row.semesterTotalCredits = semesterTotalCredits;
      }
      continue;
    }

    const cells = parseTableRow(line);
    if (!cells) {
      continue;
    }

    invariant(currentGrade !== null, `Missing grade context in ${programMeta.code}`);
    invariant(currentSemesterInGrade !== null, `Missing semester context in ${programMeta.code}`);
    invariant(currentOverallSemester !== null, `Missing overall semester context in ${programMeta.code}`);

    const [rowNoRaw, courseCode, courseName, theoryHours, practiceHoursRaw, credits, notes = ""] = cells;
    const row = {
      programCode: programMeta.code,
      programName: programMeta.name,
      sourceTitle,
      sourceStatus,
      grade: currentGrade,
      semesterInGrade: currentSemesterInGrade,
      overallSemester: currentOverallSemester,
      rowNumber: parseInteger(rowNoRaw.replace(/\D/g, "")),
      isMarked: rowNoRaw.includes("*"),
      courseCode: normalizeText(courseCode),
      courseName: normalizeText(courseName),
      theoryHours: parseInteger(theoryHours),
      practiceHoursRaw: normalizeText(practiceHoursRaw),
      credits: parseInteger(credits),
      notesRaw: normalizeText(notes),
      semesterTotalCredits: null,
    };

    rows.push(row);
    currentSemesterRows.push(row);
  }

  return {
    program: {
      code: programMeta.code,
      name: programMeta.name,
      faculty: programMeta.faculty,
      degree: programMeta.degree,
      language: programMeta.language,
      source_title: sourceTitle,
      source_status: sourceStatus,
    },
    rows,
  };
}

function parseElectivesMarkdown(content) {
  const lines = content.split(/\r?\n/);
  const sourceTitle = lines.find((line) => line.startsWith("# "))?.replace(/^#\s+/, "") ?? "IT Faculty Electives";
  const sourceStatus = lines.find((line) => line.startsWith("Status:"))?.replace(/^Status:\s*/, "") ?? null;

  let currentGroupCode = null;
  const groups = [];
  const courses = [];

  for (const line of lines) {
    const groupMatch = line.match(/^##\s+(AE|NAE|NTE)\s+-\s+(.+)$/i);
    if (groupMatch) {
      currentGroupCode = groupMatch[1].toUpperCase();
      groups.push({
        code: currentGroupCode,
        name: ELECTIVE_GROUP_NAMES[currentGroupCode] ?? normalizeText(groupMatch[2]),
        description: normalizeText(groupMatch[2]),
        scope: "it-faculty",
      });
      continue;
    }

    const cells = parseTableRow(line);
    if (!cells || !currentGroupCode) {
      continue;
    }

    const [, courseCode, courseName, theoryHours, practiceHoursRaw, credits] = cells;
    courses.push({
      electiveGroupCode: currentGroupCode,
      sourceTitle,
      sourceStatus,
      courseCode: normalizeText(courseCode),
      courseName: normalizeText(courseName),
      theoryHours: parseInteger(theoryHours),
      practiceHoursRaw: normalizeText(practiceHoursRaw),
      credits: parseInteger(credits),
    });
  }

  return { groups, courses };
}

function createCourseRegistry() {
  const byKey = new Map();

  return {
    ensure({ sourceKind, isPlaceholder = false, courseCode, courseName, theoryHours, practiceHoursRaw, credits }) {
      const normalizedKey = [courseCode, courseName, theoryHours, practiceHoursRaw, credits]
        .map((item) => normalizeText(String(item)).toLowerCase())
        .join("|");

      if (!byKey.has(normalizedKey)) {
        byKey.set(normalizedKey, {
          source_hash: hashKey(normalizedKey),
          source_kind: sourceKind,
          is_placeholder: isPlaceholder,
          course_code: courseCode,
          course_name: courseName,
          theory_hours: theoryHours,
          practice_hours_raw: practiceHoursRaw,
          credits,
          description: null,
          teachers: [],
          outcomes: [],
          grading_components: [],
        });
      }

      const existing = byKey.get(normalizedKey);
      if (sourceKind === "elective_catalog" && existing.source_kind === "curriculum") {
        existing.source_kind = "elective_catalog";
      }
      if (isPlaceholder) {
        existing.is_placeholder = true;
      }

      return existing;
    },
    values() {
      return [...byKey.values()];
    },
  };
}

async function clearImportedTables(supabase) {
  const deleteAll = async (table) => {
    const { error } = await supabase.from(table).delete().not("id", "is", null);
    if (error) {
      throw error;
    }
  };

  await deleteAll("offering_option_courses");
  await deleteAll("elective_group_courses");
  await deleteAll("offering_audiences");
  await deleteAll("curriculum_offerings");
  await deleteAll("catalog_courses");
  await deleteAll("elective_groups");
  await deleteAll("academic_programs");
}

async function main() {
  const env = parseEnv(await fs.readFile(envPath, "utf8"));
  invariant(env.NEXT_PUBLIC_SUPABASE_URL, "Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  invariant(env.SUPABASE_SERVICE_ROLE_KEY, "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const programResults = [];
  for (const meta of Object.values(PROGRAM_META)) {
    const content = await fs.readFile(path.join(dataDir, meta.file), "utf8");
    programResults.push(parseProgramMarkdown(content, meta));
  }

  const electivesMarkdown = await fs.readFile(path.join(dataDir, "IT_Faculty_Electives.md"), "utf8");
  const electivesData = parseElectivesMarkdown(electivesMarkdown);

  const courseRegistry = createCourseRegistry();
  const unresolvedOptionCodes = new Set();
  const electiveCatalogByCode = new Map();

  for (const electiveCourse of electivesData.courses) {
    const courseRecord = courseRegistry.ensure({
      sourceKind: "elective_catalog",
      courseCode: electiveCourse.courseCode,
      courseName: electiveCourse.courseName,
      theoryHours: electiveCourse.theoryHours,
      practiceHoursRaw: electiveCourse.practiceHoursRaw,
      credits: electiveCourse.credits,
    });
    electiveCatalogByCode.set(electiveCourse.courseCode, courseRecord);
  }

  const offeringGroups = new Map();

  for (const result of programResults) {
    for (const row of result.rows) {
      const parsedNotes = parseNotes(row.notesRaw);
      const courseRecord = courseRegistry.ensure({
        sourceKind: "curriculum",
        courseCode: row.courseCode,
        courseName: row.courseName,
        theoryHours: row.theoryHours,
        practiceHoursRaw: row.practiceHoursRaw,
        credits: row.credits,
      });

      for (const optionCode of parsedNotes.optionCodes) {
        if (!electiveCatalogByCode.has(optionCode)) {
          unresolvedOptionCodes.add(optionCode);
        }
      }

      const signature = [
        row.grade,
        row.semesterInGrade,
        row.overallSemester,
        courseRecord.source_hash,
        normalizeText(parsedNotes.raw || "").toLowerCase(),
      ].join("|");

      if (!offeringGroups.has(signature)) {
        offeringGroups.set(signature, {
          source_hash: hashKey(signature),
          catalog_course_hash: courseRecord.source_hash,
          grade: row.grade,
          semester_in_grade: row.semesterInGrade,
          overall_semester: row.overallSemester,
          row_number: row.rowNumber,
          semester_total_credits: row.semesterTotalCredits,
          notes_raw: parsedNotes.raw,
          elective_group_code: parsedNotes.electiveGroupCode,
          is_marked: row.isMarked,
          is_elective_slot:
            parsedNotes.optionCodes.length > 0 ||
            Boolean(parsedNotes.electiveGroupCode) ||
            /elective/i.test(row.courseName),
          program_codes: new Set(),
          option_codes: new Set(parsedNotes.optionCodes),
        });
      }

      const offering = offeringGroups.get(signature);
      offering.program_codes.add(row.programCode);
      for (const optionCode of parsedNotes.optionCodes) {
        offering.option_codes.add(optionCode);
      }
    }
  }

  for (const optionCode of [...unresolvedOptionCodes].sort()) {
    const placeholderCourse = courseRegistry.ensure({
      sourceKind: "placeholder_option",
      isPlaceholder: true,
      courseCode: optionCode,
      courseName: `${optionCode} (pending details)`,
      theoryHours: 0,
      practiceHoursRaw: "0+0",
      credits: 0,
    });
    electiveCatalogByCode.set(optionCode, placeholderCourse);
  }

  await clearImportedTables(supabase);

  const programsToInsert = programResults.map((result) => result.program);
  const { data: insertedPrograms, error: programsError } = await supabase
    .from("academic_programs")
    .insert(programsToInsert)
    .select("id, code");
  if (programsError) {
    throw programsError;
  }
  const programIdByCode = new Map(insertedPrograms.map((program) => [program.code, program.id]));

  const { data: insertedElectiveGroups, error: electiveGroupsError } = await supabase
    .from("elective_groups")
    .insert(electivesData.groups)
    .select("id, code");
  if (electiveGroupsError) {
    throw electiveGroupsError;
  }
  const electiveGroupIdByCode = new Map(insertedElectiveGroups.map((group) => [group.code, group.id]));

  const coursesToInsert = courseRegistry.values();
  const { data: insertedCourses, error: coursesError } = await supabase
    .from("catalog_courses")
    .insert(coursesToInsert)
    .select("id, source_hash, course_code, source_kind");
  if (coursesError) {
    throw coursesError;
  }
  const courseIdByHash = new Map(insertedCourses.map((course) => [course.source_hash, course.id]));
  const electiveCourseIdByCode = new Map(
    insertedCourses
      .filter((course) => course.source_kind === "elective_catalog" || course.source_kind === "placeholder_option")
      .map((course) => [course.course_code, course.id]),
  );

  const electiveGroupCoursesToInsert = electivesData.courses.map((course) => {
    const normalizedKey = [course.courseCode, course.courseName, course.theoryHours, course.practiceHoursRaw, course.credits]
      .map((item) => normalizeText(String(item)).toLowerCase())
      .join("|");

    return {
      elective_group_id: electiveGroupIdByCode.get(course.electiveGroupCode),
      course_id: courseIdByHash.get(hashKey(normalizedKey)),
    };
  });

  const { error: electiveGroupCoursesError } = await supabase
    .from("elective_group_courses")
    .insert(electiveGroupCoursesToInsert);
  if (electiveGroupCoursesError) {
    throw electiveGroupCoursesError;
  }

  const offeringsToInsert = [...offeringGroups.values()].map((offering) => ({
    source_hash: offering.source_hash,
    catalog_course_id: courseIdByHash.get(offering.catalog_course_hash),
    grade: offering.grade,
    semester_in_grade: offering.semester_in_grade,
    overall_semester: offering.overall_semester,
    row_number: offering.row_number,
    semester_total_credits: offering.semester_total_credits,
    notes_raw: offering.notes_raw,
    elective_group_id: offering.elective_group_code
      ? electiveGroupIdByCode.get(offering.elective_group_code)
      : null,
    is_marked: offering.is_marked,
    is_elective_slot: offering.is_elective_slot,
  }));

  const { data: insertedOfferings, error: offeringsError } = await supabase
    .from("curriculum_offerings")
    .insert(offeringsToInsert)
    .select("id, source_hash");
  if (offeringsError) {
    throw offeringsError;
  }
  const offeringIdByHash = new Map(insertedOfferings.map((offering) => [offering.source_hash, offering.id]));

  const offeringAudiencesToInsert = [];
  const offeringOptionCoursesToInsert = [];

  for (const offering of offeringGroups.values()) {
    const offeringId = offeringIdByHash.get(offering.source_hash);

    for (const programCode of offering.program_codes) {
      offeringAudiencesToInsert.push({
        offering_id: offeringId,
        program_id: programIdByCode.get(programCode),
      });
    }

    for (const optionCode of offering.option_codes) {
      const courseId = electiveCourseIdByCode.get(optionCode);
      if (courseId) {
        offeringOptionCoursesToInsert.push({
          offering_id: offeringId,
          course_id: courseId,
        });
      }
    }
  }

  const { error: audiencesError } = await supabase
    .from("offering_audiences")
    .insert(offeringAudiencesToInsert);
  if (audiencesError) {
    throw audiencesError;
  }

  if (offeringOptionCoursesToInsert.length > 0) {
    const { error: optionCoursesError } = await supabase
      .from("offering_option_courses")
      .insert(offeringOptionCoursesToInsert);
    if (optionCoursesError) {
      throw optionCoursesError;
    }
  }

  console.log(
    JSON.stringify(
      {
        programs: programsToInsert.length,
        electiveGroups: electivesData.groups.length,
        catalogCourses: coursesToInsert.length,
        offerings: offeringsToInsert.length,
        offeringAudiences: offeringAudiencesToInsert.length,
        offeringOptionCourses: offeringOptionCoursesToInsert.length,
        unresolvedOptionCodes: [...unresolvedOptionCodes].sort(),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
