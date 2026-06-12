import type { EngineInteractionView } from "@tcg/protocol";
import type { Side } from "./sides";

/**
 * Resolved status for the AI control panel pill. Mirrors Lorcana's
 * `resolveHumanVsAiMode` — derived purely from inputs so the panel can render
 * a stable label without owning lifecycle state.
 *
 *   - `done`        — game ended.
 *   - `error`       — last AI step threw.
 *   - `you-control` — the AI side is currently the human seat (mid-takeover, but
 *                     with no AI strategy → no driver). Effectively means
 *                     "no-one is driving."
 *   - `thinking`    — AI side is actionable AND mode is auto.
 *   - `paused`      — AI side is actionable AND mode is step.
 *   - `waiting`     — AI side has nothing to do (other side's turn / idle).
 */
export type AiStatus = "thinking" | "paused" | "waiting" | "you-control" | "done" | "error";

export type AiMode = "auto" | "step";
export type AiSpeed = "fast" | "balanced" | "slow";

export const AI_SPEED_MS: Readonly<Record<AiSpeed, number>> = {
  fast: 250,
  balanced: 600,
  slow: 1400,
};

export interface ResolveAiStatusInput {
  /** Whether the engine signalled gameEnded. */
  gameEnded: boolean;
  /** Most recent error string from an AI step, if any. */
  lastError: string | null;
  /** AI auto/step pacing. */
  mode: AiMode;
  /** Side currently driven by the human. */
  humanSide: Side;
  /** Side this status refers to (the AI side, opposite of humanSide). */
  aiSide: Side;
  /** Whether the AI side has a strategy attached. */
  hasStrategy: boolean;
  /** The AI side's protocol interaction view (so we know if it's actionable). */
  aiInteractionView: EngineInteractionView;
}

/** Pure, exhaustive resolver. Tested by `__tests__/resolveAiStatus.test.ts`. */
export function resolveAiStatus(input: ResolveAiStatusInput): AiStatus {
  if (input.gameEnded) {
    return "done";
  }
  if (input.lastError) {
    return "error";
  }
  if (!input.hasStrategy) {
    return "you-control";
  }

  const status = input.aiInteractionView.status;
  const isActionable =
    status === "choosing" ||
    (status === "ready" && input.aiInteractionView.actions.some((action) => action.enabled));

  if (!isActionable) {
    return "waiting";
  }
  return input.mode === "auto" ? "thinking" : "paused";
}
