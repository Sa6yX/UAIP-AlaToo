import type { KeyboardEvent } from "react";

import { DEPT_META } from "../data";
import type { Course, Department } from "../types";

import { GradingBar } from "./grading-bar";

type CourseCardProps = {
  course: Course;
  showDetails: boolean;
  onSelect: (course: Course) => void;
  onOcsClick: (course: Course) => void;
};

type ChipTone = {
  bg: string;
  text: string;
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

function LabelChip({ label, tone }: { label: string; tone: ChipTone }) {
  return (
    <span
      className="shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.04em]"
      style={{ backgroundColor: tone.bg, color: tone.text }}
    >
      {label}
    </span>
  );
}

function MetaItem({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-[var(--uaip-gray-600)]">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function getElectiveGroupTone(groupCode: string | null | undefined): ChipTone {
  switch (groupCode) {
    case "AE":
      return { bg: "#dbeafe", text: "#1d4ed8" };
    case "NAE":
      return { bg: "#fffbeb", text: "#b45309" };
    case "NTE":
      return { bg: "#ecfdf5", text: "#047857" };
    default:
      return { bg: DEPT_META.Elective.bg, text: DEPT_META.Elective.text };
  }
}

function getAudienceDepartmentBadges(course: Course) {
  const departments = course.departments ?? [];

  if (!course.isElective) {
    return departments.length > 0 ? departments : [course.dept];
  }

  const collapsed = new Set<string>();

  for (const department of departments) {
    if (department.startsWith("COM")) {
      collapsed.add("COM");
    } else {
      collapsed.add(department);
    }
  }

  return [...collapsed];
}

function getBadgeTone(label: string): ChipTone {
  if (label === "COM") {
    return { bg: "#eef2ff", text: "#4338ca" };
  }

  if (label in DEPT_META) {
    const meta = DEPT_META[label as Department];
    return { bg: meta.bg, text: meta.text };
  }

  return { bg: "#f3f4f6", text: "#4b5563" };
}

export function CourseCard({ course, showDetails, onSelect, onOcsClick }: CourseCardProps) {
  const teacherPreview =
    course.teachers.length > 0
      ? course.teachers.length > 1
        ? `${course.teachers[0]} +${course.teachers.length - 1} more`
        : course.teachers[0]
      : "Teacher not assigned yet";
  const audienceBadges = getAudienceDepartmentBadges(course);
  const metaItems = [
    course.code ? { label: course.code, color: "#2563eb" } : null,
    { label: `${course.credits} credits`, color: "#7c3aed" },
    { label: course.semester ? `Semester ${course.semester}` : "Curriculum", color: "#059669" },
  ].filter((item): item is { label: string; color: string } => Boolean(item));

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
      className="group relative cursor-pointer rounded-[16px] bg-[var(--uaip-surface-0)] px-5 py-5 text-left shadow-[0_12px_30px_rgba(17,17,17,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(17,17,17,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uaip-blue)]/25"
    >
      <div className="mb-3 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="relative min-w-0 flex-1">
            <div className="uaip-chip-scroll -mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 pb-0.5 pr-16">
              {course.isElective ? (
                <LabelChip
                  label={course.electiveGroupCode || "Elective"}
                  tone={getElectiveGroupTone(course.electiveGroupCode)}
                />
              ) : null}
              {audienceBadges.map((badge) => (
                <LabelChip key={`${course.id}-${badge}`} label={badge} tone={getBadgeTone(badge)} />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-20"
              style={{
                background:
                  "linear-gradient(to left, var(--uaip-surface-0) 46%, rgba(255,255,255,0.99) 68%, rgba(255,255,255,0.96) 82%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative z-10 shrink-0 bg-[var(--uaip-surface-0)] pl-3">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOcsClick(course);
              }}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--uaip-blue)] px-2.5 py-1 text-[0.6875rem] font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              OCS
              <ArrowUpRightIcon />
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          {metaItems.map((item) => (
            <MetaItem key={`${course.id}-${item.label}`} label={item.label} color={item.color} />
          ))}
        </div>
      </div>

      <h3 className="font-heading text-[clamp(1.03rem,0.99rem+0.2vw,1.12rem)] font-bold text-[var(--uaip-text-primary)]">
        {course.name}
      </h3>

      <p className="mt-1 text-xs text-[var(--uaip-gray-500)]">{teacherPreview}</p>

      {showDetails ? (
        <>
          <div className="relative mt-2.5 overflow-hidden text-sm leading-[1.55] text-[var(--uaip-gray-600)]">
            <p style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
              {course.description}
            </p>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 h-[1.55em] w-[25%] min-w-[84px]"
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.88) 58%, var(--uaip-surface-0) 100%)",
              }}
            />
          </div>

          <GradingBar components={course.components} />
        </>
      ) : null}
    </div>
  );
}
