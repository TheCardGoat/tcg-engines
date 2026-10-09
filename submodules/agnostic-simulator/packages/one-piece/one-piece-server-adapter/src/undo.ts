import type { EngineEvent, MatchSeat, MatchState } from "@tcg/op-engine";

export interface OnePieceUndoCheckpoint {
  actorId: string;
  moveId: string;
  state: MatchState;
}

export interface OnePieceUndoState {
  checkpoints: OnePieceUndoCheckpoint[];
  turnStart: OnePieceUndoCheckpoint | null;
  /** State version at the clean start of this main phase, or null after a barrier. */
  turnStartStateID: number | null;
}

/** A secret-area change or private engine event may reveal information that an undo cannot hide. */
export function hasOnePieceUndoBarrier(
  before: MatchState,
  after: MatchState,
  events: readonly EngineEvent[],
): boolean {
  if (events.some((event) => event.visibility !== "public")) return true;
  for (const seat of ["south", "north"] as const satisfies readonly MatchSeat[]) {
    const previous = before.players[seat];
    const next = after.players[seat];
    if (!sameCardOrder(previous.deck, next.deck) || !sameCardOrder(previous.life, next.life)) {
      return true;
    }
  }
  return false;
}

function sameCardOrder(before: readonly string[], after: readonly string[]): boolean {
  return before.length === after.length && before.every((cardId, index) => cardId === after[index]);
}

export function readOnePieceUndoState(metadata: unknown): OnePieceUndoState {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return { checkpoints: [], turnStart: null, turnStartStateID: null };
  }
  const value = metadata as Record<string, unknown>;
  const checkpoints = Array.isArray(value.undoCheckpoints)
    ? value.undoCheckpoints.filter(isOnePieceUndoCheckpoint)
    : [];
  const turnStart = isOnePieceUndoCheckpoint(value.turnStartCheckpoint)
    ? value.turnStartCheckpoint
    : null;
  const turnStartStateID =
    typeof value.turnStartStateID === "number" &&
    Number.isSafeInteger(value.turnStartStateID) &&
    value.turnStartStateID >= 0
      ? value.turnStartStateID
      : null;
  return { checkpoints, turnStart, turnStartStateID };
}

function isOnePieceUndoCheckpoint(value: unknown): value is OnePieceUndoCheckpoint {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (typeof record.actorId !== "string" || typeof record.moveId !== "string") return false;
  if (!record.state || typeof record.state !== "object" || Array.isArray(record.state)) return false;
  const state = record.state as Record<string, unknown>;
  return (
    state.status === "active" &&
    state.phase === "main" &&
    (state.activeSeat === "south" || state.activeSeat === "north") &&
    typeof state.turnNumber === "number" &&
    typeof state.idCounter === "number" &&
    Boolean(state.players)
  );
}
