import type { GrandArchiveNumericProperty } from "@tcg/grand-archive-types";
import type { GrandArchiveProposedEvent } from "./events.ts";
import { grandArchiveCharacteristicsAreSiegeable } from "../game/functional-subtypes.ts";
import type { GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveMatchProgram } from "./match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "../game/model.ts";
import {
  collectGrandArchiveActionRules,
  grandArchiveActionIsForbidden,
} from "../rules/state/rule-modifications.ts";
import type { GrandArchiveEvaluationContext } from "../procedures/effects/evaluation.ts";
import {
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectHasActiveKeyword,
} from "../rules/abilities/intrinsic-keywords.ts";
import {
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "../rules/state/continuous.ts";

function counterAdditionIsForbidden(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  counter: string,
  actorId: GrandArchivePlayerId | undefined,
): boolean {
  const prospectiveState =
    state.objects[object.id] === object
      ? state
      : { ...state, objects: { ...state.objects, [object.id]: object } };
  const playerId = actorId ?? object.controllerId;
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state: prospectiveState,
    controllerId: playerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    candidateId: object.id,
    bindings: {},
  };
  return collectGrandArchiveActionRules({
    action: "add-counter",
    activationKind: "ability",
    playerId,
    candidateId: object.id,
    fromZone: object.zone,
    counter,
    evaluation,
  }).some((rule) => rule.effect.mode === "forbid");
}

function objectMoveIsForbidden(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  fromZone: GrandArchiveCardInstance["zone"],
): boolean {
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: object.ownerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    candidateId: object.id,
    bindings: {},
  };
  return collectGrandArchiveActionRules({
    action: "move",
    activationKind: "ability",
    playerId: object.ownerId,
    candidateId: object.id,
    fromZone,
    evaluation,
  }).some((rule) => rule.effect.mode === "forbid");
}

function objectWakeIsForbidden(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  actorId: GrandArchivePlayerId | undefined,
): boolean {
  const playerId = actorId ?? object.controllerId;
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: playerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    candidateId: object.id,
    bindings: {},
  };
  return grandArchiveActionIsForbidden({
    action: "wake",
    activationKind: "ability",
    playerId,
    candidateId: object.id,
    fromZone: object.zone,
    evaluation,
  });
}

function allowedEntryCounters(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  counters: Readonly<Record<string, number>>,
  actorId: GrandArchivePlayerId | undefined,
): Readonly<Record<string, number>> {
  return Object.fromEntries(
    Object.entries(counters).filter(
      ([counter, amount]) =>
        amount <= 0 || !counterAdditionIsForbidden(program, state, object, counter, actorId),
    ),
  );
}

/** Applies static action restrictions before an event enters replacement processing. */
export function prepareGrandArchiveRuleBoundEvent(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
): GrandArchiveProposedEvent | undefined {
  switch (event.type) {
    case "stack-item-added":
    case "stack-item-deferred": {
      if (event.item.kind !== "card-activation" && event.item.kind !== "materialization")
        return event;
      const object = state.objects[event.item.cardId];
      return object
        ? {
            ...event,
            sourceCharacteristics: grandArchiveObjectCurrentCharacteristics(program, state, object),
          }
        : event;
    }
    case "object-state-changed": {
      const object = state.objects[event.objectId];
      if (!object) return event;
      if (object.states.has(event.state) === event.value) return undefined;
      if (
        event.state === "rested" &&
        event.value === false &&
        event.gameActionKind !== "special-game-action" &&
        objectWakeIsForbidden(program, state, object, event.actorId)
      ) {
        return undefined;
      }
      return event;
    }
    case "object-activation-state-changed": {
      const object = state.objects[event.objectId];
      return !object || object.activationStates.has(event.state) !== event.value
        ? event
        : undefined;
    }
    case "object-facing-changed": {
      const object = state.objects[event.objectId];
      return !object ||
        object.facing !== event.facing ||
        (event.revealAtEndOfGame === true && object.revealAtEndOfGame !== true)
        ? event
        : undefined;
    }
    case "damage-marked": {
      const object = state.objects[event.objectId];
      const asDurabilityLoss =
        object?.zone === "field" &&
        (grandArchiveCharacteristicsAreSiegeable(
          grandArchiveObjectCurrentCharacteristics(program, state, object),
        ) ||
          grandArchiveObjectHasActiveKeyword(program, state, object, "siegeable"));
      if (asDurabilityLoss) return { ...event, asDurabilityLoss: true };
      if (!event.asDurabilityLoss && event.durabilityRemoved === undefined) return event;
      const {
        asDurabilityLoss: _asDurabilityLoss,
        durabilityRemoved: _durabilityRemoved,
        ...markedDamage
      } = event;
      return markedDamage;
    }
    case "counter-changed": {
      if (event.delta <= 0) return event;
      const object = state.objects[event.objectId];
      if (!object) return event;
      if (event.gameActionKind === "special-game-action") return event;
      return counterAdditionIsForbidden(program, state, object, event.counter, event.actorId)
        ? undefined
        : event;
    }
    case "object-created": {
      if (event.gameActionKind === "special-game-action") return event;
      const counters = allowedEntryCounters(
        program,
        state,
        event.object,
        event.object.counters,
        event.actorId,
      );
      return { ...event, object: { ...event.object, counters } };
    }
    case "tokens-summoned": {
      if (event.gameActionKind === "special-game-action") return event;
      const first = event.objects[0];
      const prepareObject = (object: GrandArchiveCardInstance): GrandArchiveCardInstance => ({
        ...object,
        counters: allowedEntryCounters(program, state, object, object.counters, event.actorId),
      });
      const objects: readonly [GrandArchiveCardInstance, ...GrandArchiveCardInstance[]] = [
        prepareObject(first),
        ...event.objects.slice(1).map(prepareObject),
      ];
      return { ...event, objects };
    }
    case "object-moved": {
      const object = state.objects[event.objectId];
      if (!object) return event;
      let admittedEvent: Extract<GrandArchiveProposedEvent, { readonly type: "object-moved" }> =
        event;
      if (event.entryFace !== undefined) {
        const definition = program.cardsById[object.definitionId];
        if (object.copy !== undefined) return undefined;
        if (
          event.to !== "field" ||
          event.entryFacing === "face-down" ||
          object.activeDefinitionId !== undefined ||
          definition?.layout.kind !== "double-faced"
        ) {
          const { entryFace: _inapplicableEntryFace, ...withoutEntryFace } = event;
          admittedEvent = withoutEntryFace;
        }
      }
      if (
        event.gameActionKind !== "special-game-action" &&
        objectMoveIsForbidden(program, state, object, event.from)
      ) {
        return undefined;
      }
      const previousCharacteristics = grandArchiveObjectCurrentCharacteristics(
        program,
        state,
        object,
      );
      const leftFieldAsUnit =
        event.from === "field" &&
        previousCharacteristics.types.some((type) => type === "ALLY" || type === "CHAMPION");
      const leftFieldAsChampion =
        event.from === "field" && previousCharacteristics.types.includes("CHAMPION");
      const numericEvaluation = {
        program,
        state,
        controllerId: object.controllerId,
        sourceId: object.id,
        abilityBearerId: object.id,
        bindings: {},
      };
      const previousNumericProperties: Partial<Record<GrandArchiveNumericProperty, number>> = {};
      for (const property of [
        "level",
        "power",
        "life",
        "durability",
        "reserve-cost",
        "memory-cost",
      ] as const) {
        const value = deriveGrandArchiveNumericProperty(object, property, numericEvaluation);
        if (value !== undefined) previousNumericProperties[property] = value;
      }
      const {
        leftFieldAsUnit: _proposedLeftFieldAsUnit,
        leftFieldAsChampion: _proposedLeftFieldAsChampion,
        ...unclassifiedEvent
      } = admittedEvent;
      void _proposedLeftFieldAsUnit;
      void _proposedLeftFieldAsChampion;
      const withLastKnownClassification: Extract<
        GrandArchiveProposedEvent,
        { readonly type: "object-moved" }
      > = {
        ...unclassifiedEvent,
        ...(leftFieldAsUnit ? { leftFieldAsUnit: true } : {}),
        ...(leftFieldAsChampion ? { leftFieldAsChampion: true } : {}),
        previousObject: object,
        previousCharacteristics,
        previousNumericProperties,
        ...(event.from === "field" && event.to !== "field"
          ? {
              previousAbilities:
                event.previousAbilities ??
                grandArchiveObjectActiveAbilities(program, state, object),
            }
          : {}),
      };
      if (!admittedEvent.initialCounters) return withLastKnownClassification;
      const prospectiveObject: GrandArchiveCardInstance = {
        ...object,
        zone: admittedEvent.to,
        controllerId: admittedEvent.newControllerId ?? object.controllerId,
      };
      return {
        ...withLastKnownClassification,
        initialCounters: allowedEntryCounters(
          program,
          state,
          prospectiveObject,
          admittedEvent.initialCounters,
          admittedEvent.actorId,
        ),
      };
    }
    case "object-transformed": {
      const object = state.objects[event.objectId];
      const definition = object ? program.cardsById[object.definitionId] : undefined;
      return object?.zone === "field" &&
        object.facing === "face-up" &&
        object.copy === undefined &&
        object.activeDefinitionId === undefined &&
        definition?.layout.kind === "double-faced"
        ? event
        : undefined;
    }
    default:
      return event;
  }
}
