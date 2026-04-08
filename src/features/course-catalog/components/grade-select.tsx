import { useEffect, useMemo, useRef, useState } from "react";

import type { StudyGrade } from "../types";

type GradeSelectProps = {
  options: StudyGrade[];
  value: StudyGrade | "";
  onChange: (value: StudyGrade | "") => void;
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

function SearchIcon() {
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
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13 13 4 4" />
    </svg>
  );
}

export function GradeSelect({ options, value, onChange }: GradeSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return options;
    }

    return options.filter((option) => option.toLowerCase().includes(normalized));
  }, [options, search]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => {
            const next = !current;

            if (!next) {
              setSearch("");
            }

            return next;
          });
        }}
        className="flex h-11 w-full items-center justify-between rounded-[14px] border border-[var(--uaip-gray-200)] bg-white px-4 text-left text-[0.95rem] text-[var(--uaip-text-primary)] shadow-[0_1px_2px_rgba(17,17,17,0.04)] transition hover:border-[var(--uaip-gray-300)]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? "text-[var(--uaip-text-primary)]" : "text-[var(--uaip-gray-400)]"}>
          {value || "Select grade"}
        </span>
        <span className="text-[var(--uaip-gray-400)]">
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[18px] border border-[var(--uaip-gray-200)] bg-white p-3 shadow-[0_18px_50px_rgba(17,17,17,0.14)]">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--uaip-gray-400)]">
              <SearchIcon />
            </span>
            <input
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-11 w-full rounded-[14px] border border-[var(--uaip-gray-200)] bg-white pl-10 pr-3 text-[0.9375rem] text-[var(--uaip-text-primary)] outline-none transition placeholder:text-[var(--uaip-gray-400)] focus:border-[var(--uaip-blue)] focus:ring-2 focus:ring-[var(--uaip-blue)]/15"
            />
          </div>

          <div className="mt-3 max-h-[260px] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearch("");
              }}
              className={`flex w-full items-center rounded-[12px] px-3 py-2.5 text-left text-[0.95rem] transition ${
                value === ""
                  ? "bg-[var(--uaip-gray-100)] font-semibold text-[var(--uaip-text-primary)]"
                  : "text-[var(--uaip-gray-700)] hover:bg-[var(--uaip-gray-50)]"
              }`}
            >
              All grades
            </button>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`mt-1 flex w-full items-center rounded-[12px] px-3 py-2.5 text-left text-[0.95rem] transition ${
                    value === option
                      ? "bg-[var(--uaip-gray-100)] font-semibold text-[var(--uaip-text-primary)]"
                      : "text-[var(--uaip-gray-700)] hover:bg-[var(--uaip-gray-50)]"
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-[0.9rem] text-[var(--uaip-gray-400)]">No grades found</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
