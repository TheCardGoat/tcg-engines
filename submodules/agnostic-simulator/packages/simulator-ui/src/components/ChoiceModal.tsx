import { useCallback, useEffect, useRef, useState } from "react";

import type { InteractionOption } from "@tcg/simulator-contract";

interface ChoiceModalProps {
  open: boolean;
  title: string;
  description?: string;
  options: readonly InteractionOption[];
  timerMs?: number;
  onSelect?: (optionId: string) => void;
  onClose?: () => void;
}

export function ChoiceModal({
  open,
  title,
  description,
  options,
  timerMs,
  onSelect,
  onClose,
}: ChoiceModalProps) {
  const [remainingMs, setRemainingMs] = useState(timerMs ?? 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (open && timerMs !== undefined && timerMs > 0) {
      setRemainingMs(timerMs);
      intervalRef.current = setInterval(() => {
        setRemainingMs((prev) => {
          const next = Math.max(0, prev - 100);
          if (next <= 0 && options.length > 0) onSelect?.(options[0]!.id);
          return next;
        });
      }, 100);
    } else if (!open) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [open, timerMs, options, onSelect]);

  const seconds = Math.ceil(remainingMs / 1000);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  if (!open) return null;

  return (
    <div
      className="choice-modal-backdrop fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="choice-modal w-full max-w-sm overflow-hidden rounded-xl border border-[var(--board-border)] bg-[var(--board-surface)] text-[var(--board-text)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h3 className="choice-modal-title text-center text-lg font-black text-[var(--board-text)]">
            {title}
          </h3>
          {description !== undefined && (
            <p className="choice-modal-description mt-1 text-center text-sm font-bold text-[var(--board-muted)]">
              {description}
            </p>
          )}
          {timerMs !== undefined && (
            <p className="mt-1 text-center text-sm font-bold text-[var(--board-muted)]">
              Auto-select in <span className="tabular-nums">{seconds}s</span>
            </p>
          )}
        </div>
        <div className="grid gap-2 border-t border-[var(--board-border)] p-3">
          {options.map((option) => (
            <button
              key={option.id}
              className="choice-modal-option w-full rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)] px-4 py-3 text-left text-sm font-bold text-[var(--board-text)] transition-colors hover:border-[var(--game-accent)] hover:bg-[var(--game-accent)]/10"
              onClick={() => onSelect?.(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
