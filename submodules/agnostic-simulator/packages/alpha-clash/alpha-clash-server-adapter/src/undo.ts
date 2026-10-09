import type { AcCommand, MatchState } from "@tcg/alpha-clash-engine";

export interface AlphaClashUndoCheckpoint {
  actorId: string;
  moveId: string;
  stateVersion: number;
  state: MatchState;
}

export interface AlphaClashUndoState {
  checkpoints: AlphaClashUndoCheckpoint[];
  turnStart: AlphaClashUndoCheckpoint | null;
  turnStartStateVersion: number | null;
}

export function isPlayingTurn(state: MatchState): boolean {
  return state.phase.name !== "setup" && state.phase.name !== "complete";
}

export function emptyAlphaClashUndoState(state: MatchState, version: number, atTurnStart = true): AlphaClashUndoState {
  return { checkpoints: [], turnStart: null, turnStartStateVersion: atTurnStart && isPlayingTurn(state) ? version : null };
}

/** Changes to hidden deck order, card identity, or the turn stop an undo chain. */
export function hasAlphaClashUndoBarrier(before: MatchState, after: MatchState, command: AcCommand): boolean {
  if (before.turnNumber !== after.turnNumber || before.activePlayer !== after.activePlayer) return true;
  if (before.phase.name === "setup" || after.phase.name === "complete") return true;
  if (before.rngState !== after.rngState) return true;
  if (command.type === "mulligan" || command.type === "playCard" || command.type === "respond" ||
      command.type === "deployResource" || command.type === "activateAbility" || command.type === "resolveChoice" ||
      command.type === "concede") return true;
  for (const seat of ["player-one", "player-two"] as const) {
    const oldDeck = before.deckOrder[seat];
    const newDeck = after.deckOrder[seat];
    if (oldDeck.length !== newDeck.length || oldDeck.some((id, index) => id !== newDeck[index])) return true;
  }
  for (const [id, card] of Object.entries(after.cards)) {
    const previous = before.cards[id];
    if (previous && (previous.zone === "hand" || previous.zone === "deck" || previous.faceDown) &&
        card.zone !== "hand" && card.zone !== "deck" && !card.faceDown) return true;
  }
  return false;
}

export function readAlphaClashUndoState(metadata: unknown, state: MatchState, version: number): AlphaClashUndoState {
  if (!isRecord(metadata)) return emptyAlphaClashUndoState(state, version);
  const checkpoints = Array.isArray(metadata.undoCheckpoints)
    ? metadata.undoCheckpoints.filter(isCheckpoint) : [];
  const turnStart = isCheckpoint(metadata.turnStartCheckpoint) ? metadata.turnStartCheckpoint : null;
  const turnStartStateVersion = typeof metadata.turnStartStateVersion === "number" &&
    Number.isSafeInteger(metadata.turnStartStateVersion) && metadata.turnStartStateVersion >= 0
      ? metadata.turnStartStateVersion : null;
  return { checkpoints, turnStart, turnStartStateVersion };
}

function isCheckpoint(value: unknown): value is AlphaClashUndoCheckpoint {
  if (!isRecord(value) || !isRecord(value.state)) return false;
  return typeof value.actorId === "string" && typeof value.moveId === "string" &&
    typeof value.stateVersion === "number" && Number.isSafeInteger(value.stateVersion) &&
    value.stateVersion >= 0 && typeof value.state.turnNumber === "number" &&
    isRecord(value.state.phase) && isRecord(value.state.cards);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
