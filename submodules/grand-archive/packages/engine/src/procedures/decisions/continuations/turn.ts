import type { GrandArchiveProposedEvent } from "../../../kernel/events.ts";
import {
  commitGrandArchiveRecollection,
  continueGrandArchiveEndCleanup,
  grandArchiveRecollectionEvents,
} from "../../turn-progression.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

export const resolveGrandArchiveInfluenceCleanupDecision: GrandArchiveDecisionResolver<
  "discard-to-influence-limit"
> = ({ match, decision, command, playerId }) => {
  if (!Array.isArray(command.answer) || command.answer.some((value) => typeof value !== "string")) {
    return match.failure("illegal-command", "Influence cleanup requires an array of card ids");
  }
  const state = match.getState();
  const answer = command.answer;
  const selected = decision.candidateIds.filter((candidate) => answer.includes(candidate));
  if (
    new Set(answer).size !== answer.length ||
    selected.length !== answer.length ||
    selected.length !== decision.amount ||
    selected.some((objectId) => {
      const object = state.objects[objectId];
      return (
        !object ||
        object.ownerId !== decision.playerId ||
        (object.zone !== "hand" && object.zone !== "memory")
      );
    })
  ) {
    return match.failure(
      "illegal-command",
      "Influence cleanup must discard the exact excess from hand or memory",
    );
  }
  const moveEvents = selected.map((objectId): GrandArchiveProposedEvent => {
    const object = state.objects[objectId];
    if (!object) throw new Error(`Validated influence-cleanup object ${objectId} disappeared`);
    return {
      type: "object-moved",
      objectId,
      from: object.zone,
      to: "graveyard",
      actorId: playerId,
      cause: { kind: "rule", rule: "discard-to-influence-limit" },
    };
  });
  const discarded = match.commit([
    {
      type: "decision-cleared",
      decisionId: decision.id,
      actorId: playerId,
      cause: { kind: "command", move: "answer-decision" },
    },
    ...moveEvents,
  ]);
  const current = match.getState();
  if (
    current.decision ||
    current.opportunity ||
    current.stack.length > 0 ||
    current.pendingTriggers.length > 0 ||
    current.resolution
  ) {
    return discarded;
  }
  return continueGrandArchiveEndCleanup(match, discarded);
};

export const resolveGrandArchiveRecollectionDecision: GrandArchiveDecisionResolver<
  "choose-recollection"
> = ({ match, decision, command, playerId }) => {
  if (!Array.isArray(command.answer) || command.answer.some((value) => typeof value !== "string")) {
    return match.failure("illegal-command", "Recollection requires an array of card ids");
  }
  const state = match.getState();
  const answer = command.answer;
  const selected = decision.candidateIds.filter((candidate) => answer.includes(candidate));
  if (
    new Set(answer).size !== answer.length ||
    selected.length !== answer.length ||
    selected.length !== decision.amount ||
    selected.some((objectId) => {
      const object = state.objects[objectId];
      return !object || object.ownerId !== decision.playerId || object.zone !== "memory";
    })
  ) {
    return match.failure(
      "illegal-command",
      "Recollection must choose the exact permitted number of cards from memory",
    );
  }
  return commitGrandArchiveRecollection(match, [
    {
      type: "decision-cleared",
      decisionId: decision.id,
      actorId: playerId,
      cause: { kind: "command", move: "answer-decision" },
    },
    ...grandArchiveRecollectionEvents(decision.playerId, selected),
  ]);
};

export const grandArchiveTurnDecisionResolvers = {
  "discard-to-influence-limit": resolveGrandArchiveInfluenceCleanupDecision,
  "choose-recollection": resolveGrandArchiveRecollectionDecision,
} satisfies {
  readonly [Kind in
    | "discard-to-influence-limit"
    | "choose-recollection"]: GrandArchiveDecisionResolver<Kind>;
};
