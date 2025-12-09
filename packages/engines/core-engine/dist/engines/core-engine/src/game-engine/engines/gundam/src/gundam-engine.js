import { GameEngine } from "~/game-engine/core-engine/game-engine";
import { allGundamCardsById } from "./cards/definitions/cards";
import { GundamModel } from "./cards/gundam-card-model";
import { GundamGame } from "./game-definition/gundam-game-definition";
/**
 * GundamEngine Class
 * Main engine class for Gundam TCG game logic.
 */
export class GundamEngine extends GameEngine {
    // Store the repository locally for access in card model initialization
    cardRepository;
    /**
     * Constructor for GundamEngine
     */
    constructor({ initialState, initialCoreCtx, cards, cardRepository, gameId, playerId, seed, players, debug, }) {
        super({
            game: GundamGame,
            seed,
            initialState,
            initialCoreCtx,
            matchID: gameId,
            playerID: playerId,
            players,
            cards,
            debug,
            repository: cardRepository || {},
        });
        if (cardRepository) {
            this.cardRepository = cardRepository;
        }
    }
    /**
     * Initializes card models with Gundam-specific functionality
     */
    initializeCardModels() {
        const getCardDefinition = this.cardRepository
            ? (id) => this.cardRepository.getCardByPublicId(id)
            : (id) => allGundamCardsById[id];
        for (const [playerId, playerCards] of Object.entries(this.cardInstanceStore.playerCardsIds)) {
            for (const card of Object.keys(playerCards)) {
                const cardDefinition = getCardDefinition(playerCards[card]);
                if (cardDefinition) {
                    const originalCard = this.cardRepository
                        ? { ...cardDefinition }
                        : cardDefinition;
                    if (this.cardRepository && originalCard) {
                        originalCard.instanceId = undefined;
                    }
                    this.cardInstanceStore.getCardInstances()[card] = new GundamModel({
                        engine: this,
                        card: originalCard,
                        instanceId: card,
                        ownerId: playerId,
                    });
                }
            }
        }
    }
    /**
     * ### Enhanced Card Filtering
     * Type-safe card filtering with Gundam-specific properties
     */
    /** Query cards with Gundam-specific filtering capabilities */
    queryCardsByFilter(filter) {
        return super.queryCardsByFilter(filter);
    }
    /** Get engine store for backward compatibility with legacy APIs */
    getStore() {
        return {
            state: this.getGameState(),
            stateHash: "core-engine-hash",
        };
    }
    /**
     * ### Available Moves
     * Game moves that can be executed by players.
     *
     * **chooseWhoGoesFirstMove(playerId)**
     * - Selects which player goes first
     * - Used during game setup phase
     * - Returns move result with success/failure status
     *
     * **alterHand(cardsToAlter)**
     * - Allows player to mulligan cards from hand
     * - Takes array of card instance IDs to replace
     * - Used during setup phase after initial draw
     */
    get moves() {
        return {
            chooseFirstPlayer: (playerId) => {
                return this.processMove(playerId, "chooseFirstPlayer", [playerId]);
            },
            alterHand: (cardsToAlter) => {
                const currentPlayer = this.getCurrentPlayer();
                if (!currentPlayer)
                    return false;
                return this.processMove(currentPlayer, "alterHand", [cardsToAlter]);
            },
            redrawHand: (shouldRedraw) => {
                const currentPlayer = this.getCurrentPlayer();
                if (!currentPlayer)
                    return false;
                return this.processMove(currentPlayer, "redrawHand", [shouldRedraw]);
            },
            concede: (playerId) => {
                return this.processMove(playerId, "concede", [playerId]);
            },
        };
    }
    /**
     * ### State Query Methods
     * Methods for querying game state and context.
     */
    /** Get the owner of a card by instance ID */
    getCardOwner(instanceId) {
        return super.getCardOwner(instanceId);
    }
    /** Get the zone of a card by instance ID */
    getCardZone(instanceId) {
        const zone = super.getCardZone(instanceId);
        return zone;
    }
    getZonesCardCount(player) {
        const ctx = this.getCtx();
        const playerId = player || "player_one";
        const count = {
            deck: 0,
            resourceDeck: 0,
            resourceArea: 0,
            battleArea: 0,
            shieldBase: 0,
            shieldSection: 0,
            removalArea: 0,
            hand: 0,
            trash: 0,
            sideboard: 0,
        };
        const zones = [
            "deck",
            "resourceDeck",
            "resourceArea",
            "battleArea",
            "shieldBase",
            "shieldSection",
            "removalArea",
            "hand",
            "trash",
            "sideboard",
        ];
        for (const zone of zones) {
            const cardZone = ctx.cardZones[`${playerId}-${zone}`];
            count[zone] = cardZone?.cards?.length || 0;
        }
        return count;
    }
    /** Get all card models in the game */
    queryAllCards() {
        return Object.values(this.cardInstanceStore.getCardInstances());
    }
    /** Required implementations of abstract methods */
    getCurrentPhase() {
        const ctx = this.getCtx();
        return ctx?.currentPhase || "";
    }
    getCurrentSegment() {
        const ctx = this.getCtx();
        return ctx?.currentSegment || "";
    }
    isGameOver() {
        const ctx = this.getCtx();
        return ctx?.gameOver !== undefined;
    }
    getWinners() {
        const ctx = this.getCtx();
        return ctx?.winner ? [ctx.winner] : [];
    }
}
//# sourceMappingURL=gundam-engine.js.map