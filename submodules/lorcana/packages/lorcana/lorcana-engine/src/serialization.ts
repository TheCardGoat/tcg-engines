/**
 * Production serialization helpers for LorcanaServer.
 *
 * These helpers centralize authoritative state extraction/loading so
 * consumers (API, persistence layers, replay tooling) don't need to
 * call engine internals directly.
 */

import type { CardCatalog, CardsMaps, PlayerId, RuntimeSnapshot } from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import { LorcanaServer, createLorcanaServerGame } from "./lorcana-server";
import type { LorcanaMatchState } from "./types";

export interface LorcanaUndoStackEntrySnapshot {
  stateID: number;
  playerId: string;
  state: LorcanaMatchState;
  runtimeSnapshot: RuntimeSnapshot;
  undoneStateID: number;
  undoneMoveId?: string;
}

export interface LorcanaServerAuthoritativeSnapshot {
  state: LorcanaMatchState;
  cardsMaps: CardsMaps;
  undoStack?: LorcanaUndoStackEntrySnapshot[];
}

/**
 * Get the full authoritative Lorcana match state for persistence.
 * Only works in server mode.
 */
export function getLorcanaServerAuthoritativeState(engine: LorcanaServer): LorcanaMatchState {
  return engine.getState() as LorcanaMatchState;
}

export function getLorcanaServerAuthoritativeSnapshot(
  engine: LorcanaServer,
  cardsMaps: CardsMaps,
): LorcanaServerAuthoritativeSnapshot {
  return {
    state: getLorcanaServerAuthoritativeState(engine),
    cardsMaps,
    undoStack: engine.getUndoStackSnapshot(),
  };
}

/**
 * Load a previously serialized authoritative Lorcana match state.
 * Caller must pass cardCatalog (e.g. getLorcanaCardCatalog() from @tcg/lorcana-cards).
 */
export function loadLorcanaServerAuthoritativeState(
  state: LorcanaMatchState,
  cardsMaps: CardsMaps,
  cardCatalog: CardCatalog,
  eng?: LorcanaServer,
): LorcanaServer {
  const players = Object.keys(cardsMaps.owners).map((id) => ({ id: id as PlayerId }));
  const playersInfo = players.map((player) => ({ player }));
  const engine =
    eng ??
    createLorcanaServerGame(playersInfo, {
      seed: state.ctx.random.seed,
      cardsMaps,
      cardCatalog,
      players,
      matchID: state.ctx.matchID,
      gameID: state.ctx.gameID,
      goingFirst: (state.ctx.status.choosingFirstPlayer ?? "") as PlayerId,
      _skipInitialization: true,
    });
  engine.loadState(state);

  return engine;
}

export function loadLorcanaServerAuthoritativeSnapshot(
  snapshot: LorcanaServerAuthoritativeSnapshot,
  cardCatalog: CardCatalog,
  eng?: LorcanaServer,
  playersOverride?: Array<{ id: PlayerId }>,
): LorcanaServer {
  const players =
    playersOverride && playersOverride.length > 0
      ? playersOverride
      : Object.keys(snapshot.cardsMaps.owners).map((id) => ({ id: id as PlayerId }));
  const playersInfo = players.map((player) => ({ player }));
  const engine =
    eng ??
    createLorcanaServerGame(playersInfo, {
      seed: snapshot.state.ctx.random.seed,
      cardsMaps: snapshot.cardsMaps,
      cardCatalog,
      players,
      matchID: snapshot.state.ctx.matchID,
      gameID: snapshot.state.ctx.gameID,
      goingFirst: (snapshot.state.ctx.status.choosingFirstPlayer ?? "") as PlayerId,
      _skipInitialization: true,
    });

  engine.restoreAuthoritativeSnapshot(snapshot);
  return engine;
}
