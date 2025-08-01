import { type Result, ResultHelpers } from "~/game-engine/core-engine";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { CoreCardInstanceStore } from "~/game-engine/core-engine/card/core-card-instance-store";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { AnyEngineError } from "~/game-engine/core-engine/errors/engine-errors";
import {
  InvalidMoveError,
  MoveExecutionError,
} from "~/game-engine/core-engine/errors/engine-errors";
import { FlowManager } from "~/game-engine/core-engine/flow/flow-manager";
import { CoreGameRuntime } from "~/game-engine/core-engine/game/game-runtime";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
} from "~/game-engine/core-engine/game-configuration";
import type { MoveRequest } from "~/game-engine/core-engine/move/move-processor";
import {
  type CoreCtx,
  getCurrentPriorityPlayer,
} from "~/game-engine/core-engine/state/context";
import { GameStateStore } from "~/game-engine/core-engine/state/state-store";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultCardMeta,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificCardMeta,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import {
  ErrorFormatters,
  safeExecute,
} from "~/game-engine/core-engine/utils/error-utils";
import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";
import type { CoreCardInstance } from "../card/core-card-instance";

export interface CoreEngineOpts<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardMeta extends GameSpecificCardMeta = DefaultCardMeta,
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
  coreOperationClass?: new (opts: {
    state: CoreEngineState<GameState>;
    engine: CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardMeta,
      CardModel
    >;
  }) => CoreOperation<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardMeta,
    CardModel
  >;
}

export type ClientState<
  GameState extends GameSpecificGameState = DefaultGameState,
> =
  | null
  | (CoreEngineState<GameState> & {
      isActive: boolean;
      isConnected: boolean;
    });

export class CoreEngine<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardMeta extends GameSpecificCardMeta = DefaultCardMeta,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> {
  private readonly debug?: boolean;
  private readonly gameRuntime: CoreGameRuntime<GameState>;

  private subscribers: Array<(state: ClientState<GameState>) => void> = [];
  private gameStateStore: GameStateStore<GameState>;
  private flowManager: FlowManager<GameState>;

  // Generic storage for player cards and card models
  public cardInstanceStore: CoreCardInstanceStore<
    CardDefinition,
    GameState,
    PlayerState,
    CardFilter,
    CardInstance
  >;

  // Factory for creating game-specific CoreOperation instances
  private readonly coreOperationClass: new (opts: {
    state: CoreEngineState<GameState>;
    engine: CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardMeta,
      CardInstance
    >;
  }) => CoreOperation<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardMeta,
    CardInstance
  >;

  private authoritativeEngine?: CoreEngine<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardMeta,
    CardInstance
  >;
  private clientEngines: Record<
    PlayerID,
    CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardMeta,
      CardInstance
    >
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
    coreOperationClass,
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

    // Store the core operation class factory (default to CoreOperation)
    this.coreOperationClass = coreOperationClass || (CoreOperation as any);

    // Initialize card instance store using dependency injection pattern
    this.cardInstanceStore = this.createCardInstanceStore({
      repository,
      cards,
    });
    this.initializeCardModels();

    this.gameRuntime = new CoreGameRuntime<GameState>({
      game,
      initialState,
      initialCoreCtx,
      cards,
      players,
      seed,
      debug,
    });

    this.gameStateStore = new GameStateStore<GameState>({
      initialState: this.gameRuntime.initialState,
    });

    this.flowManager = new FlowManager<GameState>(
      this.gameRuntime.processedGame,
      cards,
      players,
    );

    // Automatically process initial flow transitions to initialize segments and phases
    const initialStateWithFlow = this.flowManager.processFlowTransitions(
      this.gameRuntime.initialState,
      this.createFnContextFromState(this.getGameState()),
    );
    if (this.gameRuntime.initialState !== initialStateWithFlow) {
      logger.debug("Applying initial flow transitions to game state");
      this.gameStateStore.updateState({ newState: initialStateWithFlow });
    }
  }

  /**
   * Creates a function context from the current game state
   * Uses the context factory pattern for consistent context creation
   *
   * @param state - Current game state
   * @returns Function context for game operations
   */
  protected createFnContextFromState(
    state: CoreEngineState<GameState>,
  ): FnContext<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  > {
    const coreOperation = this.createCoreOperationFromState(state);

    return {
      coreOps: coreOperation,
      playerID: this.playerID || "unknown", // Make required, provide fallback

      // Computed getters that always reflect current state from coreOps
      get G() {
        return coreOperation.state.G;
      },
      // Although ctx is deprecated in favor of coreOps.getCtx(),
      // we maintain this getter for backward compatibility.
      // Both approaches ensure access to the latest context.
      get ctx() {
        return coreOperation.state.ctx;
      },
      _getUpdatedState: () => ({
        G: coreOperation.state.G,
        ctx: coreOperation.state.ctx,
        _undo: [],
        _redo: [],
        _stateID: 0,
      }),
    };
  }

  /**
   * Factory method for creating CoreOperation instances
   * Uses the provided coreOperationClass or defaults to CoreOperation
   *
   * @param state - Current game state
   * @returns CoreOperation instance for the game
   */
  protected createCoreOperationFromState(
    state: CoreEngineState<GameState>,
  ): CoreOperation<
    GameState,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardMeta,
    CardInstance
  > {
    return new this.coreOperationClass({
      state: state,
      engine: this,
    });
  }

  processMove(
    playerID: string,
    moveType: string,
    args: unknown[],
  ): Result<CoreEngineState<GameState>, AnyEngineError> {
    if (debuggers.moves) {
      logger.group(
        `Processing move: ${moveType} for player: ${playerID}`,
        moveType,
        args,
      );
    }

    // Validate player is allowed to make moves
    if (!this.canPlayerMove(playerID)) {
      return ResultHelpers.error(
        new InvalidMoveError(
          moveType,
          playerID,
          ErrorFormatters.permission(
            "Move",
            moveType,
            "made",
            playerID,
            `priority belongs to ${this.getPriorityPlayers().join(", ")}`,
          ),
        ),
      );
    }

    return safeExecute(
      `processMove:${moveType}`,
      () => {
        const moveRequest: MoveRequest = {
          playerID,
          moveType,
          args,
        };

        const initialFnContext = this.createFnContextFromState(
          this.getGameState(),
        );

        const processResult = this.gameRuntime.processMove(
          moveRequest,
          initialFnContext,
        );

        if (!processResult.success) {
          if (debuggers.moves) {
            logger.error(processResult);
          }

          return {
            success: false,
            error: (processResult as { success: false; error: AnyEngineError })
              .error,
          };
        }

        const { newState } = processResult.data;
        const updatedFnContext = this.createFnContextFromState(newState);
        const finalState = this.flowManager.processFlowTransitions(
          newState,
          updatedFnContext,
        );

        finalState.ctx.numMoves = (finalState.ctx.numMoves || 0) + 1;

        this.gameStateStore.updateState({
          newState: finalState,
        });

        if (this.isAuthoritative) {
          this.broadcastToClients(this.getGameState());
        } else if (this.authoritativeEngine) {
          (this.authoritativeEngine as any).receiveFromClient(
            this.playerID,
            finalState,
          );
        }

        return ResultHelpers.ok(finalState);
      },
      { playerID, moveType },
    );
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

  private updateState(newState: CoreEngineState<GameState>): void {
    this.gameStateStore.updateState({ newState });
  }

  private notifySubscribers(): void {
    const clientState = this.getState();
    for (const callback of this.subscribers) {
      callback(clientState);
    }
  }

  // Flow management delegation methods
  transitionToPhase(phaseName: string): void {
    const currentState = this.getGameState();
    const fnContext = this.createFnContextFromState(currentState);
    const newState = this.flowManager.transitionToPhase(
      phaseName,
      currentState,
      fnContext,
    );
    this.updateState(newState);
    this.notifySubscribers();
  }

  endCurrentPhase(): void {
    const currentState = this.getGameState();
    const fnContext = this.createFnContextFromState(currentState);
    const newState = this.flowManager.endCurrentPhase(currentState, fnContext);
    this.updateState(newState);
    this.notifySubscribers();
  }

  endCurrentTurn(): void {
    const currentState = this.getGameState();
    const fnContext = this.createFnContextFromState(currentState);
    const newState = this.flowManager.endCurrentTurn(currentState, fnContext);
    this.updateState(newState);
    this.notifySubscribers();
  }

  // Authoritative engine pattern methods
  setAuthoritativeEngine(
    authEngine: CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardMeta,
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
      CardMeta,
      CardInstance
    >,
  ): void {
    this.clientEngines[playerID] = engine;
    this.isAuthoritative = true;
  }

  private receiveFromClient(
    _playerID: PlayerID,
    state: CoreEngineState<GameState>,
  ): void {
    const hashBefore = this.gameStateStore.stateHash;
    this.updateState(state);
    const hashAfter = this.gameStateStore.stateHash;

    if (debuggers.transportMessages) {
      logger.debug(
        `Authoritative engine received state from client ${_playerID}, hash: ${hashBefore} -> ${hashAfter}`,
      );
    }

    if (hashBefore !== hashAfter) {
      this.broadcastToClients(state);
    }
  }

  private broadcastToClients(state: CoreEngineState<GameState>): void {
    for (const [_, engine] of Object.entries(this.clientEngines)) {
      engine.receiveFromAuthoritative(state);
    }
  }

  private receiveFromAuthoritative(state: CoreEngineState<GameState>): void {
    const currentState = this.gameStateStore.getState();

    if (state._stateID >= currentState._stateID) {
      this.gameStateStore.updateState({
        newState: state,
      });

      this.notifySubscribers();
    } else {
      if (debuggers.transportMessages) {
        logger.warn(
          `Received outdated state from authoritative engine: ${state._stateID} < ${currentState._stateID}`,
        );
      }
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
  getCtx() {
    return this.getGameState()?.ctx;
  }

  /** Get number of turns played */
  getNumTurns() {
    return this.getCtx().numTurns;
  }

  /** Get number of moves made */
  getNumMoves() {
    return this.getCtx().numMoves;
  }

  getNumTurnMoves() {
    return this.getCtx().numTurnMoves;
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

    let viewState = currentState;
    if (this.playerID && (this.authoritativeEngine || this.isAuthoritative)) {
      viewState = {
        ...currentState,
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

  getGameState(): CoreEngineState<GameState> {
    return this.gameStateStore.getState();
  }

  getGameStateHash() {
    return this.gameStateStore.stateHash;
  }

  isGameOver(): boolean {
    return !!this.gameStateStore.getState().ctx.gameOver;
  }

  getWinner(): PlayerID | undefined {
    return this.gameStateStore.getState().ctx.winner;
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

  getCardByInstanceId(instanceId: string): CardInstance | undefined {
    return this.cardInstanceStore.getCardByInstanceId(instanceId);
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

  private createCardInstanceStore({
    repository,
    cards,
  }: {
    repository: CardRepository<CardDefinition>;
    cards: GameCards;
  }): CoreCardInstanceStore<
    CardDefinition,
    GameState,
    PlayerState,
    CardFilter,
    CardInstance
  > {
    return new CoreCardInstanceStore<
      CardDefinition,
      GameState,
      PlayerState,
      CardFilter,
      CardInstance
    >({
      repository,
      engine: this,
      playerCardsIds: cards,
    });
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
