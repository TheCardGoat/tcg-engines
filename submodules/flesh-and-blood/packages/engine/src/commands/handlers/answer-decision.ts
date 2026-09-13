import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { parseFabDecisionAnswer, submitFabDecision } from "../../procedures/decisions/index.ts";
import type { FabDecisionSubmitResult } from "../../procedures/decisions/index.ts";
import type { FabDecisionId } from "../../rules/events.ts";

function isFabDecisionId(value: string | null): value is FabDecisionId {
  return value !== null && /^decision-\d+$/.test(value);
}

export function handleAnswerDecision(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"answer-decision">,
): FabCommandHandlerResult {
  const decisionId = command.decisionId;
  const stateVersion = command.stateVersion;
  const answer = parseFabDecisionAnswer(command.answer);
  const followUpAnswers = (command.followUpAnswers ?? []).map(parseFabDecisionAnswer);
  if (
    !isFabDecisionId(decisionId) ||
    stateVersion === null ||
    !answer ||
    followUpAnswers.some((candidate) => candidate === null)
  ) {
    return {
      accepted: false,
      error: "FAB decision submission is malformed.",
      errorCode: "invalid_decision_submission",
    };
  }

  let result: FabDecisionSubmitResult;
  try {
    result = submitFabDecision(
      context.state,
      actorId,
      { decisionId, stateVersion, answer },
      context.transactionOptions(),
    );
    for (const followUpAnswer of followUpAnswers) {
      if (!result.accepted) break;
      const nextDecision = result.state.decision;
      if (!nextDecision || nextDecision.actorId !== actorId || !followUpAnswer) {
        return {
          accepted: false,
          error: "The combined FAB decision no longer has the expected follow-up.",
          errorCode: "stale_decision",
        };
      }
      result = submitFabDecision(
        result.state,
        actorId,
        {
          decisionId: nextDecision.decisionId,
          stateVersion: nextDecision.stateVersion,
          answer: followUpAnswer,
        },
        context.transactionOptions(),
      );
    }
  } catch (error) {
    return {
      accepted: false,
      error: error instanceof Error ? error.message : "FAB decision resumption failed.",
      errorCode: "unsupported_decision_continuation",
    };
  }
  if (!result || result.accepted !== true) {
    return (
      result ?? {
        accepted: false,
        error: "FAB decision continuation did not produce a result.",
        errorCode: "unsupported_decision_continuation",
      }
    );
  }
  return {
    accepted: true,
    move: "answer-decision",
    actorId,
    state: context.state,
    outcome: result.outcome,
  };
}
