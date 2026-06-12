import type { CommandEnvelope, CommandResult } from "../types/command.ts";
import type { PlayerId } from "../types/branded.ts";
import type { FilteredMatchView, ViewRoleContext } from "../types/projection.ts";
import type { MatchState } from "../types/match-state.ts";
import type { Transport } from "../types/transport.ts";

/** Base engine interface */
export interface GameEngine {
  executeCommand(envelope: CommandEnvelope, playerId: PlayerId): CommandResult;
  getView(roleCtx: ViewRoleContext): FilteredMatchView;
  getAvailableMoves(playerId: PlayerId): string[];
  getState(): MatchState;
  getStateID(): number;
  canUndo(playerId: PlayerId): boolean;
  undo(playerId: PlayerId): CommandResult | null;
  dispose(): void;
}

/** Engine that communicates over a transport */
export interface TransportAwareEngine extends GameEngine {
  connect(transport: Transport): void;
  disconnect(): void;
}

/** Authority mode */
export type AuthorityMode = "server" | "client";
