import {
  collectGrandArchiveModeTargets,
  declareGrandArchiveModes,
  declareGrandArchiveTargetsWithRandom,
  getGrandArchiveAnnouncementModes,
  grandArchiveModeTrackingEvents,
  grandArchiveTargetingContext,
  validateGrandArchiveChosenVariables,
} from "../../activation/activation.ts";
import type { GrandArchiveCommandFailure } from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import { grandArchiveObjectCurrentCharacteristics } from "../../../rules/state/continuous.ts";
import type { GrandArchiveProposedEvent } from "../../../kernel/events.ts";
import {
  grandArchiveEvaluationObject,
  GrandArchiveUnsupportedRuleError,
} from "../../effects/evaluation.ts";
import {
  grandArchiveOpportunityIsSuppressed,
  openGrandArchiveOpportunity,
} from "../../game-flow/opportunity.ts";
import { createGrandArchiveTriggeredStackItem } from "../../../rules/abilities/triggers.ts";
import { GrandArchiveDecisionAnswerCodec } from "../answer-codec.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

function triggerDecisionFailure(
  match: GrandArchiveCommandHandlerContext,
  error: unknown,
): GrandArchiveCommandFailure {
  if (error instanceof GrandArchiveUnsupportedRuleError) {
    return match.failure("not-implemented", error.message);
  }
  if (error instanceof Error) return match.failure("illegal-command", error.message);
  throw error;
}

export const resolveGrandArchiveTriggeredAbilityOrderDecision: GrandArchiveDecisionResolver<
  "order-triggered-abilities"
> = ({ match, decision, command, playerId }) => {
  const answer = command.answer;
  if (
    !Array.isArray(answer) ||
    answer.some((value) => typeof value !== "string") ||
    answer.length !== decision.pendingTriggerIds.length ||
    new Set(answer).size !== answer.length ||
    answer.some((id) => !decision.pendingTriggerIds.includes(id))
  ) {
    return match.failure(
      "illegal-command",
      "Trigger order must be an exact permutation of the pending trigger ids",
    );
  }
  return match.commit([
    {
      type: "decision-cleared",
      decisionId: decision.id,
      actorId: playerId,
      cause: { kind: "command", move: "answer-decision" },
    },
    {
      type: "pending-trigger-batch-ordered",
      batchId: decision.batchId,
      controllerId: playerId,
      triggerIds: answer,
      actorId: playerId,
      cause: { kind: "rule", rule: "simultaneous-trigger-order-chosen" },
    },
  ]);
};

export const resolveGrandArchiveTriggeredAbilityAnnouncementDecision: GrandArchiveDecisionResolver<
  "announce-triggered-ability"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const pending = state.pendingTriggers.find((trigger) => trigger.id === decision.pendingTriggerId);
  if (!pending) {
    return match.failure("illegal-command", "Pending trigger no longer exists");
  }
  const pendingSource = pending.sourceId ? state.objects[pending.sourceId] : undefined;
  const masterySource = pending.bindings.masterySourceName;
  if (
    (pending.sourceId && !pendingSource) ||
    (!pending.sourceId && !pending.gameSource && typeof masterySource !== "string")
  ) {
    return match.failure("illegal-command", "Pending trigger source no longer exists");
  }
  const announcement = new GrandArchiveDecisionAnswerCodec(match).parseTriggerAnnouncement(
    command.answer,
  );
  if (!announcement) {
    return match.failure("illegal-command", "Triggered-ability announcement has an invalid shape");
  }
  const original = state;
  try {
    const evaluation = {
      program: match.getProgram(),
      state,
      controllerId: pending.controllerId,
      ...(pending.sourceId
        ? {
            sourceId: pending.sourceId,
            abilityBearerId: pending.sourceId,
            sourceIdentityId: pending.sourceId,
            sourceIncarnation: pending.sourceIncarnation,
          }
        : {}),
      ...(pending.sourceLkiEventId
        ? {
            sourceLkiEventId: pending.sourceLkiEventId,
            sourceInformationBasis: "last-known" as const,
          }
        : {}),
      bindings: pending.bindings,
      variables: { ...pending.variables, ...announcement.variables },
    };
    const evaluationSource = pending.sourceId
      ? grandArchiveEvaluationObject(pending.sourceId, evaluation, true)
      : undefined;
    const modeDeclaration = getGrandArchiveAnnouncementModes(
      pending.ability.modes,
      "effect" in pending.ability ? pending.ability.effect : undefined,
      evaluation,
    );
    const cascade = "cascade" in pending.ability ? pending.ability.cascade : undefined;
    if (cascade && (announcement.modeIds?.length ?? 0) > 0) {
      throw new Error("A Cascade mode is selected automatically and cannot be declared");
    }
    const modes = declareGrandArchiveModes(modeDeclaration, announcement.modeIds, evaluation);
    const cascadeModes = cascade
      ? pending.selectedModeIds.flatMap((modeId) => {
          const mode = cascade.modes.find((entry) => entry.id === modeId);
          return mode ? [mode] : [];
        })
      : [];
    const selectedModes = [...cascadeModes, ...modes.modes];
    validateGrandArchiveChosenVariables(pending.ability.variables, modes.modes, evaluation);
    const targetDeclaration = declareGrandArchiveTargetsWithRandom(
      collectGrandArchiveModeTargets(cascade ? undefined : pending.ability.targets, selectedModes),
      announcement.targets,
      {
        ...evaluation,
        ...(modes.random ? { state: { ...state, random: modes.random } } : { state }),
        targeting: grandArchiveTargetingContext(
          "triggered-ability",
          evaluationSource
            ? grandArchiveObjectCurrentCharacteristics(match.getProgram(), state, evaluationSource)
                .subtypes
            : [],
          [pending.ability.effect, ...selectedModes.map((mode) => mode.effect)],
          "resolutionAs" in pending.ability && pending.ability.resolutionAs === "spell",
        ),
      },
    );
    const targets = targetDeclaration.targets;
    const announcementRandom = targetDeclaration.random ?? modes.random;
    const events: GrandArchiveProposedEvent[] = [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      {
        type: "pending-trigger-removed",
        triggerId: pending.id,
        actorId: playerId,
        cause: { kind: "rule", rule: "trigger-targets-declared" },
      },
      ...grandArchiveModeTrackingEvents(modes, playerId, {
        kind: "rule",
        rule: "triggered-mode-selected",
      }),
      ...(announcementRandom
        ? [
            {
              type: "random-state-changed" as const,
              random: announcementRandom,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "random-trigger-announcement" },
            },
          ]
        : []),
      {
        type: "stack-item-added",
        item: createGrandArchiveTriggeredStackItem(
          state,
          pending,
          targets,
          [...pending.selectedModeIds, ...modes.ids],
          { ...pending.variables, ...announcement.variables },
        ),
        actorId: playerId,
        cause: { kind: "rule", rule: "triggered-ability" },
      },
    ];
    if (state.pendingTriggers.length === 1 && !grandArchiveOpportunityIsSuppressed(state)) {
      events.push({
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(state, state.turn.playerId, "stack-item-added"),
        cause: { kind: "rule", rule: "triggered-abilities-entered-stack" },
      });
    }
    return match.commit(events);
  } catch (error) {
    match.replaceState(original);
    return triggerDecisionFailure(match, error);
  }
};

export const grandArchiveTriggerDecisionResolvers = {
  "order-triggered-abilities": resolveGrandArchiveTriggeredAbilityOrderDecision,
  "announce-triggered-ability": resolveGrandArchiveTriggeredAbilityAnnouncementDecision,
} satisfies {
  readonly [Kind in
    | "order-triggered-abilities"
    | "announce-triggered-ability"]: GrandArchiveDecisionResolver<Kind>;
};
