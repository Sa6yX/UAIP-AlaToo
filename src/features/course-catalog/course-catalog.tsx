"use client";

import { useEffect, useMemo, useState } from "react";

import { COURSES, DEPARTMENTS, GRADE_SCALE } from "./data";
import { CourseCard } from "./components/course-card";
import { CourseModal } from "./components/course-modal";
import type { Course, DepartmentFilter } from "./types";

export function CourseCatalog() {
  const [activeDept, setActiveDept] = useState<DepartmentFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPageBottomFade, setShowPageBottomFade] = useState(false);

  useEffect(() => {
    if (!selectedCourse) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCourse(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onEscape);
    };
  }, [selectedCourse]);

  useEffect(() => {
    const updatePageFadeState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const canScroll = fullHeight > viewportHeight + 4;

      setShowPageBottomFade(canScroll && scrollTop + viewportHeight < fullHeight - 2);
    };

    updatePageFadeState();

    window.addEventListener("scroll", updatePageFadeState, { passive: true });
    window.addEventListener("resize", updatePageFadeState);

    return () => {
      window.removeEventListener("scroll", updatePageFadeState);
      window.removeEventListener("resize", updatePageFadeState);
    };
  }, [activeDept, search]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return COURSES.filter((course) => {
      const matchDepartment =
        activeDept === "All" ||
        course.dept === activeDept ||
        (activeDept === "Electives" && course.dept === "Elective");

      const matchSearch =
        normalizedSearch.length === 0 ||
        course.name.toLowerCase().includes(normalizedSearch) ||
        course.teachers.some((teacher) => teacher.toLowerCase().includes(normalizedSearch));

      return matchDepartment && matchSearch;
    });
  }, [activeDept, search]);

  const electiveCount = useMemo(
    () => COURSES.filter((course) => course.dept === "Elective").length,
    [],
  );

  return (
    <div className="min-h-screen bg-[var(--uaip-bg)] font-sans">
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden h-[76px] bg-gradient-to-t from-[var(--uaip-bg)] to-transparent transition-opacity duration-200 lg:block ${showPageBottomFade ? "opacity-100" : "opacity-0"}`}
      />
      <header className="border-b border-[var(--uaip-gray-200)] bg-white px-5 py-5 md:px-8">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--uaip-gray-400)]">
              Ala-Too International University
            </p>
            <h1 className="font-heading mt-0.5 text-[clamp(1.4rem,1.29rem+0.56vw,1.75rem)] font-extrabold text-[var(--uaip-text-primary)]">
              Course Catalog
            </h1>
          </div>

          <div className="text-right text-xs text-[var(--uaip-gray-400)]">
            <p className="font-semibold text-[var(--uaip-gray-500)]">
              {COURSES.length} courses · {electiveCount} electives
            </p>
            <p>No login required</p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-6">
        <section className="mb-7 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses or teachers…"
            className="h-11 min-w-[210px] flex-1 rounded-[10px] border border-[var(--uaip-gray-200)] bg-white px-4 text-base text-[var(--uaip-text-primary)] outline-none transition placeholder:text-[var(--uaip-gray-400)] focus:border-[var(--uaip-blue)]"
          />

          <div className="flex flex-wrap gap-1.5">
            {DEPARTMENTS.map((department) => {
              const isActive = activeDept === department;

              return (
                <button
                  key={department}
                  type="button"
                  onClick={() => setActiveDept(department)}
                  className="rounded-lg px-4 py-2 text-[0.8125rem] font-semibold transition"
                  style={{
                    border: isActive
                      ? "1.5px solid transparent"
                      : "1.5px solid var(--uaip-gray-200)",
                    background: isActive ? "var(--uaip-text-primary)" : "#ffffff",
                    color: isActive ? "#ffffff" : "var(--uaip-gray-500)",
                  }}
                >
                  {department}
                </button>
              );
            })}
          </div>
        </section>

        {(activeDept === "All" || activeDept === "Electives") && (
          <section className="mb-6 flex items-start gap-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3.5">
            <span className="text-lg" aria-hidden>
              💡
            </span>
            <div>
              <h2 className="font-heading text-[clamp(1.03rem,1rem+0.16vw,1.1rem)] font-bold text-[#92400e]">
                About electives
              </h2>
              <p className="mt-0.5 text-base leading-relaxed text-[#b45309]">
                Electives are open to all departments. You choose one from the full list each
                semester. Review the grading breakdown and learning outcomes before choosing.
              </p>
            </div>
          </section>
        )}

        <section className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-[linear-gradient(135deg,#1e3a5f_0%,#2563eb_100%)] px-5 py-4">
          <div>
            <p className="text-[0.8125rem] font-bold tracking-[0.06em] text-[#93c5fd]">
              INSTITUTIONAL POLICY
            </p>
            <h2 className="font-heading text-[clamp(1.03rem,0.99rem+0.22vw,1.12rem)] font-semibold text-white">
              All courses follow a standardized grading scale · No mid-semester changes permitted
            </h2>
          </div>

          <div className="flex gap-2.5">
            {GRADE_SCALE.map((item) => (
              <div key={item.grade} className="text-center">
                <p className="font-heading text-sm font-extrabold text-white">{item.grade}</p>
                <p className="text-[0.625rem] text-[#93c5fd]">{item.range}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mb-4 text-[0.8125rem] text-[var(--uaip-gray-400)]">
          {filteredCourses.length} course{filteredCourses.length === 1 ? "" : "s"}
          {search ? ` matching "${search}"` : ""}
        </p>

        {filteredCourses.length > 0 ? (
          <section className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[18px]">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onSelect={setSelectedCourse} />
            ))}
          </section>
        ) : (
          <section className="py-16 text-center text-[var(--uaip-gray-400)]">
            <p className="text-3xl">🔍</p>
            <h3 className="font-heading mt-3 text-[clamp(1.08rem,1.02rem+0.2vw,1.15rem)] font-semibold text-[var(--uaip-gray-600)]">
              No courses found
            </h3>
            <p className="mt-1 text-base">Try a different search or department filter</p>
          </section>
        )}
      </div>

      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}
