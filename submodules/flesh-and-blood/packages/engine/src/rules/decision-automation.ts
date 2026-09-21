import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

import type { FabDecision, FabDecisionAnswer } from "./process.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { distinctPrintedNameCount } from "../kernel/different-names.ts";
import { fabScopedAutoPassActive } from "./automation-verdict.ts";

/** One automatic decision, in real commit order. */
export interface FabAutomaticDecision {
  readonly actorId: string;
  readonly decisionId: string;
  readonly decisionKind:
    | "trigger-order"
    | "trigger-first-player"
    | "entity-target"
    | "optional-effect-decline";
}

/** The raw answer-decision payload the automation submits on the actor's behalf. */
export interface FabAutomaticDecisionCommand {
  readonly decisionId: string;
  readonly stateVersion: number;
  readonly answer: unknown;
}

/**
 * Default answers for the two simultaneous-trigger ordering decisions. The
 * ordering keeps entries exactly as presented — the pending-trigger entry
 * order — and the first-player selection picks the controller whose trigger
 * entered first (the first presented option).
 */
export function fabDefaultTriggerOrderAnswer(decision: FabDecision): FabDecisionAnswer | null {
  if (decision.kind === "ordering") {
    const orderedIds = decision.entries.map((entry) => entry.id);
    return orderedIds.length > 0 ? { kind: "ordering", orderedIds } : null;
  }
  if (decision.kind === "option") {
    const first = decision.options[0];
    return first ? { kind: "option", optionIds: [first.id] } : null;
  }
  return null;
}

function isAutoOrderableContinuation(
  continuation: FabDecision["continuation"],
): continuation is Extract<
  FabDecision["continuation"],
  { readonly kind: "trigger-order" | "trigger-first-player" }
> {
  return continuation.kind === "trigger-order" || continuation.kind === "trigger-first-player";
}

/**
 * True when the entity-target prompt has no real choice: the player must pick
 * exactly the presented candidate set (the common 1-of-1 case, and exact N of
 * N). Optional/`up to` prompts stay manual even with one candidate.
 */
export function isForcedEntityTargetDecision(
  decision: FabDecision,
): decision is Extract<FabDecision, { readonly kind: "entity-target" }> {
  return (
    decision.kind === "entity-target" &&
    decision.min > 0 &&
    decision.min === decision.max &&
    decision.candidates.length === decision.min &&
    (!decision.differentNames ||
      distinctPrintedNameCount(decision.candidates) === decision.candidates.length)
  );
}

/** Unique entity-target answer, or `null` when the player still has a choice. */
export function fabForcedEntityTargetAnswer(decision: FabDecision): FabDecisionAnswer | null {
  if (!isForcedEntityTargetDecision(decision)) return null;
  return {
    kind: "entity-target",
    instanceIds: decision.candidates.map((candidate) => candidate.instanceId),
  };
}

function automaticDecisionFor(
  state: FabRulesSnapshot,
  decision: FabDecision,
): {
  readonly decisionKind: FabAutomaticDecision["decisionKind"];
  readonly answer: FabDecisionAnswer;
} | null {
  const preferences = state.automationPreferences[decision.actorId];
  if (isAutoOrderableContinuation(decision.continuation)) {
    if (preferences?.autoOrderTriggers !== true) return null;
    const answer = fabDefaultTriggerOrderAnswer(decision);
    return answer ? { decisionKind: decision.continuation.kind, answer } : null;
  }
  // A scoped auto-pass arm is the seat's explicit opt-out of interacting, so
  // its own optional effects decline without surfacing. Other players' prompts
  // and every non-optional decision still stop the drain.
  if (
    decision.kind === "boolean" &&
    decision.continuation.kind === "optional-effect" &&
    fabScopedAutoPassActive(state, decision.actorId)
  ) {
    return {
      decisionKind: "optional-effect-decline",
      answer: { kind: "boolean", value: false },
    };
  }
  if (preferences?.autoSelectSingletonTargets !== true) return null;
  const answer = fabForcedEntityTargetAnswer(decision);
  return answer ? { decisionKind: "entity-target", answer } : null;
}

/**
 * Consume decisions the actor opted to auto-answer: simultaneous-trigger
 * ordering (`autoOrderTriggers`) and forced entity-targets
 * (`autoSelectSingletonTargets`). Modal, optional, and multi-candidate
 * targeting decisions always surface. These are internal authoritative
 * transitions riding the triggering command's receipt; a rejected submission
 * (best-effort, mirroring the priority drain) leaves the manual decision in
 * place.
 */
export function drainDecisionAutomation(
  getState: () => FabRulesSnapshot,
  answerDecision: (
    actorId: string,
    command: FabAutomaticDecisionCommand,
  ) => { readonly accepted: true } | { readonly accepted: false; readonly error: string },
): readonly FabAutomaticDecision[] {
  const automaticDecisions: FabAutomaticDecision[] = [];
  const guard = createFabLoopGuard({ label: "runtime: decision automation drain" });
  while (true) {
    const state = getState();
    if (state.gameEnded) break;
    const decision = state.decision;
    if (!decision) break;
    const automatic = automaticDecisionFor(state, decision);
    if (!automatic) break;

    guard.tick();
    const result = answerDecision(decision.actorId, {
      decisionId: decision.decisionId,
      stateVersion: state.stateID,
      answer: automatic.answer,
    });
    if (!result.accepted) break;
    automaticDecisions.push({
      actorId: decision.actorId,
      decisionId: decision.decisionId,
      decisionKind: automatic.decisionKind,
    });
  }
  return automaticDecisions;
}
