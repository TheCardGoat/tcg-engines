import type {
  GrandArchiveDuration,
  GrandArchiveEffect,
  GrandArchiveExecutableAbility,
  GrandArchiveRelativePlayer,
} from "@tcg/grand-archive-types";
import {
  resolveGrandArchivePlayers,
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveExecutionBinding,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import { anchorGrandArchiveDuration, grandArchiveDurationStatus } from "../state/durations.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import type {
  GrandArchiveDelayedTriggerInstance,
  GrandArchiveMatchState,
} from "../../game/model.ts";

type CreateDelayedTriggerEffect = Extract<
  GrandArchiveEffect,
  { readonly kind: "create-delayed-trigger" }
>;

function exactlyOnePlayer(
  whose: GrandArchiveRelativePlayer,
  context: GrandArchiveEvaluationContext,
): GrandArchivePlayerId {
  const players = resolveGrandArchivePlayers(whose, context);
  if (players.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      "delayed-trigger duration requires exactly one player",
    );
  }
  return players[0]!;
}

function nextTurnNumberForPlayer(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  includeCurrent: boolean,
): number {
  const currentIndex = state.turnOrder.indexOf(state.turn.playerId);
  const targetIndex = state.turnOrder.indexOf(playerId);
  if (currentIndex < 0 || targetIndex < 0) {
    throw new GrandArchiveUnsupportedRuleError("delayed-trigger turn-order player");
  }
  let offset = (targetIndex - currentIndex + state.turnOrder.length) % state.turnOrder.length;
  if (offset === 0 && (!includeCurrent || state.turn.playerId !== playerId)) {
    offset = state.turnOrder.length;
  }
  return state.turn.number + offset;
}

function validateDelayedTriggerDuration(duration: GrandArchiveDuration | undefined): void {
  if (!duration) return;
  switch (duration.kind) {
    case "this-turn":
    case "until-end-of-turn":
    case "until-end-of-next-turn":
    case "until-start-of-turn":
    case "until-end-of-phase":
    case "until-end-of-next-phase":
    case "during-next-turn":
    case "permanent":
    case "this-attack":
    case "while-source-on-field":
    case "while-source-in-functional-zone":
      return;
    case "for-next-event":
    case "while-subjects-in-zone":
    case "while-condition":
      throw new GrandArchiveUnsupportedRuleError(`delayed-trigger duration ${duration.kind}`);
    default:
      return assertNever(duration);
  }
}

function delayedAbility(
  effect: CreateDelayedTriggerEffect,
  ordinal: number,
): Extract<GrandArchiveExecutableAbility, { readonly kind: "triggered" }> {
  return {
    id: `delayed-${ordinal}-a1`,
    kind: "triggered",
    text: "Delayed triggered effect.",
    trigger: effect.trigger,
    effect: effect.effect,
  };
}

function captureBindingObjectIncarnations(
  context: GrandArchiveEvaluationContext,
): GrandArchiveDelayedTriggerInstance["bindingObjectIncarnations"] {
  return Object.fromEntries(
    Object.entries(context.bindings).flatMap(([binding, value]) => {
      if (!Array.isArray(value)) return [];
      const incarnations = Object.fromEntries(
        value.flatMap((id) => {
          const object = context.state.objects[id];
          return object ? [[object.id, object.incarnation] as const] : [];
        }),
      );
      return Object.keys(incarnations).length > 0 ? [[binding, incarnations] as const] : [];
    }),
  );
}

/**
 * Rehydrates a delayed trigger's bindings without allowing a card that left
 * and later re-entered a zone to be mistaken for the earlier rules object.
 */
export function currentGrandArchiveDelayedTriggerBindings(
  trigger: GrandArchiveDelayedTriggerInstance,
  state: GrandArchiveMatchState,
  observedActivationSource?: {
    readonly objectId: GrandArchiveObjectId;
    readonly incarnation: number;
  },
): Readonly<Record<string, GrandArchiveExecutionBinding>> {
  return Object.fromEntries(
    Object.entries(trigger.bindings).map(([binding, value]) => {
      if (!Array.isArray(value)) return [binding, value] as const;
      const incarnations = trigger.bindingObjectIncarnations[binding];
      if (!incarnations) return [binding, value] as const;
      return [
        binding,
        value.filter((id) => {
          const expectedIncarnation = incarnations[id as GrandArchiveObjectId];
          return (
            expectedIncarnation === undefined ||
            state.objects[id]?.incarnation === expectedIncarnation ||
            (observedActivationSource?.objectId === id &&
              observedActivationSource?.incarnation === expectedIncarnation)
          );
        }),
      ] as const;
    }),
  );
}

export function createGrandArchiveDelayedTrigger(
  effect: CreateDelayedTriggerEffect,
  context: GrandArchiveEvaluationContext,
): GrandArchiveDelayedTriggerInstance {
  if (!context.sourceId) {
    throw new GrandArchiveUnsupportedRuleError("delayed trigger without a source object");
  }
  const startsPlayer = effect.starts ? exactlyOnePlayer(effect.starts.whose, context) : undefined;
  validateDelayedTriggerDuration(effect.expires);
  const notBeforeTurnNumber = startsPlayer
    ? nextTurnNumberForPlayer(context.state, startsPlayer, false)
    : context.state.turn.number;
  const ordinal = context.state.nextDelayedTriggerOrdinal;
  return {
    id: `delayed-trigger-${ordinal}`,
    sourceId: context.sourceId,
    controllerId: context.controllerId,
    ability: delayedAbility(effect, ordinal),
    bindings: { ...context.bindings },
    bindingObjectIncarnations: captureBindingObjectIncarnations(context),
    variables: { ...context.variables },
    ...(effect.expires ? { duration: effect.expires } : {}),
    durationAnchors: effect.expires ? anchorGrandArchiveDuration(effect.expires, context) : {},
    createdAtVersion: context.state.stateVersion,
    createdTurnNumber: context.state.turn.number,
    createdPhase: context.state.turn.phase,
    notBeforeTurnNumber,
    ...(effect.limit !== undefined
      ? { remainingUses: effect.limit }
      : effect.expires === undefined
        ? { remainingUses: 1 }
        : {}),
  };
}

export function grandArchiveDelayedTriggerIsActive(
  trigger: GrandArchiveDelayedTriggerInstance,
  state: GrandArchiveMatchState,
): boolean {
  return (
    state.turn.number >= trigger.notBeforeTurnNumber && durationStatus(trigger, state) === "active"
  );
}

export function grandArchiveDelayedTriggerIsExpired(
  trigger: GrandArchiveDelayedTriggerInstance,
  state: GrandArchiveMatchState,
): boolean {
  return durationStatus(trigger, state) === "expired";
}

function durationStatus(
  trigger: GrandArchiveDelayedTriggerInstance,
  state: GrandArchiveMatchState,
) {
  if (state.turn.number < trigger.notBeforeTurnNumber) return "pending";
  if (!trigger.duration) return "active";
  const delayedStart = state.eventHistory.find(
    (event): event is Extract<typeof event, { readonly type: "turn-started" }> =>
      event.type === "turn-started" && event.turnNumber === trigger.notBeforeTurnNumber,
  );
  const durationInstance =
    trigger.notBeforeTurnNumber > trigger.createdTurnNumber && delayedStart
      ? {
          ...trigger,
          createdAtVersion: delayedStart.stateVersion,
          createdTurnNumber: delayedStart.turnNumber,
          createdPhase: "wake-up" as const,
        }
      : trigger;
  return grandArchiveDurationStatus(trigger.duration, durationInstance, { state });
}

export function collectExpiredGrandArchiveDelayedTriggers(
  state: GrandArchiveMatchState,
): readonly string[] {
  return state.delayedTriggers
    .filter((trigger) => grandArchiveDelayedTriggerIsExpired(trigger, state))
    .map((trigger) => trigger.id);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive delayed-trigger variant: ${JSON.stringify(value)}`);
}
