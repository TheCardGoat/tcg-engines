import { useId } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import classes from "./InteractionResolutionPrompt.module.css";

import { isLegalNumber, type Bounds } from "../interactions/number-value";

/** Only enumerate finite, discrete ranges that fit in a compact button row. */
export function smallNumberChoices({ min, max, step }: Bounds): number[] | undefined {
  if (
    min === undefined ||
    max === undefined ||
    step === undefined ||
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(max) ||
    !Number.isSafeInteger(step) ||
    step <= 0 ||
    max < min
  )
    return undefined;
  const count = Math.floor((max - min) / step) + 1;
  if (count > 6) return undefined;
  return Array.from({ length: count }, (_, index) => min + index * step);
}

/** The draft is explicit. Typing never silently clamps or rounds a payment. */
export function BoundedNumberControl({
  value,
  min,
  max,
  step,
  describedBy,
  onChange,
  disabled = false,
  className,
}: Bounds & {
  value: number | undefined;
  disabled?: boolean;
  className?: string;
  describedBy?: string;
  onChange: (value: number | undefined) => void;
}) {
  const rangeId = useId();
  const legal = isLegalNumber(value, { min, max, step });
  const range =
    min !== undefined && max !== undefined
      ? `Allowed: ${min}–${max}`
      : min !== undefined
        ? `Minimum: ${min}`
        : max !== undefined
          ? `Maximum: ${max}`
          : "Choose an amount";
  const next = (direction: number) => {
    const base = legal && value !== undefined ? value + direction * (step ?? 1) : (min ?? 0);
    onChange(Math.min(max ?? base, Math.max(min ?? base, base)));
  };
  return (
    <div className={classes.numberControl}>
      <div className={className ?? classes.numberStepper} role="group" aria-label="Amount">
        <button
          type="button"
          aria-label="Decrease amount"
          disabled={disabled || (legal && value !== undefined && value <= (min ?? -Infinity))}
          onClick={() => next(-1)}
        >
          <IconMinus size={18} aria-hidden="true" />
        </button>
        <input
          disabled={disabled}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step ?? "any"}
          value={value !== undefined && Number.isFinite(value) ? value : ""}
          aria-label="Amount"
          aria-describedby={[describedBy, rangeId].filter(Boolean).join(" ")}
          aria-invalid={value !== undefined && !legal}
          onChange={(event) =>
            onChange(
              event.currentTarget.value === "" ? undefined : event.currentTarget.valueAsNumber,
            )
          }
        />
        <button
          type="button"
          aria-label="Increase amount"
          disabled={disabled || (legal && value !== undefined && value >= (max ?? Infinity))}
          onClick={() => next(1)}
        >
          <IconPlus size={18} aria-hidden="true" />
        </button>
      </div>
      <span id={rangeId} className={classes.numberRange}>
        {range}
        {step === 1 ? " · Whole numbers" : step !== undefined ? ` · Step ${step}` : ""}
      </span>
    </div>
  );
}
