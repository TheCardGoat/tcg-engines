import type {
  GrandArchiveObjectId,
  GrandArchiveStackItemId,
  GrandArchiveTargetId,
} from "../../game/identity.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  observeGrandArchiveCommittedEvent,
  type GrandArchiveObservedEvent,
} from "../../kernel/observed-events.ts";
import type { GrandArchiveHeuristicHistory, GrandArchiveHeuristicHistoryEvent } from "./types.ts";

export function buildGrandArchiveHeuristicHistory(
  state: GrandArchiveMatchState,
  visibleObjectIds: ReadonlySet<GrandArchiveObjectId>,
): GrandArchiveHeuristicHistory {
  const currentStackIds = new Set<GrandArchiveStackItemId>(state.stack.map((item) => item.id));
  const visibleTargetIds = new Set<GrandArchiveTargetId>([
    ...visibleObjectIds,
    ...state.turnOrder,
    ...currentStackIds,
  ]);
  const projectWindow = (start: number): readonly GrandArchiveHeuristicHistoryEvent[] =>
    state.eventHistory
      .slice(start)
      .flatMap(observeGrandArchiveCommittedEvent)
      .map((event) =>
        projectHistoryEvent(event, visibleObjectIds, visibleTargetIds, currentStackIds),
      );

  const turnStart = lastHistoryIndex(state, (event) => event.type === "turn-started");
  const phaseStart = lastHistoryIndex(state, isPhaseBoundary);
  const combatStart = state.combat
    ? lastHistoryIndex(state, (event) => event.type === "combat-started")
    : null;
  const resolutionStart = state.resolution?.startedEventHistoryIndex ?? null;

  return {
    turn: projectWindow(turnStart),
    phase: projectWindow(phaseStart),
    combat: combatStart === null ? null : projectWindow(combatStart),
    resolution: resolutionStart === null ? null : projectWindow(resolutionStart),
  };
}

function lastHistoryIndex(
  state: GrandArchiveMatchState,
  predicate: (event: GrandArchiveMatchState["eventHistory"][number]) => boolean,
): number {
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    if (predicate(state.eventHistory[index]!)) return index;
  }
  return 0;
}

function isPhaseBoundary(event: GrandArchiveMatchState["eventHistory"][number]): boolean {
  return (
    event.type === "phase-changed" ||
    event.type === "turn-started" ||
    event.type === "combat-started" ||
    event.type === "combat-ended"
  );
}

function projectHistoryEvent(
  event: GrandArchiveObservedEvent,
  visibleObjectIds: ReadonlySet<GrandArchiveObjectId>,
  visibleTargetIds: ReadonlySet<GrandArchiveTargetId>,
  currentStackIds: ReadonlySet<GrandArchiveStackItemId>,
): GrandArchiveHeuristicHistoryEvent {
  const {
    committedEvent: _committedEvent,
    subjectId,
    subjectIds,
    recipientId,
    recipientIds,
    previousObjectId,
    stackItemId,
    sourceId,
    usingIds,
    ...metadata
  } = event;
  const visibleSubjects = subjectIds?.filter((id) => visibleObjectIds.has(id));
  const visibleRecipients = recipientIds?.filter((id) => visibleTargetIds.has(id));
  const visibleUsing = usingIds?.filter((id) => visibleObjectIds.has(id));
  return {
    ...metadata,
    ...(subjectId && visibleObjectIds.has(subjectId) ? { subjectId } : {}),
    ...(visibleSubjects && visibleSubjects.length > 0 ? { subjectIds: visibleSubjects } : {}),
    ...(recipientId && visibleObjectIds.has(recipientId) ? { recipientId } : {}),
    ...(visibleRecipients && visibleRecipients.length > 0
      ? { recipientIds: visibleRecipients }
      : {}),
    ...(previousObjectId && visibleObjectIds.has(previousObjectId) ? { previousObjectId } : {}),
    ...(stackItemId && currentStackIds.has(stackItemId) ? { stackItemId } : {}),
    ...(sourceId && visibleObjectIds.has(sourceId) ? { sourceId } : {}),
    ...(visibleUsing && visibleUsing.length > 0 ? { usingIds: visibleUsing } : {}),
  };
}
