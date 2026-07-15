import { cn } from "../../lib/utils.ts";
import type { OpponentStrategyId } from "../../game/match-factory.ts";

interface StrategyOption {
  readonly id: OpponentStrategyId;
  readonly title: string;
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
    description: "Passes every turn. Never deploys or attacks. Ideal for learning the flow.",
  },
  {
    id: "greedy-legal",
    title: "Veteran",
    description:
      "Plays the highest-priority legal action — deploys units, attacks rested targets, pressures shields.",
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
      <legend className="gd-mono text-hud-xs font-bold text-hud-info mb-2 tracking-hud-label uppercase">
        Opponent AI
      </legend>
      <div
        role="radiogroup"
        aria-label="Opponent AI"
        className="grid gap-2 grid-cols-1 sm:grid-cols-2"
      >
        {OPTIONS.map((option) => {
          const isSelected = option.id === selected;
          const inputId = `${idPrefix}-${option.id}`;
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={cn(
                "relative flex flex-col gap-1 cursor-pointer pt-2.5 pr-3 pb-2.5 pl-3 clip-hud-6",
                "bg-[linear-gradient(180deg,rgba(255,255,255,.85),rgba(248,250,254,.95))]",
                "border transition-[border-color,box-shadow,filter] duration-150",
                isSelected
                  ? "border-hud-accent-hot shadow-[0_0_16px_rgba(45,107,255,.35)]"
                  : "border-hud-border hover:border-hud-border-hot",
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
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    "gd-display font-extrabold tracking-hud-body text-hud-md",
                    isSelected ? "text-hud-accent-hot" : "text-hud-text",
                  )}
                >
                  {option.title}
                </span>
                <span className="gd-mono text-hud-2xs text-hud-text-faint tracking-hud-label">
                  {option.id}
                </span>
              </div>
              <span className="text-hud-xs text-hud-text-muted leading-snug">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
