import type { GundamControlState } from "../../game/index.ts";
import { cn } from "../../lib/utils.ts";

import classes from "./PriorityCommandBeacon.module.css";

export interface PriorityCommandBeaconProps {
  readonly controlState: GundamControlState;
  readonly spectator?: boolean;
  readonly compact?: boolean;
  readonly responsive?: boolean;
  readonly className?: string;
}

function priorityCopy(
  controlState: GundamControlState,
  spectator: boolean,
): {
  readonly key: string;
  readonly label: string;
  readonly subject: string;
  readonly direction?: "self" | "opponent";
} {
  if (controlState.kind === "resolving") {
    return { key: "resolving", label: "Resolving", subject: "AUTO" };
  }

  if (controlState.priorityHolder === "self") {
    return {
      key: "self",
      label: spectator ? "Player 1 priority" : "Your priority",
      subject: spectator ? "P1" : "YOU",
      direction: "self",
    };
  }

  return {
    key: "opponent",
    label: spectator ? "Player 2 priority" : "Opponent priority",
    subject: spectator ? "P2" : "OPP",
    direction: "opponent",
  };
}

export function PriorityCommandBeacon({
  controlState,
  spectator = false,
  compact = false,
  responsive = false,
  className,
}: PriorityCommandBeaconProps) {
  const copy = priorityCopy(controlState, spectator);

  return (
    <span
      key={copy.key}
      aria-label={copy.label}
      data-priority-beacon={controlState.kind}
      data-direction={copy.direction}
      data-responsive={responsive ? "true" : undefined}
      data-state={controlState.kind}
      className={cn(
        classes.beacon,
        compact
          ? "h-full w-[4.5rem] flex-none"
          : responsive
            ? "h-full w-[4.5rem] flex-none sm:w-[9.25rem]"
            : "h-full w-[9.25rem] flex-none",
        className,
      )}
    >
      <span className={classes.sweep} aria-hidden />
      <span className={classes.label} aria-hidden>
        {copy.direction ? (
          <span className={classes.arrow}>{copy.direction === "self" ? "↓" : "↑"}</span>
        ) : null}
        {compact || responsive ? (
          <span className={classes.compactLabel}>
            <strong>{copy.subject}</strong>
            <small>{controlState.kind === "resolving" ? "RESOLVING" : "PRIORITY"}</small>
          </span>
        ) : null}
        {responsive ? <span className="hidden sm:inline">{copy.label}</span> : null}
        {!compact && !responsive ? copy.label : null}
      </span>
    </span>
  );
}
