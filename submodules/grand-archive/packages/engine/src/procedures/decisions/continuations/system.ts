import {
  grandArchiveOpportunityIsSuppressed,
  openGrandArchiveOpportunity,
} from "../../game-flow/opportunity.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

export const resolveGrandArchiveUniqueObjectDecision: GrandArchiveDecisionResolver<
  "choose-unique-object"
> = ({ match, decision, command, playerId }) => {
  if (typeof command.answer !== "string") {
    return match.failure("illegal-command", "Unique-object answer must be an object id");
  }
  const kept = decision.candidates.find((candidate) => candidate === command.answer);
  if (!kept) return match.failure("illegal-command", "Chosen object is not a candidate");
  return match.commit([
    {
      type: "decision-cleared",
      decisionId: decision.id,
      actorId: playerId,
      cause: { kind: "command", move: "answer-decision" },
    },
    ...decision.candidates
      .filter((candidate) => candidate !== kept)
      .map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "field" as const,
        to: "graveyard" as const,
        actorId: playerId,
        cause: { kind: "rule" as const, rule: "unique-object-sacrifice" },
      })),
  ]);
};

export const resolveGrandArchivePreserveDestinationDecision: GrandArchiveDecisionResolver<
  "choose-preserve-destination"
> = ({ match, decision, command, playerId }) => {
  if (typeof command.answer !== "boolean") {
    return match.failure("illegal-command", "Preserve destination answer must be a boolean");
  }
  const state = match.getState();
  const card = state.objects[decision.cardId];
  if (!card || card.zone !== "effects-stack") {
    return match.failure("illegal-command", "Preserve source card is no longer resolving");
  }
  return match.commit([
    {
      type: "decision-cleared",
      decisionId: decision.id,
      actorId: playerId,
      cause: { kind: "command", move: "answer-decision" },
    },
    {
      type: "object-moved",
      objectId: card.id,
      from: "effects-stack",
      to: command.answer ? "material-deck" : "banishment",
      ...(command.answer
        ? { entryFacing: "face-up" as const, entryStates: ["preserved" as const] }
        : {}),
      actorId: playerId,
      cause: {
        kind: "rule",
        rule: command.answer
          ? "preserve-chosen-over-banishment"
          : "preserve-declined-for-banishment",
      },
    },
    ...(grandArchiveOpportunityIsSuppressed(state)
      ? []
      : [
          {
            type: "opportunity-opened" as const,
            window: openGrandArchiveOpportunity(state, state.turn.playerId, "stack-item-resolved"),
            cause: {
              kind: "stack-item" as const,
              stackItemId: decision.stackItemId,
            },
          },
        ]),
  ]);
};

export const grandArchiveSystemDecisionResolvers = {
  "choose-unique-object": resolveGrandArchiveUniqueObjectDecision,
  "choose-preserve-destination": resolveGrandArchivePreserveDestinationDecision,
} satisfies {
  readonly [Kind in
    | "choose-unique-object"
    | "choose-preserve-destination"]: GrandArchiveDecisionResolver<Kind>;
};
