export type Department = "AMI" | "CIF" | "CEH" | "Elective";

export type DepartmentFilter = "All" | "AMI" | "CIF" | "CEH" | "Electives";

export type CourseComponent = {
  name: string;
  weight: number;
};

export type Course = {
  id: number;
  dept: Department;
  name: string;
  teachers: string[];
  credits: number;
  type: string;
  outcomes: string[];
  components: CourseComponent[];
  description: string;
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
