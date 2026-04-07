import { GRADING_COMPONENT_COLORS } from "../data";
import type { CourseComponent } from "../types";

type GradingBarProps = {
  components: CourseComponent[];
};

export function GradingBar({ components }: GradingBarProps) {
  return (
    <div className="mt-3">
      <div className="flex h-1.5 gap-[2px] overflow-hidden rounded-sm">
        {components.map((component, index) => (
          <div
            key={component.name}
            className="rounded-[2px]"
            style={{
              width: `${component.weight}%`,
              backgroundColor: GRADING_COMPONENT_COLORS[index % GRADING_COMPONENT_COLORS.length],
            }}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
        {components.map((component, index) => (
          <span
            key={component.name}
            className="inline-flex items-center gap-1 text-[0.6875rem] text-[var(--uaip-gray-500)]"
          >
            <span
              className="inline-block size-2 rounded-[2px]"
              style={{
                backgroundColor: GRADING_COMPONENT_COLORS[index % GRADING_COMPONENT_COLORS.length],
              }}
            />
            {component.name}
            <strong className="text-[var(--uaip-text-primary)]">· {component.weight}%</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
