import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { FAB_CONTINUOUS_ATOM_STAGE } from "../rules/continuous/ir.ts";

export interface FabSnapshotValidationContext {
  readonly playerIds: ReadonlySet<string>;
  readonly objects: Readonly<Record<string, unknown>>;
  readonly attackProxies: Readonly<Record<string, unknown>>;
  readonly lkiArena: Readonly<Record<string, unknown>>;
  readonly stateID: number;
  readonly rulesStack: readonly unknown[];
  readonly rulesProcess: unknown;
}

const DECISION_KINDS = new Set([
  "boolean",
  "option",
  "entity-target",
  "ordering",
  "group-choice",
  "numeric",
  "partition",
  "payment",
  "effect-resolution",
]);

const CONTINUATION_KINDS = new Set([
  "replacement-player",
  "replacement-cost-target",
  "replacement-cost-payment",
  "replacement-consequence-target",
  "replacement-first-player",
  "replacement-order",
  "journal-replacement-order",
  "continuous-replacement-order",
  "continuous-order",
  "trigger-first-player",
  "trigger-order",
  "layer-mode",
  "layer-target",
  "trigger-additional-cost",
  "play-mode",
  "play-target",
  "play-x",
  "play-cost-target",
  "activation-target",
  "activation-equip-destination",
  "activation-x",
  "optional-effect",
  "effect-payment-amount",
  "payment",
  "effect-resolution",
  "turn-pitch-order",
  "turn-heave",
  "turn-arsenal",
]);

const PROCESS_STAGES = new Set([
  "procedure",
  "replacement-collection",
  "replacement-ordering",
  "continuous-ordering",
  "event-commit",
  "trigger-collection",
  "state-trigger-scan",
  "simultaneous-player-selection",
  "trigger-ordering",
  "layer-declaration",
  "layer-resolution",
  "settled",
]);

const REPLACEMENT_KINDS = new Set(["self-or-identity", "standard", "prevention", "outcome"]);
const LAYER_KINDS = new Set(["card", "activated", "triggered"]);
const PROCEDURE_KINDS = new Set([
  "play-card",
  "activate",
  "combat-close",
  "start-turn",
  "end-turn",
]);

export function hasValidRuntimeGraphs(
  decision: unknown,
  rulesProcess: unknown,
  rulesStack: unknown,
  continuousEffectInstances: unknown,
  continuousOrderingDecisions: unknown,
  context: FabSnapshotValidationContext,
): boolean {
  if (!hasValidRulesStack(rulesStack, context)) {
    console.error("[DBG] rulesStack invalid");
    return false;
  }
  if (!hasValidRulesProcess(rulesProcess, context)) {
    console.error("[DBG] rulesProcess invalid");
    return false;
  }
  if (!hasValidDecision(decision, context)) {
    console.error("[DBG] decision invalid");
    return false;
  }
  if (!hasValidContinuousEffects(continuousEffectInstances, context)) {
    console.error("[DBG] continuousEffects invalid");
    return false;
  }
  if (!hasValidContinuousOrdering(continuousOrderingDecisions, context)) {
    console.error("[DBG] continuousOrdering invalid");
    return false;
  }
  return true;
}

function hasValidDecision(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (value === null) return true;
  if (!isRecord(value) || !isStringIn(value.kind, DECISION_KINDS)) return false;
  if (
    !isId(value.decisionId, "decision-") ||
    !isInteger(value.stateVersion) ||
    value.stateVersion !== context.stateID ||
    !isPlayer(value.actorId, context) ||
    typeof value.label !== "string" ||
    !hasValidContinuation(value.continuation, context)
  )
    return false;
  const processId = continuationProcessId(value.continuation);
  if (!isRecord(context.rulesProcess) || context.rulesProcess.processId !== processId) return false;
  switch (value.kind) {
    case "boolean":
      return typeof value.acceptLabel === "string" && typeof value.declineLabel === "string";
    case "option":
      return validBounds(value) && validLabelEntries(value.options);
    case "entity-target":
      return (
        validBounds(value) &&
        Array.isArray(value.candidates) &&
        value.candidates.every(
          (candidate) =>
            isRecord(candidate) &&
            isNonEmptyString(candidate.instanceId) &&
            targetMatchesCandidateId(candidate.target, candidate.instanceId, context) &&
            typeof candidate.label === "string",
        )
      );
    case "ordering":
      return validLabelEntries(value.entries);
    case "group-choice": {
      if (
        !Array.isArray(value.entries) ||
        !value.entries.every(
          (entry) =>
            isRecord(entry) && isLiveObjectId(entry.id, context) && typeof entry.label === "string",
        ) ||
        !Array.isArray(value.cohorts)
      )
        return false;
      const entryIds = new Set(
        (value.entries as readonly Record<string, unknown>[]).map((entry) => entry.id),
      );
      if (entryIds.size !== value.entries.length) return false;
      const cohortIds = new Set<string>();
      const cohortEntryIds: string[] = [];
      const validCohorts = value.cohorts.every(
        (cohort) =>
          isRecord(cohort) &&
          isNonEmptyString(cohort.id) &&
          !cohortIds.has(cohort.id) &&
          Boolean(cohortIds.add(cohort.id)) &&
          typeof cohort.label === "string" &&
          isStringArray(cohort.entryIds) &&
          cohort.entryIds.length > 0 &&
          cohort.entryIds.every((id) => {
            cohortEntryIds.push(id);
            return entryIds.has(id);
          }),
      );
      return (
        validCohorts &&
        cohortEntryIds.length === entryIds.size &&
        new Set(cohortEntryIds).size === entryIds.size
      );
    }
    case "numeric":
      return (
        validBounds(value) &&
        (value.requiresExplicitAnswer === undefined ||
          typeof value.requiresExplicitAnswer === "boolean")
      );
    case "partition":
      return validLabelEntries(value.entries) && validLabelEntries(value.groups);
    case "payment":
      return (
        isFiniteNonNegative(value.amount) &&
        typeof value.oneAtATime === "boolean" &&
        typeof value.cancellable === "boolean" &&
        Array.isArray(value.candidates) &&
        value.candidates.every(
          (candidate) =>
            isRecord(candidate) &&
            isLiveObjectId(candidate.instanceId, context) &&
            isFiniteNonNegative(candidate.value),
        )
      );
    case "effect-resolution":
      return validLabelEntries(value.options);
    default:
      return false;
  }
}

function hasValidContinuation(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (
    !isRecord(value) ||
    !isStringIn(value.kind, CONTINUATION_KINDS) ||
    !isId(value.processId, "process-")
  )
    return false;
  if ("playerId" in value && !isPlayer(value.playerId, context)) return false;
  if ("controllerId" in value && !isPlayer(value.controllerId, context)) return false;
  if (
    "eventGroupId" in value &&
    value.eventGroupId !== undefined &&
    !isNonEmptyString(value.eventGroupId)
  )
    return false;
  if ("effectPath" in value && !isIntegerArray(value.effectPath)) return false;
  switch (value.kind) {
    case "replacement-player":
    case "replacement-first-player":
    case "trigger-first-player":
    case "play-mode":
    case "play-x":
    case "play-cost-target":
    case "activation-x":
    case "turn-pitch-order":
    case "turn-heave":
    case "turn-arsenal":
      return true;
    case "replacement-cost-target":
    case "replacement-consequence-target":
      return isNonEmptyString(value.replacementId);
    case "replacement-cost-payment":
      return isNonEmptyString(value.replacementId) && isInteger(value.amount) && value.amount >= 0;
    case "replacement-order":
    case "journal-replacement-order":
      return isStringIn(value.replacementKind, REPLACEMENT_KINDS);
    case "continuous-replacement-order":
      return value.journalCursor === null || isInteger(value.journalCursor);
    case "continuous-order":
      return (
        isNonEmptyString(value.orderingId) &&
        isRecord(value.timestamp) &&
        isInteger(value.timestamp.sequence) &&
        isRecord(value.subject) &&
        value.subject.kind === "object" &&
        hasValidObjectRef(value.subject.ref, context) &&
        isInteger(value.stage) &&
        value.stage >= 1 &&
        value.stage <= 8 &&
        hasValidContinuousSubstage(value.substage) &&
        isStringArray(value.atomIds) &&
        (value.journalCursor === null || isInteger(value.journalCursor))
      );
    case "trigger-order":
      return true;
    case "layer-mode":
    case "trigger-additional-cost":
      return isNonEmptyString(value.pendingTriggerId);
    case "layer-target":
      return isNonEmptyString(value.pendingTriggerId) && isNonEmptyString(value.targetKey);
    case "play-target":
    case "activation-target":
      return isNonEmptyString(value.targetKey);
    case "optional-effect":
      return isIntegerArray(value.effectPath);
    case "effect-payment-amount":
      return isNonEmptyString(value.layerId) && isIntegerArray(value.effectPath);
    case "payment":
      return (
        (value.cost === "asset" || value.cost === "effect") &&
        (value.procedure === "play" ||
          value.procedure === "activate" ||
          (value.procedure === "effect" &&
            isNonEmptyString(value.layerId) &&
            isIntegerArray(value.effectPath)))
      );
    case "effect-resolution":
      return isNonEmptyString(value.layerId) && isIntegerArray(value.effectPath);
    default:
      return false;
  }
}

function hasValidRulesProcess(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (value === null) return true;
  if (!isRecord(value) || !isId(value.processId, "process-")) return false;
  const processId = value.processId;
  const __checks: readonly [string, () => boolean][] = [
    ["stage", () => isStringIn(value.stage, PROCESS_STAGES)],
    [
      "pendingEvents",
      () =>
        Array.isArray(value.pendingEvents) &&
        value.pendingEvents.every((event) => hasValidProposedEvent(event, processId, context)),
    ],
    [
      "resolutionEventGroups",
      () =>
        Array.isArray(value.resolutionEventGroups) &&
        value.resolutionEventGroups.every((group) => hasValidEventGroup(group, processId, context)),
    ],
    [
      "replacementCandidates",
      () =>
        Array.isArray(value.replacementCandidates) &&
        value.replacementCandidates.every((candidate) =>
          hasValidReplacementCandidate(candidate, context),
        ),
    ],
    ["replacementChoiceResolved", () => typeof value.replacementChoiceResolved === "boolean"],
    [
      "replacementChoicePlayerIds",
      () =>
        isStringArray(value.replacementChoicePlayerIds) &&
        value.replacementChoicePlayerIds.every((id) => context.playerIds.has(id)),
    ],
    ["selectedOptionalReplacementIds", () => isStringArray(value.selectedOptionalReplacementIds)],
    [
      "declinedOptionalReplacementIds",
      () =>
        value.declinedOptionalReplacementIds !== undefined &&
        !isStringArray(value.declinedOptionalReplacementIds)
          ? false
          : true,
    ],
    ["orderedReplacementIds", () => isStringArray(value.orderedReplacementIds)],
    ["appliedReplacementIds", () => isStringArray(value.appliedReplacementIds)],
    [
      "cancelledContinuousApplicationKeys",
      () => isStringArray(value.cancelledContinuousApplicationKeys),
    ],
    ["orderedTriggerIds", () => isStringArray(value.orderedTriggerIds)],
    [
      "triggerPlayerOrder",
      () =>
        isStringArray(value.triggerPlayerOrder) &&
        value.triggerPlayerOrder.every((id) => context.playerIds.has(id)),
    ],
    [
      "orderedTriggerControllers",
      () =>
        isStringArray(value.orderedTriggerControllers) &&
        value.orderedTriggerControllers.every((id) => context.playerIds.has(id)),
    ],
    [
      "pendingTriggers",
      () =>
        Array.isArray(value.pendingTriggers) &&
        value.pendingTriggers.every((trigger) => hasValidPendingTrigger(trigger, context)),
    ],
    ["stateTriggersOnStack", () => isStringArray(value.stateTriggersOnStack)],
    ["effectChoices", () => isRecordOf(value.effectChoices, (entry) => typeof entry === "boolean")],
    [
      "effectPartitions",
      () =>
        isRecordOf(value.effectPartitions, (partition) =>
          hasValidBindings(partition, context, true),
        ),
    ],
    ["effectOptions", () => isRecordOf(value.effectOptions, isNonEmptyString)],
    ["effectTargets", () => hasValidTargetMap(value.effectTargets, context)],
    [
      "effectPaymentAmounts",
      () =>
        value.effectPaymentAmounts !== undefined &&
        !isRecordOf(value.effectPaymentAmounts, (amount) => isInteger(amount) && amount >= 0)
          ? false
          : true,
    ],
    [
      "effectPaymentPitches",
      () =>
        value.effectPaymentPitches !== undefined &&
        !isRecordOf(
          value.effectPaymentPitches,
          (refs) => Array.isArray(refs) && refs.every((ref) => hasValidObjectRef(ref, context)),
        )
          ? false
          : true,
    ],
    [
      "effectPaymentContinuation",
      () =>
        value.effectPaymentContinuation !== undefined &&
        !hasValidEffectPaymentContinuation(value.effectPaymentContinuation, processId, context)
          ? false
          : true,
    ],
    ["iterationCount", () => isInteger(value.iterationCount) && value.iterationCount >= 0],
    ["journalReplacementOrders", () => isRecordOf(value.journalReplacementOrders, isStringArray)],
    ["journalReplacementChoices", () => isRecordOf(value.journalReplacementChoices, isStringArray)],
    [
      "journalReplacementChoicePlayerIds",
      () =>
        isRecordOf(
          value.journalReplacementChoicePlayerIds,
          (ids) => isStringArray(ids) && ids.every((id) => context.playerIds.has(id)),
        ),
    ],
    ["procedure", () => hasValidProcedure(value.procedure, processId, context)],
    [
      "resolvingLayerId",
      () => !(value.resolvingLayerId !== null && !stackHasLayer(value.resolvingLayerId, context)),
    ],
    [
      "abilityStepContinuation",
      () => {
        if (value.abilityStepContinuation === undefined) return true;
        const continuation = value.abilityStepContinuation;
        return (
          isRecord(continuation) &&
          isNonEmptyString(continuation.layerId) &&
          stackHasLayer(continuation.layerId, context) &&
          isInteger(continuation.fromCursor) &&
          continuation.fromCursor >= 0 &&
          isNonEmptyString(continuation.faceId)
        );
      },
    ],
    [
      "replacementFirstPlayerId",
      () =>
        value.replacementFirstPlayerId !== undefined &&
        !isPlayer(value.replacementFirstPlayerId, context)
          ? false
          : true,
    ],
    ["replacementMaps", () => hasValidReplacementMaps(value, context)],
  ];
  for (const [label, check] of __checks) {
    if (!check()) {
      console.error(`[DBG] rulesProcess check failed: ${label}`);
      return false;
    }
  }
  return true;
}

function hasValidEffectPaymentContinuation(
  value: unknown,
  processId: string,
  context: FabSnapshotValidationContext,
): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.eventGroupId) &&
    isNonEmptyString(value.layerId) &&
    stackHasLayer(value.layerId, context) &&
    isIntegerArray(value.effectPath) &&
    (value.optionalPath === null || isIntegerArray(value.optionalPath)) &&
    isPlayer(value.playerId, context) &&
    (value.costType === "resources" || value.costType === "life") &&
    isInteger(value.amount) &&
    value.amount >= 0 &&
    Array.isArray(value.pitches) &&
    value.pitches.every((ref) => hasValidObjectRef(ref, context)) &&
    Array.isArray(value.events) &&
    value.events.every((event) => hasValidProposedEvent(event, processId, context)) &&
    isRecordOf(value.effectChoices, (entry) => typeof entry === "boolean") &&
    isRecordOf(value.effectPartitions, (partition) => hasValidBindings(partition, context, true)) &&
    isRecordOf(value.effectOptions, isNonEmptyString) &&
    hasValidTargetMap(value.effectTargets, context) &&
    isRecordOf(value.effectPaymentAmounts, (amount) => isInteger(amount) && amount >= 0)
  );
}

function hasValidReplacementMaps(
  value: Record<string, unknown>,
  context: FabSnapshotValidationContext,
) {
  for (const key of [
    "selectedOptionalReplacementIds",
    "orderedReplacementIds",
    "appliedReplacementIds",
  ]) {
    const entries = value[key];
    if (!Array.isArray(entries) || !entries.every(isNonEmptyString)) return false;
  }
  if (value.replacementCostTargetBindings !== undefined) {
    if (!isRecord(value.replacementCostTargetBindings)) return false;
    for (const [replacementId, ref] of Object.entries(value.replacementCostTargetBindings)) {
      if (!isNonEmptyString(replacementId) || !hasValidDetachedObjectRef(ref, context))
        return false;
    }
  }
  if (value.replacementPitchBindings !== undefined) {
    if (!isRecord(value.replacementPitchBindings)) return false;
    for (const [replacementId, bindings] of Object.entries(value.replacementPitchBindings)) {
      if (
        !isNonEmptyString(replacementId) ||
        !Array.isArray(bindings) ||
        !bindings.every((ref) => hasValidDetachedObjectRef(ref, context))
      ) {
        return false;
      }
    }
  }
  if (value.replacementConsequenceTargetBindings !== undefined) {
    if (!isRecord(value.replacementConsequenceTargetBindings)) return false;
    for (const [replacementId, ref] of Object.entries(value.replacementConsequenceTargetBindings)) {
      if (!isNonEmptyString(replacementId) || !hasValidDetachedObjectRef(ref, context))
        return false;
    }
  }
  if (value.replacementCostCommitReceipts !== undefined) {
    if (!isRecord(value.replacementCostCommitReceipts)) return false;
    for (const receipt of Object.values(value.replacementCostCommitReceipts)) {
      if (
        !isRecord(receipt) ||
        (receipt.status !== "committed" && receipt.status !== "failed") ||
        !hasValidDetachedObjectRef(receipt.object, context) ||
        (receipt.status === "committed" && !isId(receipt.eventId, "event-"))
      )
        return false;
    }
  }
  if (value.replacementConsequenceCommitReceipts !== undefined) {
    if (!isRecord(value.replacementConsequenceCommitReceipts)) return false;
    for (const receipt of Object.values(value.replacementConsequenceCommitReceipts)) {
      if (
        !isRecord(receipt) ||
        (receipt.status !== "committed" && receipt.status !== "failed") ||
        !hasValidDetachedObjectRef(receipt.object, context) ||
        (receipt.status === "committed" && !isId(receipt.eventId, "event-"))
      )
        return false;
    }
  }
  return true;
}

function hasValidDetachedObjectRef(value: unknown, context: FabSnapshotValidationContext): boolean {
  void context;
  return isRecord(value) && isNonEmptyString(value.instanceId) && isInteger(value.incarnation);
}

function hasValidProcedure(
  value: unknown,
  processId: string,
  context: FabSnapshotValidationContext,
): boolean {
  if (value === null) return true;
  if (
    !isRecord(value) ||
    !isStringIn(value.kind, PROCEDURE_KINDS) ||
    !isPlayer(value.actorId, context)
  )
    return false;
  if (
    !Array.isArray(value.eventGroups) ||
    !value.eventGroups.every((group) => hasValidEventGroup(group, processId, context))
  )
    return false;
  switch (value.kind) {
    case "play-card":
      return (
        hasValidObjectSnapshot(value.object, context) &&
        hasValidTargetMap(value.declaredTargets, context) &&
        (value.chosenX === null || (isInteger(value.chosenX) && value.chosenX >= 0)) &&
        isStringArray(value.effectCostTargetIds) &&
        value.effectCostTargetIds.every((id) => isLiveObjectId(id, context)) &&
        hasValidBindings(value.costBindings, context, false)
      );
    case "activate":
      return (
        hasValidObjectSnapshot(value.object, context) &&
        hasValidTargetMap(value.declaredTargets, context) &&
        (value.equipDestination === null ||
          value.equipDestination === "head" ||
          value.equipDestination === "chest" ||
          value.equipDestination === "arms" ||
          value.equipDestination === "legs")
      );
    case "combat-close":
      return hasValidObjectSnapshot(value.attack, context);
    case "start-turn":
      return true;
    case "end-turn":
      return isPlayer(value.nextPlayerId, context);
    default:
      return false;
  }
}

function hasValidRulesStack(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (!Array.isArray(value)) return false;
  const layerIds = new Set<string>();
  return value.every((layer) => {
    if (
      !isRecord(layer) ||
      !isStringIn(layer.kind, LAYER_KINDS) ||
      !isId(layer.layerId, "layer-") ||
      layerIds.has(layer.layerId) ||
      !isPlayer(layer.controllerId, context) ||
      // A rules layer retains source LKI after a resolution/activation cost
      // moves or destroys that source (Bloodrot Pox, Ornate Tessen).
      !hasValidDetachedObjectSnapshot(layer.source, context) ||
      !hasValidBindings(layer.bindings, context, false)
    )
      return false;
    if (
      layer.effectPaymentReceipts !== undefined &&
      !isRecordOf(layer.effectPaymentReceipts, (receipt) =>
        hasValidEffectPaymentReceipt(receipt, context),
      )
    )
      return false;
    layerIds.add(layer.layerId);
    switch (layer.kind) {
      case "card":
        return (
          isNonEmptyString(layer.instanceId) &&
          isRecord(layer.resolutionPlan) &&
          Array.isArray(layer.resolutionPlan.steps) &&
          layer.resolutionPlan.steps.length > 0 &&
          isInteger(layer.resolutionPlan.cursor) &&
          layer.resolutionPlan.cursor >= 0 &&
          layer.resolutionPlan.cursor < layer.resolutionPlan.steps.length &&
          layer.resolutionPlan.steps.every(
            (step) => isRecord(step) && hasValidTargetMap(step.targets, context),
          )
        );
      case "activated":
        return (
          (layer.role === "ability" || layer.role === "attack") &&
          isNonEmptyString(layer.abilityId) &&
          hasValidTargetMap(layer.targets, context) &&
          (layer.equipDestination === null ||
            layer.equipDestination === "head" ||
            layer.equipDestination === "chest" ||
            layer.equipDestination === "arms" ||
            layer.equipDestination === "legs")
        );
      case "triggered":
        return isNonEmptyString(layer.abilityId) && hasValidTargetMap(layer.targets, context);
      default:
        return false;
    }
  });
}

function hasValidEffectPaymentReceipt(
  value: unknown,
  context: FabSnapshotValidationContext,
): boolean {
  return (
    isRecord(value) &&
    (value.status === "committed" || value.status === "failed") &&
    isPlayer(value.playerId, context) &&
    (value.costType === "resources" || value.costType === "life") &&
    isInteger(value.amount) &&
    value.amount >= 0 &&
    Array.isArray(value.pitches) &&
    value.pitches.every((ref) => hasValidDetachedObjectRef(ref, context)) &&
    isStringArray(value.eventIds)
  );
}

function hasValidContinuousEffects(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (!Array.isArray(value)) return false;
  const effectIds = new Set<string>();
  return value.every((effect) => {
    if (
      !isRecord(effect) ||
      !isNonEmptyString(effect.effectId) ||
      effectIds.has(effect.effectId) ||
      (effect.origin !== "layer" &&
        effect.origin !== "static" &&
        effect.origin !== "resolution-window") ||
      !isPlayer(effect.controllerId, context) ||
      !hasValidDetachedObjectSnapshot(effect.source, context) ||
      !Array.isArray(effect.atoms) ||
      !effect.atoms.every(hasValidContinuousAtom) ||
      !hasValidContinuousExpiry(effect.expiresAt, context) ||
      !Array.isArray(effect.initialSubjects) ||
      !effect.initialSubjects.every((subject) =>
        hasValidContinuousInitialSubject(subject, context),
      ) ||
      !Array.isArray(effect.applications) ||
      !effect.applications.every((application) =>
        hasValidContinuousApplication(application, context),
      )
    )
      return false;
    effectIds.add(effect.effectId);
    if (effect.origin === "layer") return hasValidBindings(effect.lockedBindings, context, false);
    return isNonEmptyString(effect.abilityId);
  });
}

function hasValidContinuousExpiry(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (!isRecord(value)) return false;
  switch (value.kind) {
    case "turn":
      return Object.keys(value).length === 2 && isInteger(value.turnNumber);
    case "player-turn-start":
      return (
        Object.keys(value).length === 3 &&
        isPlayer(value.playerId, context) &&
        isInteger(value.afterTurnNumber)
      );
    case "player-turn-end":
      return (
        Object.keys(value).length === 3 &&
        isPlayer(value.playerId, context) &&
        isInteger(value.turnNumber)
      );
    // Phase-window lifetimes (FabContinuousExpiry IR): atoms apply only while
    // the named player sits in that phase on windowTurnNumber.
    case "player-action-phase-window":
    case "player-end-phase-window":
      return (
        Object.keys(value).length === 3 &&
        isPlayer(value.playerId, context) &&
        isInteger(value.windowTurnNumber)
      );
    case "combat-chain":
      return Object.keys(value).length === 2 && isInteger(value.combatNumber);
    case "source":
      return Object.keys(value).length === 2 && hasValidObjectRef(value.ref, context);
    case "permanent":
      return Object.keys(value).length === 1;
    default:
      return false;
  }
}

function hasValidContinuousInitialSubject(
  value: unknown,
  context: FabSnapshotValidationContext,
): boolean {
  if (!isRecord(value) || !("attack" in value)) return hasValidObjectRef(value, context);
  if (!hasValidObjectRef(value, context) || !isRecord(value.attack)) return false;
  if (value.attack.kind === "card") return Object.keys(value.attack).length === 1;
  if (value.attack.kind !== "proxy" || !isNonEmptyString(value.attack.proxyId)) return false;
  const proxy = context.attackProxies[value.attack.proxyId];
  return (
    isRecord(proxy) && proxy.id === value.attack.proxyId && proxy.sourceId === value.instanceId
  );
}

function hasValidContinuousAtom(value: unknown): boolean {
  if (!isRecord(value) || !isNonEmptyString(value.atomId) || !isNonEmptyString(value.kind)) {
    return false;
  }
  const stageByKind: Readonly<Record<string, unknown>> = FAB_CONTINUOUS_ATOM_STAGE;
  if (!Object.hasOwn(stageByKind, value.kind) || value.stage !== stageByKind[value.kind])
    return false;
  if (value.kind !== "copy") return true;
  return (
    (value.except === null || value.except === "base-life") &&
    isRecord(value.sourceProvenance) &&
    isNonEmptyString(value.sourceProvenance.instanceId) &&
    Number.isInteger(value.sourceProvenance.incarnation) &&
    hasValidFrozenCopyProperties(value.frozenSource)
  );
}

export function hasValidFrozenCopyProperties(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value).sort();
  const expected = [
    "abilities",
    "activeFaceIds",
    "color",
    "keywords",
    "names",
    "numeric",
    "textBoxIds",
    "traits",
    "typeBox",
    "typeBoxes",
  ].sort();
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index]))
    return false;
  if (
    !Array.isArray(value.names) ||
    value.names.length === 0 ||
    !value.names.every(isNonEmptyString) ||
    !Array.isArray(value.activeFaceIds) ||
    value.activeFaceIds.length === 0 ||
    !value.activeFaceIds.every(isNonEmptyString) ||
    !Array.isArray(value.typeBoxes) ||
    value.typeBoxes.length === 0 ||
    !value.typeBoxes.every(isRecord) ||
    !isRecord(value.typeBox) ||
    !Array.isArray(value.traits) ||
    !value.traits.every(isNonEmptyString) ||
    !Array.isArray(value.textBoxIds) ||
    !value.textBoxIds.every(isNonEmptyString) ||
    !isRecord(value.numeric) ||
    !Object.values(value.numeric).every(
      (number) => typeof number === "number" && Number.isFinite(number),
    ) ||
    !Array.isArray(value.keywords) ||
    !Array.isArray(value.abilities)
  )
    return false;
  const typeBox = value.typeBox;
  if (!isRecord(typeBox)) return false;
  return ["metatypes", "supertypes", "types", "subtypes"].every(
    (key) => Array.isArray(typeBox[key]) && typeBox[key].every(isNonEmptyString),
  );
}

function hasValidContinuousApplication(value: unknown, context: FabSnapshotValidationContext) {
  if (!isRecord(value) || !isRecord(value.subject)) return false;
  return (
    value.subject.kind === "game" ||
    (value.subject.kind === "object" && hasValidObjectRef(value.subject.ref, context))
  );
}

function hasValidContinuousOrdering(
  value: unknown,
  context: FabSnapshotValidationContext,
): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (ordering) =>
        isRecord(ordering) &&
        isNonEmptyString(ordering.orderingId) &&
        isRecord(ordering.timestamp) &&
        isInteger(ordering.timestamp.sequence) &&
        (ordering.timestamp.simultaneousGroupId === null ||
          isNonEmptyString(ordering.timestamp.simultaneousGroupId)) &&
        isRecord(ordering.subject) &&
        ordering.subject.kind === "object" &&
        hasValidObjectRef(ordering.subject.ref, context) &&
        isInteger(ordering.stage) &&
        ordering.stage >= 1 &&
        ordering.stage <= 8 &&
        hasValidContinuousSubstage(ordering.substage) &&
        isPlayer(ordering.decidedByPlayerId, context) &&
        isStringArray(ordering.orderedAtomIds),
    )
  );
}

function hasValidContinuousSubstage(value: unknown): boolean {
  return (
    value === null ||
    value === "independent" ||
    value === "dependent" ||
    (isInteger(value) && value >= 1 && value <= 7)
  );
}

function hasValidReplacementCandidate(value: unknown, context: FabSnapshotValidationContext) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.replacementId) &&
    isPlayer(value.controllerId, context) &&
    isStringIn(value.replacementKind, REPLACEMENT_KINDS) &&
    hasValidObjectSnapshot(value.source, context) &&
    (value.persistedCostTarget === undefined ||
      hasValidDetachedObjectRef(value.persistedCostTarget, context)) &&
    (value.persistedPitchedInstanceIds === undefined ||
      (Array.isArray(value.persistedPitchedInstanceIds) &&
        value.persistedPitchedInstanceIds.every((ref) =>
          hasValidDetachedObjectRef(ref, context),
        ))) &&
    (value.persistedConsequenceTarget === undefined ||
      hasValidDetachedObjectRef(value.persistedConsequenceTarget, context))
  );
}

function hasValidPendingTrigger(value: unknown, context: FabSnapshotValidationContext) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.pendingTriggerId) &&
    isNonEmptyString(value.abilityId) &&
    isPlayer(value.controllerId, context) &&
    hasValidObjectSnapshot(value.source, context) &&
    hasValidBindings(value.bindings, context, false) &&
    hasValidTargetMap(value.declaredTargets, context)
  );
}

function hasValidEventGroup(
  value: unknown,
  processId: string,
  context: FabSnapshotValidationContext,
) {
  if (!isRecord(value)) {
    console.error("[DBG] group not record");
    return false;
  }
  if (!isNonEmptyString(value.eventGroupId)) {
    console.error("[DBG] group bad eventGroupId");
    return false;
  }
  if (!Array.isArray(value.events)) {
    console.error("[DBG] group events not array");
    return false;
  }
  for (const event of value.events) {
    if (!hasValidProposedEvent(event, processId, context)) {
      console.error(`[DBG] group event invalid: name=${(event as { name?: string })?.name}`);
      return false;
    }
  }
  return true;
}

function hasValidProposedEvent(
  value: unknown,
  processId: string,
  context: FabSnapshotValidationContext,
  allowDetachedAffected = false,
) {
  if (!isRecord(value)) {
    console.error("[DBG] pe not record");
    return false;
  }
  if (!isNonEmptyString(value.name)) {
    console.error("[DBG] pe bad name");
    return false;
  }
  if (value.processId !== processId) {
    console.error("[DBG] pe processId mismatch", value.processId, processId);
    return false;
  }
  if (!isPlayerOrNull(value.controllerId, context)) {
    console.error("[DBG] pe bad controllerId", value.controllerId);
    return false;
  }
  if (!Array.isArray(value.affected)) {
    console.error("[DBG] pe affected not array");
    return false;
  }
  for (const snapshot of value.affected) {
    const ok =
      allowDetachedAffected ||
      isClashProcedureEventName(value.name) ||
      objectCreatingEventName(value.name)
        ? hasValidDetachedObjectSnapshot(snapshot, context)
        : hasValidObjectSnapshot(snapshot, context);
    if (!ok) {
      console.error(`[DBG] pe affected snapshot invalid for ${value.name}`);
      return false;
    }
  }
  if (!hasValidBindings(value.bindings, context, false)) {
    console.error(`[DBG] pe bindings invalid for ${value.name}`);
    return false;
  }
  if (!isRecord(value.cause)) {
    console.error("[DBG] pe cause not record");
    return false;
  }
  if (!hasValidClashProcedureEventData(value, processId, context)) {
    console.error(`[DBG] pe clash data invalid for ${value.name}`);
    return false;
  }
  if (!hasValidTransitionReceipt(value.data, context)) {
    console.error(`[DBG] pe transition receipt invalid for ${value.name}`);
    return false;
  }
  switch (value.cause.kind) {
    case "player-command":
      return isPlayer(value.cause.actorId, context);
    case "layer":
      return isNonEmptyString(value.cause.layerId) && isPlayer(value.cause.controllerId, context);
    case "effect":
      return isNonEmptyString(value.cause.abilityId) && isPlayer(value.cause.controllerId, context);
    case "rule":
      return (
        isNonEmptyString(value.cause.rule) && isPlayerOrNull(value.cause.controllerId, context)
      );
    case "event":
      return (
        isId(value.cause.eventId, "event-") && isPlayerOrNull(value.cause.controllerId, context)
      );
    default:
      return false;
  }
}

function hasValidTransitionReceipt(data: unknown, context: FabSnapshotValidationContext): boolean {
  if (!isRecord(data) || !("transition" in data) || data.transition === undefined) return true;
  const transition = data.transition;
  if (!isRecord(transition)) return false;
  const before = transition.before;
  if (!isRecord(before) || !isRecord(before.ref)) return false;
  if (!hasValidDetachedObjectSnapshot(before, context)) return false;
  const beforeRef = before.ref;
  const after = transition.after;
  if (after !== null && !hasValidObjectSnapshot(after, context)) return false;
  switch (transition.identity) {
    case "ceased":
      return after === null;
    case "preserved":
      return (
        isRecord(after) &&
        isRecord(after.ref) &&
        after.ref.instanceId === beforeRef.instanceId &&
        after.ref.incarnation === beforeRef.incarnation
      );
    case "reset":
      return (
        isRecord(after) &&
        isRecord(after.ref) &&
        after.ref.instanceId === beforeRef.instanceId &&
        after.ref.incarnation !== beforeRef.incarnation
      );
    default:
      return false;
  }
}

function isClashProcedureEventName(value: unknown): boolean {
  return value === "clash-outcome" || value === "clash-prize" || value === "reclash-request";
}

/**
 * Events whose `affected` snapshots describe objects the event itself will
 * bring into existence. A staged-but-uncommitted `create` in a pending
 * resolution group names its future token (a decision can interrupt the flush
 * and persist the proposal), so those snapshots cannot be anchored
 * live-or-LKI yet — detached shape is all persistence can demand.
 */
function objectCreatingEventName(value: unknown): boolean {
  return value === "create" || value === "random-token-request";
}

function isEffectRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && isNonEmptyString(value.type);
}

function hasRecord(value: Record<string, unknown>, key: string): boolean {
  return isRecord(value[key]);
}

function hasString(value: Record<string, unknown>, key: string): boolean {
  return isNonEmptyString(value[key]);
}

function hasNumber(value: Record<string, unknown>, key: string): boolean {
  return typeof value[key] === "number" && Number.isFinite(value[key]);
}

function hasAmount(value: Record<string, unknown>, key: string): boolean {
  return (typeof value[key] === "number" && Number.isFinite(value[key])) || isRecord(value[key]);
}

function hasEffect(value: Record<string, unknown>, key: string): boolean {
  return hasValidPersistedFabEffect(value[key]);
}

/**
 * Validates the executable shape persisted by clash continuations. This is
 * deliberately exhaustive over FabEffect's discriminant: adding an effect
 * type must add its required payload here before snapshots may admit it.
 * Nested executable effects are checked recursively.
 */
function hasValidPersistedFabEffect(value: unknown): value is FabEffect {
  if (!isEffectRecord(value)) return false;
  if (value.outputBinding !== undefined && !isNonEmptyString(value.outputBinding)) return false;
  if (value.appliesTo !== undefined && !isRecord(value.appliesTo)) return false;

  const type = value.type as FabEffect["type"];
  switch (type) {
    case "sequence":
      return Array.isArray(value.steps) && value.steps.every(hasValidPersistedFabEffect);
    case "if-you-do":
      return hasEffect(value, "effect") && hasEffect(value, "then");
    case "self-replacement":
      return hasEffect(value, "modification");
    case "choice":
      return Array.isArray(value.options) && value.options.every(hasValidPersistedFabEffect);
    case "conditional":
      return (
        hasRecord(value, "condition") &&
        hasEffect(value, "then") &&
        (value.else === undefined || hasValidPersistedFabEffect(value.else))
      );
    case "optional":
      return (
        hasEffect(value, "effect") &&
        (value.then === undefined || hasValidPersistedFabEffect(value.then))
      );
    case "for-each":
      return hasRecord(value, "target") && hasEffect(value, "effect");
    case "remove-counters":
      return hasString(value, "counter") && hasAmount(value, "count") && hasRecord(value, "target");
    case "repeat":
      return (
        hasEffect(value, "effect") &&
        (value.times === undefined ||
          (typeof value.times === "number" && Number.isFinite(value.times)) ||
          isRecord(value.times)) &&
        (value.until === undefined || value.until === "declined" || isRecord(value.until))
      );
    case "delayed-trigger":
      return (
        hasRecord(value, "trigger") && hasRecord(value, "policy") && hasRecord(value, "resolution")
      );
    case "inline-trigger":
      return hasRecord(value, "trigger") && hasRecord(value, "resolution");
    case "deal-damage":
      return (
        hasString(value, "damageType") && hasAmount(value, "amount") && hasRecord(value, "target")
      );
    case "gain-life":
    case "lose-life":
      return hasAmount(value, "amount") && hasRecord(value, "target");
    case "gain-action-points":
    case "gain-resources":
    case "gain-chi":
    case "opt":
    case "amp":
    case "create-extra":
      return hasAmount(value, "amount") || hasAmount(value, "count");
    case "draw":
      return hasAmount(value, "count") && hasString(value, "player");
    case "take-extra-turn":
    case "lose-game":
    case "intimidate":
    case "crowd-boos":
    case "crowd-cheers":
      return hasString(value, "player") || hasString(value, "target");
    case "discard":
    case "banish":
    case "destroy":
    case "negate":
    case "turn-face-down":
    case "turn-face-up":
    case "reveal":
    case "look":
    case "awaken":
    case "choose-card":
    case "remove-all-counters":
    case "charge":
    case "pitch-card":
    case "equip":
    case "transcend":
    case "mark":
    case "freeze":
    case "unfreeze":
    case "tap":
    case "untap":
    case "add-defending":
      return hasRecord(value, "target");
    case "unless":
      return hasEffect(value, "effect") && hasEffect(value, "escape");
    case "move-card":
      return hasRecord(value, "target") && hasRecord(value, "to");
    case "bind-aura":
      return hasRecord(value, "target");
    case "search":
      return Array.isArray(value.zones) && hasRecord(value, "filter") && hasRecord(value, "to");
    case "shuffle":
    case "win-clash":
    case "choose-color":
    case "choose-new-targets":
    case "choose-opponent":
    case "cancel-event":
    case "return-to-brood":
    case "win-wager":
    case "name-card":
      return true;
    case "choose-same-name-group":
      return (
        hasRecord(value, "target") &&
        hasString(value, "selectedBinding") &&
        hasString(value, "orderedRemainderBinding")
      );
    case "reorder-deck":
      return hasRecord(value, "target") && hasString(value, "position");
    case "sharpen":
      return hasRecord(value, "target");
    case "guess":
      return (
        hasString(value, "predicate") && hasString(value, "binding") && hasString(value, "guesser")
      );
    case "choose-option":
      return Array.isArray(value.options) && value.options.every(isNonEmptyString);
    case "choose-and-create-token":
      return (
        Array.isArray(value.options) &&
        value.options.every(isNonEmptyString) &&
        hasString(value, "chooser")
      );
    case "choose-number":
      return (
        (value.min === undefined ||
          (typeof value.min === "number" && Number.isFinite(value.min))) &&
        (value.max === undefined || (typeof value.max === "number" && Number.isFinite(value.max)))
      );
    case "contract-task":
      return (
        hasString(value, "task") && hasString(value, "completeOn") && hasRecord(value, "filter")
      );
    case "contract-watch":
      return hasRecord(value, "condition") && hasEffect(value, "effect");
    case "start-game":
      return (
        hasString(value, "setup") &&
        (hasRecord(value, "filter") ||
          Array.isArray(value.zoneCounts) ||
          Array.isArray(value.sharedLibrary))
      );
    case "create-token":
      return (
        hasString(value, "controller") &&
        (hasString(value, "token") || hasRecord(value, "copySource"))
      );
    case "create-card":
      return hasString(value, "name") && hasRecord(value, "to");
    case "ignore":
      return value.part === undefined || isNonEmptyString(value.part);
    case "add-counter":
    case "distribute-counters":
      return (
        hasString(value, "counter") &&
        hasAmount(value, "count") &&
        hasRecord(value, type === "add-counter" ? "target" : "among")
      );
    case "move-counter":
      return hasString(value, "counter") && hasRecord(value, "from") && hasRecord(value, "to");
    case "roll":
      return hasNumber(value, "sides");
    case "clash":
      return (
        hasRecord(value, "with") &&
        (value.prize === undefined || hasValidPersistedFabEffect(value.prize))
      );
    case "reclash":
      return value.from === "replaced-clash" && hasRecord(value, "cost");
    case "swap-clash-reveals":
      return value.prize === undefined || hasValidPersistedFabEffect(value.prize);
    case "retrieve":
      return hasRecord(value, "target") && hasRecord(value, "cost");
    case "transform":
      return hasRecord(value, "target") && hasString(value, "into");
    case "transform-into-resolving-card":
      return hasRecord(value, "target");
    case "copy":
      return (
        hasRecord(value, "target") && hasRecord(value, "source") && hasString(value, "duration")
      );
    case "exchange":
      return hasRecord(value, "first") && hasRecord(value, "second");
    case "gain-control":
    case "give":
    case "steal":
      return hasRecord(value, "target") && hasString(value, "controller");
    case "set-status":
      return hasString(value, "status") && hasRecord(value, "target");
    case "attack-with":
      return hasRecord(value, "target");
    case "modify-activation-limit":
      return (
        hasRecord(value, "target") &&
        hasString(value, "operation") &&
        hasAmount(value, "count") &&
        value.duration === "this-turn"
      );
    case "play-card":
      return hasRecord(value, "source");
    case "pay":
      return hasRecord(value, "cost") && hasString(value, "payer");
    case "wager":
      return value.prize === undefined || hasValidPersistedFabEffect(value.prize);
    case "become":
      return hasString(value, "source") && hasString(value, "duration");
    case "modify-numeric":
      return (
        hasString(value, "property") &&
        hasString(value, "op") &&
        hasAmount(value, "amount") &&
        hasString(value, "duration")
      );
    case "modify-activation-cost":
      return (
        hasString(value, "op") &&
        hasAmount(value, "amount") &&
        hasRecord(value, "target") &&
        hasString(value, "duration")
      );
    case "grant-property":
      return hasRecord(value, "property") && hasString(value, "duration");
    case "remove-property":
      return (
        hasRecord(value, "property") && hasRecord(value, "target") && hasString(value, "duration")
      );
    case "can-be-attacked":
      return hasRecord(value, "target") && hasString(value, "duration");
    case "replacement":
      return (
        hasString(value, "replacementKind") &&
        hasRecord(value, "replaces") &&
        hasEffect(value, "modification")
      );
    case "prevention":
      return hasString(value, "preventionKind") && hasString(value, "duration");
    case "rule-modification":
      return hasString(value, "mode") && hasString(value, "action") && hasString(value, "duration");
    default: {
      const exhaustive: never = type;
      void exhaustive;
      return false;
    }
  }
}

/** Deep validation for recursive/continuation-bearing clash procedure events. */
function hasValidClashProcedureEventData(
  value: Record<string, unknown>,
  processId: string,
  context: FabSnapshotValidationContext,
): boolean {
  if (!isRecord(value.data)) return false;
  switch (value.name) {
    case "clash-outcome":
      return (
        isId(value.data.clashId, "clash-") &&
        isPlayer(value.data.firstPlayerId, context) &&
        isPlayer(value.data.secondPlayerId, context) &&
        isPlayerOrNull(value.data.winnerId, context) &&
        isFiniteNumberOrNull(value.data.firstPower) &&
        isFiniteNumberOrNull(value.data.secondPower) &&
        typeof value.data.firstHasPower === "boolean" &&
        typeof value.data.secondHasPower === "boolean" &&
        Array.isArray(value.data.revealed) &&
        value.data.revealed.every((snapshot) => hasValidObjectSnapshot(snapshot, context)) &&
        (value.data.deferredEffect === undefined ||
          hasValidPersistedFabEffect(value.data.deferredEffect))
      );
    case "clash-prize":
      return (
        isId(value.data.clashId, "clash-") &&
        (value.data.deferredEffect === undefined ||
          hasValidPersistedFabEffect(value.data.deferredEffect)) &&
        Array.isArray(value.data.branches) &&
        value.data.branches.every(
          (branch) =>
            isRecord(branch) &&
            isPlayer(branch.winnerId, context) &&
            Array.isArray(branch.events) &&
            branch.events.every((event) => hasValidProposedEvent(event, processId, context, true)),
        )
      );
    case "reclash-request":
      return (
        isId(value.data.clashId, "clash-") &&
        isPlayer(value.data.firstPlayerId, context) &&
        isPlayer(value.data.secondPlayerId, context) &&
        (value.data.deferredEffect === undefined ||
          hasValidPersistedFabEffect(value.data.deferredEffect))
      );
    default:
      return true;
  }
}

function hasValidBindings(value: unknown, context: FabSnapshotValidationContext, idsOnly: boolean) {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([__k, binding]) => {
    const ok = idsOnly
      ? Array.isArray(binding) &&
        binding.every(
          (id) =>
            isLiveObjectId(id, context) || isPlayer(id, context) || isLkiInstanceId(id, context),
        )
      : hasValidBindingValue(binding, context);
    if (!ok) {
      console.error(
        `[DBG] binding invalid key=${__k} idsOnly=${idsOnly} json=${JSON.stringify(binding)?.slice(0, 400)}`,
      );
    }
    return ok;
  });
}

function hasValidTargetMap(value: unknown, context: FabSnapshotValidationContext): boolean {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (targets) =>
        Array.isArray(targets) && targets.every((target) => hasValidTargetRef(target, context)),
    )
  );
}

function hasValidTargetRef(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (!isRecord(value)) return false;
  if (value.kind === "object") return hasValidObjectRef(value.ref, context);
  return value.kind === "player" && isPlayer(value.playerId, context);
}

function targetMatchesCandidateId(
  value: unknown,
  candidateId: string,
  context: FabSnapshotValidationContext,
): boolean {
  if (!isRecord(value) || !hasValidTargetRef(value, context)) return false;
  return value.kind === "object"
    ? isRecord(value.ref) && value.ref.instanceId === candidateId
    : value.kind === "player" && value.playerId === candidateId;
}

function hasValidBindingValue(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every((entry) => hasValidBindingValue(entry, context));
  if (!isRecord(value)) return false;
  if ("ref" in value && "instanceId" in value) {
    // Anticipatory staged tokens: a proposed (not yet committed) create event
    // binds snapshots of tokens that may still be replaced or declined, so
    // their refs are neither live nor LKI. Shape-check them like detached
    // snapshots instead of demanding ref liveness.
    if (value.objectKind === "created-token") {
      const shapeOk = hasValidDetachedObjectSnapshot(value, context);
      if (!shapeOk || !("continuationRef" in value)) return shapeOk;
      return (
        isRecord(value.continuationRef) &&
        value.continuationRef.instanceId === value.instanceId &&
        hasValidObjectRef(value.continuationRef, context)
      );
    }
    if (!hasValidObjectSnapshot(value, context)) return false;
    if (!("continuationRef" in value)) return true;
    return (
      isRecord(value.continuationRef) &&
      value.continuationRef.instanceId === value.instanceId &&
      hasValidObjectRef(value.continuationRef, context)
    );
  }
  return Object.values(value).every((entry) => hasValidBindingValue(entry, context));
}

function hasValidObjectSnapshot(value: unknown, context: FabSnapshotValidationContext): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.instanceId) &&
    isRecord(value.ref) &&
    value.ref.instanceId === value.instanceId &&
    hasValidObjectRef(value.ref, context) &&
    isPlayer(value.ownerId, context) &&
    (value.controllerId === null || isPlayer(value.controllerId, context))
  );
}

function hasValidDetachedObjectSnapshot(
  value: unknown,
  context: FabSnapshotValidationContext,
): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.instanceId) &&
    isRecord(value.ref) &&
    value.ref.instanceId === value.instanceId &&
    isInteger(value.ref.incarnation) &&
    isPlayer(value.ownerId, context) &&
    (value.controllerId === null || isPlayer(value.controllerId, context))
  );
}

function hasValidObjectRef(value: unknown, context: FabSnapshotValidationContext): boolean {
  if (!isRecord(value) || !isNonEmptyString(value.instanceId) || !isInteger(value.incarnation))
    return false;
  const live = context.objects[value.instanceId];
  if (isRecord(live) && live.incarnation === value.incarnation) return true;
  return Object.values(context.lkiArena).some(
    (lki) =>
      isRecord(lki) &&
      isRecord(lki.ref) &&
      lki.ref.instanceId === value.instanceId &&
      lki.ref.incarnation === value.incarnation,
  );
}

function continuationProcessId(value: unknown): string | null {
  return isRecord(value) && isNonEmptyString(value.processId) ? value.processId : null;
}

function stackHasLayer(layerId: unknown, context: FabSnapshotValidationContext) {
  return (
    isNonEmptyString(layerId) &&
    context.rulesStack.some((layer) => isRecord(layer) && layer.layerId === layerId)
  );
}

function validBounds(value: Record<string, unknown>) {
  return isInteger(value.min) && isInteger(value.max) && value.min >= 0 && value.max >= value.min;
}

function validLabelEntries(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) => isRecord(entry) && isNonEmptyString(entry.id) && typeof entry.label === "string",
    )
  );
}

function isLiveObjectId(value: unknown, context: FabSnapshotValidationContext): value is string {
  return isNonEmptyString(value) && isRecord(context.objects[value]);
}

function isLkiInstanceId(value: unknown, context: FabSnapshotValidationContext): value is string {
  return (
    isNonEmptyString(value) &&
    Object.values(context.lkiArena).some(
      (lki) => isRecord(lki) && isRecord(lki.ref) && lki.ref.instanceId === value,
    )
  );
}

function isPlayer(value: unknown, context: FabSnapshotValidationContext): value is string {
  return isNonEmptyString(value) && context.playerIds.has(value);
}

function isPlayerOrNull(value: unknown, context: FabSnapshotValidationContext) {
  return value === null || isPlayer(value, context);
}

function isId(value: unknown, prefix: string): value is string {
  return isNonEmptyString(value) && value.startsWith(prefix);
}

function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isFiniteNumberOrNull(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isIntegerArray(value: unknown): value is readonly number[] {
  return Array.isArray(value) && value.every((entry) => isInteger(entry) && entry >= 0);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function isStringIn(value: unknown, values: ReadonlySet<string>): value is string {
  return isNonEmptyString(value) && values.has(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRecordOf(
  value: unknown,
  predicate: (entry: unknown) => boolean,
): value is Record<string, unknown> {
  return isRecord(value) && Object.values(value).every(predicate);
}
