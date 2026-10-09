import type { GrandArchiveMatchSnapshotV1 } from "@tcg/grand-archive-engine/simulator";

export interface GrandArchiveUndoCheckpoint {
  actorId: string;
  moveId: string;
  stateVersion: number;
  snapshot: GrandArchiveMatchSnapshotV1;
}

export interface GrandArchiveUndoState {
  checkpoints: GrandArchiveUndoCheckpoint[];
  turnStart: GrandArchiveUndoCheckpoint | null;
  turnStartStateVersion: number | null;
}

export function emptyGrandArchiveUndoState(snapshot: GrandArchiveMatchSnapshotV1, atTurnStart = true): GrandArchiveUndoState {
  return {
    checkpoints: [], turnStart: null,
    turnStartStateVersion: atTurnStart && snapshot.status === "playing" ? snapshot.stateVersion : null,
  };
}

export function hasGrandArchiveUndoBarrier(
  before: GrandArchiveMatchSnapshotV1,
  after: GrandArchiveMatchSnapshotV1,
  eventTypes: readonly string[],
  actorId: string,
): boolean {
  if (before.status !== "playing" || after.status !== "playing") return true;
  if (before.turn.number !== after.turn.number || before.turn.playerId !== after.turn.playerId) return true;
  if (before.turn.playerId !== actorId || before.random.cursor !== after.random.cursor) return true;
  if (eventTypes.some((type) =>
    type === "card-revealed" || type === "cards-looked-at" || type === "cards-searched" ||
    type === "zone-reordered" || type === "random-state-changed")) return true;
  for (const seat of before.turnOrder) {
    for (const zone of ["main-deck", "material-deck", "hand"] as const) {
      const previous = before.zones[seat]?.[zone] ?? [];
      const next = after.zones[seat]?.[zone] ?? [];
      if (previous.length !== next.length || previous.some((id, index) => id !== next[index])) return true;
    }
  }
  return false;
}

export function readGrandArchiveUndoState(metadata: unknown, snapshot: GrandArchiveMatchSnapshotV1): GrandArchiveUndoState {
  if (!isRecord(metadata)) return emptyGrandArchiveUndoState(snapshot);
  const checkpoints = Array.isArray(metadata.undoCheckpoints)
    ? metadata.undoCheckpoints.filter(isCheckpoint) : [];
  const turnStart = isCheckpoint(metadata.turnStartCheckpoint) ? metadata.turnStartCheckpoint : null;
  const turnStartStateVersion = typeof metadata.turnStartStateVersion === "number" &&
    Number.isSafeInteger(metadata.turnStartStateVersion) && metadata.turnStartStateVersion >= 0
      ? metadata.turnStartStateVersion : null;
  return { checkpoints, turnStart, turnStartStateVersion };
}

function isCheckpoint(value: unknown): value is GrandArchiveUndoCheckpoint {
  if (!isRecord(value) || !isRecord(value.snapshot)) return false;
  return typeof value.actorId === "string" && typeof value.moveId === "string" &&
    typeof value.stateVersion === "number" && Number.isSafeInteger(value.stateVersion) &&
    value.snapshot.stateVersion === value.stateVersion &&
    value.snapshot.status === "playing" && isRecord(value.snapshot.turn);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
