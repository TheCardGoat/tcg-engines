import { ResultHelpers } from "~/game-engine/core-engine";
import { CoreCardInstanceStore } from "~/game-engine/core-engine/card/core-card-instance-store";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import { InvalidMoveError, MoveExecutionError, } from "~/game-engine/core-engine/errors/engine-errors";
import { FlowManager } from "~/game-engine/core-engine/flow/flow-manager";
import { CoreGameRuntime } from "~/game-engine/core-engine/game/game-runtime";
import { getCurrentPriorityPlayer, } from "~/game-engine/core-engine/state/context";
import { GameStateStore } from "~/game-engine/core-engine/state/state-store";
import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";
export class CoreEngine {
    debug;
    gameRuntime;
    subscribers = [];
    gameStateStore;
    flowManager;
    // Generic storage for player cards and card models
    cardInstanceStore;
    authoritativeEngine;
    clientEngines = {};
    isAuthoritative = false;
    matchID;
    gameID;
    playerID;
    constructor({ game, matchID, playerID, initialState, cards, players, debug, seed, repository, initialCoreCtx, }) {
        this.playerID = playerID || null;
        this.matchID = matchID || "default-match";
        this.gameID = "default-game";
        this.debug = debug;
        // Initialize card instance store early so it's available to other components
        this.cardInstanceStore = new CoreCardInstanceStore({
            repository,
            engine: this,
            playerCardsIds: cards,
        });
        this.initializeCardModels();
        this.gameRuntime = new CoreGameRuntime({
            game,
            initialState,
            initialCoreCtx,
            cards,
            players,
            seed,
            debug,
        });
        this.gameStateStore = new GameStateStore({
            initialState: this.gameRuntime.initialState,
        });
        this.flowManager = new FlowManager(this.gameRuntime.processedGame, cards, players);
        // Automatically process initial flow transitions to initialize segments and phases
        const initialStateWithFlow = this.flowManager.processFlowTransitions(this.gameRuntime.initialState, this.createFnContextFromState(this.getGameState()));
        if (this.gameRuntime.initialState !== initialStateWithFlow) {
            logger.debug("Applying initial flow transitions to game state");
            this.gameStateStore.updateState({ newState: initialStateWithFlow });
        }
    }
    createFnContextFromState(state) {
        const coreOperation = new CoreOperation({
            state: state,
            engine: this,
        });
        return {
            coreOps: coreOperation,
            gameOps: this,
            playerID: this.playerID || "unknown", // Make required, provide fallback
            // Computed getters that always reflect current state from coreOps
            get G() {
                return coreOperation.state.G;
            },
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
    processMove(playerID, moveType, args) {
        if (debuggers.moves) {
            logger.group(`Processing move: ${moveType} for player: ${playerID}`, moveType, args);
        }
        // Validate player is allowed to make moves
        if (!this.canPlayerMove(playerID)) {
            return ResultHelpers.error(new InvalidMoveError(moveType, playerID, `Player ${playerID} is not allowed to make moves, priority players: ${this.getPriorityPlayers()}`));
        }
        try {
            const moveRequest = {
                playerID,
                moveType,
                args,
            };
            const initialFnContext = this.createFnContextFromState(this.getGameState());
            const processResult = this.gameRuntime.processMove(moveRequest, initialFnContext);
            if (!processResult.success) {
                if (debuggers.moves) {
                    logger.error(processResult);
                }
                return {
                    success: false,
                    error: processResult
                        .error,
                };
            }
            const { newState } = processResult.data;
            const updatedFnContext = this.createFnContextFromState(newState);
            const finalState = this.flowManager.processFlowTransitions(newState, updatedFnContext);
            this.gameStateStore.updateState({
                newState: finalState,
            });
            if (this.isAuthoritative) {
                this.broadcastToClients(this.getGameState());
            }
            else if (this.authoritativeEngine) {
                this.authoritativeEngine.receiveFromClient(this.playerID, finalState);
            }
            return ResultHelpers.ok(finalState);
        }
        catch (error) {
            logger.error("Unexpected error processing move:", error);
            return ResultHelpers.error(new MoveExecutionError(moveType, playerID, error instanceof Error ? error : new Error(String(error))));
        }
        finally {
            logger.groupEnd();
        }
    }
    canPlayerMove(playerID) {
        // Check if game is over
        if (this.isGameOver()) {
            return false;
        }
        // Use FlowManager to check if player can act (handles allowAnyPlayerToAct)
        const currentState = this.getGameState();
        return this.flowManager.canPlayerAct(currentState, playerID);
    }
    updateState(newState) {
        this.gameStateStore.updateState({ newState });
    }
    notifySubscribers() {
        const clientState = this.getState();
        for (const callback of this.subscribers) {
            callback(clientState);
        }
    }
    // Authoritative engine pattern methods
    setAuthoritativeEngine(authEngine) {
        this.authoritativeEngine = authEngine;
        if (this.playerID) {
            authEngine.registerClientEngine(this.playerID, this);
        }
    }
    registerClientEngine(playerID, engine) {
        this.clientEngines[playerID] = engine;
        this.isAuthoritative = true;
    }
    receiveFromClient(_playerID, state) {
        const hashBefore = this.gameStateStore.stateHash;
        this.updateState(state);
        const hashAfter = this.gameStateStore.stateHash;
        if (debuggers.transportMessages) {
            logger.debug(`Authoritative engine received state from client ${_playerID}, hash: ${hashBefore} -> ${hashAfter}`);
        }
        if (hashBefore !== hashAfter) {
            this.broadcastToClients(state);
        }
    }
    broadcastToClients(state) {
        for (const [_, engine] of Object.entries(this.clientEngines)) {
            engine.receiveFromAuthoritative(state);
        }
    }
    receiveFromAuthoritative(state) {
        const currentState = this.gameStateStore.getState();
        if (state._stateID >= currentState._stateID) {
            this.gameStateStore.updateState({
                newState: state,
            });
            this.notifySubscribers();
        }
        else {
            if (debuggers.transportMessages) {
                logger.warn(`Received outdated state from authoritative engine: ${state._stateID} < ${currentState._stateID}`);
            }
        }
    }
    // Public API
    subscribe(callback) {
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
    getState() {
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
    getCurrentPlayer() {
        return getCurrentPriorityPlayer(this.gameStateStore.getState().ctx);
    }
    getGameState() {
        return this.gameStateStore.getState();
    }
    getGameStateHash() {
        return this.gameStateStore.stateHash;
    }
    isGameOver() {
        return this.gameStateStore.getState().ctx.gameOver !== undefined;
    }
    hasPlayerMulliganed(playerID) {
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
    queryCardsByFilter(filter) {
        return this.cardInstanceStore.queryCards(filter);
    }
    /**
     * Gets the owner of a card by instance ID
     * @param instanceId The instance ID of the card
     * @returns The player ID who owns the card, or undefined if not found
     */
    getCardOwner(instanceId) {
        return this.cardInstanceStore.getCardOwner(instanceId);
    }
    /**
     * Gets the zone of a card by instance ID
     * @param instanceId The instance ID of the card
     * @returns The zone name where the card is located, or undefined if not found
     */
    getCardZone(instanceId) {
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
    initializeCardModels() {
        // Base implementation does nothing
        // Subclasses should override this method to initialize their card models
    }
    /**
     * Query cards by game-specific filter with enhanced type safety
     * @param filter The filter to apply
     * @returns Matched card models
     */
    queryCards(filter) {
        const cards = this.queryCardsByFilter(filter);
        return cards.map((card) => this.cardInstanceStore.getCardByInstanceId(card.instanceId));
    }
    /**
     * Find cards in a specific zone
     * @param zoneName The zone to search
     * @param playerId Optional player ID to filter by
     * @returns Array of card models in the zone
     */
    getCardsInZone(zoneName, playerId) {
        // Create a filter object with the correct type
        const filter = {
            zone: zoneName,
            ...(playerId ? { owner: playerId } : {}),
        };
        const cards = this.queryCardsByFilter(filter);
        // Convert the returned cards to the correct CardInstance type
        return cards.map((card) => this.cardInstanceStore.getCardByInstanceId(card.instanceId));
    }
    /**
     * Increment turn count (for testing state sharing with coreOps)
     */
    incrementTurnCount() {
        const currentState = this.getGameState();
        currentState.ctx.numTurns = (currentState.ctx.numTurns || 0) + 1;
    }
    /**
     * Get current turn count (for testing state sharing with coreOps)
     */
    getTurnCount() {
        const currentState = this.getGameState();
        return currentState.ctx.numTurns || 0;
    }
}
export function Core(opts) {
    return new CoreEngine(opts);
}
//# sourceMappingURL=core-engine.js.map