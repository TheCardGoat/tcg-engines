import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

import { profileFabOperation } from "../performance-observer.ts";
import type { FabAutoPassSource } from "./auto-pass.ts";
import {
  drainOptionalTriggerAutomation,
  type FabAutomaticTriggerPass,
} from "./optional-trigger-automation.ts";
import { drainPriorityAutomation, type FabAutomaticPriorityPass } from "./priority-automation.ts";
import { drainDecisionAutomation, type FabAutomaticDecision } from "./decision-automation.ts";

/**
 * One authoritative automatic action in real commit order, regardless of which
 * drain produced it. The `kind` discriminant drives log rendering so
 * interleaved trigger passes, priority passes, and decision answers never
 * reorder by source list.
 */
export type FabAutomationAction =
  | ({ readonly kind: "trigger" } & FabAutomaticTriggerPass)
  | ({ readonly kind: "priority" } & FabAutomaticPriorityPass)
  | ({ readonly kind: "decision" } & FabAutomaticDecision);

/**
 * Circuit breaker for the fixed point, far above any realistic interleaving
 * (2–6 rounds). Each accepted pass commits state, so termination is monotonic;
 * the guard only bounds the composition if a future policy regresses that.
 */
const FAB_AUTOMATION_FIXED_POINT_LIMIT = 32;

/**
 * Drain both automation authorities to a fixed point inside one command
 * receipt. Running each drain once, sequentially, is not closed under the
 * other: an automatic priority pass can complete a cycle that resolves a
 * layer and latches a new `autoPassWhileTop` trigger whose always-hold owner
 * then stalls until the next command (and a trigger-drain decline can hand
 * priority to an auto-pass seat the priority drain already visited). Each
 * round re-runs both drains until a round produces no passes, the game ends,
 * or an engine decision opens — all under one bounded loop guard.
 */
export function drainFabAutomation(
  runtime: FabAutoPassSource,
  passPriority: Parameters<typeof drainPriorityAutomation>[1],
  answerDecision: Parameters<typeof drainDecisionAutomation>[1],
): readonly FabAutomationAction[] {
  return profileFabOperation("automation-fixed-point", () => {
    const automaticActions: FabAutomationAction[] = [];
    const guard = createFabLoopGuard({
      label: "runtime: automation fixed point",
      limit: FAB_AUTOMATION_FIXED_POINT_LIMIT,
    });
    for (let round = 0; round < FAB_AUTOMATION_FIXED_POINT_LIMIT; round += 1) {
      guard.tick();
      // Decision auto-answers first: a forced target or trigger-order answer
      // can unblock the pass drains in the same round (and a published
      // non-automatable decision still stops both pass drains below).
      const decisionAnswers = drainDecisionAutomation(() => runtime.getState(), answerDecision);
      automaticActions.push(
        ...decisionAnswers.map(
          (automaticDecision): FabAutomationAction => ({
            kind: "decision",
            ...automaticDecision,
          }),
        ),
      );
      const triggerPasses = drainOptionalTriggerAutomation(() => runtime.getState(), passPriority);
      automaticActions.push(
        ...triggerPasses.map(
          (automaticPass): FabAutomationAction => ({
            kind: "trigger",
            ...automaticPass,
          }),
        ),
      );
      const priorityPasses = drainPriorityAutomation(runtime, passPriority);
      automaticActions.push(
        ...priorityPasses.map(
          (automaticPass): FabAutomationAction => ({
            kind: "priority",
            ...automaticPass,
          }),
        ),
      );
      if (decisionAnswers.length + triggerPasses.length + priorityPasses.length === 0) break;
      const state = runtime.getState();
      if (state.gameEnded || state.decision) break;
    }
    return automaticActions;
  });
}
