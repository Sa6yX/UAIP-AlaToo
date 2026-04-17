import { useEffect, useRef, useState } from "react";

type FilterSelectProps<T extends string> = {
  options: readonly T[];
  value: T | "";
  onChange: (value: T | "") => void;
  placeholder: string;
  allLabel: string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 5 5 5-5" />
    </svg>
  );
}

export function FilterSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder,
  allLabel,
}: FilterSelectProps<T>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between rounded-[12px] bg-[var(--uaip-surface-2)] px-3.5 text-left text-[0.9rem] font-medium text-[var(--uaip-text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_rgba(17,17,17,0.04)] transition hover:bg-[var(--uaip-surface-3)]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? "text-[var(--uaip-text-primary)]" : "text-[var(--uaip-gray-400)]"}>
          {value || placeholder}
        </span>
        <span className="text-[var(--uaip-gray-400)]">
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[14px] bg-[var(--uaip-surface-0)] p-2 shadow-[0_18px_40px_rgba(17,17,17,0.12)]">
          <div className="max-h-[260px] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-[10px] px-3 py-2 text-left text-[0.9rem] transition ${
                value === ""
                  ? "bg-[var(--uaip-surface-2)] font-semibold text-[var(--uaip-text-primary)]"
                  : "text-[var(--uaip-gray-700)] hover:bg-[var(--uaip-surface-1)]"
              }`}
            >
              {allLabel}
            </button>

            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`mt-1 flex w-full items-center rounded-[10px] px-3 py-2 text-left text-[0.9rem] transition ${
                  value === option
                    ? "bg-[var(--uaip-surface-2)] font-semibold text-[var(--uaip-text-primary)]"
                    : "text-[var(--uaip-gray-700)] hover:bg-[var(--uaip-surface-1)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
