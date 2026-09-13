import { Check } from "lucide-react";

import { cn } from "../../lib/utils.ts";
import type { OpponentStrategyId } from "../../game/match-factory.ts";

interface StrategyOption {
  readonly id: OpponentStrategyId;
  readonly title: string;
  readonly level: string;
  readonly description: string;
}

/**
 * The full strategy catalog surfaced to the picker. Order is
 * presentation order — keep "Rookie" first so the first-time
 * experience defaults to the easiest opponent.
 */
const OPTIONS: readonly StrategyOption[] = [
  {
    id: "pass-only",
    title: "Rookie",
    level: "Learn the flow",
    description: "Passes every turn and never attacks.",
  },
  {
    id: "greedy-legal",
    title: "Veteran",
    level: "Active opponent",
    description: "Deploys Units, attacks rested targets, and pressures Shields.",
  },
  {
    id: "combat-aware",
    title: "Ace",
    level: "Full challenge",
    description: "Pairs before combat, chooses favorable attacks, and blocks.",
  },
];

export interface OpponentPickerProps {
  readonly selected: OpponentStrategyId;
  readonly onSelect: (id: OpponentStrategyId) => void;
  readonly idPrefix?: string;
}

export function OpponentPicker({
  selected,
  onSelect,
  idPrefix = "opponent-strategy",
}: OpponentPickerProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-bold text-hud-text">Opponent difficulty</legend>
      <div
        role="radiogroup"
        aria-label="Opponent difficulty"
        className="grid gap-2 grid-cols-1 sm:grid-cols-3"
      >
        {OPTIONS.map((option) => {
          const isSelected = option.id === selected;
          const inputId = `${idPrefix}-${option.id}`;
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={cn(
                "relative flex min-h-28 cursor-pointer flex-col gap-1 clip-hud-6 border bg-hud-surface/65 px-3 py-3",
                "transition-[border-color,box-shadow,background-color] duration-150",
                "focus-within:ring-2 focus-within:ring-hud-info",
                isSelected
                  ? "border-hud-accent-hot bg-hud-surface-raised shadow-[0_8px_20px_rgba(0,0,0,.18)]"
                  : "border-hud-border hover:border-hud-border-hot hover:bg-hud-surface-raised",
              )}
            >
              <input
                type="radio"
                id={inputId}
                name={idPrefix}
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "gd-display text-base font-extrabold tracking-hud-body",
                    isSelected ? "text-hud-accent-hot" : "text-hud-text",
                  )}
                >
                  {option.title}
                </span>
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full border",
                    isSelected
                      ? "border-hud-accent-hot bg-hud-accent-hot text-white"
                      : "border-hud-border text-transparent",
                  )}
                  aria-hidden="true"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-hud-label text-hud-info-deep">
                {option.level}
              </span>
              <span className="mt-1 text-xs leading-5 text-hud-text-muted">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
