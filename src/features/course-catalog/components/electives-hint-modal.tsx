type InfoModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  showNeverShowAgain?: boolean;
  neverShowAgain?: boolean;
  onNeverShowAgainChange?: (checked: boolean) => void;
  actionLabel?: string;
  onClose: () => void;
};

export function InfoModal({
  isOpen,
  title,
  description,
  showNeverShowAgain = false,
  neverShowAgain = false,
  onNeverShowAgainChange,
  actionLabel = "OK, understood",
  onClose,
}: InfoModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="About electives"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 md:p-6"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[440px] rounded-[20px] border border-[var(--uaip-border-subtle)] bg-[var(--uaip-surface-0)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-7"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl" aria-hidden>
            💡
          </span>
          <div>
            <h2 className="font-heading text-[clamp(1.04rem,1rem+0.2vw,1.14rem)] font-bold text-[var(--uaip-text-primary)]">
              {title}
            </h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--uaip-gray-700)]">
              {description}
            </p>
          </div>
        </div>

        {showNeverShowAgain ? (
          <label className="mt-5 flex items-center gap-2.5 text-sm font-medium text-[var(--uaip-gray-600)]">
            <input
              type="checkbox"
              checked={neverShowAgain}
              onChange={(event) => onNeverShowAgainChange?.(event.target.checked)}
              className="size-4 rounded bg-[var(--uaip-surface-2)] accent-[var(--uaip-blue)]"
            />
            Never show again
          </label>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex w-full items-center justify-center rounded-[12px] bg-[var(--uaip-blue)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
