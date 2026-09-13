import type { ReactNode } from "react";

import { cx } from "../class-names";
import type { CardInteractionState } from "../interactions/card-interaction";

export interface CardInteractionFrameProps {
  readonly state?: CardInteractionState;
  readonly children: ReactNode;
  readonly className?: string;
}

export function CardInteractionFrame({
  state = { kind: "idle" },
  children,
  className,
}: CardInteractionFrameProps) {
  const label = cardInteractionDescription(state);
  return (
    <span
      className={cx("sim-card-interaction relative block h-full w-full rounded-md", className)}
      data-card-interaction={state.kind}
      data-action-count={"actionCount" in state ? state.actionCount : undefined}
    >
      {children}
      {state.kind !== "idle" ? (
        <>
          <span
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute -inset-1 z-20 rounded-lg border-2",
              state.kind === "actionable" &&
                "border-amber-300 shadow-[0_4px_16px_rgba(245,158,11,0.42)]",
              state.kind === "selected" &&
                "border-cyan-200 shadow-[0_5px_18px_rgba(34,211,238,0.48)]",
              state.kind === "targetable" &&
                "border-dashed border-sky-300 shadow-[0_4px_16px_rgba(56,189,248,0.4)]",
            )}
            data-card-interaction-outline={state.kind}
          />
          <span className="sr-only">{label}</span>
        </>
      ) : null}
    </span>
  );
}

export function cardInteractionDescription(state: CardInteractionState): string {
  switch (state.kind) {
    case "idle":
      return "Card details available";
    case "actionable":
      return `${state.actionCount} ${state.actionCount === 1 ? "action" : "actions"} available`;
    case "selected":
      return `Selected card, ${state.actionCount} ${state.actionCount === 1 ? "action" : "actions"} available`;
    case "targetable":
      return state.label ?? "Valid target";
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}
