import {
  enablePatches,
  applyPatches as immerApplyPatches,
  type Patch,
  produce,
} from "immer";
import { FlowManager } from "../flow/flow-manager";
import type {
  GameDefinition,
  Player,
} from "../game-definition/game-definition";
import type { MoveContext } from "../moves/move-system";
import { SeededRNG } from "../rng/seeded-rng";
import type { PlayerId } from "../types/branded";

// Enable Immer patches for state tracking
enablePatches();

/**
 * RuleEngine Options
 *
 * Configuration options for RuleEngine initialization
 */
export type RuleEngineOptions = {
  /** Optional RNG seed for deterministic gameplay */
  seed?: string;
  /** Optional initial patches (for replay/restore) */
  initialPatches?: Patch[];
};

/**
 * Move Execution Result
 *
 * Result of executing a move through the engine
 */
export type MoveExecutionResult =
  | {
      success: true;
      patches: Patch[];
      inversePatches: Patch[];
    }
  | {
      success: false;
      error: string;
      errorCode?: string;
    };

/**
 * History Entry
 *
 * Record of a move execution for replay/undo
 */
export type HistoryEntry = {
  moveId: string;
  context: MoveContext;
  patches: Patch[];
  inversePatches: Patch[];
  timestamp: number;
};

/**
 * RuleEngine - Core game engine
 *
 * Task 11: Integrates all game systems:
 * - State management with Immer
 * - Move execution and validation
 * - Flow orchestration (turns/phases)
 * - History tracking (undo/redo)
 * - Patch generation (delta sync)
 * - RNG for determinism
 * - Player view filtering
 *
 * @example
 * ```typescript
 * const engine = new RuleEngine(gameDefinition, players);
 *
 * // Execute moves
 * const result = engine.executeMove('playCard', {
 *   playerId: 'p1',
 *   data: { cardId: 'card-123' }
 * });
 *
 * // Get player view
 * const playerState = engine.getPlayerView('p1');
 *
 * // Check game end
 * const gameEnd = engine.checkGameEnd();
 * ```
 */
export class RuleEngine<TState, TMoves extends Record<string, any>> {
  private currentState: TState;
  private readonly gameDefinition: GameDefinition<TState, TMoves>;
  private readonly rng: SeededRNG;
  private readonly history: HistoryEntry[] = [];
  private historyIndex = -1;
  private flowManager?: FlowManager<TState>;
  private readonly initialPlayers: Player[]; // Store for replay

  /**
   * Create a new RuleEngine instance
   *
   * Task 11.1, 11.2: Constructor with GameDefinition
   *
   * @param gameDefinition - Game definition with setup, moves, flow
   * @param players - Array of players for the game
   * @param options - Optional configuration (seed, patches)
   */
  constructor(
    gameDefinition: GameDefinition<TState, TMoves>,
    players: Player[],
    options?: RuleEngineOptions,
  ) {
    this.gameDefinition = gameDefinition;
    this.initialPlayers = players;

    // Initialize RNG with optional seed
    this.rng = new SeededRNG(options?.seed);

    // Call setup to create initial state
    this.currentState = gameDefinition.setup(players);

    // Initialize flow manager if flow definition exists
    if (gameDefinition.flow) {
      this.flowManager = new FlowManager(
        gameDefinition.flow,
        this.currentState,
      );
    }
  }

  /**
   * Get current game state
   *
   * Task 11.3, 11.4: getState method
   *
   * Returns immutable snapshot of current state.
   * Modifications to returned state do not affect engine.
   *
   * @returns Current game state (immutable)
   */
  getState(): TState {
    // Use structuredClone for deep cloning with better performance and type safety
    // than JSON serialization. Note: structuredClone preserves more types (Date, Map, Set, etc.)
    // but still creates a deep copy to ensure immutability
    return structuredClone(this.currentState);
  }

  /**
   * Get player-specific view of game state
   *
   * Task 11.5, 11.6: getPlayerView with filtering
   *
   * Applies playerView filter from GameDefinition to hide private information.
   * If no playerView function defined, returns full state.
   *
   * @param playerId - Player requesting the view
   * @returns Filtered state for this player
   */
  getPlayerView(playerId: string): TState {
    if (this.gameDefinition.playerView) {
      const filteredState = this.gameDefinition.playerView(
        this.currentState,
        playerId,
      );
      // Use structuredClone for deep cloning filtered state
      return structuredClone(filteredState);
    }

    // No filter defined, return full state
    return this.getState();
  }

  /**
   * Execute a move
   *
   * Task 11.7, 11.8, 11.9, 11.10: executeMove with validation
   * Task 11.25, 11.26: RNG integration in move context
   *
   * Validates and executes a move, updating game state.
   * Returns patches for network synchronization.
   *
   * Process:
   * 1. Validate move exists
   * 2. Add RNG to context
   * 3. Check move condition
   * 4. Execute reducer with Immer
   * 5. Capture patches
   * 6. Update history
   * 7. Check game end condition
   *
   * @param moveId - Name of move to execute
   * @param context - Move context (player, targets, data)
   * @returns Execution result with patches or error
   */
  executeMove(moveId: string, context: MoveContext): MoveExecutionResult {
    // Task 11.7: Validate move exists
    const moveDef = this.gameDefinition.moves[moveId as keyof TMoves];
    if (!moveDef) {
      return {
        success: false,
        error: `Move '${moveId}' not found`,
        errorCode: "MOVE_NOT_FOUND",
      };
    }

    // Task 11.25, 11.26: Add RNG to context for deterministic randomness
    const contextWithRNG: MoveContext = {
      ...context,
      rng: this.rng,
    };

    // Task 11.8: Check move condition
    if (
      moveDef.condition &&
      !moveDef.condition(this.currentState, contextWithRNG)
    ) {
      return {
        success: false,
        error: `Move '${moveId}' condition not met`,
        errorCode: "CONDITION_FAILED",
      };
    }

    // Task 11.9: Execute reducer with Immer and capture patches
    let patches: Patch[] = [];
    let inversePatches: Patch[] = [];

    try {
      this.currentState = produce(
        this.currentState,
        (draft) => {
          moveDef.reducer(draft, contextWithRNG);
        },
        (p, ip) => {
          patches = p;
          inversePatches = ip;
        },
      );

      // Update flow manager state if it exists
      // Note: Flow manager manages its own state copy for flow orchestration
      // We don't need to sync it back after every move
      // The flow manager will update state through its own lifecycle hooks

      // Task 11.10: Update history
      this.addToHistory({
        moveId,
        context,
        patches,
        inversePatches,
        timestamp: Date.now(),
      });

      return {
        success: true,
        patches,
        inversePatches,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Move execution failed",
        errorCode: "EXECUTION_ERROR",
      };
    }
  }

  /**
   * Check if a move can be executed
   *
   * Task 11.11, 11.12: canExecuteMove without side effects
   *
   * Validates move without actually executing it.
   * Used for UI state (enable/disable buttons) and AI move filtering.
   *
   * @param moveId - Name of move to check
   * @param context - Move context
   * @returns True if move can be executed, false otherwise
   */
  canExecuteMove(moveId: string, context: MoveContext): boolean {
    const moveDef = this.gameDefinition.moves[moveId as keyof TMoves];
    if (!moveDef) {
      return false;
    }

    // Add RNG to context
    const contextWithRNG: MoveContext = {
      ...context,
      rng: this.rng,
    };

    if (
      moveDef.condition &&
      !moveDef.condition(this.currentState, contextWithRNG)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get all valid moves for current state
   *
   * Task 11.13, 11.14: getValidMoves enumeration
   *
   * Framework hook that games can use to enumerate available moves.
   * Returns list of move IDs that pass their conditions.
   *
   * Note: This is a basic implementation. Games may want to override
   * this with more sophisticated move enumeration that includes
   * target enumeration, action combinations, etc.
   *
   * @param playerId - Player to get moves for
   * @returns Array of valid move IDs
   */
  getValidMoves(playerId: PlayerId): string[] {
    const validMoves: string[] = [];

    for (const moveId of Object.keys(this.gameDefinition.moves)) {
      const context: MoveContext = { playerId };

      if (this.canExecuteMove(moveId, context)) {
        validMoves.push(moveId);
      }
    }

    return validMoves;
  }

  /**
   * Check if game has ended
   *
   * Task 10.10: Evaluate endIf condition
   *
   * Checks game end condition from GameDefinition.
   * Should be called after each move execution.
   *
   * @returns Game end result if ended, undefined otherwise
   */
  checkGameEnd() {
    if (this.gameDefinition.endIf) {
      return this.gameDefinition.endIf(this.currentState);
    }
    return undefined;
  }

  /**
   * Get game history
   *
   * Task 11.17, 11.18: getHistory
   *
   * Returns full move history for replay and analysis.
   *
   * @returns Array of history entries
   */
  getHistory(): readonly HistoryEntry[] {
    return this.history;
  }

  /**
   * Get patches since a specific point
   *
   * Task 11.21, 11.22: getPatches
   *
   * Returns all patches accumulated since the given history index.
   * Used for incremental network synchronization.
   *
   * @param sinceIndex - History index to get patches from (default: 0)
   * @returns Array of patches
   */
  getPatches(sinceIndex = 0): Patch[] {
    const patches: Patch[] = [];

    for (let i = sinceIndex; i < this.history.length; i++) {
      const entry = this.history[i];
      if (entry) {
        patches.push(...entry.patches);
      }
    }

    return patches;
  }

  /**
   * Apply patches to state
   *
   * Task 11.23, 11.24: applyPatches for network sync
   *
   * Applies a set of patches from the server to update local state.
   * Used by clients to stay in sync with authoritative server state.
   *
   * @param patches - Patches to apply
   */
  applyPatches(patches: Patch[]): void {
    // Use Immer's built-in applyPatches for correct patch application
    // Type assertion is safe here because Immer patches preserve the type
    this.currentState = immerApplyPatches(
      this.currentState as object,
      patches,
    ) as TState;
  }

  /**
   * Undo last move
   *
   * Task 11.15, 11.16: Undo with inverse patches
   *
   * Reverts the last move using inverse patches.
   * Updates history index to enable redo.
   *
   * @returns True if undo succeeded, false if no moves to undo
   */
  undo(): boolean {
    if (this.historyIndex < 0) {
      return false;
    }

    const entry = this.history[this.historyIndex];
    if (!entry) {
      return false;
    }

    // Apply inverse patches to revert the move using Immer's applyPatches
    // Type assertion is safe here because Immer patches preserve the type
    this.currentState = immerApplyPatches(
      this.currentState as object,
      entry.inversePatches,
    ) as TState;

    this.historyIndex--;
    return true;
  }

  /**
   * Redo previously undone move
   *
   * Task 11.15, 11.16: Redo with forward patches
   *
   * Re-applies a move that was undone.
   *
   * @returns True if redo succeeded, false if no moves to redo
   */
  redo(): boolean {
    if (this.historyIndex >= this.history.length - 1) {
      return false;
    }

    const entry = this.history[this.historyIndex + 1];
    if (!entry) {
      return false;
    }

    // Apply forward patches to redo the move using Immer's applyPatches
    // Type assertion is safe here because Immer patches preserve the type
    this.currentState = immerApplyPatches(
      this.currentState as object,
      entry.patches,
    ) as TState;

    this.historyIndex++;
    return true;
  }

  /**
   * Replay game from history
   *
   * Task 11.19, 11.20: Replay with deterministic execution
   *
   * Replays the game from initial state using recorded history.
   * Useful for game analysis, bug reproduction, and verification.
   *
   * @param upToIndex - Optional index to replay up to (default: all)
   * @returns Final state after replay
   */
  replay(upToIndex?: number): TState {
    // Reset to initial state
    this.currentState = this.gameDefinition.setup(this.initialPlayers);

    // Reset RNG to initial seed for deterministic replay
    const originalSeed = this.rng.getSeed();
    this.rng.setSeed(originalSeed);

    const endIndex = upToIndex ?? this.history.length;

    for (let i = 0; i < endIndex; i++) {
      const entry = this.history[i];
      if (!entry) break;

      // Re-execute the move
      this.executeMove(entry.moveId, entry.context);
    }

    return this.getState();
  }

  /**
   * Get RNG instance
   *
   * Task 11.25, 11.26: RNG integration
   *
   * Provides access to the seeded RNG for deterministic random operations.
   * Games should use this RNG (not Math.random()) for all randomness.
   *
   * @returns Seeded RNG instance
   */
  getRNG(): SeededRNG {
    return this.rng;
  }

  /**
   * Get flow manager
   *
   * Task 11.27, 11.28: Flow integration
   *
   * Provides access to the flow orchestration system.
   * Returns undefined if no flow definition in GameDefinition.
   *
   * @returns FlowManager instance or undefined
   */
  getFlowManager(): FlowManager<TState> | undefined {
    return this.flowManager;
  }

  /**
   * Add entry to history
   *
   * Internal method to manage history tracking.
   * Truncates forward history when new move is made after undo.
   */
  private addToHistory(entry: HistoryEntry): void {
    // Truncate forward history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }

    this.history.push(entry);
    this.historyIndex = this.history.length - 1;
  }
}
