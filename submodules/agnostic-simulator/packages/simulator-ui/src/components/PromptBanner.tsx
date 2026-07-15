import { useEffect, useRef, useState } from "react";

interface PromptBannerProps {
  promptText: string;
  timerMs?: number;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function PromptBanner({ promptText, timerMs, onCancel, onConfirm }: PromptBannerProps) {
  const [remainingMs, setRemainingMs] = useState(timerMs ?? 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (timerMs !== undefined && timerMs > 0) {
      setRemainingMs(timerMs);
      intervalRef.current = setInterval(() => {
        setRemainingMs((prev) => {
          const next = Math.max(0, prev - 100);
          if (next <= 0) onConfirm?.();
          return next;
        });
      }, 100);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerMs, onConfirm]);

  const seconds = Math.ceil(remainingMs / 1000);
  const timerColor =
    remainingMs > 30000
      ? "text-green-400"
      : remainingMs > 10000
        ? "text-yellow-400"
        : "text-red-400";

  const bannerClass =
    "prompt-banner sticky top-0 z-30 grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[var(--game-accent)]/30 bg-[var(--board-surface)]/95 px-4 py-3 backdrop-blur-md";

  return (
    <div className={bannerClass} role="status" aria-live="assertive">
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-normal text-[var(--game-accent)]">
          Action Required
        </p>
        <p className="mt-0.5 text-sm font-bold leading-snug text-[var(--board-text)]">
          {promptText}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {timerMs !== undefined && (
          <span className={`text-lg font-black tabular-nums ${timerColor}`}>{seconds}s</span>
        )}
        {onCancel && (
          <button
            className="rounded-md border border-[var(--board-border)] px-3 py-1.5 text-xs font-bold text-[var(--board-muted)] transition-colors hover:bg-[var(--board-surface-soft)] hover:text-[var(--board-text)]"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        {onConfirm && (
          <button
            className="rounded-md bg-[var(--game-accent)] px-3 py-1.5 text-xs font-black text-white transition-opacity hover:opacity-90"
            onClick={onConfirm}
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
}
