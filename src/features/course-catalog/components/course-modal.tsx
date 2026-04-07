import { DEPT_META, GRADE_SCALE, GRADING_COMPONENT_COLORS } from "../data";
import type { Course } from "../types";

type CourseModalProps = {
  course: Course | null;
  onClose: () => void;
};

function getTeacherInitial(teacher: string) {
  const parts = teacher.trim().split(/\s+/);
  const lastName = parts[parts.length - 1] ?? "?";
  return lastName.charAt(0).toUpperCase();
}

export function CourseModal({ course, onClose }: CourseModalProps) {
  if (!course) {
    return null;
  }

  const dept = DEPT_META[course.dept];

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
        className="uaip-modal-scroll max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-[18px] bg-white px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:px-9 md:py-8"
      >
        <div className="mb-5 flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.04em]"
            style={{ backgroundColor: dept.bg, color: dept.text }}
          >
            {course.dept}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-[var(--uaip-gray-500)] transition hover:text-[var(--uaip-text-primary)]"
            aria-label="Close course details"
          >
            ×
          </button>
        </div>

        <h2 className="font-heading text-[clamp(1.46rem,1.36rem+0.45vw,1.65rem)] font-extrabold text-[var(--uaip-text-primary)]">
          {course.name}
        </h2>

        <p className="mt-1 text-[0.8125rem] text-[var(--uaip-gray-400)]">
          {course.credits} credits · {course.type}
        </p>

        <p className="mt-4 text-base leading-[1.7] text-[var(--uaip-gray-700)]">
          {course.description}
        </p>

        <section className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--uaip-gray-400)]">
            Teachers
          </h3>
          <div className="mt-2.5 space-y-0.5">
            {course.teachers.map((teacher) => (
              <div
                key={teacher}
                className="flex items-center gap-2.5 border-b border-[var(--uaip-gray-100)] py-1.5 text-[0.9375rem] text-[var(--uaip-text-primary)]"
              >
                <span
                  className="grid size-7 place-items-center rounded-full text-[0.8125rem] font-bold"
                  style={{ backgroundColor: dept.bg, color: dept.text }}
                >
                  {getTeacherInitial(teacher)}
                </span>
                {teacher}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--uaip-gray-400)]">
            Grading breakdown
          </h3>

          <div className="mt-2.5 space-y-0.5">
            {course.components.map((component, index) => {
              const chipColor = GRADING_COMPONENT_COLORS[index % GRADING_COMPONENT_COLORS.length];

              return (
                <div
                  key={component.name}
                  className="flex items-center gap-2.5 border-b border-[var(--uaip-gray-100)] py-1.5"
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

          <div className="mt-3.5 rounded-[10px] bg-[var(--uaip-gray-50)] p-3">
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
        </section>

        <section className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--uaip-gray-400)]">
            Skills you&apos;ll gain
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-2">
            {course.outcomes.map((outcome) => (
              <span
                key={outcome}
                className="rounded-full bg-[var(--uaip-gray-100)] px-3 py-1 text-xs font-medium text-[var(--uaip-gray-700)]"
              >
                {outcome}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
