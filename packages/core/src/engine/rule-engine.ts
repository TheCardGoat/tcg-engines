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
import {
  type FormattedHistoryEntry,
  HistoryManager,
  type HistoryQueryOptions,
} from "../history";
import { createHistoryOperations } from "../history/history-operations";
import { Logger, type LoggerOptions } from "../logging";
import type {
  EnumeratedMove,
  MoveEnumerationOptions,
} from "../moves/move-enumeration";
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
import { TelemetryManager, type TelemetryOptions } from "../telemetry";
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
  /** Optional logger configuration for structured logging */
  logger?: LoggerOptions;
  /** Optional telemetry configuration for event tracking */
  telemetry?: TelemetryOptions;
  /** Optional player ID to designate as the choosing player (e.g., loser of previous game in best-of-three). If not provided, randomly selected. */
  choosingFirstPlayer?: string;
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
 * Replay History Entry
 *
 * Record of a move execution for replay/undo functionality.
 * Contains full context, patches, and inverse patches for deterministic replay.
 *
 * Note: For user-facing history with localization, use HistoryEntry from @tcg/core/history
 */
export type ReplayHistoryEntry<
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
  private readonly history: ReplayHistoryEntry<
    any,
    TCardMeta,
    TCardDefinition
  >[] = [];
  private historyIndex = -1;
  private readonly moveHistory: HistoryManager; // New move history system
  private flowManager?: FlowManager<TState, TCardMeta>;
  private readonly initialPlayers: Player[]; // Store for replay
  private readonly initialChoosingFirstPlayer?: string; // Store for replay
  private internalState: InternalState<TCardDefinition, TCardMeta>;
  private readonly cardRegistry: CardRegistry<TCardDefinition>;
  private trackerSystem: TrackerSystem;
  private readonly logger: Logger;
  private readonly telemetry: TelemetryManager;
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

    // Initialize logging and telemetry FIRST (before any other operations)
    this.logger = new Logger(options?.logger ?? { level: "SILENT" });
    this.telemetry = new TelemetryManager(
      options?.telemetry ?? { enabled: false },
    );

    this.gameDefinition = gameDefinition;
    this.initialPlayers = players;
    this.initialChoosingFirstPlayer = options?.choosingFirstPlayer;

    // Initialize RNG with optional seed
    this.rng = new SeededRNG(options?.seed);

    // Initialize move history manager
    this.moveHistory = new HistoryManager();

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

    // Set which player gets to choose who goes first
    // This follows TCG rules where one player is designated to make the choice
    // (e.g., via coin flip, dice roll, rock-paper-scissors, or loser of previous game)
    // IMPORTANT: This must happen BEFORE setup to ensure deterministic replay
    if (players.length > 0) {
      if (options?.choosingFirstPlayer) {
        // Use explicitly specified choosing player (e.g., loser of previous game in best-of-three)
        this.internalState.choosingFirstPlayer = createPlayerId(
          options.choosingFirstPlayer,
        );
      } else {
        // Randomly select if not specified
        const randomIndex = Math.floor(this.rng.random() * players.length);
        const choosingPlayer = players[randomIndex];
        if (choosingPlayer) {
          this.internalState.choosingFirstPlayer = createPlayerId(
            choosingPlayer.id,
          );
        }
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
          logger: this.logger.child("flow"),
          telemetry: this.telemetry,
        },
      );
    }

    // Register telemetry hooks from game definition
    if (gameDefinition.telemetryHooks) {
      if (gameDefinition.telemetryHooks.onPlayerAction) {
        this.telemetry.registerHook(
          "onPlayerAction",
          gameDefinition.telemetryHooks.onPlayerAction,
        );
      }
      if (gameDefinition.telemetryHooks.onStateChange) {
        this.telemetry.registerHook(
          "onStateChange",
          gameDefinition.telemetryHooks.onStateChange,
        );
      }
      if (gameDefinition.telemetryHooks.onRuleEvaluation) {
        this.telemetry.registerHook(
          "onRuleEvaluation",
          gameDefinition.telemetryHooks.onRuleEvaluation,
        );
      }
      if (gameDefinition.telemetryHooks.onFlowTransition) {
        this.telemetry.registerHook(
          "onFlowTransition",
          gameDefinition.telemetryHooks.onFlowTransition,
        );
      }
      if (gameDefinition.telemetryHooks.onEngineError) {
        this.telemetry.registerHook(
          "onEngineError",
          gameDefinition.telemetryHooks.onEngineError,
        );
      }
      if (gameDefinition.telemetryHooks.onPerformance) {
        this.telemetry.registerHook(
          "onPerformance",
          gameDefinition.telemetryHooks.onPerformance,
        );
      }
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
   * Get move history with player-aware filtering and verbosity levels
   *
   * Returns formatted history entries with player-specific visibility filtering
   * and message formatting based on requested verbosity level.
   *
   * @param options - Query options for filtering and formatting
   * @returns Array of formatted history entries
   *
   * @example
   * ```typescript
   * // Get all history for a specific player (casual verbosity)
   * const history = engine.getHistory({
   *   playerId: 'player_one',
   *   verbosity: 'CASUAL'
   * });
   *
   * // Get recent history (since timestamp)
   * const recentHistory = engine.getHistory({
   *   since: Date.now() - 60000 // Last minute
   * });
   *
   * // Get technical details for debugging
   * const debugHistory = engine.getHistory({
   *   verbosity: 'DEVELOPER'
   * });
   * ```
   */
  getHistory(options?: HistoryQueryOptions): FormattedHistoryEntry[] {
    return this.moveHistory.query(options ?? {});
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
    const startTime = Date.now();

    // Log move execution start (INFO level)
    this.logger.info(`Executing move: ${moveId}`, {
      moveId,
      playerId: contextInput.playerId,
      params: contextInput.params as Record<string, unknown>,
    });

    // Task 11.7: Validate move exists
    const moveDef = this.gameDefinition.moves[moveId as keyof TMoves];
    if (!moveDef) {
      const error = `Move '${moveId}' not found`;
      this.logger.error(error, { moveId });
      return {
        success: false,
        error,
        errorCode: "MOVE_NOT_FOUND",
      };
    }

    // Task 11.8: Check move condition with detailed failure information
    const conditionResult = this.checkMoveCondition(moveId, contextInput);
    if (!conditionResult.success) {
      // Type narrow to failure case
      const failure = conditionResult as {
        success: false;
        error: string;
        errorCode: string;
        errorContext?: Record<string, unknown>;
      };

      // Log condition failure (WARN level)
      this.logger.warn(`Move condition failed: ${moveId}`, {
        moveId,
        playerId: contextInput.playerId,
        error: failure.error,
        errorCode: failure.errorCode,
      });

      // Add history entry for failed move
      this.moveHistory.addEntry({
        moveId,
        playerId: contextInput.playerId,
        params: contextInput.params,
        timestamp: contextInput.timestamp ?? Date.now(),
        turn: this.flowManager?.getTurnNumber(),
        phase: this.flowManager?.getCurrentPhase(),
        segment: this.flowManager?.getCurrentSegment(),
        success: false,
        error: {
          code: failure.errorCode,
          message: failure.error,
          context: failure.errorContext,
        },
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: {
              key: `moves.${moveId}.failure`,
              values: {
                playerId: contextInput.playerId,
                error: failure.error,
              },
            },
            advanced: {
              key: `moves.${moveId}.failure.detailed`,
              values: {
                playerId: contextInput.playerId,
                error: failure.error,
                errorCode: failure.errorCode,
              },
            },
          },
        },
      });

      // Emit telemetry event for failed move
      this.telemetry.emitEvent({
        type: "playerAction",
        moveId,
        playerId: contextInput.playerId,
        params: contextInput.params,
        result: "failure",
        error: failure.error,
        errorCode: failure.errorCode,
        duration: Date.now() - startTime,
        timestamp: startTime,
      });

      return failure;
    }

    // Check if game has already ended
    if (this.gameEnded) {
      const error = "Game has already ended";
      this.logger.warn(error, { moveId });
      return {
        success: false,
        error,
        errorCode: "GAME_ENDED",
      };
    }

    // Task 11.25, 11.26: Add RNG to context for deterministic randomness
    // Also add operations API for zone and card management
    const zoneOps = createZoneOperations(
      this.internalState,
      this.logger.child("zones"),
    );
    const cardOps = createCardOperations(
      this.internalState,
      this.logger.child("cards"),
    );
    const gameOps = createGameOperations(
      this.internalState,
      this.logger.child("game"),
    );

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

    // Create history operations for this move
    const historyOps = createHistoryOperations(this.moveHistory, {
      moveId,
      playerId: contextInput.playerId,
      params: contextInput.params,
      timestamp: contextInput.timestamp ?? Date.now(),
      turn: flowState?.turn,
      phase: flowState?.currentPhase,
      segment: flowState?.currentSegment,
    });

    const contextWithOperations: MoveContext<any, TCardMeta, TCardDefinition> =
      {
        ...contextInput,
        rng: this.rng,
        zones: zoneOps,
        cards: cardOps,
        game: gameOps,
        history: historyOps,
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

      // Add automatic base history entry for successful move
      this.moveHistory.addEntry({
        moveId,
        playerId: contextInput.playerId,
        params: contextInput.params,
        timestamp: contextInput.timestamp ?? Date.now(),
        turn: flowState?.turn,
        phase: flowState?.currentPhase,
        segment: flowState?.currentSegment,
        success: true,
        messages: {
          visibility: "PUBLIC",
          messages: {
            casual: {
              key: `moves.${moveId}.success`,
              values: {
                playerId: contextInput.playerId,
                params: contextInput.params,
              },
            },
          },
        },
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

      // Log successful completion (DEBUG level)
      const duration = Date.now() - startTime;
      this.logger.debug(`Move completed: ${moveId}`, {
        moveId,
        playerId: contextInput.playerId,
        duration,
        patchCount: patches.length,
      });

      // Emit telemetry events for successful move
      this.telemetry.emitEvent({
        type: "playerAction",
        moveId,
        playerId: contextInput.playerId,
        params: contextInput.params,
        result: "success",
        duration,
        timestamp: startTime,
      });

      this.telemetry.emitEvent({
        type: "stateChange",
        patches,
        inversePatches,
        moveId,
        timestamp: Date.now(),
      });

      return {
        success: true,
        patches,
        inversePatches,
      };
    } catch (error) {
      // Log error (ERROR level)
      const errorMessage =
        error instanceof Error ? error.message : "Move execution failed";
      this.logger.error(`Move execution error: ${moveId}`, {
        moveId,
        playerId: contextInput.playerId,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Emit telemetry error event
      this.telemetry.emitEvent({
        type: "engineError",
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        context: {
          moveId,
          playerId: contextInput.playerId,
          params: contextInput.params,
        },
        moveId,
        playerId: contextInput.playerId,
        timestamp: Date.now(),
      });

      return {
        success: false,
        error: errorMessage,
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
    const zoneOps = createZoneOperations(
      this.internalState,
      this.logger.child("zones"),
    );
    const cardOps = createCardOperations(
      this.internalState,
      this.logger.child("cards"),
    );
    const gameOps = createGameOperations(
      this.internalState,
      this.logger.child("game"),
    );

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

    // Create dummy history operations (conditions should be side-effect free)
    const dummyHistoryOps = {
      log: () => {
        // No-op: conditions shouldn't add history entries
      },
    };

    return {
      ...contextInput,
      rng: this.rng,
      zones: zoneOps,
      cards: cardOps,
      game: gameOps,
      history: dummyHistoryOps,
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

    // Log condition evaluation (DEBUG level)
    this.logger.debug(`Evaluating move condition: ${moveId}`, {
      moveId,
      playerId: contextInput.playerId,
    });

    const contextWithOperations = this.buildMoveContext(contextInput);
    const result = moveDef.condition(this.currentState, contextWithOperations);

    if (result === true) {
      // Log success (TRACE level)
      this.logger.trace(`Condition passed: ${moveId}`, { moveId });
      return { success: true };
    }

    if (result === false) {
      // Legacy boolean false - return generic error for backward compatibility
      this.logger.debug(`Condition failed: ${moveId}`, {
        moveId,
        reason: "Condition returned false",
      });
      return {
        success: false,
        error: `Move '${moveId}' condition not met`,
        errorCode: "CONDITION_FAILED",
      };
    }

    // Detailed ConditionFailure object (result must be ConditionFailure here)
    const failure = result as ConditionFailure; // TypeScript narrowing
    this.logger.debug(`Condition failed: ${moveId}`, {
      moveId,
      reason: failure.reason,
      errorCode: failure.errorCode,
    });
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
   * Note: This is a basic implementation. Games may want to use
   * enumerateMoves() for more sophisticated enumeration that includes
   * parameter combinations and full validation.
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
   * Enumerate all valid moves with parameters
   *
   * Discovers all possible moves for a given player by invoking
   * each move's enumerator function (if provided). Each enumerated
   * parameter set is then validated against the move's condition.
   *
   * This is the primary API for AI agents and UI components to discover
   * available actions at any game state.
   *
   * @param playerId - Player to enumerate moves for
   * @param options - Optional configuration for enumeration
   * @returns Array of enumerated moves with parameters
   *
   * @example
   * ```typescript
   * // Get all valid moves with parameters
   * const moves = engine.enumerateMoves(playerId, {
   *   validOnly: true,  // Only return moves that pass condition
   *   includeMetadata: true
   * });
   *
   * for (const move of moves) {
   *   console.log(`${move.moveId}:`, move.params);
   *   if (move.isValid) {
   *     // Can execute this move
   *     engine.executeMove(move.moveId, {
   *       playerId: move.playerId,
   *       params: move.params,
   *       targets: move.targets
   *     });
   *   }
   * }
   *
   * // Enumerate specific moves only
   * const attackMoves = engine.enumerateMoves(playerId, {
   *   moveIds: ['attack', 'special-attack'],
   *   validOnly: true
   * });
   * ```
   */
  enumerateMoves(
    playerId: PlayerId,
    options?: MoveEnumerationOptions,
  ): EnumeratedMove<unknown>[] {
    const results: EnumeratedMove<unknown>[] = [];
    const validOnly = options?.validOnly ?? false;
    const includeMetadata = options?.includeMetadata ?? false;
    const moveIdsFilter = options?.moveIds;
    const maxPerMove = options?.maxPerMove;

    // Log enumeration start (DEBUG level)
    this.logger.debug("Enumerating moves", {
      playerId,
      validOnly,
      includeMetadata,
      moveIdsFilter,
    });

    // Build enumeration context (similar to move execution context)
    const context = this.buildEnumerationContext(playerId);

    // Iterate through all moves
    for (const [moveId, moveDef] of Object.entries(this.gameDefinition.moves)) {
      // Filter by moveIds if specified
      if (moveIdsFilter && !moveIdsFilter.includes(moveId)) {
        continue;
      }

      // If move has no enumerator, add a placeholder result
      if (!moveDef.enumerator) {
        if (!validOnly) {
          results.push({
            moveId,
            playerId,
            params: {} as any,
            isValid: false,
            validationError: {
              reason: "Move requires parameters but no enumerator provided",
              errorCode: "NO_ENUMERATOR",
            },
          });
        }
        continue;
      }

      try {
        // Invoke enumerator to get parameter combinations
        const paramCombinations = moveDef.enumerator(
          this.currentState,
          context,
        );

        // Limit results per move if specified
        const limitedCombinations = maxPerMove
          ? paramCombinations.slice(0, maxPerMove)
          : paramCombinations;

        // Log parameter combinations (TRACE level)
        this.logger.trace(
          `Enumerated ${limitedCombinations.length} parameter combinations for ${moveId}`,
          {
            moveId,
            count: limitedCombinations.length,
          },
        );

        // Validate each parameter combination
        for (const params of limitedCombinations) {
          const contextInput: MoveContextInput<any> = {
            playerId,
            params,
          };

          // Check if this move is valid
          const conditionResult = this.checkMoveCondition(moveId, contextInput);

          const enumeratedMove: import("../moves/move-enumeration").EnumeratedMove<any> =
            {
              moveId,
              playerId,
              params,
              isValid: conditionResult.success,
            };

          // Add validation error if failed
          if (!conditionResult.success) {
            enumeratedMove.validationError = {
              reason: conditionResult.error,
              errorCode: conditionResult.errorCode,
              context: conditionResult.errorContext,
            };
          }

          // Add metadata if requested
          if (includeMetadata && moveDef.metadata) {
            enumeratedMove.metadata = moveDef.metadata;
          }

          // Add to results (filter by validOnly)
          if (!validOnly || enumeratedMove.isValid) {
            results.push(enumeratedMove);
          }
        }
      } catch (error) {
        // Log enumerator error (ERROR level)
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Enumerator function threw an error";
        this.logger.error(`Enumerator error for move: ${moveId}`, {
          moveId,
          error: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Add error result if not validOnly
        if (!validOnly) {
          results.push({
            moveId,
            playerId,
            params: {} as any,
            isValid: false,
            validationError: {
              reason: `Enumerator failed: ${errorMessage}`,
              errorCode: "ENUMERATOR_ERROR",
              context: { error: errorMessage },
            },
          });
        }
      }
    }

    // Log completion (DEBUG level)
    this.logger.debug(`Enumeration complete: ${results.length} moves found`, {
      playerId,
      count: results.length,
      validCount: results.filter((m) => m.isValid).length,
    });

    return results;
  }

  /**
   * Build enumeration context for move enumerators
   *
   * Creates a context with all necessary operations for parameter discovery.
   * Similar to buildMoveContext but focused on enumeration needs.
   *
   * @param playerId - Player to enumerate for
   * @returns Enumeration context
   * @private
   */
  private buildEnumerationContext(
    playerId: PlayerId,
  ): import("../moves/move-enumeration").MoveEnumerationContext<
    TCardMeta,
    TCardDefinition
  > {
    const zoneOps = createZoneOperations(
      this.internalState,
      this.logger.child("zones"),
    );
    const cardOps = createCardOperations(
      this.internalState,
      this.logger.child("cards"),
    );
    const gameOps = createGameOperations(
      this.internalState,
      this.logger.child("game"),
    );

    // Add flow state if available
    const flowState = this.flowManager
      ? {
          currentPhase: this.flowManager.getCurrentPhase(),
          currentSegment: this.flowManager.getCurrentSegment(),
          turn: this.flowManager.getTurnNumber(),
          currentPlayer: this.flowManager.getCurrentPlayer() as PlayerId,
          isFirstTurn: this.flowManager.isFirstTurn(),
        }
      : undefined;

    return {
      playerId,
      zones: zoneOps,
      cards: cardOps,
      game: gameOps,
      registry: this.cardRegistry,
      flow: flowState,
      rng: this.rng,
    };
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
   * Get game history for replay and undo
   *
   * Task 11.17, 11.18: getReplayHistory
   *
   * Returns full move history with context for replay and undo features.
   * Contains complete move context, patches, and inverse patches for deterministic replay.
   *
   * **Breaking Change**: This method was previously named `getHistory()`.
   *
   * **Migration Guide**:
   * - For replay/undo functionality: Use `getReplayHistory()` (this method)
   * - For user-facing history display: Use `getHistory()` with query options
   *
   * @example
   * ```typescript
   * // Before (old API):
   * const history = engine.getHistory();
   *
   * // After (new API):
   * // For replay/undo:
   * const replayHistory = engine.getReplayHistory();
   *
   * // For UI display:
   * const displayHistory = engine.getHistory({
   *   playerId: 'player_one',
   *   verbosity: 'CASUAL',
   *   includeFailures: false
   * });
   * ```
   *
   * @returns Array of history entries with full context, patches, and inverse patches
   */
  getReplayHistory(): readonly ReplayHistoryEntry<
    any,
    TCardMeta,
    TCardDefinition
  >[] {
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

    // Set which player gets to choose who goes first
    // This must match the original constructor behavior for deterministic replay
    if (this.initialPlayers.length > 0) {
      if (this.initialChoosingFirstPlayer) {
        // Use explicitly specified choosing player (stored from initial options)
        this.internalState.choosingFirstPlayer = createPlayerId(
          this.initialChoosingFirstPlayer,
        );
      } else {
        // Randomly select if not specified (must match constructor)
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
   * Get logger instance
   *
   * Provides access to the engine's logger for custom logging.
   * Useful for game-specific logging or debugging.
   *
   * @returns Logger instance
   *
   * @example
   * ```typescript
   * const engine = new RuleEngine(gameDefinition, players, {
   *   logger: { level: 'DEVELOPER', pretty: true }
   * });
   *
   * const logger = engine.getLogger();
   * logger.info('Custom game event', { eventId: 'custom-123' });
   * ```
   */
  getLogger(): Logger {
    return this.logger;
  }

  /**
   * Get telemetry manager instance
   *
   * Provides access to the telemetry system for custom event tracking.
   * Useful for analytics, monitoring, and debugging integrations.
   *
   * @returns TelemetryManager instance
   *
   * @example
   * ```typescript
   * const engine = new RuleEngine(gameDefinition, players, {
   *   telemetry: { enabled: true }
   * });
   *
   * const telemetry = engine.getTelemetry();
   * telemetry.on('playerAction', (event) => {
   *   analytics.track('game.move', event);
   * });
   * ```
   */
  getTelemetry(): TelemetryManager {
    return this.telemetry;
  }

  /**
   * Add entry to history
   *
   * Internal method to manage history tracking.
   * Truncates forward history when new move is made after undo.
   */
  private addToHistory(entry: ReplayHistoryEntry): void {
    // Truncate forward history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }

    this.history.push(entry);
    this.historyIndex = this.history.length - 1;
  }
}
