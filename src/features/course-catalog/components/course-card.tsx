import { DEPT_META } from "../data";
import type { Course } from "../types";

import { GradingBar } from "./grading-bar";

type CourseCardProps = {
  course: Course;
  onSelect: (course: Course) => void;
};

export function CourseCard({ course, onSelect }: CourseCardProps) {
  const dept = DEPT_META[course.dept];
  const hasMultipleTeachers = course.teachers.length > 1;

  return (
    <button
      type="button"
      onClick={() => onSelect(course)}
      className="group relative rounded-[14px] border border-[var(--uaip-gray-200)] bg-white px-5 py-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)]"
    >
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <span
          className="rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.04em]"
          style={{ backgroundColor: dept.bg, color: dept.text }}
        >
          {course.dept === "Elective" ? "ELECTIVE" : course.dept}
        </span>

        <span className="text-[0.6875rem] text-[var(--uaip-gray-400)]">
          {course.credits} credits · {course.type}
        </span>
      </div>

      <h3 className="font-heading text-[clamp(1.03rem,0.99rem+0.2vw,1.12rem)] font-bold text-[var(--uaip-text-primary)]">
        {course.name}
      </h3>

      <p className="mt-1 text-xs text-[var(--uaip-gray-500)]">
        {hasMultipleTeachers ? (
          <>
            {course.teachers[0]}{" "}
            <span className="text-[var(--uaip-gray-300)]">+{course.teachers.length - 1} more</span>
          </>
        ) : (
          course.teachers[0]
        )}
      </p>

      <p className="mt-2.5 text-base leading-relaxed text-[var(--uaip-gray-600)]">
        {course.description.slice(0, 112)}…
      </p>

      <GradingBar components={course.components} />
    </button>
  );
}
