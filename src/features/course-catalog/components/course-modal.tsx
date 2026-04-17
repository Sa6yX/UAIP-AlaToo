import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { DEPT_META, GRADE_SCALE, GRADING_COMPONENT_COLORS } from "../data";
import { getEdgeFadeOpacity } from "../scroll-fade";
import type { Course, Department } from "../types";

type CourseModalProps = {
  course: Course | null;
  onClose: () => void;
};

type ChipTone = {
  bg: string;
  text: string;
};

function getTeacherInitial(teacher: string) {
  const parts = teacher.trim().split(/\s+/);
  const lastName = parts[parts.length - 1] ?? "?";
  return lastName.charAt(0).toUpperCase();
}

function LabelChip({ label, tone }: { label: string; tone: ChipTone }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.04em]"
      style={{ backgroundColor: tone.bg, color: tone.text }}
    >
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

export function CourseModal({ course, onClose }: CourseModalProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const descriptionWrapRef = useRef<HTMLDivElement | null>(null);
  const descriptionTextRef = useRef<HTMLParagraphElement | null>(null);
  const [fadeOpacity, setFadeOpacity] = useState({ top: 0, bottom: 0 });
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const [descriptionHeights, setDescriptionHeights] = useState({ expanded: 0, condensed: 0 });

  useEffect(() => {
    if (!course) {
      return;
    }

    const element = scrollRef.current;
    const descriptionText = descriptionTextRef.current;

    if (!element || !descriptionText) {
      return;
    }

    const measureDescription = () => {
      const computedStyle = window.getComputedStyle(descriptionText);
      const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 0;
      const expanded = descriptionText.scrollHeight;
      const condensed = lineHeight > 0 ? lineHeight * 2 : expanded;

      setDescriptionHeights({
        expanded,
        condensed: Math.min(expanded, condensed),
      });
    };

    const updateFadeState = () => {
      const overflowDistance = element.scrollHeight - element.clientHeight;
      const hasOverflow = overflowDistance > 4;
      const isScrolled = element.scrollTop > 10;
      const remainingBottomDistance = Math.max(overflowDistance - element.scrollTop, 0);

      setIsHeaderCondensed(isScrolled);
      setFadeOpacity(
        hasOverflow
          ? {
              top: getEdgeFadeOpacity(element.scrollTop, 68),
              bottom: getEdgeFadeOpacity(remainingBottomDistance, 96),
            }
          : { top: 0, bottom: 0 },
      );
    };

    element.scrollTop = 0;
    measureDescription();
    updateFadeState();

    element.addEventListener("scroll", updateFadeState, { passive: true });
    window.addEventListener("resize", measureDescription);
    window.addEventListener("resize", updateFadeState);

    return () => {
      element.removeEventListener("scroll", updateFadeState);
      window.removeEventListener("resize", measureDescription);
      window.removeEventListener("resize", updateFadeState);
    };
  }, [course]);

  if (!course) {
    return null;
  }

  const audienceBadges = getAudienceDepartmentBadges(course);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${course.name} details`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 md:p-6"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="grid h-[85vh] w-full max-w-[560px] grid-rows-[auto,minmax(0,1fr)] overflow-hidden rounded-[20px] bg-[var(--uaip-surface-0)] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <div className="shrink-0 bg-[var(--uaip-surface-0)] px-6 py-7 md:px-9 md:py-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
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

            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full bg-[var(--uaip-surface-0)] text-xl leading-none text-[var(--uaip-gray-500)] transition hover:bg-[var(--uaip-surface-1)] hover:text-[var(--uaip-text-primary)]"
              aria-label="Close course details"
            >
              ×
            </button>
          </div>

          <h2 className="font-heading text-[clamp(1.46rem,1.36rem+0.45vw,1.65rem)] font-extrabold text-[var(--uaip-text-primary)]">
            {course.name}
          </h2>

          <p className="mt-1 text-[0.8125rem] text-[var(--uaip-gray-400)]">
            {course.code ? `${course.code} · ` : ""}
            {course.credits} credits · {course.type}
          </p>

          <div
            ref={descriptionWrapRef}
            className="relative mt-4 overflow-hidden transition-[height] duration-300 ease-linear"
            style={{
              height:
                descriptionHeights.expanded > 0
                  ? `${isHeaderCondensed ? descriptionHeights.condensed : descriptionHeights.expanded}px`
                  : undefined,
            }}
          >
            <p ref={descriptionTextRef} className="text-base leading-[1.7] text-[var(--uaip-gray-700)]">
              {course.description}
            </p>
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute bottom-0 right-0 h-[1.7em] w-[25%] min-w-[96px] transition-opacity duration-300",
                isHeaderCondensed ? "opacity-100" : "opacity-0",
              )}
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.88) 58%, var(--uaip-surface-0) 100%)",
              }}
            />
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollRef}
            className="uaip-modal-scroll h-full overflow-y-auto px-6 pb-7 pt-6 md:px-9 md:pb-8"
          >
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--uaip-gray-400)]">
                Teachers
              </h3>
              {course.teachers.length > 0 ? (
                <div className="mt-2.5 space-y-2">
                  {course.teachers.map((teacher) => (
                    <div
                      key={teacher}
                      className="flex items-center gap-2.5 rounded-[12px] bg-[var(--uaip-surface-1)] px-3 py-2 text-[0.9375rem] text-[var(--uaip-text-primary)]"
                    >
                      <span
                        className="grid size-7 place-items-center rounded-full text-[0.8125rem] font-bold"
                        style={{ backgroundColor: DEPT_META[course.dept].bg, color: DEPT_META[course.dept].text }}
                      >
                        {getTeacherInitial(teacher)}
                      </span>
                      {teacher}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2.5 text-[0.9375rem] text-[var(--uaip-gray-500)]">
                  Teacher list will be added with the next data update.
                </p>
              )}
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--uaip-gray-400)]">
                Grading breakdown
              </h3>

              {course.components.length > 0 ? (
                <>
                  <div className="mt-2.5 space-y-2">
                    {course.components.map((component, index) => {
                      const chipColor =
                        GRADING_COMPONENT_COLORS[index % GRADING_COMPONENT_COLORS.length];

                      return (
                        <div
                          key={component.name}
                          className="flex items-center gap-2.5 rounded-[12px] bg-[var(--uaip-surface-1)] px-3 py-2"
                        >
                          <span
                            className="grid size-9 place-items-center rounded-lg text-sm font-extrabold"
                            style={{ color: chipColor, backgroundColor: `${chipColor}20` }}
                          >
                            {component.weight}%
                          </span>
                          <span className="text-[0.9375rem] text-[var(--uaip-gray-700)]">
                            {component.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3.5 rounded-[14px] bg-[var(--uaip-surface-1)] p-3.5">
                    <h4 className="mb-2 text-xs font-bold text-[var(--uaip-gray-500)]">
                      Standard grading scale
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {GRADE_SCALE.map((item) => (
                        <span
                          key={item.grade}
                          className="rounded-full px-2.5 py-1 text-xs font-bold"
                          style={{ color: item.color, backgroundColor: `${item.color}20` }}
                        >
                          {item.grade} · {item.range}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-2.5 text-[0.9375rem] text-[var(--uaip-gray-500)]">
                  Detailed grading components are not published in this dataset yet.
                </p>
              )}
            </section>

            <section className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--uaip-gray-400)]">
                Skills you&apos;ll gain
              </h3>

              {course.outcomes.length > 0 ? (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {course.outcomes.map((outcome) => (
                    <span
                      key={outcome}
                      className="rounded-full bg-[var(--uaip-surface-2)] px-3 py-1 text-xs font-medium text-[var(--uaip-gray-700)]"
                    >
                      {outcome}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2.5 text-[0.9375rem] text-[var(--uaip-gray-500)]">
                  Learning outcomes will be added after syllabus-level enrichment.
                </p>
              )}
            </section>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[68px] bg-gradient-to-b from-[var(--uaip-surface-0)] via-[rgba(255,255,255,0.92)] to-transparent transition-opacity duration-150"
            style={{ opacity: fadeOpacity.top }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[96px] bg-gradient-to-t from-[var(--uaip-surface-0)] via-[rgba(255,255,255,0.94)] to-transparent transition-opacity duration-150"
            style={{ opacity: fadeOpacity.bottom }}
          />
        </div>
      </div>
    </div>
  );
}
