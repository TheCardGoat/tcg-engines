import { useCallback } from "react";

import type { InteractionOption } from "@tcg/simulator-contract";

import { cx } from "../class-names";

interface ChoiceChipsProps {
  options: InteractionOption[];
  selectedIds: string[];
  multi?: boolean;
  onSelect?: (selectedIds: string[]) => void;
}

export function ChoiceChips({ options, selectedIds, multi = false, onSelect }: ChoiceChipsProps) {
  const toggleOption = useCallback(
    (optionId: string) => {
      if (multi) {
        const next = selectedIds.includes(optionId)
          ? selectedIds.filter((id) => id !== optionId)
          : [...selectedIds, optionId];
        onSelect?.(next);
      } else {
        onSelect?.([optionId]);
      }
    },
    [multi, selectedIds, onSelect],
  );

  return (
    <div
      className="choice-chips flex min-w-0 gap-2 overflow-x-auto pb-1 [overscroll-behavior-inline:contain]"
      role="group"
      aria-label="Choice options"
    >
      {options.map((option) => (
        <button
          key={option.id}
          className={cx(
            "choice-chip inline-flex flex-shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-extrabold transition-colors",
            selectedIds.includes(option.id)
              ? "border-[var(--game-accent)] bg-[var(--game-accent)]/20 text-[var(--game-accent)]"
              : "border-[var(--board-border)] bg-[var(--board-surface)] text-[var(--board-muted)] hover:text-[var(--board-text)]",
          )}
          onClick={() => toggleOption(option.id)}
          aria-pressed={selectedIds.includes(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
