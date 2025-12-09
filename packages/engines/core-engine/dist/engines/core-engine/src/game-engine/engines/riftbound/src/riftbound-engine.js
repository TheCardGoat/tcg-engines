/**
 * Main Riftbound Engine class
 * Extends the GameEngine framework to implement Riftbound TCG rules
 */
// Imports from core engine
import { CardRepository, } from "~/game-engine/core-engine/card/card-repository-factory";
import { GameEngine } from "~/game-engine/core-engine/game-engine";
import { logger } from "~/game-engine/core-engine/utils/logger";
// Riftbound specific imports
import { RiftboundGame } from "./game-definition/riftbound-game-definition";
import { createEmptyRiftboundGameState } from "./utils/createEmptyRiftboundGameState";
// Create a simple card repository for testing
const createDefaultRepository = () => {
    const mockCards = {};
    const mockDictionary = {
        player_one: {},
        player_two: {},
    };
    return new CardRepository(mockDictionary, mockCards);
};
/**
 * Main Riftbound Engine class
 * Implements the complete Riftbound TCG ruleset
 */
export class RiftboundEngine extends GameEngine {
    // Store the repository locally for access in card model initialization
    cardRepository;
    /**
     * Constructor for RiftboundEngine
     */
    constructor(config) {
        const initialState = config.initialState || createEmptyRiftboundGameState();
        const repository = config.cardRepository || createDefaultRepository();
        super({
            game: RiftboundGame,
            seed: config.seed,
            initialState,
            initialCoreCtx: config.initialCoreCtx,
            matchID: config.gameId,
            playerID: config.playerId,
            debug: config.debug,
            players: config.players,
            cards: config.cards || {},
            repository,
        });
        if (config.cardRepository) {
            this.cardRepository = config.cardRepository;
        }
        // Initialize the engine state
        this.initializeEngine(config);
    }
    /**
     * Initialize the engine with configuration
     */
    initializeEngine(config) {
        const state = this.getGameState();
        const G = state.G;
        logger.info(`Riftbound Engine initialized: ${config.gameId}`, {
            playerId: this.playerID,
            gameMode: G.gameMode,
            playerCount: config.players?.length || 0,
            skipPreGame: config.skipPreGame,
        });
    }
    /**
     * Initializes card models with Riftbound-specific functionality
     */
    initializeCardModels() {
        // This will be implemented when the card system is complete
        // Similar to how GundamModel initializes cards
    }
    /**
     * Get zone card counts for a player
     */
    getZonesCardCount(player) {
        const ctx = this.getCtx();
        const playerId = player || "player_one";
        const count = {
            deck: 0,
            hand: 0,
            resourceDeck: 0,
            base: 0,
            legendZone: 0,
            championZone: 0,
            removalArea: 0,
            trash: 0,
            sideboard: 0,
        };
        const zones = [
            "deck",
            "hand",
            "resourceDeck",
            "base",
            "legendZone",
            "championZone",
            "removalArea",
            "trash",
            "sideboard",
        ];
        for (const zone of zones) {
            const cardZone = ctx.cardZones[`${playerId}-${zone}`];
            count[zone] = cardZone?.cards?.length || 0;
        }
        return count;
    }
    /** Query all cards in the game */
    queryAllCards() {
        return Object.values(this.cardInstanceStore.getCardInstances());
    }
    /**
     * Process a Riftbound-specific move with type safety
     */
    processRiftboundMove(moveType, params) {
        try {
            // Get the current player (for moves that need a player ID)
            const currentPlayer = this.playerID || this.getTurnPlayer() || "player_one";
            // Process the move through CoreEngine
            const result = this.processMove(currentPlayer, moveType, [params]);
            if (result.success) {
                return {
                    success: true,
                    gameState: result.data.G,
                    logs: [],
                };
            }
            return {
                success: false,
                error: "Move failed",
            };
        }
        catch (error) {
            logger.error(`Error processing move ${moveType}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    /**
     * Game move implementations
     */
    get moves() {
        return {
            // Will implement actual moves later
            concede: (playerId) => {
                return this.processMove(playerId, "concede", [playerId]);
            },
        };
    }
    /**
     * Get the current game state for debugging
     */
    getDebugState() {
        const G = this.getGameState().G;
        const ctx = this.getGameState().ctx;
        return {
            gameSegment: ctx.currentSegment,
            gamePhase: ctx.currentPhase,
            gameState: G.gameState,
            turnPlayer: ctx.playerOrder[ctx.turnPlayerPos] || "NOT_SET",
            priorityPlayers: [ctx.playerOrder[ctx.priorityPlayerPos] || "NOT_SET"],
            playerCount: ctx.playerOrder.length,
            victoryScore: G.victoryScore,
        };
    }
    /**
     * Required implementations of abstract methods
     */
    getCurrentPhase() {
        const ctx = this.getCtx();
        return ctx?.currentPhase || "";
    }
    getCurrentSegment() {
        const ctx = this.getCtx();
        return ctx?.currentSegment || "";
    }
    isGameOver() {
        const G = this.getGameState().G;
        // Check for victory by points
        for (const playerId of this.getGameState().ctx.playerOrder) {
            if (this.canWin(playerId)) {
                return true;
            }
        }
        return this.getCtx()?.gameOver !== undefined;
    }
    /**
     * Check if a player can win the game
     */
    canWin(playerId) {
        const G = this.getGameState().G;
        const ctx = this.getGameState().ctx;
        const player = ctx.players[playerId];
        const victoryScore = G.victoryScore;
        return player ? player.points >= victoryScore : false;
    }
    getWinners() {
        const ctx = this.getCtx();
        if (!ctx?.gameOver) {
            return [];
        }
        const winners = [];
        for (const playerId of ctx.playerOrder) {
            if (this.canWin(playerId)) {
                winners.push(playerId);
            }
        }
        return winners;
    }
    /**
     * Serialize the game state for persistence
     */
    serialize() {
        return JSON.stringify({
            gameState: this.getGameState().G,
            coreCtx: this.getGameState().ctx,
        });
    }
    /**
     * Deserialize and restore game state
     */
    static deserialize(data, config) {
        const parsed = JSON.parse(data);
        return new RiftboundEngine({
            ...config,
            initialState: parsed.gameState,
            initialCoreCtx: parsed.coreCtx,
        });
    }
}
//# sourceMappingURL=riftbound-engine.js.map