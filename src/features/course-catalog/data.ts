import type { Course, Department, DepartmentFilter, DepartmentMeta, GradeScaleItem } from "./types";

export const DEPARTMENTS: DepartmentFilter[] = ["All", "AMI", "CIF", "CEH", "Electives"];

export const DEPT_META: Record<Department, DepartmentMeta> = {
  AMI: {
    label: "Applied Math & Informatics",
    color: "#2563eb",
    bg: "#eff6ff",
    text: "#1d4ed8",
  },
  CIF: {
    label: "Creative Industries Foundation",
    color: "#7c3aed",
    bg: "#f5f3ff",
    text: "#6d28d9",
  },
  CEH: {
    label: "Cybersec & Ethical Hacking",
    color: "#059669",
    bg: "#ecfdf5",
    text: "#047857",
  },
  Elective: {
    label: "Elective",
    color: "#d97706",
    bg: "#fffbeb",
    text: "#b45309",
  },
};

export const GRADE_SCALE: GradeScaleItem[] = [
  { grade: "A", range: "90–100%", color: "#16a34a" },
  { grade: "B", range: "75–89%", color: "#2563eb" },
  { grade: "C", range: "60–74%", color: "#d97706" },
  { grade: "D", range: "50–59%", color: "#ea580c" },
  { grade: "F", range: "< 50%", color: "#dc2626" },
];

export const GRADING_COMPONENT_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626"];

export const COURSES: Course[] = [
  {
    id: 1,
    dept: "AMI",
    name: "Machine Learning",
    teachers: ["Dr. Aibek Nurlanov", "Ms. Dinara Seitkali"],
    credits: 5,
    type: "Theory + Lab",
    outcomes: ["Data modeling", "Python/sklearn", "Research methods"],
    components: [
      { name: "Midterm exam", weight: 30 },
      { name: "Final exam", weight: 35 },
      { name: "Lab assignments", weight: 25 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "Foundations of supervised and unsupervised learning. Covers regression, classification, clustering, and neural networks with practical Python implementation.",
  },
  {
    id: 2,
    dept: "AMI",
    name: "Algorithms & Data Structures",
    teachers: ["Prof. Ruslan Bekov"],
    credits: 4,
    type: "Theory + Lab",
    outcomes: ["Algorithm design", "Complexity analysis", "Problem solving"],
    components: [
      { name: "Midterm exam", weight: 25 },
      { name: "Final exam", weight: 40 },
      { name: "Programming tasks", weight: 25 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "Core algorithms including sorting, searching, graphs, and dynamic programming. Emphasis on efficiency analysis and competitive programming skills.",
  },
  {
    id: 3,
    dept: "CIF",
    name: "Digital Design",
    teachers: ["Ms. Kamila Asanova", "Mr. Timur Zhaksybekov"],
    credits: 4,
    type: "Studio / Project",
    outcomes: ["Figma proficiency", "UI/UX principles", "Portfolio building"],
    components: [
      { name: "Portfolio project", weight: 45 },
      { name: "Midterm critique", weight: 20 },
      { name: "Weekly briefs", weight: 25 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "Visual communication and interface design. Students build a professional portfolio across branding, web UI, and motion graphics using industry-standard tools.",
  },
  {
    id: 4,
    dept: "CIF",
    name: "Media Production",
    teachers: ["Dr. Aizat Beisembayeva"],
    credits: 3,
    type: "Studio / Project",
    outcomes: ["Video editing", "Storytelling", "Adobe Premiere"],
    components: [
      { name: "Final production", weight: 50 },
      { name: "Script & storyboard", weight: 20 },
      { name: "Weekly tasks", weight: 20 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "End-to-end video and audio production. Students produce a short documentary or branded content piece from concept to final cut.",
  },
  {
    id: 5,
    dept: "CEH",
    name: "Network Security",
    teachers: ["Mr. Erlan Dzhaksybekov"],
    credits: 5,
    type: "Theory + Lab",
    outcomes: ["Penetration testing", "Network protocols", "CTF skills"],
    components: [
      { name: "Midterm exam", weight: 25 },
      { name: "Final exam", weight: 35 },
      { name: "Lab/CTF challenges", weight: 30 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "Defensive and offensive network security. Topics include firewalls, IDS/IPS, VPNs, and hands-on CTF exercises in a sandboxed lab environment.",
  },
  {
    id: 6,
    dept: "Elective",
    name: "Entrepreneurship & Startups",
    teachers: ["Mr. Bakai Omurbekov"],
    credits: 2,
    type: "Elective / Survey",
    outcomes: ["Business modeling", "Pitch skills", "Lean startup"],
    components: [
      { name: "Business plan", weight: 40 },
      { name: "Pitch presentation", weight: 30 },
      { name: "Case analyses", weight: 20 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "From idea to MVP. Covers business model canvas, market validation, and fundraising. Guest lectures from local founders.",
  },
  {
    id: 7,
    dept: "Elective",
    name: "Introduction to Psychology",
    teachers: ["Dr. Gulnara Mamytbekova"],
    credits: 2,
    type: "Elective / Survey",
    outcomes: ["Critical thinking", "Communication", "Self-awareness"],
    components: [
      { name: "Final essay", weight: 35 },
      { name: "Midterm test", weight: 30 },
      { name: "Seminar tasks", weight: 25 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "Core concepts in cognitive, social, and developmental psychology. No prerequisites. Designed for non-psychology majors seeking a humanities perspective.",
  },
  {
    id: 8,
    dept: "Elective",
    name: "Data Visualization",
    teachers: ["Ms. Asel Nurova", "Mr. Arman Bekzhanov"],
    credits: 2,
    type: "Elective / Survey",
    outcomes: ["Tableau/D3.js", "Storytelling with data", "Design thinking"],
    components: [
      { name: "Dashboard project", weight: 45 },
      { name: "Midterm chart critique", weight: 20 },
      { name: "Weekly tasks", weight: 25 },
      { name: "Participation", weight: 10 },
    ],
    description:
      "Communicating data through interactive dashboards and infographics. Taught using Tableau and basic D3.js. No coding experience required.",
  },
];
