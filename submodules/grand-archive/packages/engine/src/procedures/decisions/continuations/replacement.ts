import { proposeGrandArchiveCombatCleanup } from "../../combat/combat.ts";
import { GrandArchiveUnsupportedRuleError } from "../../effects/evaluation.ts";
import { resumeGrandArchiveEffectResolution } from "../../effects/stack-resolution.ts";
import type { GrandArchiveCommandFailure } from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

function replacementFailure(
  match: GrandArchiveCommandHandlerContext,
  error: unknown,
): GrandArchiveCommandFailure {
  if (error instanceof GrandArchiveUnsupportedRuleError) {
    return match.failure("not-implemented", error.message);
  }
  if (error instanceof Error) return match.failure("illegal-command", error.message);
  throw error;
}

export const resolveGrandArchiveReplacementDecision: GrandArchiveDecisionResolver<
  "choose-replacement"
> = ({ match, decision, command, playerId }) => {
  let answer:
    | { readonly kind: "order"; readonly candidateId: string }
    | { readonly kind: "optional"; readonly candidateId: string; readonly apply: boolean };
  if (decision.mode === "order") {
    if (typeof command.answer !== "string" || !decision.candidateIds.includes(command.answer)) {
      return match.failure(
        "illegal-command",
        "Replacement order answer must be an applicable replacement id",
      );
    }
    answer = { kind: "order", candidateId: command.answer };
  } else {
    if (typeof command.answer !== "boolean" || !decision.continuation.selectedCandidateId) {
      return match.failure("illegal-command", "Optional replacement answer must be a boolean");
    }
    answer = {
      kind: "optional",
      candidateId: decision.continuation.selectedCandidateId,
      apply: command.answer,
    };
  }
  const original = match.getState();
  try {
    const cleared = match.getKernel().transact(match.getState(), [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
    ]);
    match.replaceState(cleared.state);
    const resumed = match
      .getKernel()
      .resumeReplacement(match.getState(), decision.continuation, answer);
    match.replaceState(resumed.state);
    const events = [...cleared.result.events, ...resumed.result.events];
    if (match.getState().decision) return { ok: true, state: match.getState(), events };
    const resumedState = match.getState();
    if (resumedState.resolution) {
      const resolution = resumeGrandArchiveEffectResolution(
        match.getProgram(),
        resumedState,
        match.getKernel(),
        resumedState.resolution,
      );
      match.replaceState(resolution.state);
      events.push(...resolution.events);
      if (resolution.paused) return { ok: true, state: match.getState(), events };
      return match.stabilize(events, resolution.triggerEvents);
    }
    const triggerEvents = match
      .getState()
      .eventHistory.slice(decision.continuation.startedEventHistoryIndex);
    const stabilized = match.stabilize(events, triggerEvents);
    if (
      match.getState().status === "playing" &&
      !match.getState().decision &&
      match.getState().stack.length === 0 &&
      match.getState().combat?.step === "end"
    ) {
      const cleanup = match.commit(proposeGrandArchiveCombatCleanup(match.getState()));
      return {
        ok: true,
        state: cleanup.state,
        events: [...stabilized.events, ...cleanup.events],
      };
    }
    return stabilized;
  } catch (error) {
    match.replaceState(original);
    return replacementFailure(match, error);
  }
};

export const grandArchiveReplacementDecisionResolvers = {
  "choose-replacement": resolveGrandArchiveReplacementDecision,
} satisfies {
  readonly "choose-replacement": GrandArchiveDecisionResolver<"choose-replacement">;
};
