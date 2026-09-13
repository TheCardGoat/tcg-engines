import type { GrandArchiveObjectState } from "@tcg/grand-archive-types";
import type { GrandArchiveObjectId } from "../game/identity.ts";
import type { GrandArchiveCommittedEvent, GrandArchiveProposedEvent } from "../kernel/events.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveDecision,
  GrandArchiveMatchState,
  GrandArchiveReplacementContinuation,
  GrandArchiveReplacementPreCommit,
} from "../game/model.ts";
import {
  collectGrandArchiveSnapshotValidationIssues,
  GrandArchiveSnapshotValidationError,
  isGrandArchiveMatchSnapshotV1,
} from "./snapshot-validation.ts";

export interface GrandArchiveSerializedObject extends Omit<
  GrandArchiveCardInstance,
  "states" | "activationStates"
> {
  readonly states: readonly GrandArchiveObjectState[];
  readonly activationStates: readonly import("@tcg/grand-archive-types").GrandArchiveActivationState[];
}

/**
 * Closed persistence DTO. Runtime state additions must be classified explicitly
 * as persisted or transient instead of silently crossing the snapshot boundary.
 */
export interface GrandArchiveMatchSnapshotV1 {
  readonly schemaVersion: GrandArchiveMatchState["schemaVersion"];
  readonly snapshotVersion: 1;
  readonly programFingerprint: GrandArchiveMatchState["programFingerprint"];
  readonly mode: GrandArchiveMatchState["mode"];
  readonly status: GrandArchiveMatchState["status"];
  readonly winnerIds: GrandArchiveMatchState["winnerIds"];
  readonly gameStates: GrandArchiveMatchState["gameStates"];
  readonly stateVersion: GrandArchiveMatchState["stateVersion"];
  readonly players: GrandArchiveMatchState["players"];
  readonly turnOrder: GrandArchiveMatchState["turnOrder"];
  readonly objects: Readonly<Record<GrandArchiveObjectId, GrandArchiveSerializedObject>>;
  readonly zones: GrandArchiveMatchState["zones"];
  readonly sharedZones: GrandArchiveMatchState["sharedZones"];
  readonly stack: GrandArchiveMatchState["stack"];
  readonly turn: GrandArchiveMatchState["turn"];
  readonly pregame: GrandArchiveMatchState["pregame"];
  readonly opportunity: GrandArchiveMatchState["opportunity"];
  readonly decision: GrandArchiveSerializedDecision | null;
  readonly resolution: GrandArchiveMatchState["resolution"];
  readonly replacementFollowUps: GrandArchiveMatchState["replacementFollowUps"];
  readonly replacementPreCommit: GrandArchiveSerializedReplacementPreCommit | null;
  readonly trackedCharacteristics: GrandArchiveMatchState["trackedCharacteristics"];
  readonly combat: GrandArchiveMatchState["combat"];
  readonly pendingGameOutcome: GrandArchiveMatchState["pendingGameOutcome"];
  readonly pendingTermination: GrandArchiveMatchState["pendingTermination"];
  readonly random: GrandArchiveMatchState["random"];
  readonly nextObjectOrdinal: GrandArchiveMatchState["nextObjectOrdinal"];
  readonly nextStackOrdinal: GrandArchiveMatchState["nextStackOrdinal"];
  readonly nextDecisionOrdinal: GrandArchiveMatchState["nextDecisionOrdinal"];
  readonly nextEventOrdinal: GrandArchiveMatchState["nextEventOrdinal"];
  readonly eventHistory: readonly GrandArchiveSerializedEvent[];
  readonly continuousEffects: GrandArchiveMatchState["continuousEffects"];
  readonly nextContinuousOrdinal: GrandArchiveMatchState["nextContinuousOrdinal"];
  readonly replacementEffects: GrandArchiveMatchState["replacementEffects"];
  readonly nextReplacementOrdinal: GrandArchiveMatchState["nextReplacementOrdinal"];
  readonly replacementLimitUsages: GrandArchiveMatchState["replacementLimitUsages"];
  readonly ruleModifications: GrandArchiveMatchState["ruleModifications"];
  readonly nextRuleModificationOrdinal: GrandArchiveMatchState["nextRuleModificationOrdinal"];
  readonly pendingTriggers: GrandArchiveMatchState["pendingTriggers"];
  readonly nextPendingTriggerOrdinal: GrandArchiveMatchState["nextPendingTriggerOrdinal"];
  readonly generatedTriggers: GrandArchiveMatchState["generatedTriggers"];
  readonly nextGeneratedTriggerOrdinal: GrandArchiveMatchState["nextGeneratedTriggerOrdinal"];
  readonly delayedTriggers: GrandArchiveMatchState["delayedTriggers"];
  readonly nextDelayedTriggerOrdinal: GrandArchiveMatchState["nextDelayedTriggerOrdinal"];
}

type GrandArchiveSerializedProposedEvent =
  | Exclude<
      GrandArchiveProposedEvent,
      {
        readonly type:
          | "object-created"
          | "object-removed-from-game"
          | "object-moved"
          | "tokens-summoned";
      }
    >
  | (Omit<Extract<GrandArchiveProposedEvent, { readonly type: "object-created" }>, "object"> & {
      readonly object: GrandArchiveSerializedObject;
    })
  | (Omit<
      Extract<GrandArchiveProposedEvent, { readonly type: "object-removed-from-game" }>,
      "object"
    > & {
      readonly object: GrandArchiveSerializedObject;
    })
  | (Omit<
      Extract<GrandArchiveProposedEvent, { readonly type: "object-moved" }>,
      "previousObject"
    > & {
      readonly previousObject?: GrandArchiveSerializedObject;
    })
  | (Omit<Extract<GrandArchiveProposedEvent, { readonly type: "tokens-summoned" }>, "objects"> & {
      readonly objects: readonly [GrandArchiveSerializedObject, ...GrandArchiveSerializedObject[]];
    });

type GrandArchiveReplacementDecision = Extract<
  GrandArchiveDecision,
  { readonly kind: "choose-replacement" }
>;

type GrandArchiveSerializedReplacementContinuation = Omit<
  GrandArchiveReplacementContinuation,
  "queue"
> & {
  readonly queue: readonly {
    readonly event: GrandArchiveSerializedProposedEvent;
    readonly depth: number;
    readonly appliedReplacementIds: readonly string[];
  }[];
};

type GrandArchiveSerializedReplacementPreCommit = Omit<
  GrandArchiveReplacementPreCommit,
  "continuation"
> & {
  readonly continuation: GrandArchiveSerializedReplacementContinuation;
};

type GrandArchiveSerializedDecision =
  | Exclude<GrandArchiveDecision, GrandArchiveReplacementDecision>
  | (Omit<GrandArchiveReplacementDecision, "continuation"> & {
      readonly continuation: GrandArchiveSerializedReplacementContinuation;
    });

export type GrandArchiveSerializedEvent =
  | Exclude<
      GrandArchiveCommittedEvent,
      {
        readonly type:
          | "object-created"
          | "object-removed-from-game"
          | "object-moved"
          | "tokens-summoned"
          | "decision-created";
      }
    >
  | (Omit<Extract<GrandArchiveCommittedEvent, { readonly type: "object-created" }>, "object"> & {
      readonly object: GrandArchiveSerializedObject;
    })
  | (Omit<
      Extract<GrandArchiveCommittedEvent, { readonly type: "object-removed-from-game" }>,
      "object"
    > & {
      readonly object: GrandArchiveSerializedObject;
    })
  | (Omit<
      Extract<GrandArchiveCommittedEvent, { readonly type: "object-moved" }>,
      "previousObject"
    > & {
      readonly previousObject?: GrandArchiveSerializedObject;
    })
  | (Omit<
      Extract<GrandArchiveCommittedEvent, { readonly type: "decision-created" }>,
      "decision"
    > & {
      readonly decision: GrandArchiveSerializedDecision;
    })
  | (Omit<Extract<GrandArchiveCommittedEvent, { readonly type: "tokens-summoned" }>, "objects"> & {
      readonly objects: readonly [GrandArchiveSerializedObject, ...GrandArchiveSerializedObject[]];
    });

function serializeObject(object: GrandArchiveCardInstance): GrandArchiveSerializedObject {
  return {
    ...object,
    states: [...object.states],
    activationStates: [...object.activationStates],
  };
}

function restoreObject(object: GrandArchiveSerializedObject): GrandArchiveCardInstance {
  return {
    ...object,
    states: new Set(object.states),
    activationStates: new Set(object.activationStates),
  };
}

function mapNonEmpty<T, U>(
  values: readonly [T, ...T[]],
  transform: (value: T, index: number) => U,
): readonly [U, ...U[]] {
  return [
    transform(values[0], 0),
    ...values.slice(1).map((value, index) => transform(value, index + 1)),
  ];
}

function serializeProposedEvent(
  event: GrandArchiveProposedEvent,
): GrandArchiveSerializedProposedEvent {
  if (event.type === "object-created") return { ...event, object: serializeObject(event.object) };
  if (event.type === "object-removed-from-game") {
    return { ...event, object: serializeObject(event.object) };
  }
  if (event.type === "object-moved") {
    const { previousObject, ...serialized } = event;
    return {
      ...serialized,
      ...(previousObject ? { previousObject: serializeObject(previousObject) } : {}),
    };
  }
  if (event.type === "tokens-summoned") {
    return {
      ...event,
      objects: mapNonEmpty(event.objects, serializeObject),
    };
  }
  return event;
}

function restoreProposedEvent(
  event: GrandArchiveSerializedProposedEvent,
): GrandArchiveProposedEvent {
  if (event.type === "object-created") return { ...event, object: restoreObject(event.object) };
  if (event.type === "object-removed-from-game") {
    return { ...event, object: restoreObject(event.object) };
  }
  if (event.type === "object-moved") {
    const { previousObject, ...restored } = event;
    return {
      ...restored,
      ...(previousObject ? { previousObject: restoreObject(previousObject) } : {}),
    };
  }
  if (event.type === "tokens-summoned") {
    return {
      ...event,
      objects: mapNonEmpty(event.objects, restoreObject),
    };
  }
  return event;
}

function serializeReplacementContinuation(
  continuation: GrandArchiveReplacementContinuation,
): GrandArchiveSerializedReplacementContinuation {
  return {
    ...continuation,
    queue: continuation.queue.map((entry) => ({
      ...entry,
      event: serializeProposedEvent(entry.event),
    })),
  };
}

function restoreReplacementContinuation(
  continuation: GrandArchiveSerializedReplacementContinuation,
): GrandArchiveReplacementContinuation {
  return {
    ...continuation,
    queue: continuation.queue.map((entry) => ({
      ...entry,
      event: restoreProposedEvent(entry.event),
    })),
  };
}

function serializeDecision(
  decision: GrandArchiveDecision | null,
): GrandArchiveSerializedDecision | null {
  if (!decision || decision.kind !== "choose-replacement") return decision;
  return {
    ...decision,
    continuation: serializeReplacementContinuation(decision.continuation),
  };
}

function restoreDecision(
  decision: GrandArchiveSerializedDecision | null,
): GrandArchiveDecision | null {
  if (!decision || decision.kind !== "choose-replacement") return decision;
  return {
    ...decision,
    continuation: restoreReplacementContinuation(decision.continuation),
  };
}

export function serializeGrandArchiveMatchSnapshot(
  state: GrandArchiveMatchState,
): GrandArchiveMatchSnapshotV1 {
  const {
    schemaVersion,
    programFingerprint,
    mode,
    status,
    winnerIds,
    gameStates,
    stateVersion,
    players,
    turnOrder,
    objects: stateObjects,
    zones,
    sharedZones,
    stack,
    turn,
    pregame,
    opportunity,
    decision,
    resolution,
    replacementFollowUps,
    replacementPreCommit,
    trackedCharacteristics,
    combat,
    pendingGameOutcome,
    pendingTermination,
    random,
    nextObjectOrdinal,
    nextStackOrdinal,
    nextDecisionOrdinal,
    nextEventOrdinal,
    eventHistory: stateEventHistory,
    continuousEffects,
    nextContinuousOrdinal,
    replacementEffects,
    nextReplacementOrdinal,
    replacementLimitUsages,
    ruleModifications,
    nextRuleModificationOrdinal,
    pendingTriggers,
    nextPendingTriggerOrdinal,
    generatedTriggers,
    nextGeneratedTriggerOrdinal,
    delayedTriggers,
    nextDelayedTriggerOrdinal,
    ...unclassifiedState
  } = state;
  unclassifiedState satisfies Record<string, never>;
  const objects: Record<GrandArchiveObjectId, GrandArchiveSerializedObject> = {};
  for (const object of Object.values(stateObjects)) {
    objects[object.id] = serializeObject(object);
  }
  const eventHistory: GrandArchiveSerializedEvent[] = stateEventHistory.map((event) => {
    if (event.type === "object-created") return { ...event, object: serializeObject(event.object) };
    if (event.type === "object-removed-from-game") {
      return { ...event, object: serializeObject(event.object) };
    }
    if (event.type === "object-moved") {
      const { previousObject, ...serialized } = event;
      return {
        ...serialized,
        ...(previousObject ? { previousObject: serializeObject(previousObject) } : {}),
      };
    }
    if (event.type === "tokens-summoned") {
      return {
        ...event,
        objects: mapNonEmpty(event.objects, serializeObject),
      };
    }
    if (event.type === "decision-created") {
      const decision = serializeDecision(event.decision);
      if (!decision) throw new Error("A decision-created event must contain a decision");
      return { ...event, decision };
    }
    return event;
  });
  const snapshot: GrandArchiveMatchSnapshotV1 = {
    schemaVersion,
    snapshotVersion: 1,
    programFingerprint,
    mode,
    status,
    winnerIds,
    gameStates,
    stateVersion,
    players,
    turnOrder,
    objects,
    zones,
    sharedZones,
    stack,
    turn,
    pregame,
    opportunity,
    eventHistory,
    decision: serializeDecision(decision),
    resolution,
    replacementFollowUps,
    replacementPreCommit: replacementPreCommit
      ? {
          ...replacementPreCommit,
          continuation: serializeReplacementContinuation(replacementPreCommit.continuation),
        }
      : null,
    trackedCharacteristics,
    combat,
    pendingGameOutcome,
    pendingTermination,
    random,
    nextObjectOrdinal,
    nextStackOrdinal,
    nextDecisionOrdinal,
    nextEventOrdinal,
    continuousEffects,
    nextContinuousOrdinal,
    replacementEffects,
    nextReplacementOrdinal,
    replacementLimitUsages,
    ruleModifications,
    nextRuleModificationOrdinal,
    pendingTriggers,
    nextPendingTriggerOrdinal,
    generatedTriggers,
    nextGeneratedTriggerOrdinal,
    delayedTriggers,
    nextDelayedTriggerOrdinal,
  };
  const issues = collectGrandArchiveSnapshotValidationIssues(snapshot);
  if (issues.length > 0) {
    throw new GrandArchiveSnapshotValidationError("serialize", issues, snapshot);
  }
  return snapshot;
}

export function restoreGrandArchiveMatchSnapshot(
  program: GrandArchiveMatchProgram,
  snapshot: unknown,
): GrandArchiveMatchState {
  if (!isGrandArchiveMatchSnapshotV1(snapshot, program)) {
    throw new GrandArchiveSnapshotValidationError(
      "restore",
      collectGrandArchiveSnapshotValidationIssues(snapshot, program),
      snapshot,
    );
  }
  const {
    snapshotVersion: _snapshotVersion,
    objects: snapshotObjects,
    eventHistory: snapshotEventHistory,
    decision: snapshotDecision,
    replacementPreCommit: snapshotReplacementPreCommit,
    ...persistedState
  } = snapshot;
  const objects: Record<GrandArchiveObjectId, GrandArchiveCardInstance> = {};
  for (const object of Object.values(snapshotObjects)) {
    if (!program.cardsById[object.definitionId]) {
      throw new Error(`Snapshot contains unknown card ${object.definitionId}`);
    }
    if (object.activeDefinitionId && !program.cardsById[object.activeDefinitionId]) {
      throw new Error(`Snapshot contains unknown active card ${object.activeDefinitionId}`);
    }
    objects[object.id] = restoreObject(object);
  }
  const eventHistory: GrandArchiveCommittedEvent[] = snapshotEventHistory.map((event) => {
    if (event.type === "object-created") return { ...event, object: restoreObject(event.object) };
    if (event.type === "object-removed-from-game") {
      return { ...event, object: restoreObject(event.object) };
    }
    if (event.type === "object-moved") {
      const { previousObject, ...restored } = event;
      return {
        ...restored,
        ...(previousObject ? { previousObject: restoreObject(previousObject) } : {}),
      };
    }
    if (event.type === "tokens-summoned") {
      return {
        ...event,
        objects: mapNonEmpty(event.objects, restoreObject),
      };
    }
    if (event.type === "decision-created") {
      const decision = restoreDecision(event.decision);
      if (!decision) throw new Error("A decision-created event must contain a decision");
      return { ...event, decision };
    }
    return event;
  });
  const state: GrandArchiveMatchState = {
    ...persistedState,
    objects,
    eventHistory,
    decision: restoreDecision(snapshotDecision),
    replacementPreCommit: snapshotReplacementPreCommit
      ? {
          ...snapshotReplacementPreCommit,
          continuation: restoreReplacementContinuation(snapshotReplacementPreCommit.continuation),
        }
      : null,
  };
  return state;
}
