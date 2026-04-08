type ElectivesHintModalProps = {
  isOpen: boolean;
  neverShowAgain: boolean;
  onNeverShowAgainChange: (checked: boolean) => void;
  onClose: () => void;
};

const ELECTIVES_HINT_TEXT =
  "Electives are open to all departments. You choose one from the full list each semester. Review the grading breakdown and learning outcomes before choosing.";

export function ElectivesHintModal({
  isOpen,
  neverShowAgain,
  onNeverShowAgainChange,
  onClose,
}: ElectivesHintModalProps) {
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
        className="w-full max-w-[440px] rounded-[18px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-7"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl" aria-hidden>
            💡
          </span>
          <div>
            <h2 className="font-heading text-[clamp(1.04rem,1rem+0.2vw,1.14rem)] font-bold text-[var(--uaip-text-primary)]">
              About electives
            </h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--uaip-gray-700)]">
              {ELECTIVES_HINT_TEXT}
            </p>
          </div>
        </div>

        <label className="mt-5 flex items-center gap-2.5 text-sm font-medium text-[var(--uaip-gray-600)]">
          <input
            type="checkbox"
            checked={neverShowAgain}
            onChange={(event) => onNeverShowAgainChange(event.target.checked)}
            className="size-4 rounded border border-[var(--uaip-gray-300)] accent-[var(--uaip-blue)]"
          />
          Never show again
        </label>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 inline-flex w-full items-center justify-center rounded-[12px] bg-[var(--uaip-blue)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
        >
          OK, understood
        </button>
      </div>
    </div>
  );
}
