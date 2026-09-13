import {
  grandArchiveRetaliationCandidates,
  grandArchiveRetaliatorHasSteadfast,
  proposeGrandArchiveDamageOpportunity,
} from "../../combat/combat.ts";
import type { GrandArchiveCommandFailure } from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import type { GrandArchiveProposedEvent } from "../../../kernel/events.ts";
import { GrandArchiveUnsupportedRuleError } from "../../effects/evaluation.ts";
import { grandArchiveDecisionId, grandArchiveObjectId } from "../../../game/identity.ts";
import type { GrandArchiveMatchState } from "../../../game/model.ts";
import {
  commitGrandArchiveCombatDamage,
  completeGrandArchiveCombatDamageTransition,
} from "../../turn-progression.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

function combatDecisionFailure(
  match: GrandArchiveCommandHandlerContext,
  error: unknown,
): GrandArchiveCommandFailure {
  if (error instanceof GrandArchiveUnsupportedRuleError) {
    return match.failure("not-implemented", error.message);
  }
  if (error instanceof Error) return match.failure("illegal-command", error.message);
  throw error;
}

export const resolveGrandArchiveRetaliatorsDecision: GrandArchiveDecisionResolver<
  "choose-retaliators"
> = ({ match, decision, command, playerId }) => {
  const answer = command.answer;
  if (!Array.isArray(answer) || answer.some((value) => typeof value !== "string")) {
    return match.failure("illegal-command", "Retaliation answer must be an array of object ids");
  }
  const state = match.getState();
  const selected = decision.candidates.filter((candidate) => answer.includes(candidate));
  if (new Set(answer).size !== answer.length || selected.length !== answer.length) {
    return match.failure("illegal-command", "Retaliation answer contains an invalid candidate");
  }
  const accumulated = [...decision.selectedRetaliatorIds, ...selected];
  const nextControllerId = decision.remainingControllerIds[0];
  const nextCandidates = nextControllerId
    ? grandArchiveRetaliationCandidates(match.getProgram(), state).filter(
        (objectId) => state.objects[objectId]?.controllerId === nextControllerId,
      )
    : [];
  return match.commit([
    {
      type: "decision-cleared",
      decisionId: decision.id,
      actorId: playerId,
      cause: { kind: "command", move: "answer-decision" },
    },
    ...selected.flatMap((objectId): readonly GrandArchiveProposedEvent[] => {
      const object = state.objects[objectId];
      if (!object) return [];
      const steadfast = grandArchiveRetaliatorHasSteadfast(match.getProgram(), state, object);
      return [
        ...(steadfast
          ? []
          : [
              {
                type: "object-state-changed" as const,
                objectId,
                state: "rested" as const,
                value: true,
                actorId: playerId,
                cause: { kind: "rule" as const, rule: "retaliation-cost" },
              },
            ]),
        {
          type: "object-state-changed",
          objectId,
          state: "retaliating",
          value: true,
          actorId: playerId,
          cause: { kind: "rule", rule: "retaliation-declared" },
        },
      ];
    }),
    ...(nextControllerId
      ? [
          {
            type: "decision-created" as const,
            decision: {
              id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
              kind: "choose-retaliators" as const,
              playerId: nextControllerId,
              candidates: nextCandidates,
              selectedRetaliatorIds: accumulated,
              remainingControllerIds: decision.remainingControllerIds.slice(1),
              stateVersion: state.stateVersion,
            },
            cause: { kind: "rule" as const, rule: "choose-retaliators" },
          },
        ]
      : proposeGrandArchiveDamageOpportunity(state, accumulated)),
  ]);
};

export const resolveGrandArchiveRetaliationDamageOrderDecision: GrandArchiveDecisionResolver<
  "order-retaliation-damage"
> = ({ match, decision, command, playerId }) => {
  const answer = command.answer;
  if (
    !Array.isArray(answer) ||
    answer.some((value) => typeof value !== "string") ||
    answer.length !== decision.retaliatorIds.length ||
    new Set(answer).size !== answer.length ||
    answer.some((objectId) => !decision.retaliatorIds.includes(objectId))
  ) {
    return match.failure(
      "illegal-command",
      "Retaliation damage order must be an exact permutation of the retaliator ids",
    );
  }
  const state = match.getState();
  const combat = state.combat;
  if (!combat || combat.step !== "damage") {
    return match.failure("illegal-command", "Combat is no longer in the damage step");
  }
  const orderedState: GrandArchiveMatchState = {
    ...state,
    combat: {
      ...combat,
      retaliatorIds: answer,
      retaliationOrderConfirmed: true,
    },
  };
  return commitGrandArchiveCombatDamage(
    match,
    [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      {
        type: "combat-retaliators-ordered",
        retaliatorIds: answer,
        actorId: playerId,
        cause: { kind: "rule", rule: "retaliation-damage-order-chosen" },
      },
    ],
    orderedState,
  );
};

export const resolveGrandArchiveCriticalDecision: GrandArchiveDecisionResolver<
  "resolve-critical"
> = ({ match, decision, command, playerId }) => {
  const answer = command.answer;
  if (!Array.isArray(answer) || answer.some((value) => typeof value !== "string")) {
    return match.failure(
      "illegal-command",
      "Critical answer must be an array of hand card ids or an empty array to decline",
    );
  }
  const state = match.getState();
  const pending = state.replacementPreCommit;
  if (
    !pending ||
    pending.followUp.kind !== "critical" ||
    pending.followUp.amount !== decision.amount ||
    pending.followUp.sourceId !== decision.sourceId ||
    pending.followUp.recipientId !== decision.recipientId
  ) {
    return match.failure("illegal-command", "Critical replacement is no longer pending");
  }
  if (
    new Set(answer).size !== answer.length ||
    (answer.length !== 0 && answer.length !== decision.amount) ||
    answer.some((objectId) => !decision.candidates.includes(grandArchiveObjectId(objectId)))
  ) {
    return match.failure(
      "illegal-command",
      `Critical requires either zero or exactly ${decision.amount} candidate cards`,
    );
  }
  const selectedIds = answer.map(grandArchiveObjectId);
  const original = state;
  try {
    const answered = match.getKernel().transact(state, [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      ...(selectedIds.length === 0
        ? [
            {
              type: "replacement-pre-commit-critical-declined" as const,
              playerId,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "critical-discard-declined" },
            },
          ]
        : [
            {
              type: "replacement-pre-commit-critical-paid" as const,
              objectIds: selectedIds,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "critical-discard-committed" },
            },
          ]),
    ]);
    match.replaceState(answered.state);
    if (selectedIds.length === 0) {
      return completeGrandArchiveCombatDamageTransition(
        match,
        match.stabilize([...answered.result.events]),
      );
    }
    const updatedPending = match.getState().replacementPreCommit;
    if (!updatedPending) throw new Error("Critical payment lost its continuation");
    const cleared = match.getKernel().transact(match.getState(), [
      {
        type: "replacement-pre-commit-cleared",
        cause: { kind: "rule", rule: "critical-replacement-completed" },
      },
    ]);
    const resumed = match
      .getKernel()
      .resumeReplacementPreCommit(cleared.state, updatedPending.continuation);
    match.replaceState(resumed.state);
    return completeGrandArchiveCombatDamageTransition(
      match,
      match.stabilize(
        [...answered.result.events, ...cleared.result.events, ...resumed.result.events],
        resumed.result.events,
      ),
    );
  } catch (error) {
    match.replaceState(original);
    return combatDecisionFailure(match, error);
  }
};

export const grandArchiveCombatDecisionResolvers = {
  "choose-retaliators": resolveGrandArchiveRetaliatorsDecision,
  "order-retaliation-damage": resolveGrandArchiveRetaliationDamageOrderDecision,
  "resolve-critical": resolveGrandArchiveCriticalDecision,
} satisfies {
  readonly [Kind in
    | "choose-retaliators"
    | "order-retaliation-damage"
    | "resolve-critical"]: GrandArchiveDecisionResolver<Kind>;
};
