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
import type {
  ConditionFailure,
  MoveContext,
  MoveContextInput,
} from "../moves/move-system";
import type { CardRegistry } from "../operations/card-registry";
import { createCardRegistry } from "../operations/card-registry-impl";
import {
  createCardOperations,
  createGameOperations,
  createZoneOperations,
} from "../operations/operations-impl";
import { SeededRNG } from "../rng/seeded-rng";
import type { PlayerId } from "../types/branded";
import { createPlayerId } from "../types/branded-utils";
import type { InternalState } from "../types/state";
import { TrackerSystem } from "./tracker-system";

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
      errorCode: string;
      errorContext?: Record<string, unknown>;
    };

/**
 * History Entry
 *
 * Record of a move execution for replay/undo
 */
export type HistoryEntry<
  TParams = any,
  TCardMeta = any,
  TCardDefinition = any,
> = {
  moveId: string;
  context: MoveContext<TParams, TCardMeta, TCardDefinition>;
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
 * - Internal state management (zones/cards)
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
export class RuleEngine<
  TState,
  TMoves extends Record<string, any>,
  TCardDefinition = any,
  TCardMeta = any,
> {
  private currentState: TState;
  private readonly gameDefinition: GameDefinition<
    TState,
    TMoves,
    TCardDefinition,
    TCardMeta
  >;
  private readonly rng: SeededRNG;
  private readonly history: HistoryEntry<any, TCardMeta, TCardDefinition>[] =
    [];
  private historyIndex = -1;
  private flowManager?: FlowManager<TState, TCardMeta>;
  private readonly initialPlayers: Player[]; // Store for replay
  private internalState: InternalState<TCardDefinition, TCardMeta>;
  private readonly cardRegistry: CardRegistry<TCardDefinition>;
  private trackerSystem: TrackerSystem;
  private gameEnded = false;
  private gameEndResult?: {
    winner?: PlayerId;
    reason: string;
    metadata?: Record<string, unknown>;
  };

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
    gameDefinition: GameDefinition<TState, TMoves, TCardDefinition, TCardMeta>,
    players: Player[],
    options?: RuleEngineOptions,
  ) {
    // Enable Immer patches for state tracking
    enablePatches();

    this.gameDefinition = gameDefinition;
    this.initialPlayers = players;

    // Initialize RNG with optional seed
    this.rng = new SeededRNG(options?.seed);

    // Initialize card registry from game definition
    this.cardRegistry = createCardRegistry(gameDefinition.cards);

    // Initialize tracker system from game definition
    this.trackerSystem = new TrackerSystem(gameDefinition.trackers);

    // Initialize internal state with zones from game definition
    this.internalState = {
      zones: {},
      cards: {},
      cardMetas: {},
    };

    // Create zone instances from zone configs (if provided)
    if (gameDefinition.zones) {
      for (const zoneId in gameDefinition.zones) {
        const zoneConfig = gameDefinition.zones[zoneId];
        if (zoneConfig) {
          this.internalState.zones[zoneId] = {
            config: zoneConfig,
            cardIds: [],
          };
        }
      }
    }

    // Randomly select which player gets to choose who goes first
    // This follows TCG rules where one player is randomly designated to make the choice
    // (e.g., via coin flip, dice roll, or rock-paper-scissors)
    // IMPORTANT: This must happen BEFORE setup to ensure deterministic replay
    if (players.length > 0) {
      const randomIndex = Math.floor(this.rng.random() * players.length);
      const choosingPlayer = players[randomIndex];
      if (choosingPlayer) {
        this.internalState.choosingFirstPlayer = createPlayerId(
          choosingPlayer.id,
        );
      }
    }

    // Call setup to create initial state
    this.currentState = gameDefinition.setup(players);

    // Initialize flow manager if flow definition exists
    if (gameDefinition.flow) {
      // Create operations for flow manager
      const zoneOps = createZoneOperations(this.internalState);
      const cardOps = createCardOperations<TCardDefinition, TCardMeta>(
        this.internalState,
      );
      const gameOps = createGameOperations(this.internalState);

      this.flowManager = new FlowManager(
        gameDefinition.flow,
        this.currentState,
        {
          onTurnEnd: () => this.trackerSystem.resetTurn(),
          onPhaseEnd: (phaseName) => this.trackerSystem.resetPhase(phaseName),
          gameOperations: gameOps,
          zoneOperations: zoneOps,
          cardOperations: cardOps,
        },
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
   * Check if the game has ended
   *
   * @returns True if game has ended via endGame() call
   */
  hasGameEnded(): boolean {
    return this.gameEnded;
  }

  /**
   * Get the game end result
   *
   * @returns Game end result if game has ended, undefined otherwise
   */
  getGameEndResult():
    | {
        winner?: PlayerId;
        reason: string;
        metadata?: Record<string, unknown>;
      }
    | undefined {
    return this.gameEndResult;
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
   * @param context - Move context (player, typed params, targets)
   * @returns Execution result with patches or error
   */
  executeMove(
    moveId: string,
    contextInput: MoveContextInput<any>,
  ): MoveExecutionResult {
    // Task 11.7: Validate move exists
    const moveDef = this.gameDefinition.moves[moveId as keyof TMoves];
    if (!moveDef) {
      return {
        success: false,
        error: `Move '${moveId}' not found`,
        errorCode: "MOVE_NOT_FOUND",
      };
    }

    // Task 11.8: Check move condition with detailed failure information
    const conditionResult = this.checkMoveCondition(moveId, contextInput);
    if (!conditionResult.success) {
      return conditionResult;
    }

    // Check if game has already ended
    if (this.gameEnded) {
      return {
        success: false,
        error: "Game has already ended",
        errorCode: "GAME_ENDED",
      };
    }

    // Task 11.25, 11.26: Add RNG to context for deterministic randomness
    // Also add operations API for zone and card management
    const zoneOps = createZoneOperations(this.internalState);
    const cardOps = createCardOperations(this.internalState);
    const gameOps = createGameOperations(this.internalState);

    // Track pending flow transitions
    let pendingPhaseEnd = false;
    let pendingSegmentEnd = false;
    let pendingTurnEnd = false;

    // Inject flow state from FlowManager if available
    const flowState = this.flowManager
      ? {
          currentPhase: this.flowManager.getCurrentPhase(),
          currentSegment: this.flowManager.getCurrentSegment(),
          turn: this.flowManager.getTurnNumber(),
          currentPlayer: this.flowManager.getCurrentPlayer() as PlayerId,
          isFirstTurn: this.flowManager.isFirstTurn(),
          // Provide flow control methods (deferred until after move completes)
          endPhase: () => {
            pendingPhaseEnd = true;
          },
          endSegment: () => {
            pendingSegmentEnd = true;
          },
          endTurn: () => {
            pendingTurnEnd = true;
          },
          setCurrentPlayer: (playerId?: PlayerId) => {
            this.flowManager?.setCurrentPlayer(playerId);
          },
        }
      : undefined;

    // Create endGame function to allow moves to end the game
    const endGame = (result: {
      winner?: PlayerId;
      reason: string;
      metadata?: Record<string, unknown>;
    }) => {
      this.gameEnded = true;
      this.gameEndResult = result;
    };

    const contextWithOperations: MoveContext<any, TCardMeta, TCardDefinition> =
      {
        ...contextInput,
        rng: this.rng,
        zones: zoneOps,
        cards: cardOps,
        game: gameOps,
        registry: this.cardRegistry,
        flow: flowState,
        endGame,
        trackers: {
          check: (name, playerId) => this.trackerSystem.check(name, playerId),
          mark: (name, playerId) => this.trackerSystem.mark(name, playerId),
          unmark: (name, playerId) => this.trackerSystem.unmark(name, playerId),
        },
      };

    // Task 11.9: Execute reducer with Immer and capture patches
    let patches: Patch[] = [];
    let inversePatches: Patch[] = [];

    try {
      this.currentState = produce(
        this.currentState,
        (draft) => {
          moveDef.reducer(draft, contextWithOperations);
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

      // Task 11.10: Update history (store full context for replay)
      this.addToHistory({
        moveId,
        context: contextWithOperations,
        patches,
        inversePatches,
        timestamp: Date.now(),
      });

      // Execute any pending flow transitions after move completes
      if (this.flowManager) {
        if (pendingPhaseEnd) {
          this.flowManager.nextPhase();
        }
        if (pendingSegmentEnd) {
          this.flowManager.nextGameSegment();
        }
        if (pendingTurnEnd) {
          this.flowManager.nextTurn();
        }
      }

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
   * Build full move context with engine-provided services
   *
   * Centralizes context building logic used by condition checks and move execution.
   * Includes RNG, operations APIs, and flow state.
   *
   * @param contextInput - Base context from caller
   * @returns Full context with all engine services
   * @private
   */
  private buildMoveContext(
    contextInput: MoveContextInput<any>,
  ): MoveContext<any, TCardMeta, TCardDefinition> {
    const zoneOps = createZoneOperations(this.internalState);
    const cardOps = createCardOperations(this.internalState);
    const gameOps = createGameOperations(this.internalState);

    // Add flow state for condition checks
    const flowState = this.flowManager
      ? {
          currentPhase: this.flowManager.getCurrentPhase(),
          currentSegment: this.flowManager.getCurrentSegment(),
          turn: this.flowManager.getTurnNumber(),
          currentPlayer: this.flowManager.getCurrentPlayer() as PlayerId,
          isFirstTurn: this.flowManager.getTurnNumber() === 1,
          // Condition doesn't need control methods (endPhase, endSegment, endTurn)
          // as conditions should be side-effect free
          endPhase: () => {},
          endSegment: () => {},
          endTurn: () => {},
          setCurrentPlayer: () => {},
        }
      : undefined;

    return {
      ...contextInput,
      rng: this.rng,
      zones: zoneOps,
      cards: cardOps,
      game: gameOps,
      registry: this.cardRegistry,
      flow: flowState,
    };
  }

  /**
   * Check move condition and return detailed failure information
   *
   * Evaluates move condition and returns either success or detailed failure info.
   * Supports both legacy boolean conditions and new ConditionFailure returns.
   *
   * @param moveId - Name of move to check
   * @param contextInput - Move context with typed params
   * @returns Success indicator or detailed failure information
   * @private
   */
  private checkMoveCondition(
    moveId: string,
    contextInput: MoveContextInput<any>,
  ):
    | { success: true }
    | {
        success: false;
        error: string;
        errorCode: string;
        errorContext?: Record<string, unknown>;
      } {
    const moveDef = this.gameDefinition.moves[moveId as keyof TMoves];

    if (!(moveDef && moveDef.condition)) {
      return { success: true };
    }

    const contextWithOperations = this.buildMoveContext(contextInput);
    const result = moveDef.condition(this.currentState, contextWithOperations);

    if (result === true) {
      return { success: true };
    }

    if (result === false) {
      // Legacy boolean false - return generic error for backward compatibility
      return {
        success: false,
        error: `Move '${moveId}' condition not met`,
        errorCode: "CONDITION_FAILED",
      };
    }

    // Detailed ConditionFailure object (result must be ConditionFailure here)
    const failure = result as ConditionFailure; // TypeScript narrowing
    return {
      success: false,
      error: failure.reason,
      errorCode: failure.errorCode,
      errorContext: failure.context,
    };
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
   * @param context - Move context with typed params
   * @returns True if move can be executed, false otherwise
   */
  canExecuteMove(moveId: string, contextInput: MoveContextInput<any>): boolean {
    const moveDef = this.gameDefinition.moves[moveId as keyof TMoves];
    if (!moveDef) {
      return false;
    }

    // Build full context with engine-provided services
    const contextWithOperations = this.buildMoveContext(contextInput);

    if (!moveDef.condition) {
      return true;
    }

    const result = moveDef.condition(this.currentState, contextWithOperations);

    // Support both boolean and ConditionFailure returns
    return result === true;
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
      // Create a minimal context for validation (params will be empty object for moves requiring no params)
      const context: MoveContextInput<any> = {
        playerId,
        params: {}, // Empty params - moves with required params won't validate with empty context
      };

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
  getHistory(): readonly HistoryEntry<any, TCardMeta, TCardDefinition>[] {
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
    // Reset RNG to initial seed for deterministic replay
    const originalSeed = this.rng.getSeed();
    this.rng.setSeed(originalSeed);

    // Reset internal state (zones, cards, choosingFirstPlayer, etc.)
    this.internalState = {
      zones: {},
      cards: {},
      cardMetas: {},
    };

    // Recreate zones from game definition
    if (this.gameDefinition.zones) {
      for (const zoneId in this.gameDefinition.zones) {
        const zoneConfig = this.gameDefinition.zones[zoneId];
        if (zoneConfig) {
          this.internalState.zones[zoneId] = {
            config: zoneConfig,
            cardIds: [],
          };
        }
      }
    }

    // Randomly select which player gets to choose who goes first
    // This must match the original constructor behavior for deterministic replay
    if (this.initialPlayers.length > 0) {
      const randomIndex = Math.floor(
        this.rng.random() * this.initialPlayers.length,
      );
      const choosingPlayer = this.initialPlayers[randomIndex];
      if (choosingPlayer) {
        this.internalState.choosingFirstPlayer = createPlayerId(
          choosingPlayer.id,
        );
      }
    }

    // Reset to initial state
    this.currentState = this.gameDefinition.setup(this.initialPlayers);

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
