import type { ReactNode } from "react";

import { Button } from "../primitives/index.ts";
import type { PromptAction } from "./types.ts";

export interface GamePromptProps {
  readonly message: ReactNode;
  readonly actions?: readonly PromptAction[];
  readonly anchor?: "bottom" | "top";
}

const KIND_TO_VARIANT: Record<
  NonNullable<PromptAction["kind"]>,
  "default" | "primary" | "danger"
> = {
  default: "default",
  primary: "primary",
  danger: "danger",
};

export function GamePrompt({ message, actions = [], anchor = "bottom" }: GamePromptProps) {
  const posClass = anchor === "top" ? "top-6" : "bottom-6";

  return (
    <div
      className={`gd-display absolute z-[120] left-1/2 ${posClass} -translate-x-1/2 flex items-center gap-hud-sm py-2.5 pr-3 pl-hud-md min-h-[44px] max-w-[min(780px,92vw)] surface-panel-strong border-[rgba(76,195,255,.35)] shadow-[0_0_18px_rgba(76,195,255,.18),0_6px_18px_rgba(0,0,0,.55)] clip-hud-10 [animation:gd-fade-in_.18s_ease]`}
    >
      <span className="w-1 self-stretch flex-shrink-0 rounded-sm bg-[linear-gradient(180deg,#4cc3ff,rgba(76,195,255,.2))]" />

      <div className="font-body text-sm text-hud-text font-semibold flex-shrink-0 whitespace-nowrap pr-1.5 tracking-hud-body leading-[1.2]">
        {message}
      </div>

      <div className="flex gap-1.5 flex-shrink-0">
        {actions.map((a, i) => (
          <Button
            key={i}
            onClick={a.onClick}
            disabled={a.disabled}
            data-testid={a.testId}
            variant={KIND_TO_VARIANT[a.kind ?? "default"]}
            size="md"
            className="clip-hud-5"
          >
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
