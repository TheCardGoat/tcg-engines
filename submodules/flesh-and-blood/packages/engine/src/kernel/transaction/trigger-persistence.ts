import type { FabMatchState } from "../../state.ts";
import type { FabCommittedEventBatch } from "../../rules/events.ts";
import type { FabEventTransactionOptions } from "../process-runner/types.ts";
import type { FabTriggerSource } from "../../rules/trigger-matcher.ts";
import { collectEventTriggers } from "../../rules/trigger-matcher.ts";
import { applyTriggerCollection } from "../trigger-collection.ts";
import {
  contractCompletedByEvents,
  proposeCompleteContractEvent,
} from "../../rules/contract-progress.ts";
import { expiredDelayedTriggerIdsAfterBatch } from "../../rules/delayed-trigger-lifecycle.ts";
import type { FabPendingTrigger } from "../../rules/process.ts";
import { FAB_OBSERVABLE_EVENT_NAMES } from "@tcg/flesh-and-blood-types";
import { commitAdministrativeEvent } from "./administrative.ts";

const observableTriggerEvents = new Set<string>(FAB_OBSERVABLE_EVENT_NAMES);
const MAX_TRIGGER_OCCURRENCE_RECORDS = 128;

export function collectAndPersistEventTriggers(
  state: FabMatchState,
  batch: FabCommittedEventBatch,
  triggerSources: readonly FabTriggerSource[],
  options: FabEventTransactionOptions,
): void {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB trigger collection requires a persisted process.");
  persistTriggerOccurrenceFacts(state, batch);
  const collected = collectEventTriggers(state, batch, triggerSources, options.triggerContext);
  applyTriggerCollection(state, collected);
  enqueueWagerPrizeLayers(state, batch);
  enqueueDeferredClashPrizeLayers(state, batch);

  for (const playerId of state.playerIds) {
    const task = state.players[playerId]?.activeContract;
    if (!task) continue;
    if (!contractCompletedByEvents(state, batch.events, playerId, task)) continue;
    const proposed = proposeCompleteContractEvent(state, process.processId, playerId);
    if (!proposed) continue;
    const contractBatch = commitAdministrativeEvent(state, proposed, options);
    if (contractBatch) {
      collectAndPersistEventTriggers(state, contractBatch, triggerSources, options);
    }
  }

  // CR 1.9.1b observation: when an ability on an object "triggers", emit a
  // canonical `trigger` event so meta-abilities (Riptide "whenever a trap you
  // control triggers") can subscribe. Only emit for Trap sources to avoid a
  // recursive storm (riptide itself is a Hero, not a Trap).
  for (const pending of collected.pendingTriggers) {
    // Trap is a subtype (Defense Reaction - Trap), not a card type/supertype.
    const isTrap = pending.source.current.typeBox.subtypes.includes("Trap");
    if (!isTrap) continue;
    // Skip re-entrancy: never re-emit observation for a trigger-of-trigger.
    if (pending.triggeringEvent?.name === "trigger") continue;
    const triggerBatch = commitAdministrativeEvent(
      state,
      {
        name: "trigger",
        processId: process.processId,
        cause: {
          kind: "rule",
          rule: "ability-triggered",
          controllerId: pending.controllerId,
        },
        controllerId: pending.controllerId,
        source: pending.source,
        affected: [pending.source],
        bindings: {},
        data: {
          object: pending.source,
          abilityId: pending.abilityId,
          controllerId: pending.controllerId,
        },
      },
      options,
    );
    if (triggerBatch) {
      collectAndPersistEventTriggers(state, triggerBatch, triggerSources, options);
    }
  }

  // The persisted policy makes one-shot versus repeating behavior exhaustive.
  const delayedTriggerIds = [
    ...new Set([
      ...collected.pendingTriggers
        .map((pending) => pending.abilityId)
        .filter((id) => {
          const delayed = state.delayedTriggers.find((entry) => entry.delayedTriggerId === id);
          return delayed?.policy.matching === "first";
        }),
      ...expiredDelayedTriggerIdsAfterBatch(state, batch),
    ]),
  ];
  if (delayedTriggerIds.length === 0) return;
  commitAdministrativeEvent(
    state,
    {
      name: "consume-delayed-triggers",
      processId: process.processId,
      cause: { kind: "rule", rule: "delayed trigger collected", controllerId: null },
      controllerId: null,
      source: null,
      affected: [],
      bindings: {},
      data: { delayedTriggerIds },
    },
    options,
  );
}

function persistTriggerOccurrenceFacts(state: FabMatchState, batch: FabCommittedEventBatch): void {
  const byOccurrence = new Map<
    string,
    { events: FabCommittedEventBatch["events"][number][]; existingIndex: number }
  >();
  for (const event of batch.events) {
    if (!observableTriggerEvents.has(event.name)) continue;
    const occurrenceId = event.occurrence.occurrenceId;
    const group = byOccurrence.get(occurrenceId);
    if (group) {
      group.events.push(event);
      continue;
    }
    byOccurrence.set(occurrenceId, {
      events: [event],
      existingIndex: state.triggerOccurrenceLedger.findIndex(
        (record) => record.occurrence.occurrenceId === occurrenceId,
      ),
    });
  }
  for (const { events, existingIndex } of byOccurrence.values()) {
    const first = events[0];
    if (!first) continue;
    const previous = existingIndex >= 0 ? state.triggerOccurrenceLedger[existingIndex] : undefined;
    const combinedNames = [
      ...new Set([...(previous?.eventNames ?? []), ...events.map((e) => e.name)]),
    ];
    const combinedObjects = [...(previous?.selectedObjects ?? [])];
    const seenObjects = new Set(
      combinedObjects.map((object) => `${object.ref.instanceId}:${object.ref.incarnation}`),
    );
    for (const event of events) {
      for (const object of event.affected) {
        const key = `${object.ref.instanceId}:${object.ref.incarnation}`;
        if (!seenObjects.has(key)) {
          seenObjects.add(key);
          combinedObjects.push(object);
        }
      }
    }
    const actors = new Set([
      ...(previous ? [previous.actorId] : []),
      ...events.map((event) => event.actorId),
    ]);
    const amount =
      (previous?.amount ?? 0) +
      events.reduce((total, event) => {
        const data = event.data as { readonly amount?: unknown; readonly damage?: unknown };
        if (typeof data.amount === "number") return total + data.amount;
        if (typeof data.damage === "number") return total + data.damage;
        return total + 1;
      }, 0);
    const record = {
      occurrence: first.occurrence,
      actorId: actors.size === 1 ? ([...actors][0] ?? null) : null,
      eventNames: combinedNames,
      selectedObjects: combinedObjects,
      amount,
      context: first.context,
    };
    if (existingIndex >= 0) state.triggerOccurrenceLedger[existingIndex] = record;
    else state.triggerOccurrenceLedger.push(record);
  }
  if (state.triggerOccurrenceLedger.length > MAX_TRIGGER_OCCURRENCE_RECORDS) {
    state.triggerOccurrenceLedger.splice(
      0,
      state.triggerOccurrenceLedger.length - MAX_TRIGGER_OCCURRENCE_RECORDS,
    );
  }
}

/**
 * CR 8.5.46: the captured prize is generated for the winner when the wager
 * resolves. Token prizes become create events on wager-loss. Effect prizes
 * become a winner-controlled layer so search/discard decisions stay legal.
 */
function enqueueWagerPrizeLayers(state: FabMatchState, batch: FabCommittedEventBatch): void {
  const process = state.rulesProcess;
  if (!process) return;
  for (const event of batch.events) {
    if (event.name !== "wager-win") continue;
    const prize = event.data.prize;
    if (!prize || prize.kind !== "effect") continue;
    process.pendingTriggers.push({
      pendingTriggerId: `${batch.batchId}:${event.data.wagerId}:prize`,
      abilityId: `${event.data.wagerId}:prize`,
      controllerId: event.data.actorId,
      source: event.data.object,
      trigger: {
        kind: "event",
        event: {
          name: "wager-win",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: { kind: "effect", effect: prize.effect },
      layerKeywords: [],
      triggeringEvent: event,
      bindings: { ...event.bindings, winner: event.data.actorId },
      simultaneousGroupId: `${batch.batchId}:wager-prize`,
      declaredModes: [],
      modesDeclared: false,
      declaredTargets: {},
    });
  }
}

/**
 * A clash prize belongs to the winner, but that player is unknown until the
 * clash outcome commits. Choice-bearing prizes therefore cannot be proposed
 * inside the original clash layer; declare their normal resolution layer now
 * that the authoritative winner is known.
 */
function enqueueDeferredClashPrizeLayers(
  state: FabMatchState,
  batch: FabCommittedEventBatch,
): void {
  const process = state.rulesProcess;
  if (!process) return;
  // A Victor reclash cancels clash-outcome then restages clash-prize in the
  // same follow-up batch as the original prize. Two pending layers with the
  // same clashId share pendingTriggerId, so trigger-order cannot be answered
  // and the winner never receives the printed token.
  const prizeByClashId = new Map<
    string,
    Extract<(typeof batch.events)[number], { name: "clash-prize" }>
  >();
  for (const event of batch.events) {
    if (event.name !== "clash-prize" || !event.data.deferredEffect) continue;
    const existing = prizeByClashId.get(event.data.clashId);
    if (!existing) {
      prizeByClashId.set(event.data.clashId, event);
      continue;
    }
    const existingIsFresh = existing.bindings["reclash-final"] === true;
    const nextIsFresh = event.bindings["reclash-final"] === true;
    if (existingIsFresh && !nextIsFresh) prizeByClashId.set(event.data.clashId, event);
  }
  for (const event of prizeByClashId.values()) {
    const prize = event.data.deferredEffect;
    const outcome = batch.events.find(
      (candidate): candidate is Extract<typeof candidate, { name: "clash-outcome" }> =>
        candidate.name === "clash-outcome" && candidate.data.clashId === event.data.clashId,
    );
    const winnerId = outcome?.data.winnerId;
    if (!prize || !winnerId || !event.source) continue;
    const loserId =
      winnerId === outcome.data.firstPlayerId
        ? outcome.data.secondPlayerId
        : outcome.data.firstPlayerId;
    const pendingPrize: FabPendingTrigger = {
      pendingTriggerId: `${batch.batchId}:${event.data.clashId}:prize:${event.source.instanceId}`,
      abilityId: `${event.data.clashId}:prize`,
      controllerId: winnerId,
      source: event.source,
      trigger: {
        kind: "event",
        event: {
          // Metadata for the synthetic layer: the original prize still comes
          // from the source's defend-triggered clash, not a new trigger.
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: { kind: "effect", effect: prize },
      layerKeywords: [],
      triggeringEvent: event,
      bindings: { ...event.bindings, winner: winnerId, loser: loserId },
      simultaneousGroupId: `${batch.batchId}:${event.data.clashId}:prize`,
      declaredModes: [],
      modesDeclared: false,
      declaredTargets: {},
    };
    process.pendingTriggers.push(pendingPrize);
  }
}

/** Reconcile an isolated tentative journal state before legality/payment is finalized. */

export function uniqueTriggerSources(sources: readonly FabTriggerSource[]): FabTriggerSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.source.instanceId}:${source.abilityId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
