import { logger } from "../../../shared/logger";
import { LogLevel } from "../../types/log-types";
import { LogCollector } from "../../utils/log-collector";
import type { CardRepository } from "../card/card-repository-factory";
import type { CoreCardInstance } from "../card/core-card-instance";
import { CoreCardInstanceStore } from "../card/core-card-instance-store";
import type { AnyEngineError } from "../errors/engine-errors";
import {
  EngineInitializationError,
  InvalidMoveError,
  MoveExecutionError,
  MoveRejectedError,
  UnknownMoveError,
} from "../errors/engine-errors";
import type { FlowManager } from "../flow/flow-manager";
import { createFlowManager } from "../flow/flow-manager";
import { initializeGame } from "../game/game";
import type {
  CoreEngineState,
  GameDefinition,
  GameRuntime,
  PlayerID,
  SyncInfo,
} from "../game-configuration";
import {
  MoveEnumerationService,
  type MoveProvider,
} from "../move/move-enumeration-service";
import { MoveProcessor } from "../move/move-processor";
import type { InvalidMoveResult, Move } from "../move/move-types";
import type { CoreCtx } from "../state/context";
import {
  getCurrentPriorityPlayer,
  getCurrentTurnPlayer,
} from "../state/context";
import { GameStateStore } from "../state/state-store";
import type { GameCards } from "../types";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "../types/game-specific-types";
import type { Result } from "../types/result";
import { Result as ResultHelpers } from "../types/result";
import { CoreOperation } from "./core-operation";
import { getFilterPlayerView } from "./filter-player-view";
import { Zone } from "./zone-operation";

export interface CoreEngineOpts<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardModel extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> {
  game: GameDefinition<GameState>;
  matchID?: string;
  gameID?: string;
  playerID?: PlayerID;
  initialState?: GameState;
  initialCoreCtx?: CoreCtx;
  players?: string[];
  cards: GameCards;
  debug?: boolean;
  seed?: string;
  repository: CardRepository<CardDefinition>;
  logCollector?: LogCollector;
}

export type ClientState<
  GameState extends GameSpecificGameState = DefaultGameState,
> =
  | null
  | (CoreEngineState<GameState> & {
      isActive: boolean;
      isConnected: boolean;
    });

/**
 * Enhanced Core Engine with Generic Type Support
 *
 * Provides complete type safety for game-specific implementations while
 * maintaining backward compatibility with existing code.
 *
 * Generic Parameters:
 * - GameState: Game-specific state structure
 * - CardDefinition: Game-specific card definition type
 * - PlayerState: Game-specific player state structure
 * - CardFilter: Game-specific card filtering capabilities
 */
export class CoreEngine<
  GameState extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition,
  PlayerState extends GameSpecificPlayerState,
  CardFilter extends GameSpecificCardFilter,
  CardInstance extends CoreCardInstance<CardDefinition>,
> {
  private readonly debug?: boolean;
  private readonly filterPlayerView: ReturnType<typeof getFilterPlayerView>;
  private readonly gameRuntime: GameRuntime<GameState>;

  private subscribers: Array<(state: ClientState<GameState>) => void> = [];
  private gameStateStore: GameStateStore<GameState, PlayerState>;
  private moveProcessor: MoveProcessor<GameState>;
  private flowManager: FlowManager<GameState>;
  private moveEnumerationService: MoveEnumerationService<GameState>;
  private logCollector: LogCollector;

  // Generic storage for player cards and card models
  public cardInstanceStore: CoreCardInstanceStore<CardDefinition>;

  private authoritativeEngine?: CoreEngine<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  >;
  private clientEngines: Record<
    PlayerID,
    CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardInstance>
  > = {};
  private isAuthoritative = false;

  matchID: string;
  gameID: string;
  public readonly playerID: PlayerID | null;

  constructor({
    game,
    matchID,
    playerID,
    initialState,
    cards,
    players,
    debug,
    seed,
    repository,
    initialCoreCtx,
    logCollector,
  }: CoreEngineOpts<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  >) {
    this.playerID = playerID || null;
    this.matchID = matchID || "default-match";
    this.gameID = "default-game";
    this.debug = debug;
    this.logCollector = logCollector || new LogCollector();

    this.filterPlayerView = getFilterPlayerView(game);
    const { processedGame, initialState: init } = initializeGame<
      GameState,
      PlayerState
    >({
      game,
      initialState,
      initialCoreCtx,
      cards,
      players,
      seed,
      engine: this,
      logCollector: this.logCollector,
    });

    this.gameRuntime = processedGame;
    this.gameStateStore = new GameStateStore<GameState, PlayerState>({
      initialState: init,
    });

    // Initialize card instance store early so it's available to other components
    this.cardInstanceStore = new CoreCardInstanceStore({
      repository,
      engine: this,
      playerCardsIds: cards,
    });

    // Create move processor with reference to this engine
    this.moveProcessor = new MoveProcessor<GameState>(this, this.logCollector);

    // Create flow manager with reference to this engine
    this.flowManager = createFlowManager<GameState>(
      processedGame,
      this,
      this.logCollector,
    );

    // Initialize move enumeration service
    this.moveEnumerationService = new MoveEnumerationService<GameState>(
      this as unknown as MoveProvider<GameState>,
      this.logCollector,
    );

    // Automatically process initial flow transitions to initialize segments and phases
    const initialStateWithFlow = this.flowManager.processFlowTransitions(init);
    if (initialStateWithFlow !== init) {
      this.gameStateStore.updateState({
        newState: initialStateWithFlow as CoreEngineState<
          GameState,
          PlayerState
        >,
      });
    }

    // Initialize card models
    this.initializeCardModels();
  }

  protected log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
  ) {
    this.logCollector.log(level, message, data);
  }

  processMove(
    playerID: string,
    moveType: string,
    args: unknown[],
  ): Result<
    { state: CoreEngineState<GameState, PlayerState>; logs: any[] },
    AnyEngineError
  > {
    const logCollector = new LogCollector();
    logCollector.log(
      LogLevel.DEVELOPER,
      `[${playerID}]: making move ${moveType} ${JSON.stringify(args)}`,
    );
    try {
      // Find the move function
      const move = this.getMove(this.getCtx(), moveType, playerID);

      if (!move) {
        logCollector.log(LogLevel.DEVELOPER, `Unknown move: ${moveType}`);
        return ResultHelpers.error(
          new UnknownMoveError(moveType, Object.keys(this.gameRuntime.moves)),
        );
      }

      // Check if player is allowed to move
      if (!this.canPlayerMove(playerID)) {
        return ResultHelpers.error(
          new MoveRejectedError(
            moveType,
            playerID,
            "Player cannot move at this time",
          ),
        );
      }

      const processResult = this.moveProcessor.executeMove(
        this.gameStateStore.state,
        playerID,
        moveType,
        move,
        logCollector,
        ...args,
      );

      if (processResult.error) {
        logCollector.log(LogLevel.DEVELOPER, processResult.error.toString());
        return {
          success: false,
          error: this.convertInvalidMoveResultToError(
            processResult.error,
            moveType,
            playerID,
          ),
        };
      }

      const newState = processResult.state;
      if (!newState) {
        return ResultHelpers.error(
          new MoveExecutionError(
            moveType,
            playerID,
            "Move execution returned undefined state",
          ),
        );
      }

      const finalState = this.flowManager.processFlowTransitions({
        ...this.gameStateStore.state,
        G: newState,
      });
      this.gameStateStore.updateState({
        newState: finalState as CoreEngineState<GameState, PlayerState>,
      });

      return ResultHelpers.ok({
        state: finalState as CoreEngineState<GameState, PlayerState>,
        logs: logCollector.getEntries(),
      });
    } catch (error) {
      logCollector.log(
        LogLevel.DEVELOPER,
        `Unexpected error processing move: ${error}`,
      );
      return ResultHelpers.error(
        new MoveExecutionError(
          moveType,
          playerID,
          error instanceof Error ? error.message : String(error),
        ),
      );
    }
  }

  makeMove(
    playerID: string,
    moveType: string,
    ...args: unknown[]
  ): Result<
    { state: CoreEngineState<GameState, PlayerState>; logs: any[] },
    AnyEngineError
  > {
    // If this is a client engine, delegate to authoritative engine if available
    if (this.authoritativeEngine) {
      this.authoritativeEngine.receiveFromClient(playerID, {
        ...this.gameStateStore.state,
        _stateID: this.gameStateStore.state._stateID + 1,
      });
      return ResultHelpers.ok({
        state: this.gameStateStore.state,
        logs: [],
      });
    }

    const logCollector = new LogCollector();

    try {
      logCollector.log(
        LogLevel.DEVELOPER,
        `Processing move: ${moveType} for player: ${playerID}`,
      );

      // Check if player is allowed to move
      if (!this.canPlayerMove(playerID)) {
        return ResultHelpers.error(
          new MoveRejectedError(
            moveType,
            playerID,
            "Player cannot move at this time",
          ),
        );
      }

      // Find the move function
      const move = this.getMove(this.getCtx(), moveType, playerID);

      if (!move) {
        logCollector.log(LogLevel.DEVELOPER, `Unknown move: ${moveType}`);
        return ResultHelpers.error(
          new UnknownMoveError(moveType, Object.keys(this.gameRuntime.moves)),
        );
      }

      // Execute the move directly with the move processor
      const processResult = this.moveProcessor.executeMove(
        this.gameStateStore.state,
        playerID,
        moveType,
        move,
        logCollector,
        ...args,
      );

      if (processResult.error) {
        logCollector.log(LogLevel.DEVELOPER, processResult.error.toString());
        return {
          success: false,
          error: this.convertInvalidMoveResultToError(
            processResult.error,
            moveType,
            playerID,
          ),
        };
      }

      const newState = processResult.state;
      if (!newState) {
        return ResultHelpers.error(
          new MoveExecutionError(
            moveType,
            playerID,
            "Move execution returned undefined state",
          ),
        );
      }

      const finalState = this.flowManager.processFlowTransitions({
        ...this.gameStateStore.state,
        G: newState,
      });
      this.gameStateStore.updateState({
        newState: finalState as CoreEngineState<GameState, PlayerState>,
      });

      return ResultHelpers.ok({
        state: finalState as CoreEngineState<GameState, PlayerState>,
        logs: logCollector.getEntries(),
      });
    } catch (error) {
      logCollector.log(
        LogLevel.DEVELOPER,
        `Unexpected error processing move: ${error}`,
      );
      return ResultHelpers.error(
        new MoveExecutionError(
          moveType,
          playerID,
          error instanceof Error ? error.message : String(error),
        ),
      );
    }
  }

  private canPlayerMove(playerID: string): boolean {
    // Check if game is over
    if (this.isGameOver()) {
      return false;
    }

    // Use FlowManager to check if player can act (handles allowAnyPlayerToAct)
    const currentState = this.getGameState();
    return this.flowManager.canPlayerAct(currentState, playerID);
  }

  private updateState(newState: CoreEngineState<GameState, PlayerState>): void {
    this.gameStateStore.updateState({ newState });
  }

  private notifySubscribers(): void {
    const clientState = this.getState();
    for (const callback of this.subscribers) {
      callback(clientState);
    }
  }

  // Authoritative engine pattern methods
  setAuthoritativeEngine(
    authEngine: CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardInstance
    >,
  ): void {
    this.authoritativeEngine = authEngine;
    if (this.playerID) {
      authEngine.registerClientEngine(this.playerID, this);
    }
  }

  private registerClientEngine(
    playerID: PlayerID,
    engine: CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardInstance
    >,
  ): void {
    this.clientEngines[playerID] = engine;
    this.isAuthoritative = true;
  }

  private receiveFromClient(
    _playerID: PlayerID,
    state: CoreEngineState<GameState, PlayerState>,
  ): void {
    const hashBefore = this.gameStateStore.stateHash;
    this.updateState(state);
    const hashAfter = this.gameStateStore.stateHash;

    this.logCollector.log(
      LogLevel.DEVELOPER,
      `Authoritative engine received state from client ${_playerID}, hash: ${hashBefore} -> ${hashAfter}`,
    );

    if (hashBefore !== hashAfter) {
      this.broadcastToClients(state);
    }
  }

  private broadcastToClients(state: CoreEngineState<GameState>): void {
    Object.entries(this.clientEngines).forEach(([playerID, engine]) => {
      const filteredState = this.filterPlayerView(playerID, {
        type: "update",
        args: [this.matchID, state],
      });
      engine.receiveFromAuthoritative(
        filteredState.args[1] as CoreEngineState<GameState, PlayerState>,
      );
    });
  }

  private receiveFromAuthoritative(
    state: CoreEngineState<GameState, PlayerState>,
  ): void {
    const currentState = this.gameStateStore.getState();

    if (state._stateID >= currentState._stateID) {
      this.gameStateStore.updateState({
        newState: state,
      });

      this.notifySubscribers();
    }
  }

  // Public API
  subscribe(callback: (state: ClientState<GameState>) => void): () => void {
    this.subscribers.push(callback);
    // Immediately call with current state
    callback(this.getState());

    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /** Get game context (turns, phases, players) */
  getCtx(): CoreCtx<PlayerState> {
    return this.getGameState()?.ctx as CoreCtx<PlayerState>;
  }

  /** Get number of turns played */
  getNumTurns() {
    return this.getCtx().numTurns;
  }

  /** Get number of moves made */
  getNumMoves() {
    return this.getCtx().numMoves;
  }

  /** Get current game segment (startingAGame, duringGame, etc.) */
  getGameSegment() {
    return this.getCtx().currentSegment;
  }

  /** Get current game phase within segment */
  getGamePhase() {
    return this.getCtx().currentPhase;
  }

  getGameStep() {
    return this.getCtx().currentStep;
  }

  /**
   * Get players with current priority
   * @returns Array of player IDs who have priority
   */
  getPriorityPlayers() {
    const ctx = this.getCtx();
    const priorityPlayer = getCurrentPriorityPlayer(ctx);
    return priorityPlayer ? [priorityPlayer] : [];
  }

  /**
   * Get current turn player
   * @returns ID of the current turn player
   */
  getTurnPlayer() {
    const ctx = this.getCtx();

    // If we have a first player set and we're in the starting phase, return the first player
    if (ctx?.otp && ctx?.currentSegment === "startingAGame") {
      return ctx.otp;
    }

    // For duringGame segment, use the current turn player from context
    if (ctx?.turnPlayerPos !== undefined) {
      return ctx.playerOrder[ctx.turnPlayerPos];
    }

    // Default to first player if available
    return ctx?.otp || ctx?.playerOrder[0] || "";
  }

  getState(): ClientState<GameState> {
    const currentState = this.gameStateStore.getState();
    if (!currentState) {
      return null;
    }

    // Determine if player is active
    let isActive = true;
    if (this.playerID) {
      const priorityPlayer = getCurrentPriorityPlayer(currentState.ctx);
      isActive = priorityPlayer === this.playerID;
    }

    if (currentState.ctx.gameOver !== undefined) {
      isActive = false;
    }

    // Apply player view filtering for multiplayer
    let viewState = currentState;
    if (this.playerID && (this.authoritativeEngine || this.isAuthoritative)) {
      viewState = {
        ...currentState,
        G: this.gameRuntime.playerView({
          G: currentState.G,
          ctx: currentState.ctx,
          playerID: this.playerID,
        }) as GameState,
      };
    }

    return {
      ...viewState,
      isActive,
      isConnected: true, // Always connected for simplified engine
    };
  }

  // Utility methods
  getCurrentPlayer(): PlayerID | null {
    return getCurrentPriorityPlayer(this.gameStateStore.getState().ctx);
  }

  getGameState(): CoreEngineState<GameState, PlayerState> {
    return this.gameStateStore.getState();
  }

  getGameStateHash() {
    return this.gameStateStore.stateHash;
  }

  isGameOver(): boolean {
    return this.gameStateStore.getState().ctx.gameOver !== undefined;
  }

  hasPlayerMulliganed(playerID: PlayerID): boolean {
    const pendingMulligan = this.gameStateStore.getState().ctx.pendingMulligan;
    if (!pendingMulligan) {
      return true;
    }

    return !pendingMulligan.has(playerID);
  }

  getAllCards() {
    return this.cardInstanceStore.getAllCards();
  }

  queryAllCards() {
    return this.cardInstanceStore.getAllCards();
  }

  /**
   * Type-safe card filtering with game-specific properties
   *
   * @param filter - Type-safe filter object with game-specific properties
   * @returns Array of matching card instances
   */
  queryCardsByFilter(filter: CardFilter) {
    return this.cardInstanceStore.queryCards(filter);
  }

  /**
   * Gets the owner of a card by instance ID
   * @param instanceId The instance ID of the card
   * @returns The player ID who owns the card, or undefined if not found
   */
  getCardOwner(instanceId: string): string | undefined {
    return this.cardInstanceStore.getCardOwner(instanceId);
  }

  /**
   * Gets the zone of a card by instance ID
   * @param instanceId The instance ID of the card
   * @returns The zone name where the card is located, or undefined if not found
   */
  getCardZone(instanceId: string): string | undefined {
    const ctx = this.getGameState().ctx;

    // Find the zone that contains this card instance
    for (const zoneId in ctx.cardZones) {
      const zone = ctx.cardZones[zoneId];
      if (zone.cards && zone.cards.includes(instanceId)) {
        return zone.name;
      }
    }

    return undefined;
  }

  /** Protected method for subclasses to initialize card models */
  protected initializeCardModels(): void {
    // Base implementation does nothing
    // Subclasses should override this method to initialize their card models
  }

  /**
   * Query cards by game-specific filter with enhanced type safety
   * @param filter The filter to apply
   * @returns Matched card models
   */
  queryCards(filter: CardFilter): CardInstance[] {
    const cards = this.queryCardsByFilter(filter);
    return cards.map(
      (card) =>
        this.cardInstanceStore.getCardByInstanceId(
          card.instanceId,
        ) as CardInstance,
    );
  }

  /**
   * Find cards in a specific zone
   * @param zoneName The zone to search
   * @param playerId Optional player ID to filter by
   * @returns Array of card models in the zone
   */
  getCardsInZone(zoneName: string, playerId?: string): CardInstance[] {
    // Create a filter object with the correct type
    const filter = {
      zone: zoneName,
      ...(playerId ? { owner: playerId } : {}),
    } as CardFilter;

    const cards = this.queryCardsByFilter(filter);
    // Convert the returned cards to the correct CardInstance type
    return cards.map(
      (card) =>
        this.cardInstanceStore.getCardByInstanceId(
          card.instanceId,
        ) as CardInstance,
    );
  }

  /**
   * Increment turn count (for testing state sharing with coreOps)
   */
  incrementTurnCount(): void {
    const currentState = this.getGameState();
    currentState.ctx.numTurns = (currentState.ctx.numTurns || 0) + 1;
  }

  /**
   * Get current turn count (for testing state sharing with coreOps)
   */
  getTurnCount(): number {
    const currentState = this.getGameState();
    return currentState.ctx.numTurns || 0;
  }

  /**
   * Get all available moves for the current player
   * This is a placeholder for Phase 2 implementation
   */
  getAvailableMoves(playerID: string): any[] {
    // In Phase 2, this will use the MoveEnumerationService
    return [];
  }

  /**
   * Get potential targets for a specific move
   * This is a placeholder for Phase 2 implementation
   */
  getPotentialTargets(
    playerID: string,
    moveType: string,
    ...args: unknown[]
  ): any {
    // In Phase 2, this will use the MoveEnumerationService
    return { targets: [] };
  }

  // Implement the MoveProvider interface for move enumeration
  getAllMovesForCurrentContext(
    state: CoreEngineState<GameState>,
  ): Record<string, Move> | null {
    // Get the current phase's available moves
    const ctx = state.ctx;
    const currentPhase = ctx.currentPhase;

    // Get moves from game runtime
    const moves = this.gameRuntime.moves || {};

    // In a complete implementation, we would also include phase-specific moves
    // but we'll keep it simple for now
    return moves;
  }

  getPlayerState(playerID: string): PlayerState | undefined {
    const ctx: CoreCtx<PlayerState> = this.getCtx();
    return ctx.players?.[playerID];
  }

  getMove(ctx: CoreCtx, moveName: string, playerID: string): Move | null {
    // Check if the move exists in the game runtime
    const moves = this.gameRuntime.moves || {};
    if (moves[moveName]) {
      return moves[moveName];
    }

    // Move not found
    this.logCollector.log(
      LogLevel.DEVELOPER,
      `Move ${moveName} not found in game moves`,
    );
    return null;
  }

  canPlayerAct(state: CoreEngineState<GameState>, playerID: string): boolean {
    // Check if game is over
    if (state.ctx.gameOver) {
      return false;
    }

    // Check if the player has priority
    const currentTurnPlayer = getCurrentTurnPlayer(state.ctx);
    const currentPriorityPlayer = getCurrentPriorityPlayer(state.ctx);

    // Simple check - is it their turn or do they have priority?
    return currentTurnPlayer === playerID || currentPriorityPlayer === playerID;
  }

  /**
   * Convert InvalidMoveResult to a proper AnyEngineError
   */
  private convertInvalidMoveResultToError(
    result: InvalidMoveResult,
    moveType: string,
    playerID: string,
  ): AnyEngineError {
    return new InvalidMoveError(
      moveType,
      playerID,
      result.reason || "Unknown error",
    );
  }
}

export function Core<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardModel extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
>(
  opts: CoreEngineOpts<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardModel
  >,
): CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardModel> {
  return new CoreEngine<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardModel
  >(opts);
}
