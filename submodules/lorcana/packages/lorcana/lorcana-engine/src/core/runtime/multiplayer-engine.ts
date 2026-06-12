/**
 * MultiplayerEngine - Server-side game engine
 *
 * A wrapper around MatchRuntime that provides a simplified interface
 * for server-side game management.
 */

import type { Patch } from "mutative";
import type { MatchRuntime, MoveDefinition, MatchRuntimeConfig, SetupArgs } from "./match-runtime";
import type { MatchState, CommandEnvelope, MoveInput } from "./types";
import { createPlayerId, type PlayerId } from "../types";
import { createRecordCardCatalog } from "./static-resources";
import { filterMatchView } from "./view-filter";
import type { LorcanaG } from "../../types/runtime-state";
import { buildZoneRegistry } from "./zone-registry";

// =============================================================================
// Types
// =============================================================================

export interface EnginePlayer {
  id: PlayerId;
}

export interface EngineMovePayload {
  playerId: PlayerId;
  input: MoveInput;
}

export interface EngineMoveResult {
  success: boolean;
  error?: string;
  patches?: Patch[];
}

export interface GameEndResult {
  reason: string;
  winner?: string;
  metadata?: Record<string, unknown>;
}

export interface EngineHistoryEntry {
  moveType: string;
  playerId: string;
  payload: MoveInput;
  timestamp: number;
}

export interface MultiplayerEngineOptions {
  mode: "server" | "client";
  seed?: string;
}

export interface MultiplayerGameDefinition {
  setup: (args: { players: EnginePlayer[] }) => LorcanaG;
  moves: Record<string, MoveDefinition<any, any>>;
}

// =============================================================================
// MultiplayerEngine Class
// =============================================================================

export class MultiplayerEngine {
  private runtime: MatchRuntime;
  private history: EngineHistoryEntry[] = [];
  private options: MultiplayerEngineOptions;
  private moveDefinitions: Record<string, MoveDefinition<any, any>>;

  constructor(
    definition: MultiplayerGameDefinition,
    players: EnginePlayer[],
    options: MultiplayerEngineOptions,
  ) {
    this.options = options;
    this.moveDefinitions = definition.moves;

    // Build runtime config from simplified definition
    const config: MatchRuntimeConfig = {
      name: "multiplayer-game",
      setup: (args: SetupArgs) =>
        definition.setup({
          players: args.players.map((p) => ({ id: p.id }) as unknown as EnginePlayer),
        }),
      moves: definition.moves,
      flow: {
        gameSegments: {
          main: {
            id: "main",
            name: "Main Game",
            order: 1,
            turn: {
              initialPhase: "main",
              phases: {
                main: { id: "main", name: "Main", order: 1, validMoves: [] },
              },
            },
          },
        },
        initialGameSegment: "main",
      },
      zones: {},
      playerView: (state, roleCtx) =>
        filterMatchView(state, roleCtx, buildZoneRegistry(config.zones, state.ctx.playerIds)),
      projectBoard: (state, roleCtx, _staticResources, _projectionCtx) =>
        filterMatchView(state, roleCtx, buildZoneRegistry(config.zones, state.ctx.playerIds)),
      deriveRuntimeCard: () => ({}) as never,
    };

    // Create runtime with initial state - convert EnginePlayer to Player format
    const { MatchRuntime: RuntimeClass } = require("./match-runtime");
    const runtimePlayers = players.map((p) => ({ id: p.id as unknown as string, name: undefined }));
    this.runtime = new RuntimeClass(config, {
      players: runtimePlayers,
      seed: options.seed,
      capturePatches: options.mode === "server",
      cardsMaps: { cardInstances: {}, owners: {} },
      cardCatalog: createRecordCardCatalog("multiplayer-engine:empty", {}),
    });
  }

  // =============================================================================
  // State Queries
  // =============================================================================

  /**
   * Get the current game state
   */
  getState(): LorcanaG {
    const state = this.runtime.getState();
    return state.G;
  }

  /**
   * Get the full match state (including ctx)
   */
  getMatchState(): MatchState {
    return this.runtime.getState();
  }

  /**
   * Get move history
   */
  getHistory(): EngineHistoryEntry[] {
    return [...this.history];
  }

  /**
   * Get player-specific view of the state (hides private info)
   */
  getPlayerView(playerId: string): LorcanaG {
    const filteredView = this.runtime.getFilteredView({
      role: "player",
      playerID: playerId,
    });
    return filteredView.G;
  }

  // =============================================================================
  // Move Execution
  // =============================================================================

  /**
   * Execute a move
   */
  executeMove(moveType: string, payload: EngineMovePayload): EngineMoveResult {
    const command: CommandEnvelope = {
      commandID: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      move: moveType,
      input: payload.input,
    };

    const result = this.runtime.processCommand(
      command,
      payload.playerId,
      this.runtime.getCurrentStateID(),
      Date.now(),
      "player",
    );

    if (result.success) {
      this.history.push({
        moveType,
        playerId: payload.playerId,
        payload: payload.input,
        timestamp: Date.now(),
      });

      return {
        success: true,
        patches: result.patches,
      };
    }

    return {
      success: false,
      error: result.error,
    };
  }

  // =============================================================================
  // Game End
  // =============================================================================

  /**
   * Check if the game has ended
   */
  checkGameEnd(): GameEndResult | undefined {
    if (!this.runtime.hasGameEnded()) {
      return undefined;
    }

    const endResult = this.runtime.getGameEndResult();
    if (!endResult) {
      return undefined;
    }

    return {
      reason: endResult.reason,
      winner: endResult.winner,
      metadata: endResult.metadata,
    };
  }

  // =============================================================================
  // State Management
  // =============================================================================

  /**
   * Load state (for deserialization)
   */
  loadState(state: unknown): void {
    this.runtime.loadState(state as MatchState);
    // Reset history on load - we're starting from a known state
    this.history = [];
  }
}

// Re-export for convenience
export { createPlayerId };
export type { PlayerId };
