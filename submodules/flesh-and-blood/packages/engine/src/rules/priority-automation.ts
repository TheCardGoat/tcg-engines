import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

import {
  getFabAutoPassPriorityCommand,
  type FabAutoPassPolicy,
  type FabAutoPassSource,
} from "./auto-pass.ts";

export interface FabAutomaticPriorityPass {
  readonly actorId: string;
  /** Bottom layer identifies the response window that was open before this pass. */
  readonly stackWindowId: string | null;
}

/**
 * Exhaustive seat-mode → auto-pass policy mapping. A future priority mode (for
 * example a typed-yield variant) breaks this switch until it decides its drain
 * policy here. A missing seat fails closed to always-hold.
 */
function autoPassPolicyForPriorityMode(
  mode: "auto-pass" | "always-hold" | "play-and-skip" | undefined,
): FabAutoPassPolicy {
  const seatedMode = mode ?? "always-hold";
  switch (seatedMode) {
    case "auto-pass":
      return { kind: "pass-only" };
    case "play-and-skip":
      return { kind: "own-skip" };
    case "always-hold":
      return { kind: "never" };
    default: {
      const exhaustive: never = seatedMode;
      return exhaustive;
    }
  }
}

/**
 * Close the priority holder's window only while their seat is in auto-pass and
 * the window is pass-only. These are internal authoritative transitions, never
 * client moves; every automatic pass rides the triggering command's receipt so
 * one accepted command still advances the state version exactly once.
 */
export function drainPriorityAutomation(
  runtime: FabAutoPassSource,
  passPriority: (
    actorId: string,
  ) => { readonly accepted: true } | { readonly accepted: false; readonly error: string },
): readonly FabAutomaticPriorityPass[] {
  const automaticPasses: FabAutomaticPriorityPass[] = [];
  const guard = createFabLoopGuard({ label: "runtime: priority automation drain" });
  while (true) {
    const state = runtime.getState();
    if (state.gameEnded || state.decision) break;
    const actorId = state.priority?.holderPlayerId;
    if (!actorId) break;
    const policy = autoPassPolicyForPriorityMode(
      state.automationPreferences[actorId]?.priorityMode,
    );
    // Per-card opponent-trigger yields apply in every mode and are evaluated
    // BEFORE the mode policy (auto-pass.ts), so a `never` policy must not
    // short-circuit the drain: an always-hold seat configured to yield to a
    // specific opposing trigger still passes on it. The callee returns null
    // for a yield-less `never` seat, ending the drain as before.
    const command = getFabAutoPassPriorityCommand(runtime, policy);
    if (!command) break;

    guard.tick();
    const stackWindowId = state.rulesStack[0]?.layerId ?? null;
    const passResult = passPriority(actorId);
    if (!passResult.accepted) {
      // Automation is best-effort: a rejected pass (for example, a triggered
      // clash layer whose winner-owned optional prize has no pre-outcome
      // decision — see SUP020) must degrade to the manual window, not crash
      // the command receipt. The underlying rejection stays observable when a
      // human attempts the same pass.
      break;
    }
    automaticPasses.push({ actorId, stackWindowId });
  }
  return automaticPasses;
}
