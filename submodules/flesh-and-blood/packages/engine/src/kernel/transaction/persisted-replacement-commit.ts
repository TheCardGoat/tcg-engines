import type { FabMatchState } from "../../state.ts";
import type { FabCommittedEventBatch } from "../../rules/events.ts";
import type { FabEventTransactionOptions } from "../process-runner/types.ts";
import type { FabReplacementCandidate } from "../../rules/process.ts";
import {
  proposePersistedReclashMoveCommit,
  proposePersistedReplacementCostCommit,
} from "../replacements/index.ts";
import { executeTransactionWorkGroup } from "./work-group.ts";
import { commitAdministrativeEvent } from "./administrative.ts";
import { transitionFabRulesProcessStage } from "../process-state.ts";

/**
 * Commit the event-cost of an accepted conditional replacement without yet
 * publishing its consequence. The receipt is persisted in the rules process,
 * making snapshot/restore between payment and consequence deterministic.
 */
export function commitPersistedReplacementCost(
  state: FabMatchState,
  candidate: FabReplacementCandidate,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB replacement cost commit has no persisted process.");
  const replacementEvents = [
    ...process.pendingEvents,
    ...process.resolutionEventGroups.flatMap((group) => group.events),
    ...(process.procedure?.eventGroups.flatMap((group) => group.events) ?? []),
  ];
  const proposed = proposePersistedReplacementCostCommit(state, candidate, replacementEvents);
  if (!proposed) throw new Error("FAB replacement cost commit is not currently payable.");
  const pendingEvents = [...process.pendingEvents];
  const replacementState = {
    replacementChoiceResolved: process.replacementChoiceResolved,
    replacementChoicePlayerIds: [...process.replacementChoicePlayerIds],
    selectedOptionalReplacementIds: [...process.selectedOptionalReplacementIds],
    declinedOptionalReplacementIds: [...(process.declinedOptionalReplacementIds ?? [])],
    orderedReplacementIds: [...process.orderedReplacementIds],
    replacementFirstPlayerId: process.replacementFirstPlayerId,
    journalReplacementOrders: { ...process.journalReplacementOrders },
    journalReplacementChoices: { ...process.journalReplacementChoices },
    journalDeclinedReplacementChoices: { ...process.journalDeclinedReplacementChoices },
    journalReplacementChoicePlayerIds: { ...process.journalReplacementChoicePlayerIds },
    journalReplacementFirstPlayerIds: { ...process.journalReplacementFirstPlayerIds },
    replacementCostTargetBindings: { ...process.replacementCostTargetBindings },
    replacementConsequenceTargetBindings: {
      ...process.replacementConsequenceTargetBindings,
    },
    replacementCostBindingScope: process.replacementCostBindingScope,
  };
  const result = executeTransactionWorkGroup(
    state,
    {
      events: [proposed.event],
      excludedReplacementIds: [candidate.replacementId],
      continuation: (processId, controllerId, replacementKind) => ({
        kind: "replacement-order",
        processId,
        controllerId,
        replacementKind,
      }),
    },
    options,
  );
  if (result.kind === "replacement-ordering") {
    throw new Error("FAB replacement cost encountered another unresolved replacement decision.");
  }
  const next = result.state;
  const nextProcess = next.rulesProcess;
  if (!nextProcess) throw new Error("FAB replacement cost commit lost its persisted process.");
  nextProcess.pendingEvents = pendingEvents;
  nextProcess.replacementChoiceResolved = replacementState.replacementChoiceResolved;
  nextProcess.replacementChoicePlayerIds = replacementState.replacementChoicePlayerIds;
  nextProcess.selectedOptionalReplacementIds = replacementState.selectedOptionalReplacementIds;
  nextProcess.declinedOptionalReplacementIds = replacementState.declinedOptionalReplacementIds;
  nextProcess.orderedReplacementIds = replacementState.orderedReplacementIds;
  if (replacementState.replacementFirstPlayerId) {
    nextProcess.replacementFirstPlayerId = replacementState.replacementFirstPlayerId;
  }
  nextProcess.journalReplacementOrders = replacementState.journalReplacementOrders;
  nextProcess.journalReplacementChoices = replacementState.journalReplacementChoices;
  nextProcess.journalDeclinedReplacementChoices =
    replacementState.journalDeclinedReplacementChoices;
  nextProcess.journalReplacementChoicePlayerIds =
    replacementState.journalReplacementChoicePlayerIds;
  nextProcess.journalReplacementFirstPlayerIds = replacementState.journalReplacementFirstPlayerIds;
  nextProcess.replacementCostTargetBindings = replacementState.replacementCostTargetBindings;
  nextProcess.replacementConsequenceTargetBindings =
    replacementState.replacementConsequenceTargetBindings;
  nextProcess.replacementCostBindingScope = replacementState.replacementCostBindingScope;
  const objectRef = proposed.event.data.object.ref;
  const committedEvent =
    result.kind === "committed"
      ? result.batch.events.find(
          (event) =>
            event.name === proposed.event.name &&
            event.data.object.instanceId === objectRef.instanceId &&
            event.data.object.ref.incarnation === objectRef.incarnation,
        )
      : undefined;
  const inGraveyard = next.containers.zonesByPlayerId[candidate.controllerId]?.graveyard.includes(
    objectRef.instanceId,
  );
  const remainsInArena = Object.values(next.containers.zonesByPlayerId).some((zones) =>
    [
      zones.arena,
      zones.head,
      zones.chest,
      zones.arms,
      zones.legs,
      zones.weapon1,
      zones.weapon2,
    ].some((zone) => zone.includes(objectRef.instanceId)),
  );
  const costCommitted =
    committedEvent !== undefined &&
    (proposed.event.name === "destroy" ? !remainsInArena : inGraveyard === true);
  (nextProcess.replacementCostCommitReceipts ??= {})[proposed.key] = costCommitted
    ? { status: "committed", eventId: committedEvent.eventId, object: objectRef }
    : { status: "failed", object: objectRef };
  transitionFabRulesProcessStage(nextProcess, "event-commit");
  return next;
}

/** Commit and persist Victor's selected reveal move before resuming the clash outcome. */
export function commitPersistedReclashMove(
  state: FabMatchState,
  candidate: FabReplacementCandidate,
  options: FabEventTransactionOptions,
): FabMatchState {
  const process = state.rulesProcess;
  if (!process) throw new Error("FAB re-clash move commit has no persisted process.");
  const replacementEvents = [
    ...process.pendingEvents,
    ...process.resolutionEventGroups.flatMap((group) => group.events),
    ...(process.procedure?.eventGroups.flatMap((group) => group.events) ?? []),
  ];
  const proposed = proposePersistedReclashMoveCommit(state, candidate, replacementEvents);
  if (!proposed) throw new Error("FAB re-clash move is not currently legal.");
  const batch = commitAdministrativeEvent(state, proposed.event, options);
  const moved = batch?.events.find(
    (event) =>
      event.name === "move-zone" &&
      event.data.object.instanceId === proposed.event.data.object.instanceId,
  );
  const bottom =
    state.containers.zonesByPlayerId[proposed.event.data.object.ownerId]?.deck[0] ===
    proposed.event.data.object.instanceId;
  (process.replacementConsequenceCommitReceipts ??= {})[proposed.key] =
    moved && bottom
      ? { status: "committed", eventId: moved.eventId, object: proposed.event.data.object.ref }
      : { status: "failed", object: proposed.event.data.object.ref };
  transitionFabRulesProcessStage(process, "event-commit");
  return state;
}
