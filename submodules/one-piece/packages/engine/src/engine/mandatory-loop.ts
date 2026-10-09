import { canAuditDon, auditedDonTransition } from "./don-loop.ts";
import type { Action } from "@tcg/op-types";
import {
  evaluateStableConditions,
  isDeterministicStateAction,
  isForcedSelfMovement,
  stableConditionsMatch,
} from "./loop-transition.ts";
import { effectBlocksForInstance, getCardForInstance } from "../shared.ts";
import type { MatchState, ResolutionItem } from "../types.ts";

// Wrappers only schedule audited children. Their stable gates must be supported
// even when false; unsupported predicates must never be treated as a false branch.
function auditedAction(
  state: MatchState,
  item: ResolutionItem,
  action: Action,
  profile: "restReady" | "moving",
  checkCurrentZone = true,
): boolean {
  if (item.kind !== "effectAction" && item.kind !== "effectBlock") return false;
  if (action.action === "simultaneousStateChange") {
    // Only forced field-card groups are admitted. DON identity processes and
    // replacement continuations have their own persistent state and are excluded.
    return (
      profile === "restReady" &&
      action.groups.length > 0 &&
      Object.keys(action).every((key) => key === "action" || key === "groups") &&
      !Object.values(state.cards).some(
        (card) => getCardForInstance(state, card.instanceId).effects?.replacementEffects?.length,
      ) &&
      action.groups.every(
        (group) =>
          Object.keys(group).every((key) => key === "state" || key === "target") &&
          !group.target.zones.includes("costArea") &&
          isDeterministicStateAction(
            state,
            item,
            {
              action: group.state === "rested" ? "rest" : "setActive",
              target: group.target,
            },
            "forcedGroup",
          ),
      )
    );
  }
  if (action.action === "sequence" || action.action === "conditional") {
    const allowedKeys =
      action.action === "sequence"
        ? ["action", "actions", "condition"]
        : ["action", "predicate", "whenTrue", "whenFalse", "condition"];
    if (!Object.keys(action).every((key) => allowedKeys.includes(key))) return false;
    const gate = evaluateStableConditions(
      state,
      item.controller,
      item.sourceInstanceId,
      action.condition ? [action.condition] : undefined,
      profile,
    );
    if (gate === undefined) return false;
    if (!gate) return true;
    let children: Action[];
    if (action.action === "sequence") children = action.actions;
    else {
      const predicate = evaluateStableConditions(
        state,
        item.controller,
        item.sourceInstanceId,
        [action.predicate],
        profile,
      );
      if (predicate === undefined) return false;
      children = predicate ? action.whenTrue : (action.whenFalse ?? []);
    }
    // Earlier siblings can move the source before a later child executes.
    // Each leaf is checked again when it reaches the front of the queue.
    return children.every((child) => auditedAction(state, item, child, profile, false));
  }
  return profile === "restReady"
    ? isDeterministicStateAction(state, item, action, "forcedGroup")
    : isDeterministicStateAction(state, item, action) ||
        isForcedSelfMovement(state, item, action, "handAndTrash", checkCurrentZone);
}

function isAuditedTransition(state: MatchState, item: ResolutionItem): boolean {
  if (item.kind === "effectComplete") return true;
  if (item.kind === "effectAction") return auditedAction(state, item, item.action, "restReady");
  if (item.kind !== "effectBlock") return false;
  const block = effectBlocksForInstance(state, item.sourceInstanceId, item.trigger)[
    item.blockIndex
  ];
  return Boolean(
    block &&
    !block.optional &&
    !block.oncePerTurn &&
    !block.costs?.length &&
    !block.alternativeCosts?.length &&
    !block.postCostConditions?.length &&
    stableConditionsMatch(
      state,
      item.controller,
      item.sourceInstanceId,
      block.conditions,
      "restReady",
    ) &&
    block.actions.every((action) => auditedAction(state, item, action, "restReady", false)),
  );
}

function auditedMovingTransition(state: MatchState, item: ResolutionItem): boolean {
  if (item.kind === "effectComplete" || item.kind === "effectMovementComplete") return true;
  if (item.kind === "effectAction") return auditedAction(state, item, item.action, "moving");
  if (item.kind !== "effectBlock") return false;
  const block = effectBlocksForInstance(state, item.sourceInstanceId, item.trigger)[
    item.blockIndex
  ];
  return Boolean(
    block &&
    !block.optional &&
    !block.oncePerTurn &&
    !block.costs?.length &&
    !block.alternativeCosts?.length &&
    stableConditionsMatch(
      state,
      item.controller,
      item.sourceInstanceId,
      block.conditions,
      "moving",
    ) &&
    !block.postCostConditions?.length &&
    block.actions.every((action) => auditedAction(state, item, action, "moving", false)),
  );
}

function simpleGenerationReferences(state: MatchState, item: ResolutionItem): boolean {
  if (item.kind === "effectComplete") return true;
  const common = ["id", "kind", "sourceInstanceId", "controller"];
  if (item.kind === "effectMovementComplete") {
    return (
      item.movedIds.every((id) => Boolean(state.cards[id])) &&
      Object.entries(item).every(
        ([key, value]) => value === undefined || [...common, "movedIds"].includes(key),
      )
    );
  }
  if (item.kind === "effectAction") {
    // Continuations and replacement registries can retain old zone identities.
    // Until individually audited, none may participate in a moving proof.
    // The trigger event has only physical IDs and scalar facts (no zone stamps),
    // like effectBlock.triggerEvent below; retain it verbatim in the fingerprint.
    return (
      (item.previousActionTargetIds ?? []).every((id) => Boolean(state.cards[id])) &&
      Object.entries(item).every(
        ([key, value]) =>
          value === undefined ||
          [...common, "action", "previousActionTargetIds", "effectTriggerEvent"].includes(key),
      )
    );
  }
  if (item.kind !== "effectBlock") return false;
  return (
    Object.entries(item).every(
      ([key, value]) =>
        value === undefined ||
        [
          ...common,
          "trigger",
          "blockIndex",
          "sourceZoneChangeCounter",
          "readyEffectSelected",
          "triggerEvent",
        ].includes(key),
    ) &&
    (item.sourceZoneChangeCounter === undefined ||
      item.sourceZoneChangeCounter === state.cards[item.sourceInstanceId]?.zoneChangeCounter)
  );
}

function canNormalizeMovingGenerations(state: MatchState): boolean {
  return (
    !state.battle &&
    Object.keys(state.modifiers).length === 0 &&
    state.delayedEffectActions.length === 0 &&
    // A replacement can execute nested actions synchronously, without a queue
    // item for this auditor to inspect. Exclude such sources from moving proof.
    !Object.values(state.cards).some(
      (card) => getCardForInstance(state, card.instanceId).effects?.replacementEffects?.length,
    ) &&
    !state.optionalLoopPlan &&
    !state.optionalLoopEvidence?.length &&
    !state.stoppedOptionalLoops?.length &&
    !state.promptQueue.some((prompt) => prompt.status === "pending") &&
    [
      ...state.resolutionQueue,
      ...(state.pendingAutoEffects ?? []),
      ...(state.readyEffectGroup?.effects ?? []),
    ].every((item) => simpleGenerationReferences(state, item))
  );
}

function fingerprint(state: MatchState, normalizeGenerations: boolean): string {
  // A bijection preserves duplicate identity relationships. The admitted moving
  // payload whitelist excludes all queue-ID references and keeps physical IDs.
  const queueIds = new Map<string, string>();
  const queueId = (id: string) => {
    if (!queueIds.has(id)) queueIds.set(id, `queue-${queueIds.size}`);
    return queueIds.get(id)!;
  };
  const queuedItem = (item: ResolutionItem) => ({
    ...item,
    id: queueId(item.id),
    ...(normalizeGenerations &&
      item.kind === "effectBlock" &&
      item.sourceZoneChangeCounter !== undefined && {
        // Preserve current/stale identity relationships, never only drop a stamp.
        sourceZoneChangeCounter:
          item.sourceZoneChangeCounter - state.cards[item.sourceInstanceId]!.zoneChangeCounter,
      }),
  });
  return JSON.stringify({
    ...state,
    ...(normalizeGenerations && {
      cards: Object.fromEntries(
        Object.entries(state.cards).map(([id, card]) => [id, { ...card, zoneChangeCounter: 0 }]),
      ),
    }),
    // Derived cache keys contain raw movement generations and K.O. history.
    // Preserve the actual settled choices and any pending settlement, not the
    // redundant serialization used only to invalidate that cache.
    continuousCosts: state.continuousCosts
      ? { ...state.continuousCosts, fingerprint: undefined }
      : undefined,
    optionalLoopEvidence: undefined,
    optionalLoopPlan: undefined,
    stoppedOptionalLoops: undefined,
    pendingAutoEffects: state.pendingAutoEffects?.map(queuedItem),
    readyEffectGroup: state.readyEffectGroup
      ? {
          ...state.readyEffectGroup,
          effects: state.readyEffectGroup.effects.map(queuedItem),
        }
      : undefined,
    idCounter: 0,
    eventSequence: 0,
    logSequence: 0,
    capabilitySequence: 0,
    eventHistory: ["south", "north"].map((seat) =>
      state.eventHistory.some(
        (event) =>
          event.type === "characterKod" &&
          event.turn === state.turnNumber &&
          event.payload.targetController === seat,
      ),
    ),
    logHistory: [],
    capabilityHistory: [],
    resolutionQueue: state.resolutionQueue.map(queuedItem),
  });
}

/** Exact, audited repeats only: no iteration limit, random shortcut or lossy hash. */
export class MandatoryLoopDetector {
  private readonly seen = new Set<string>();
  private readonly movingSeen = new Set<string>();
  private readonly donSeen = new Set<string>();

  repeats(state: MatchState): boolean {
    const item = state.resolutionQueue[0];
    if (!item) {
      this.seen.clear();
      this.movingSeen.clear();
      this.donSeen.clear();
      return false;
    }
    if (isAuditedTransition(state, item)) {
      const exact = fingerprint(state, false);
      if (this.seen.has(exact)) return true;
      this.seen.add(exact);
    } else this.seen.clear();
    if (canNormalizeMovingGenerations(state) && auditedMovingTransition(state, item)) {
      const equivalent = fingerprint(state, true);
      if (this.movingSeen.has(equivalent)) return true;
      this.movingSeen.add(equivalent);
    } else this.movingSeen.clear();
    if (canAuditDon(state) && auditedDonTransition(state, item)) {
      // No new normalization: retain exact scalar pools, per-card attachments and all queue state.
      const exact = fingerprint(state, false);
      if (this.donSeen.has(exact)) return true;
      this.donSeen.add(exact);
    } else this.donSeen.clear();
    return false;
  }
}
