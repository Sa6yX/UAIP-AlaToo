import type { KeyboardEvent } from "react";

import { DEPT_META } from "../data";
import type { Course } from "../types";

import { GradingBar } from "./grading-bar";

type CourseCardProps = {
  course: Course;
  onSelect: (course: Course) => void;
  onOcsClick: (course: Course) => void;
};

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12L12 4" />
      <path d="M6 4h6v6" />
    </svg>
  );
}

export function CourseCard({ course, onSelect, onOcsClick }: CourseCardProps) {
  const dept = DEPT_META[course.dept];
  const hasMultipleTeachers = course.teachers.length > 1;

  const handleOpen = () => onSelect(course);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className="group relative cursor-pointer rounded-[14px] border border-[var(--uaip-gray-200)] bg-white px-5 py-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uaip-blue)]/25"
    >
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <span
          className="rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.04em]"
          style={{ backgroundColor: dept.bg, color: dept.text }}
        >
          {course.dept === "Elective" ? "ELECTIVE" : course.dept}
        </span>

        <div className="flex items-start gap-2">
          <span className="pt-1 text-[0.6875rem] text-[var(--uaip-gray-400)]">
            {course.credits} credits · {course.type}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOcsClick(course);
            }}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--uaip-blue)] px-2.5 py-1 text-[0.6875rem] font-semibold text-white transition hover:bg-[#1d4ed8]"
          >
            OCS
            <ArrowUpRightIcon />
          </button>
        </div>
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

      <div className="relative mt-2.5 overflow-hidden text-sm leading-[1.55] text-[var(--uaip-gray-600)]">
        <p style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
          {course.description}
        </p>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[1.55em] w-[25%] min-w-[84px] bg-gradient-to-r from-transparent via-white/88 to-white"
        />
      </div>

      <GradingBar components={course.components} />
    </div>
  );
}
