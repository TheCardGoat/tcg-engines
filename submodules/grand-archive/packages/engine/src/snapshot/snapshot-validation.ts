import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { GRAND_ARCHIVE_DECISION_KINDS, type GrandArchiveDecision } from "../game/model.ts";
import type { GrandArchiveMatchSnapshotV1 } from "./snapshot.ts";
import { GRAND_ARCHIVE_PRIVATE_ZONES } from "../game/zones.ts";

export interface GrandArchiveSnapshotValidationIssue {
  readonly check: string;
  readonly detail?: string;
}

const GRAND_ARCHIVE_ZONES: readonly GrandArchiveZone[] = [
  "main-deck",
  "material-deck",
  "hand",
  "memory",
  "graveyard",
  "banishment",
  "field",
  "effects-stack",
  "intent",
  "pantheon",
  "inner-lineage",
  "loaded",
];

const GRAND_ARCHIVE_MATCH_SNAPSHOT_V1_KEYS = {
  schemaVersion: true,
  snapshotVersion: true,
  programFingerprint: true,
  mode: true,
  status: true,
  winnerIds: true,
  gameStates: true,
  stateVersion: true,
  players: true,
  turnOrder: true,
  objects: true,
  zones: true,
  sharedZones: true,
  stack: true,
  turn: true,
  pregame: true,
  opportunity: true,
  decision: true,
  resolution: true,
  replacementFollowUps: true,
  replacementPreCommit: true,
  trackedCharacteristics: true,
  combat: true,
  pendingGameOutcome: true,
  pendingTermination: true,
  random: true,
  nextObjectOrdinal: true,
  nextStackOrdinal: true,
  nextDecisionOrdinal: true,
  nextEventOrdinal: true,
  eventHistory: true,
  continuousEffects: true,
  nextContinuousOrdinal: true,
  replacementEffects: true,
  nextReplacementOrdinal: true,
  replacementLimitUsages: true,
  ruleModifications: true,
  nextRuleModificationOrdinal: true,
  pendingTriggers: true,
  nextPendingTriggerOrdinal: true,
  generatedTriggers: true,
  nextGeneratedTriggerOrdinal: true,
  delayedTriggers: true,
  nextDelayedTriggerOrdinal: true,
} satisfies Record<keyof GrandArchiveMatchSnapshotV1, true>;

const GRAND_ARCHIVE_MATCH_SNAPSHOT_V1_KEY_SET = new Set(
  Object.keys(GRAND_ARCHIVE_MATCH_SNAPSHOT_V1_KEYS),
);

function hasExactSnapshotKeys(record: Record<string, unknown>): boolean {
  const keys = Object.keys(record);
  return (
    keys.length === GRAND_ARCHIVE_MATCH_SNAPSHOT_V1_KEY_SET.size &&
    keys.every((key) => GRAND_ARCHIVE_MATCH_SNAPSHOT_V1_KEY_SET.has(key))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isSafeNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isUniqueStringArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) && value.every(isNonEmptyString) && new Set(value).size === value.length
  );
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function decisionKindIsValid(value: unknown): value is GrandArchiveDecision["kind"] {
  return isNonEmptyString(value) && Object.hasOwn(GRAND_ARCHIVE_DECISION_KINDS, value);
}

function decisionGraphIsValid(record: Record<string, unknown>): boolean {
  if (record.decision === null) return true;
  if (
    !isRecord(record.decision) ||
    !isRecord(record.players) ||
    !isRecord(record.objects) ||
    !Array.isArray(record.stack) ||
    !decisionKindIsValid(record.decision.kind) ||
    !isNonEmptyString(record.decision.id) ||
    !isNonEmptyString(record.decision.playerId) ||
    !Object.hasOwn(record.players, String(record.decision.playerId)) ||
    !isSafeNonNegativeInteger(record.decision.stateVersion) ||
    !isSafeNonNegativeInteger(record.stateVersion) ||
    record.decision.stateVersion > record.stateVersion
  ) {
    return false;
  }
  const decision = record.decision;
  const objects = record.objects;
  const stack = record.stack;
  const objectExists = (value: unknown): boolean =>
    isNonEmptyString(value) && Object.hasOwn(objects, value);
  const objectsExist = (value: unknown): boolean =>
    isStringArray(value) && value.every(objectExists);
  const playerExists = (value: unknown): boolean =>
    isNonEmptyString(value) && Object.hasOwn(record.players as object, value);
  const playersExist = (value: unknown): boolean =>
    isStringArray(value) && value.every(playerExists);
  const stackItemExists = (value: unknown): boolean =>
    isNonEmptyString(value) && stack.some((item) => isRecord(item) && item.id === value);
  const publicTargetExists = (value: unknown): boolean => {
    if (!isNonEmptyString(value)) return false;
    const object = objects[value];
    if (object !== undefined) {
      if (!isRecord(object) || object.id !== value) return false;
      return (
        isNonEmptyString(object.zone) &&
        !(GRAND_ARCHIVE_PRIVATE_ZONES as readonly string[]).includes(object.zone) &&
        object.facing === "face-up"
      );
    }
    return playerExists(value) || stackItemExists(value);
  };
  const resolvingStackItemExists = (value: unknown): boolean =>
    isNonEmptyString(value) &&
    isRecord(record.resolution) &&
    record.resolution.stackItemId === value;
  const deferredStackItemExists = (value: unknown): boolean =>
    isNonEmptyString(value) &&
    isRecord(record.resolution) &&
    Array.isArray(record.resolution.deferredStackItems) &&
    record.resolution.deferredStackItems.some((item) => isRecord(item) && item.id === value);
  const nonNegative = (value: unknown): boolean => isSafeNonNegativeInteger(value);
  const publicSelectionsAreValid = (value: unknown): boolean =>
    Array.isArray(value) &&
    value.every(
      (selection) =>
        isRecord(selection) &&
        playerExists(selection.playerId) &&
        isStringArray(selection.targetIds) &&
        selection.targetIds.length > 0 &&
        selection.targetIds.every(publicTargetExists),
    );
  const hasStackItem = (): boolean =>
    stackItemExists(decision.stackItemId) || resolvingStackItemExists(decision.stackItemId);
  const pendingChoice =
    isRecord(record.resolution) && isRecord(record.resolution.pendingChoice)
      ? record.resolution.pendingChoice
      : undefined;
  const pendingPayment =
    isRecord(record.resolution) && isRecord(record.resolution.pendingPayment)
      ? record.resolution.pendingPayment
      : undefined;

  switch (decision.kind) {
    case "choose-replacement":
      return (
        (decision.mode === "order" || decision.mode === "optional") &&
        isStringArray(decision.candidateIds) &&
        decision.candidateIds.length > 0 &&
        isRecord(decision.continuation) &&
        Array.isArray(decision.continuation.queue) &&
        isSafeNonNegativeInteger(decision.continuation.startedEventHistoryIndex) &&
        Array.isArray(record.eventHistory) &&
        decision.continuation.startedEventHistoryIndex <= record.eventHistory.length
      );
    case "choose-unique-object":
      return typeof decision.name === "string" && objectsExist(decision.candidates);
    case "choose-preserve-destination":
      return objectExists(decision.cardId) && hasStackItem();
    case "choose-retaliators":
      return (
        objectsExist(decision.candidates) &&
        objectsExist(decision.selectedRetaliatorIds) &&
        playersExist(decision.remainingControllerIds)
      );
    case "order-retaliation-damage":
      return objectsExist(decision.retaliatorIds);
    case "resolve-critical":
      return (
        nonNegative(decision.amount) &&
        objectsExist(decision.candidates) &&
        objectExists(decision.sourceId) &&
        objectExists(decision.recipientId)
      );
    case "declare-resolved-attack":
      return (
        objectExists(decision.intentId) &&
        objectsExist(decision.attackerCandidates) &&
        objectsExist(decision.targetCandidates) &&
        objectsExist(decision.weaponCandidates) &&
        playersExist(decision.cleavePlayerCandidates)
      );
    case "choose-delegated-defender":
      return (
        playerExists(decision.attackingPlayerId) &&
        objectExists(decision.attackerId) &&
        objectsExist(decision.candidateIds) &&
        objectsExist(decision.additionalTargetIds) &&
        (decision.attackCardId === undefined || objectExists(decision.attackCardId)) &&
        objectsExist(decision.weaponIds) &&
        typeof decision.resolvedAttack === "boolean"
      );
    case "discard-to-influence-limit":
      return (
        nonNegative(decision.maximum) &&
        nonNegative(decision.amount) &&
        objectsExist(decision.candidateIds)
      );
    case "choose-recollection":
      return nonNegative(decision.amount) && objectsExist(decision.candidateIds);
    case "announce-triggered-ability":
      return isNonEmptyString(decision.pendingTriggerId) && Array.isArray(decision.baseTargets);
    case "order-triggered-abilities":
      return (
        isNonEmptyString(decision.batchId) &&
        isStringArray(decision.pendingTriggerIds) &&
        decision.pendingTriggerIds.length > 0
      );
    case "resolve-optional-effect":
      return hasStackItem();
    case "resolve-effect-choice": {
      const decisionPublicSelections = decision.publicSelections ?? [];
      const pendingSimultaneous = isRecord(pendingChoice?.simultaneous)
        ? pendingChoice.simultaneous
        : undefined;
      const pendingPublicSelections = pendingSimultaneous?.publicSelections ?? [];
      return (
        hasStackItem() &&
        isRecord(decision.selection) &&
        isRecord(pendingChoice) &&
        isRecord(pendingChoice.selection) &&
        pendingChoice.selection.id === decision.selection.id &&
        (decision.mayFailToFind === undefined || decision.mayFailToFind === true) &&
        (pendingChoice.mayFailToFind === undefined || pendingChoice.mayFailToFind === true) &&
        (decision.mayFailToFind === true) === (pendingChoice.mayFailToFind === true) &&
        publicSelectionsAreValid(decisionPublicSelections) &&
        publicSelectionsAreValid(pendingPublicSelections) &&
        JSON.stringify(decisionPublicSelections) === JSON.stringify(pendingPublicSelections)
      );
    }
    case "retarget-stack-item":
      return (
        hasStackItem() &&
        (stackItemExists(decision.targetStackItemId) ||
          deferredStackItemExists(decision.targetStackItemId)) &&
        Array.isArray(decision.declarations)
      );
    case "remode-stack-item":
      return (
        hasStackItem() &&
        (stackItemExists(decision.targetStackItemId) ||
          deferredStackItemExists(decision.targetStackItemId)) &&
        Array.isArray(decision.choices) &&
        decision.choices.every(
          (choice) => Array.isArray(choice) && choice.every((id) => typeof id === "string"),
        )
      );
    case "resolve-effect-payment": {
      const remainingPlayerIds = pendingPayment?.remainingPlayerIds;
      return (
        hasStackItem() &&
        isRecord(decision.cost) &&
        typeof decision.mayDecline === "boolean" &&
        isRecord(pendingPayment) &&
        pendingPayment.playerId === decision.playerId &&
        isRecord(pendingPayment.cost) &&
        pendingPayment.mayDecline === decision.mayDecline &&
        (remainingPlayerIds === undefined ||
          (decision.mayDecline === true &&
            isStringArray(remainingPlayerIds) &&
            playersExist(remainingPlayerIds) &&
            new Set(remainingPlayerIds).size === remainingPlayerIds.length &&
            !remainingPlayerIds.includes(String(decision.playerId))))
      );
    }
    case "resolve-level-up":
      return (
        hasStackItem() &&
        objectExists(decision.championId) &&
        Array.isArray(decision.candidateCardIds) &&
        objectsExist(decision.candidateCardIds) &&
        decision.candidateCardIds.length >= 2
      );
    case "resolve-direction-choice":
      return (
        hasStackItem() &&
        decision.state === "shifting-currents" &&
        isNonEmptyString(decision.from) &&
        isStringArray(decision.directions) &&
        decision.directions.length > 0
      );
    case "resolve-distribution":
      return (
        hasStackItem() &&
        nonNegative(decision.amount) &&
        isRecord(decision.among) &&
        isRecord(decision.payload)
      );
    case "resolve-move-partition":
      return (
        hasStackItem() && objectsExist(decision.objectIds) && Array.isArray(decision.destinations)
      );
    case "resolve-counter-allocation":
      return (
        hasStackItem() &&
        isNonEmptyString(decision.counter) &&
        Array.isArray(decision.candidates) &&
        decision.candidates.every(
          (candidate) =>
            isRecord(candidate) &&
            objectExists(candidate.objectId) &&
            nonNegative(candidate.available),
        ) &&
        nonNegative(decision.minimum) &&
        nonNegative(decision.maximum) &&
        typeof decision.minimum === "number" &&
        typeof decision.maximum === "number" &&
        decision.minimum <= decision.maximum &&
        (decision.operation === "remove" ||
          (decision.operation === "move" && objectExists(decision.destinationId)))
      );
    case "announce-effect-attack":
      return (
        hasStackItem() &&
        objectExists(decision.attackerId) &&
        typeof decision.additional === "boolean" &&
        objectsExist(decision.targetCandidates) &&
        objectsExist(decision.weaponCandidates) &&
        playersExist(decision.cleavePlayerCandidates)
      );
    case "announce-effect-materialization":
    case "announce-effect-activation":
      return (
        hasStackItem() &&
        objectExists(decision.cardId) &&
        typeof decision.payCosts === "boolean" &&
        typeof decision.ignoreElementRequirements === "boolean" &&
        Array.isArray(decision.costModifiers)
      );
    case "resolve-glimpse":
      return hasStackItem() && objectsExist(decision.cardIds);
  }
  return false;
}

function objectGraphIsValid(
  record: Record<string, unknown>,
  players: ReadonlySet<string>,
  program: GrandArchiveMatchProgram | undefined,
): boolean {
  if (!isRecord(record.objects)) return false;
  for (const [objectId, value] of Object.entries(record.objects)) {
    if (
      !isRecord(value) ||
      value.id !== objectId ||
      !isNonEmptyString(value.definitionId) ||
      !players.has(String(value.ownerId)) ||
      !players.has(String(value.baseControllerId)) ||
      !players.has(String(value.controllerId)) ||
      !GRAND_ARCHIVE_ZONES.includes(value.zone as GrandArchiveZone) ||
      !isSafeNonNegativeInteger(value.incarnation) ||
      !isSafeNonNegativeInteger(value.objectVersion) ||
      !isSafeNonNegativeInteger(value.damage) ||
      !isUniqueStringArray(value.states) ||
      !isUniqueStringArray(value.activationStates) ||
      !isRecord(value.counters) ||
      Object.values(value.counters).some((counter) => !isSafeNonNegativeInteger(counter)) ||
      (program && !program.cardsById[value.definitionId]) ||
      (isNonEmptyString(value.activeDefinitionId) &&
        program !== undefined &&
        !program.cardsById[value.activeDefinitionId])
    ) {
      return false;
    }
    if (
      value.hostId !== undefined &&
      (!isNonEmptyString(value.hostId) || !Object.hasOwn(record.objects, value.hostId))
    ) {
      return false;
    }
  }
  return true;
}

function zoneGraphIsValid(record: Record<string, unknown>, players: readonly string[]): boolean {
  if (!isRecord(record.zones) || !isRecord(record.objects)) return false;
  const seen = new Set<string>();
  for (const playerId of players) {
    const zones = record.zones[playerId];
    if (!isRecord(zones)) return false;
    for (const zone of GRAND_ARCHIVE_ZONES) {
      const objectIds = zones[zone];
      if (!Array.isArray(objectIds) || !objectIds.every(isNonEmptyString)) return false;
      for (const objectId of objectIds) {
        if (seen.has(objectId)) return false;
        const object = record.objects[objectId];
        if (!isRecord(object) || object.ownerId !== playerId || object.zone !== zone) return false;
        seen.add(objectId);
      }
    }
  }
  return seen.size === Object.keys(record.objects).length;
}

function playerGraphIsValid(record: Record<string, unknown>): boolean {
  if (!isRecord(record.players) || !isUniqueStringArray(record.turnOrder)) return false;
  const players = record.players;
  const turnOrder = record.turnOrder;
  const playerIds = Object.keys(players);
  if (
    playerIds.length === 0 ||
    playerIds.length !== turnOrder.length ||
    playerIds.some((playerId) => !turnOrder.includes(playerId))
  ) {
    return false;
  }
  return playerIds.every((playerId) => {
    const player = players[playerId];
    return (
      isRecord(player) &&
      player.id === playerId &&
      isSafeNonNegativeInteger(player.turnOrder) &&
      typeof player.lost === "boolean" &&
      typeof player.conceded === "boolean"
    );
  });
}

function liveControlGraphIsValid(record: Record<string, unknown>): boolean {
  if (!isRecord(record.players) || !isUniqueStringArray(record.turnOrder)) return false;
  const players = new Set(record.turnOrder);
  if (!isRecord(record.turn) || !players.has(String(record.turn.playerId))) return false;
  if (record.opportunity !== null) {
    if (
      !isRecord(record.opportunity) ||
      !players.has(String(record.opportunity.holderId)) ||
      !players.has(String(record.opportunity.startedById)) ||
      !isUniqueStringArray(record.opportunity.passedPlayerIds) ||
      record.opportunity.passedPlayerIds.some((playerId) => !players.has(playerId))
    ) {
      return false;
    }
  }
  if (
    !isUniqueStringArray(record.winnerIds) ||
    record.winnerIds.some((playerId) => !players.has(playerId))
  ) {
    return false;
  }
  if (!Array.isArray(record.stack)) return false;
  const stackIds = new Set<string>();
  for (const item of record.stack) {
    if (
      !isRecord(item) ||
      !isNonEmptyString(item.id) ||
      stackIds.has(item.id) ||
      !players.has(String(item.controllerId)) ||
      !Array.isArray(item.targets) ||
      item.targets.some((target) => {
        if (
          !isRecord(target) ||
          !isNonEmptyString(target.binding) ||
          !isStringArray(target.targetIds) ||
          !isRecord(target.targetObjectIncarnations) ||
          typeof target.required !== "boolean"
        ) {
          return true;
        }
        const targetIds = new Set(target.targetIds);
        const targetObjectIncarnations = target.targetObjectIncarnations;
        if (
          Object.entries(targetObjectIncarnations).some(
            ([objectId, incarnation]) =>
              !targetIds.has(objectId) ||
              !isRecord(record.objects) ||
              !Object.hasOwn(record.objects, objectId) ||
              !isSafeNonNegativeInteger(incarnation),
          )
        ) {
          return true;
        }
        return target.targetIds.some(
          (targetId) =>
            isRecord(record.objects) &&
            Object.hasOwn(record.objects, targetId) &&
            !Object.hasOwn(targetObjectIncarnations, targetId),
        );
      })
    ) {
      return false;
    }
    stackIds.add(item.id);
  }
  return true;
}

function ordinalsAreValid(record: Record<string, unknown>): boolean {
  return [
    "stateVersion",
    "nextObjectOrdinal",
    "nextStackOrdinal",
    "nextDecisionOrdinal",
    "nextEventOrdinal",
    "nextContinuousOrdinal",
    "nextReplacementOrdinal",
    "nextRuleModificationOrdinal",
    "nextPendingTriggerOrdinal",
    "nextGeneratedTriggerOrdinal",
    "nextDelayedTriggerOrdinal",
  ].every((key) => isSafeNonNegativeInteger(record[key]));
}

function eventHistoryGraphIsValid(record: Record<string, unknown>): boolean {
  if (!Array.isArray(record.eventHistory)) return false;
  return record.eventHistory.every(
    (event) =>
      isRecord(event) &&
      isNonEmptyString(event.type) &&
      (event.type !== "stack-item-removed" ||
        event.outcome === "resolved" ||
        event.outcome === "fizzled" ||
        event.outcome === "abandoned"),
  );
}

function variablesAreValid(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(
    ([symbol, amount]) =>
      (symbol === "X" || symbol === "Y" || symbol === "Z") &&
      typeof amount === "number" &&
      Number.isFinite(amount),
  );
}

function persistedEffectContextsAreValid(record: Record<string, unknown>): boolean {
  return [
    record.continuousEffects,
    record.replacementEffects,
    record.ruleModifications,
    record.delayedTriggers,
  ].every(
    (instances) =>
      Array.isArray(instances) &&
      instances.every(
        (instance) =>
          isRecord(instance) &&
          isRecord(instance.bindings) &&
          variablesAreValid(instance.variables),
      ),
  );
}

/** Runs every persistence invariant and returns all named failures. */
export function collectGrandArchiveSnapshotValidationIssues(
  value: unknown,
  program?: GrandArchiveMatchProgram,
): readonly GrandArchiveSnapshotValidationIssue[] {
  if (!isRecord(value)) {
    return [{ check: "snapshot-shape", detail: `expected object, received ${typeof value}` }];
  }
  const issues: GrandArchiveSnapshotValidationIssue[] = [];
  const check = (name: string, predicate: () => boolean): void => {
    try {
      if (!predicate()) issues.push({ check: name });
    } catch (error) {
      issues.push({
        check: name,
        detail: `validator threw: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };
  check("snapshot-keys", () => hasExactSnapshotKeys(value));
  check("schema-version", () => value.schemaVersion === 1 && value.snapshotVersion === 1);
  check(
    "program-fingerprint",
    () =>
      isNonEmptyString(value.programFingerprint) &&
      (!program || value.programFingerprint === program.fingerprint),
  );
  check(
    "match-shape",
    () =>
      (value.mode === "standard" || value.mode === "draft" || value.mode === "pantheon") &&
      (value.status === "pregame" || value.status === "playing" || value.status === "finished") &&
      isRecord(value.random) &&
      isSafeNonNegativeInteger(value.random.cursor) &&
      typeof value.random.seed === "number" &&
      Number.isSafeInteger(value.random.seed) &&
      Array.isArray(value.eventHistory),
  );
  check("player-graph", () => playerGraphIsValid(value));
  const playerIds = isRecord(value.players) ? Object.keys(value.players) : [];
  const players = new Set(playerIds);
  check("object-graph", () => objectGraphIsValid(value, players, program));
  check("zone-graph", () => zoneGraphIsValid(value, playerIds));
  check("live-control-graph", () => liveControlGraphIsValid(value));
  check("decision-graph", () => decisionGraphIsValid(value));
  check("event-history-graph", () => eventHistoryGraphIsValid(value));
  check("persisted-effect-contexts", () => persistedEffectContextsAreValid(value));
  check("ordinals", () => ordinalsAreValid(value));
  return issues;
}

export function isGrandArchiveMatchSnapshotV1(
  value: unknown,
  program?: GrandArchiveMatchProgram,
): value is GrandArchiveMatchSnapshotV1 {
  return collectGrandArchiveSnapshotValidationIssues(value, program).length === 0;
}

export class GrandArchiveSnapshotValidationError extends Error {
  readonly issues: readonly GrandArchiveSnapshotValidationIssue[];
  readonly rejectedSnapshot: unknown;

  public constructor(
    operation: "serialize" | "restore",
    issues: readonly GrandArchiveSnapshotValidationIssue[],
    rejectedSnapshot: unknown,
  ) {
    super(
      `Cannot ${operation} invalid Grand Archive snapshot; failed invariants: ${issues
        .map((issue) => `${issue.check}${issue.detail ? ` (${issue.detail})` : ""}`)
        .join("; ")}`,
    );
    this.name = "GrandArchiveSnapshotValidationError";
    this.issues = issues;
    this.rejectedSnapshot = rejectedSnapshot;
  }
}
