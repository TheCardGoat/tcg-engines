import type { EngineInteractionView } from "@tcg/protocol";
import { useEngineInteractionView } from "./engineContext";
import type { Side } from "./sides";

/**
 * Three high-level board UI modes the player half can be in. Derived purely
 * from the shared interaction protocol status:
 *
 *   - `view`           — `waiting` or `idle`. Other side is acting; this half is read-only.
 *   - `select-action`  — `action`. Engine wants the player to choose what to do this main step.
 *   - `select-target`  — `choice`. An action is mid-resolution; engine is waiting on a specific input.
 */
export type BoardMode = "view" | "select-action" | "select-target";

export function statusToMode(status: EngineInteractionView["status"]): BoardMode {
  switch (status) {
    case "ready":
      return "select-action";
    case "choosing":
      return "select-target";
    case "waiting":
    case "idle":
    case "game-over":
      return "view";
  }
}

export function useBoardMode(side: Side): BoardMode {
  const view = useEngineInteractionView(side);
  return statusToMode(view.status);
}
