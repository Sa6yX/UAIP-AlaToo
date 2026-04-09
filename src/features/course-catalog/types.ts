export type Department =
  | "MATMIE"
  | "COMFCI"
  | "COMCEH"
  | "COMSE"
  | "MATDAIS"
  | "IEMIT"
  | "Elective";

export type DepartmentFilter =
  | "All"
  | "MATMIE"
  | "COMFCI"
  | "COMCEH"
  | "COMSE"
  | "MATDAIS"
  | "IEMIT"
  | "Electives";

export type StudyGrade = "1st Grade" | "2nd Grade" | "3rd Grade" | "4th Grade";

export type CourseComponent = {
  name: string;
  weight: number;
};

export type Course = {
  id: number | string;
  offeringId?: string | null;
  code?: string;
  dept: Department;
  departments?: Department[];
  isElective?: boolean;
  grade: StudyGrade;
  name: string;
  teachers: string[];
  credits: number;
  type: string;
  outcomes: string[];
  components: CourseComponent[];
  description: string;
  semester?: number | null;
  electiveGroupCode?: string | null;
};

export type GradeScaleItem = {
  grade: string;
  range: string;
  color: string;
};

export type DepartmentMeta = {
  label: string;
  color: string;
  bg: string;
  text: string;
};
