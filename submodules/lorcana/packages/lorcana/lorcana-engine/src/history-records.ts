import type { CommandEnvelope, MoveInput } from "#core";
import type { EngineMoveHistoryEntry } from "./core/engine/contracts";
import type { MoveLog } from "./types/move-log";

export type MoveHistorySourceAuthority = "server" | "client";

export interface AcceptedMoveRecord {
  gameId: string;
  stateVersion: number;
  turnNumber: number;
  actorId: string;
  moveId: string;
  input?: MoveInput;
  processedCommand: CommandEnvelope;
  timestamp: number;
  sourceAuthority: MoveHistorySourceAuthority;
  transitionType?: EngineMoveHistoryEntry["transitionType"];
  newStateID?: number;
  undoneStateID?: number;
  restoredCheckpointStateID?: number;
  undoneMoveId?: string;
}

export interface EngineLogRecord {
  gameId: string;
  stateVersion: number;
  timestamp: number;
  sourceAuthority: MoveHistorySourceAuthority;
  log: MoveLog;
}

export function createSyntheticProcessedCommand(
  gameId: string,
  stateVersion: number,
  moveEntry: EngineMoveHistoryEntry,
): CommandEnvelope {
  return {
    commandID: `persisted:${gameId}:${stateVersion}`,
    input: moveEntry.input,
    move: moveEntry.moveId,
  };
}

export function createAcceptedMoveRecord(args: {
  gameId: string;
  stateVersion: number;
  actorId: string;
  moveEntry: EngineMoveHistoryEntry;
  processedCommand?: CommandEnvelope;
  sourceAuthority: MoveHistorySourceAuthority;
}): AcceptedMoveRecord {
  const { actorId, gameId, moveEntry, processedCommand, sourceAuthority, stateVersion } = args;

  return {
    actorId,
    gameId,
    input: moveEntry.input,
    moveId: moveEntry.moveId,
    processedCommand:
      processedCommand ?? createSyntheticProcessedCommand(gameId, stateVersion, moveEntry),
    sourceAuthority,
    stateVersion,
    timestamp: moveEntry.timestamp,
    turnNumber: moveEntry.turnNumber ?? 0,
    transitionType: moveEntry.transitionType,
    newStateID: moveEntry.newStateID,
    undoneStateID: moveEntry.undoneStateID,
    restoredCheckpointStateID: moveEntry.restoredCheckpointStateID,
    undoneMoveId: moveEntry.undoneMoveId,
  };
}

export function createEngineLogRecord(args: {
  gameId: string;
  stateVersion: number;
  log: MoveLog;
  sourceAuthority: MoveHistorySourceAuthority;
}): EngineLogRecord {
  const { gameId, log, sourceAuthority, stateVersion } = args;

  return {
    gameId,
    log,
    sourceAuthority,
    stateVersion,
    timestamp: log.timestamp,
  };
}
