/**
 * LocalEngine — For bot matches and single-player games.
 * Runs both server and client authority in one process with no transport.
 * Provides direct pass-through to the MatchRuntime.
 */

import type { CommandEnvelope, CommandResult } from "../types/command.ts";
import type { PlayerId } from "../types/branded.ts";
import type { FilteredMatchView, ViewRoleContext } from "../types/projection.ts";
import type { MatchState } from "../types/match-state.ts";
import type { MatchStaticResources, Player } from "../runtime/static-resources.ts";
import type { GameEngine } from "./contracts.ts";

import { MatchRuntime } from "../runtime/match-runtime.ts";

export class LocalEngine implements GameEngine {
  private runtime: MatchRuntime;

  constructor(staticResources: MatchStaticResources) {
    this.runtime = new MatchRuntime(staticResources);
  }

  // ── Initialization ──────────────────────────────────────────────────────

  initialize(players: Player[], seed?: string): void {
    this.runtime.initialize(players, seed);
  }

  // ── GameEngine interface ────────────────────────────────────────────────

  executeCommand(envelope: CommandEnvelope, playerId: PlayerId): CommandResult {
    return this.runtime.executeCommand(envelope, playerId);
  }

  getView(roleCtx: ViewRoleContext): FilteredMatchView {
    return this.runtime.getFilteredView(roleCtx);
  }

  getAvailableMoves(playerId: PlayerId): string[] {
    return this.runtime.getAvailableMoves(playerId);
  }

  getState(): MatchState {
    return this.runtime.getState() as MatchState;
  }

  getStateID(): number {
    return this.runtime.state.ctx._stateID;
  }

  canUndo(playerId: PlayerId): boolean {
    return this.runtime.canUndo(playerId);
  }

  undo(playerId: PlayerId): CommandResult | null {
    return this.runtime.undo(playerId);
  }

  dispose(): void {
    this.runtime.dispose();
  }

  // ── Gundam-specific accessors ────────────────────────────────────────

  getRuntime(): MatchRuntime {
    return this.runtime;
  }

  getRawState(): MatchState {
    return this.runtime.getState() as MatchState;
  }
}
