"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { COURSES, DEPARTMENTS, GRADE_SCALE } from "./data";
import { CourseCard } from "./components/course-card";
import { CourseModal } from "./components/course-modal";
import { InfoModal } from "./components/electives-hint-modal";
import { getEdgeFadeOpacity } from "./scroll-fade";
import type { Course, DepartmentFilter } from "./types";

const ELECTIVES_HINT_STORAGE_KEY = "uaip-electives-hint-dismissed";
const ELECTIVES_HINT_TEXT =
  "Electives are open to all departments. You choose one from the full list each semester. Review the grading breakdown and learning outcomes before choosing.";
const OCS_COMING_SOON_TEXT = "OCS will be connected soon.";

export function CourseCatalog() {
  const filterScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeDept, setActiveDept] = useState<DepartmentFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [pendingCourse, setPendingCourse] = useState<Course | null>(null);
  const [showElectivesHintModal, setShowElectivesHintModal] = useState(false);
  const [showOcsSoonModal, setShowOcsSoonModal] = useState(false);
  const [neverShowElectivesHint, setNeverShowElectivesHint] = useState(false);
  const [electivesHintDismissed, setElectivesHintDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(ELECTIVES_HINT_STORAGE_KEY) === "1",
  );
  const [filterFadeOpacity, setFilterFadeOpacity] = useState({ left: 0, right: 0 });
  const [pageBottomFadeOpacity, setPageBottomFadeOpacity] = useState(0);

  useEffect(() => {
    const hasOpenOverlay = Boolean(selectedCourse || showElectivesHintModal || showOcsSoonModal);

    if (!hasOpenOverlay) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedCourse) {
          setSelectedCourse(null);
          return;
        }

        if (showOcsSoonModal) {
          setShowOcsSoonModal(false);
          return;
        }

        if (showElectivesHintModal) {
          setShowElectivesHintModal(false);
          setPendingCourse(null);
        }
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
  }, [selectedCourse, showElectivesHintModal, showOcsSoonModal]);

  useEffect(() => {
    const element = filterScrollRef.current;

    if (!element) {
      return;
    }

    const updateFilterFadeState = () => {
      const scrollableDistance = Math.max(element.scrollWidth - element.clientWidth, 0);
      const canScroll = scrollableDistance > 4;
      const remainingRightDistance = Math.max(scrollableDistance - element.scrollLeft, 0);

      setFilterFadeOpacity(
        canScroll
          ? {
              left: getEdgeFadeOpacity(element.scrollLeft, 72),
              right: getEdgeFadeOpacity(remainingRightDistance, 72),
            }
          : { left: 0, right: 0 },
      );
    };

    updateFilterFadeState();

    element.addEventListener("scroll", updateFilterFadeState, { passive: true });
    window.addEventListener("resize", updateFilterFadeState);

    return () => {
      element.removeEventListener("scroll", updateFilterFadeState);
      window.removeEventListener("resize", updateFilterFadeState);
    };
  }, []);

  useEffect(() => {
    const updatePageFadeState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const scrollableDistance = Math.max(fullHeight - viewportHeight, 0);
      const canScroll = scrollableDistance > 4;
      const remainingBottomDistance = Math.max(scrollableDistance - scrollTop, 0);

      setPageBottomFadeOpacity(
        canScroll ? getEdgeFadeOpacity(remainingBottomDistance, 108) : 0,
      );
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

  const openElectivesHintModal = (nextCourse: Course | null = null) => {
    if (electivesHintDismissed) {
      if (nextCourse) {
        setSelectedCourse(nextCourse);
      }

      return;
    }

    setPendingCourse(nextCourse);
    setNeverShowElectivesHint(false);
    setShowElectivesHintModal(true);
  };

  const handleElectivesHintClose = () => {
    if (neverShowElectivesHint && typeof window !== "undefined") {
      window.localStorage.setItem(ELECTIVES_HINT_STORAGE_KEY, "1");
      setElectivesHintDismissed(true);
    }

    setShowElectivesHintModal(false);

    if (pendingCourse) {
      setSelectedCourse(pendingCourse);
      setPendingCourse(null);
    }
  };

  const handleDepartmentSelect = (department: DepartmentFilter) => {
    setActiveDept(department);

    if (department === "Electives") {
      openElectivesHintModal();
    }
  };

  const handleCourseSelect = (course: Course) => {
    if (activeDept === "All" && course.dept === "Elective") {
      openElectivesHintModal(course);
      return;
    }

    setSelectedCourse(course);
  };

  const handleOcsClick = () => {
    setShowOcsSoonModal(true);
  };

  return (
    <div className="min-h-screen bg-[var(--uaip-bg)] font-sans">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden h-[76px] bg-gradient-to-t from-[var(--uaip-bg)] to-transparent transition-opacity duration-150 lg:block"
        style={{ opacity: pageBottomFadeOpacity }}
      />
      <header className="border-b border-[var(--uaip-gray-200)] bg-white px-5 py-5 md:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--uaip-gray-400)]">
              ALA-TOO INTERNATIONAL UNIVERSITY / UAIP
            </p>
            <h1 className="mt-1 text-[0.92rem] font-bold tracking-[0.12em] text-[var(--uaip-gray-500)] md:text-[1rem]">
              Course Catalog
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-6">
        <section className="mb-7">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses or teachers…"
            className="h-11 w-full rounded-[10px] border border-[var(--uaip-gray-200)] bg-white px-4 text-base text-[var(--uaip-text-primary)] outline-none transition placeholder:text-[var(--uaip-gray-400)] focus:border-[var(--uaip-blue)]"
          />

          <div className="relative mt-3">
            <div
              ref={filterScrollRef}
              className="uaip-filter-scroll flex gap-1.5 overflow-x-auto pb-1"
            >
              {DEPARTMENTS.map((department) => {
                const isActive = activeDept === department;

                return (
                  <button
                    key={department}
                    type="button"
                    onClick={() => handleDepartmentSelect(department)}
                    className="shrink-0 rounded-lg px-4 py-2 text-[0.8125rem] font-semibold transition"
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

            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 transition-opacity duration-150"
              style={{
                opacity: filterFadeOpacity.left,
                width: "15%",
                maxWidth: "84px",
                background:
                  "linear-gradient(to right, var(--uaip-bg) 0%, rgba(248, 249, 252, 0.92) 45%, transparent 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 transition-opacity duration-150"
              style={{
                opacity: filterFadeOpacity.right,
                width: "15%",
                maxWidth: "84px",
                background:
                  "linear-gradient(to left, var(--uaip-bg) 0%, rgba(248, 249, 252, 0.92) 45%, transparent 100%)",
              }}
            />
          </div>
        </section>

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

        {filteredCourses.length > 0 ? (
          <section className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[18px]">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={handleCourseSelect}
                onOcsClick={handleOcsClick}
              />
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

      <InfoModal
        isOpen={showElectivesHintModal}
        title="About electives"
        description={ELECTIVES_HINT_TEXT}
        showNeverShowAgain
        neverShowAgain={neverShowElectivesHint}
        onNeverShowAgainChange={setNeverShowElectivesHint}
        onClose={handleElectivesHintClose}
      />
      <InfoModal
        isOpen={showOcsSoonModal}
        title="OCS"
        description={OCS_COMING_SOON_TEXT}
        onClose={() => setShowOcsSoonModal(false)}
      />
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}
