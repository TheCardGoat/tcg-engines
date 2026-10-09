import type { Action, GameState, PlayerId } from "@tcg-engines/naruto-engine";

export interface NarutoUndoCheckpoint {
  actorId: string;
  moveId: string;
  stateVersion: number;
  state: GameState;
}

export interface NarutoUndoState {
  checkpoints: NarutoUndoCheckpoint[];
  turnStart: NarutoUndoCheckpoint | null;
  turnStartStateVersion: number | null;
}

export function emptyNarutoUndoState(state: GameState, stateVersion: number, atTurnStart = true): NarutoUndoState {
  return {
    checkpoints: [],
    turnStart: null,
    turnStartStateVersion: atTurnStart && isMainTurn(state) ? stateVersion : null,
  };
}

export function isMainTurn(state: GameState): boolean {
  return state.phase === "main" && state.awaitingMulligan === null && state.winner === null;
}

const PUBLIC_REVEAL_LOG_KEYS = new Set(["log.reveal", "log.revealNoMatch"]);

/** A player may not erase an information reveal or the opponent's response. */
export function hasNarutoUndoBarrier(before: GameState, after: GameState, action: Action): boolean {
  if (before.turn !== after.turn || before.activePlayer !== after.activePlayer) return true;
  if (before.seed !== after.seed || after.winner !== null) return true;
  if (action.player !== before.activePlayer) return true;
  if (
    action.type === "SUMMON" ||
    action.type === "ACTIVATE_SUPPORT" ||
    action.type === "ACTIVATE_SUPPORT_FROM_HAND" ||
    action.type === "ACTIVATE_CHARACTER" ||
    action.type === "RESOLVE_CHOICE"
  ) return true;
  for (const player of ["p1", "p2"] as const satisfies readonly PlayerId[]) {
    const oldSeat = before.players[player];
    const newSeat = after.players[player];
    if (!sameCards(oldSeat.deck, newSeat.deck)) return true;
    if (oldSeat.supports.some((support, index) =>
      support !== null && !support.revealed && newSeat.supports[index]?.revealed
    )) return true;
  }
  return after.log.slice(before.log.length).some((entry) => PUBLIC_REVEAL_LOG_KEYS.has(entry.key));
}

function sameCards(before: readonly { uid: string }[], after: readonly { uid: string }[]): boolean {
  return before.length === after.length && before.every((card, index) => card.uid === after[index]?.uid);
}

export function readNarutoUndoState(metadata: unknown, state: GameState, stateVersion: number): NarutoUndoState {
  if (!isRecord(metadata)) return emptyNarutoUndoState(state, stateVersion);
  const checkpoints = Array.isArray(metadata.undoCheckpoints)
    ? metadata.undoCheckpoints.filter(isCheckpoint)
    : [];
  const turnStart = isCheckpoint(metadata.turnStartCheckpoint) ? metadata.turnStartCheckpoint : null;
  const turnStartStateVersion =
    typeof metadata.turnStartStateVersion === "number" &&
    Number.isSafeInteger(metadata.turnStartStateVersion) && metadata.turnStartStateVersion >= 0
      ? metadata.turnStartStateVersion : null;
  return { checkpoints, turnStart, turnStartStateVersion };
}

function isCheckpoint(value: unknown): value is NarutoUndoCheckpoint {
  if (!isRecord(value) || !isRecord(value.state)) return false;
  const state = value.state;
  return typeof value.actorId === "string" && typeof value.moveId === "string" &&
    typeof value.stateVersion === "number" && Number.isSafeInteger(value.stateVersion) &&
    value.stateVersion >= 0 && state.phase === "main" &&
    typeof state.turn === "number" && (state.activePlayer === "p1" || state.activePlayer === "p2") &&
    isRecord(state.players);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
