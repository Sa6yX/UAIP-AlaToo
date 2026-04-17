"use client";

import { useEffect, useMemo, useState } from "react";

import { DEPARTMENTS, GRADE_SCALE, STUDY_GRADES } from "./data";
import { CourseCard } from "./components/course-card";
import { CourseModal } from "./components/course-modal";
import { FilterSelect } from "./components/grade-select";
import { InfoModal } from "./components/electives-hint-modal";
import { loadCatalogCourses } from "./load-catalog-offerings";
import { getEdgeFadeOpacity } from "./scroll-fade";
import type { Course, DepartmentFilter, StudyGrade } from "./types";

const ELECTIVES_HINT_STORAGE_KEY = "uaip-electives-hint-dismissed";
const ELECTIVES_HINT_TEXT =
  "Electives are open to all departments. You choose one from the full list each semester. Review the grading breakdown and learning outcomes before choosing.";
const OCS_COMING_SOON_TEXT = "OCS will be connected soon.";

function BarsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h12" />
      <path d="M4 10h12" />
      <path d="M4 15h8" />
    </svg>
  );
}

export function CourseCatalog() {
  const [activeDept, setActiveDept] = useState<DepartmentFilter>("All");
  const [activeGrade, setActiveGrade] = useState<StudyGrade | "">("");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [catalogLoadError, setCatalogLoadError] = useState<string | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(true);
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
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const loadedCourses = await loadCatalogCourses();

        if (!isMounted) {
          return;
        }

        setCourses(loadedCourses);
        setCatalogLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCatalogLoadError(
          error instanceof Error ? error.message : "Could not load course catalog data.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingCourses(false);
        }
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
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
  }, [activeDept, activeGrade, search, courses.length, isLoadingCourses]);

  const availableDepartments = useMemo(() => {
    const availableProgramCodes = new Set(
      courses.flatMap((course) => course.departments ?? []).filter((department) => department !== "Elective"),
    );
    const hasElectives = courses.some((course) => course.isElective);

    return DEPARTMENTS.filter((department) => {
      if (department === "All") {
        return true;
      }

      if (department === "Electives") {
        return hasElectives;
      }

      return availableProgramCodes.has(department);
    });
  }, [courses]);

  useEffect(() => {
    if (!availableDepartments.includes(activeDept)) {
      setActiveDept("All");
    }
  }, [activeDept, availableDepartments]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const courseDepartments = course.departments ?? [];
      const matchDepartment =
        activeDept === "All" ||
        (activeDept === "Electives" && Boolean(course.isElective)) ||
        courseDepartments.includes(activeDept as typeof courseDepartments[number]);

      const matchSearch =
        normalizedSearch.length === 0 ||
        course.name.toLowerCase().includes(normalizedSearch) ||
        (course.code ?? "").toLowerCase().includes(normalizedSearch) ||
        course.teachers.some((teacher) => teacher.toLowerCase().includes(normalizedSearch));

      const matchGrade = activeGrade.length === 0 || course.grade === activeGrade;

      return matchDepartment && matchSearch && matchGrade;
    });
  }, [activeDept, activeGrade, courses, search]);

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
    if (activeDept === "All" && course.isElective) {
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

      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 md:py-7">
        <section className="mb-4 md:mb-5">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px] gap-2 md:grid-cols-[minmax(0,1.25fr)_220px_220px_40px] md:items-start md:gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses or teachers…"
              className="col-span-3 h-10 w-full rounded-[12px] bg-[var(--uaip-surface-0)] px-3.5 text-[0.95rem] text-[var(--uaip-text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_20px_rgba(17,17,17,0.04)] outline-none transition placeholder:text-[var(--uaip-gray-400)] hover:bg-[var(--uaip-surface-1)] focus:bg-[var(--uaip-surface-0)] md:col-span-1"
            />

            <FilterSelect
              options={STUDY_GRADES}
              value={activeGrade}
              onChange={setActiveGrade}
              placeholder="All grades"
              allLabel="All grades"
            />

            <FilterSelect
              options={availableDepartments.filter((department) => department !== "All")}
              value={activeDept === "All" ? "" : activeDept}
              onChange={(value) => handleDepartmentSelect(value || "All")}
              placeholder="All sections"
              allLabel="All sections"
            />

            <button
              type="button"
              onClick={() => setShowCardDetails((current) => !current)}
              className="flex h-10 w-10 items-center justify-center self-stretch rounded-[12px] text-[var(--uaip-text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_20px_rgba(17,17,17,0.04)] transition"
              style={{
                backgroundColor: showCardDetails ? "var(--uaip-blue)" : "var(--uaip-surface-0)",
                color: showCardDetails ? "#ffffff" : "var(--uaip-gray-500)",
              }}
              aria-pressed={showCardDetails}
              aria-label={showCardDetails ? "Hide card details" : "Show card details"}
              title={showCardDetails ? "Hide card details" : "Show card details"}
            >
              <BarsIcon />
            </button>
          </div>
        </section>

        <section className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[14px] bg-[linear-gradient(135deg,#1e3a5f_0%,#2563eb_100%)] px-4 py-3 md:mb-5 md:px-5 md:py-4">
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

        {catalogLoadError ? (
          <section className="rounded-[18px] bg-[var(--uaip-surface-1)] py-16 text-center text-[var(--uaip-gray-400)] shadow-[0_12px_30px_rgba(17,17,17,0.04)]">
            <p className="text-3xl">⚠️</p>
            <h3 className="font-heading mt-3 text-[clamp(1.08rem,1.02rem+0.2vw,1.15rem)] font-semibold text-[var(--uaip-gray-600)]">
              Could not load catalog data
            </h3>
            <p className="mt-1 text-base">{catalogLoadError}</p>
          </section>
        ) : isLoadingCourses ? (
          <section className="rounded-[18px] bg-[var(--uaip-surface-1)] py-16 text-center text-[var(--uaip-gray-400)] shadow-[0_12px_30px_rgba(17,17,17,0.04)]">
            <p className="text-3xl">⏳</p>
            <h3 className="font-heading mt-3 text-[clamp(1.08rem,1.02rem+0.2vw,1.15rem)] font-semibold text-[var(--uaip-gray-600)]">
              Loading course catalog…
            </h3>
            <p className="mt-1 text-base">Fetching live data from UAIP database</p>
          </section>
        ) : filteredCourses.length > 0 ? (
          <section className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[18px]">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showDetails={showCardDetails}
                onSelect={handleCourseSelect}
                onOcsClick={handleOcsClick}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-[18px] bg-[var(--uaip-surface-1)] py-16 text-center text-[var(--uaip-gray-400)] shadow-[0_12px_30px_rgba(17,17,17,0.04)]">
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
