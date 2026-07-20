import type { HTMLAttributes } from "react";

import { cx } from "../class-names";

export interface ClockReadoutProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  active?: boolean;
  urgency?: "normal" | "warning" | "danger" | "critical";
  tone?: string;
  labelMode?: "visible" | "aria";
  labelClassName?: string;
  valueClassName?: string;
  valueTestId?: string;
}

/** Stateless presentation; the owning game remains authoritative for time semantics. */
export function ClockReadout({
  label,
  value,
  active = false,
  urgency = "normal",
  tone,
  labelMode = "visible",
  labelClassName,
  valueClassName,
  valueTestId,
  className,
  role,
  "aria-label": ariaLabel,
  ...props
}: ClockReadoutProps) {
  return (
    <div
      {...props}
      className={cx("clock-readout inline-flex items-center gap-1.5 tabular-nums", className)}
      role={role ?? "timer"}
      aria-label={ariaLabel ?? `${label}: ${value}`}
      data-active={active ? "true" : "false"}
      data-urgency={urgency}
      data-tone={tone}
    >
      {labelMode === "visible" ? <span className={labelClassName}>{label}</span> : null}
      <strong className={valueClassName} data-testid={valueTestId}>
        {value}
      </strong>
    </div>
  );
}
