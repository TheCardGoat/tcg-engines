import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import { grandArchiveDecisionContinuationRegistry } from "../../procedures/decisions/continuation-registry.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function handleGrandArchiveAnswerDecision(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  command: GrandArchiveCommandFor<"answer-decision">,
): GrandArchiveCommandTransition {
  const decision = context.getState().decision;
  if (!decision || decision.id !== command.decisionId) {
    return context.failure("illegal-command", "Decision is not pending");
  }
  if (decision.playerId !== playerId) {
    return context.failure("illegal-command", "Only the decision owner may answer");
  }
  if (decision.stateVersion !== command.stateVersion) {
    return context.failure("stale-state", "Decision answer targets a stale state version");
  }

  switch (decision.kind) {
    case "choose-replacement":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "choose-unique-object":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "choose-preserve-destination":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "declare-resolved-attack":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "choose-delegated-defender":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "discard-to-influence-limit":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "choose-recollection":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "choose-retaliators":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "order-retaliation-damage":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-critical":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "order-triggered-abilities":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "announce-triggered-ability":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-optional-effect":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "announce-effect-materialization":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "announce-effect-activation":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-effect-choice":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "retarget-stack-item":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "remode-stack-item":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-effect-payment":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-level-up":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-direction-choice":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-distribution":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "announce-effect-attack":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-counter-allocation":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-move-partition":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    case "resolve-glimpse":
      return grandArchiveDecisionContinuationRegistry[decision.kind]({
        match: context,
        decision,
        command,
        playerId,
      });
    default:
      return assertNeverDecision(decision);
  }
}

function assertNeverDecision(value: never): never {
  throw new Error(`Unhandled decision variant: ${JSON.stringify(value)}`);
}
