import { expect } from "bun:test";
import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";
import { createCtx, } from "~/game-engine/core-engine/state/context";
import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";
import { createId, createShortAndUniqueIds, } from "~/game-engine/core-engine/utils/random";
import { createEmptyGundamGameState } from "~/game-engine/engines/gundam/src/utils/createEmptyGundamGameState";
import { allGundamCardsById } from "../cards/definitions/cards";
import { side7 } from "../cards/definitions/GD01/bases/bases";
import { theWitchAndTheBride } from "../cards/definitions/GD01/commands/commands";
import { banagherLinks } from "../cards/definitions/GD01/pilots/pilots";
import { strikeDaggerGATX105 } from "../cards/definitions/GD01/units/units";
import { exBaseToken, exResourceToken, } from "../cards/definitions/tokens/tokens";
import { GundamCardRepository } from "../cards/gundam-card-repository";
import { GundamEngine } from "../gundam-engine";
export const mockUnitCard = {
    ...strikeDaggerGATX105,
    id: `test-unit-card-${strikeDaggerGATX105.id}`,
};
export const mockPilotCard = {
    ...banagherLinks,
    id: `test-pilot-card-${banagherLinks.id}`,
};
export const mockBaseCard = {
    ...side7,
    id: `test-base-card-${side7.id}`,
};
export const mockCommandCard = {
    ...theWitchAndTheBride,
    id: `test-command-card-${theWitchAndTheBride.id}`,
};
export const mockResourceCard = {
    id: "test-resource-card",
    type: "resource",
    name: "Test Resource",
    number: 999,
    set: "GD01",
    rarity: "common",
};
if (process.env.NODE_ENV === "test") {
    allGundamCardsById[mockUnitCard.id] = mockUnitCard;
    allGundamCardsById[mockPilotCard.id] = mockPilotCard;
    allGundamCardsById[mockBaseCard.id] = mockBaseCard;
    allGundamCardsById[mockCommandCard.id] = mockCommandCard;
    allGundamCardsById[mockResourceCard.id] = mockResourceCard;
    allGundamCardsById[exBaseToken.id] = exBaseToken;
    allGundamCardsById[exResourceToken.id] = exResourceToken;
}
export class GundamTestEngine {
    cards;
    // We create three engines, to simulate a game with two players and an authoritative engine
    // This adds complexity, but allows us to test the game logic in a more realistic way
    // As this can catch serialization issues and other bugs that might not be caught
    authoritativeEngine; // Simulates the server-side authoritative engine
    playerOneEngine; // Simulates the first player actions
    playerTwoEngine; // Simulates the second player actions
    activeEngine = "player_one";
    constructor(playerState = {}, opponentState = {}, opts = {
        debug: process.env.CI !== "true",
        skipPreGame: true,
    }) {
        const { initialCoreContext, game } = createMockGame(playerState, opponentState, opts.skipPreGame);
        this.cards = initialCoreContext.cards;
        // Create card repository if not provided
        const repository = opts.cardRepository ||
            new GundamCardRepository(initialCoreContext.cards || {});
        const seed = "seed-for-test"; // Use a fixed seed for reproducibility
        // Use unique game ID to avoid cache pollution between tests
        const gameId = `TEST_GAME_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const players = ["player_one", "player_two"];
        // Create authoritative engine (no playerID = authoritative)
        this.authoritativeEngine = new GundamEngine({
            initialState: game,
            initialCoreCtx: initialCoreContext,
            cards: initialCoreContext.cards,
            cardRepository: repository,
            playerId: undefined,
            gameId,
            debug: opts.debug,
            seed,
            players: players,
        });
        // Create player engines
        this.playerOneEngine = new GundamEngine({
            initialState: game,
            initialCoreCtx: initialCoreContext,
            cards: initialCoreContext.cards,
            cardRepository: repository,
            playerId: "player_one",
            gameId,
            debug: opts.debug,
            seed,
            players: players,
        });
        this.playerTwoEngine = new GundamEngine({
            initialState: game,
            initialCoreCtx: initialCoreContext,
            cards: initialCoreContext.cards,
            cardRepository: repository,
            playerId: "player_two",
            gameId,
            debug: opts.debug,
            seed,
            players: players,
        });
        // Connect player engines to authoritative engine
        this.playerOneEngine.setAuthoritativeEngine(this.authoritativeEngine);
        this.playerTwoEngine.setAuthoritativeEngine(this.authoritativeEngine);
    }
    dispose() { }
    // Return possible moves for the engine owner
    potentialMoves() {
        return [];
    }
    changeActivePlayer(playerId) {
        if (playerId !== "player_one" && playerId !== "player_two") {
            throw new Error(`Invalid player ID: ${playerId}`);
        }
        if (debuggers.testEngine) {
            logger.debug(`Changing active player to: ${playerId}`);
        }
        this.activeEngine = playerId;
    }
    get engine() {
        if (this.activeEngine === "player_one") {
            return this.playerOneEngine;
        }
        if (this.activeEngine === "player_two") {
            return this.playerTwoEngine;
        }
        logger.warn("==> No player has priority, returning authoritative engine");
        return this.authoritativeEngine;
    }
    getZonesCardCount(player) {
        return this.authoritativeEngine.getZonesCardCount(player);
    }
    assertThatZonesContain(zones, playerId) {
        expect(this.getZonesCardCount(playerId)).toEqual(expect.objectContaining(zones));
    }
    getState() {
        const engineState = this.authoritativeEngine.getState();
        return engineState?.G || {};
    }
    getCtx() {
        const ctx = this.authoritativeEngine.getCtx();
        return {
            ...ctx,
            turnPlayer: this.getTurnPlayer(),
            priorityPlayer: this.getPriorityPlayers()[0],
        };
    }
    getCards() {
        return this.cards;
    }
    getCardModel(card, _index) {
        // Placeholder method until queryAllCardsByFilter is implemented
        const results = this.engine
            .queryAllCards()
            .filter((c) => c.card.id === card.id);
        if (results.length === 0) {
            throw new Error(`Unable to find card: ${card.id} (${card.name || "unnamed"})`);
        }
        return results[0];
    }
    getPlayerLore(player = "player_one") {
        // This method is not needed for Gundam but kept for API compatibility
        return 0;
    }
    getNumTurns() {
        return this.engine.getNumTurns();
    }
    getNumMoves() {
        return this.engine.getNumMoves();
    }
    getGameSegment() {
        // Always read game segment from the authoritative engine to ensure consistency
        return this.authoritativeEngine.getGameSegment();
    }
    getGamePhase() {
        return this.authoritativeEngine.getGamePhase();
    }
    getPriorityPlayers() {
        // Always read priority from the authoritative engine to avoid circular dependency
        return this.authoritativeEngine.getPriorityPlayers();
    }
    getTurnPlayer() {
        return this.authoritativeEngine.getTurnPlayer();
    }
    getFlowState() {
        return {
            gameSegment: this.getGameSegment(),
            gamePhase: this.engine.getCtx().currentPhase,
            gameStep: this.engine.getCtx().currentStep,
            priorityPlayers: this.getPriorityPlayers(),
            turnPlayer: this.getTurnPlayer(),
            numTurns: this.getNumTurns(),
            numMoves: this.getNumMoves(),
        };
    }
    get moves() {
        return this.engine.moves;
    }
    get engineHashes() {
        return {
            playerOne: this.playerOneEngine.getStore().stateHash,
            playerTwo: this.playerTwoEngine.getStore().stateHash,
            authoritative: this.authoritativeEngine.getStore().stateHash,
        };
    }
    get engineStates() {
        return {
            playerOne: this.playerOneEngine.getStore().state,
            playerTwo: this.playerTwoEngine.getStore().state,
            authoritative: this.authoritativeEngine.getStore().state,
        };
    }
    chooseFirstPlayer(playerID) {
        const result = this.moves.chooseFirstPlayer(playerID);
        // After choosing first player, priority should be given to that player
        if (result && result.success) {
            this.changeActivePlayer(playerID);
        }
        return result;
    }
    alterHand(cards) {
        this.moves.alterHand(cards);
    }
    redrawHand(redraw) {
        const currentPlayer = this.getPriorityPlayers()[0];
        if (currentPlayer) {
            this.changeActivePlayer(currentPlayer);
            // Use the moves interface instead of direct processMove
            this.engine.moves.redrawHand(redraw);
        }
    }
    // New CardManager API methods
    /**
     * Get enriched card by instance ID using the new CardManager
     */
    getEnrichedCard(instanceId) {
        return undefined;
    }
    /**
     * Get all cards for a player using the new CardManager
     */
    getPlayerCards(playerId) {
        return [];
    }
    getZone(zone, playerId = "player_one") {
        return (getCardZone(this.playerOneEngine.getCtx(), zone, playerId)?.cards || []);
    }
    getCardsByZone(zone, playerId = "player_one") {
        const allCards = this.authoritativeEngine.queryAllCards();
        return this.getZone(zone, playerId).map((instanceId) => {
            // Find the card model by instance ID
            const cardModel = allCards.find((card) => card.instanceId === instanceId);
            return cardModel || { instanceId };
        });
    }
    /**
     * Get cards matching a custom filter using the new CardManager
     */
    getCardsWithFilter(filter) {
        return [];
    }
    /**
     * Get all cards in the game using the new CardManager
     */
    getAllEnrichedCards() {
        return [];
    }
    /**
     * Demonstrate the new CardManager with a comprehensive query
     */
    demonstrateCardManager() {
        const allCards = this.getAllEnrichedCards();
        const player1Cards = this.getPlayerCards("player_one");
        const handCards = this.getCardsByZone("hand");
        const customFilterCards = this.getCardsWithFilter((cardState) => cardState.owner === "player_one" && cardState.zone === "hand");
        return {
            totalCards: allCards.length,
            player1CardCount: player1Cards.length,
            handCardCount: handCards.length,
            customFilterCount: customFilterCards.length,
            sampleCard: allCards[0]
                ? {
                    instanceId: allCards[0].instanceId,
                    publicId: allCards[0].publicId,
                    owner: allCards[0].owner,
                    zone: allCards[0].zone,
                    definition: allCards[0].definition,
                }
                : null,
        };
    }
}
export function createMockGame(playerState = {}, opponentState = {}, skipPreMatch = true) {
    const gundamGameState = createEmptyGundamGameState();
    const initialCoreContext = createCtx({
        playerOrder: ["player_one", "player_two"],
        initialSegment: skipPreMatch ? "duringGame" : "startingAGame",
        initialPhase: skipPreMatch ? "mainPhase" : "chooseFirstPlayer",
        players: {
            player_one: {
                id: "player_one",
                name: "Player One",
            },
            player_two: {
                id: "player_two",
                name: "Player Two",
            },
        },
        cards: {},
        cardZones: {},
        gameId: "TEST_GAME_ID",
        matchId: "TEST_MATCH_ID",
        seed: "SEED",
    });
    const ids = createShortAndUniqueIds(120);
    updateInitialState("player_one", playerState, gundamGameState, ids, initialCoreContext);
    updateInitialState("player_two", opponentState, gundamGameState, ids, initialCoreContext);
    gundamGameState.choosingFirstPlayer = "player_one";
    if (skipPreMatch) {
        gundamGameState.turn = "player_one";
        gundamGameState.priority = "player_one";
    }
    else {
        console.log("not skipping pre-match");
    }
    return {
        game: JSON.parse(JSON.stringify(gundamGameState)),
        initialCoreContext: JSON.parse(JSON.stringify(initialCoreContext)),
    };
}
// 5. Preparing to Play
// 5-1. Preparing a Deck, Resource Deck, and Token Cards 5-1-1. Before the game, each player prepares a deck and a resource deck. A deck consists of exactly 50 cards, and a resource deck consists of exactly 10 cards.
// 5-1-1-1. A deck is constructed with Unit, Pilot, Command, and Base cards.
// 5-1-1-2. A deck must be constructed entirely using either one or two card colors.
// 5-1-1-2-1. A deck consisting of all red cards and a deck consisting of cards of two colors, green and white, both qualify as legal decks.
// 5-1-1-3. Up to four copies of cards with the same card number can be included in a deck.
// 5-1-1-4. A resource deck is constructed with Resource cards.
// 5-1-1-5. Any number of Resource cards with the same card number can be 12 included in a resource deck.
// 5-1-2. Before the game, each player prepares one EX Base and one EX Resource token.
// 5-1-2-1. If you intend to use other tokens, make sure to have the necessary token cards at hand.
function updateInitialState(playerId, state, game, ids, initialCoreContext) {
    const defaults = {
        deck: 15,
        resourceDeck: state.resourceArea && !Number.isNaN(state.resourceArea)
            ? 10 - Number(state.resourceArea)
            : 10,
        resourceArea: 0,
        shieldSection: 6, // Default to 6 cards for normal tests
        shieldBase: 0,
        battleArea: 0,
        removalArea: 0,
        hand: 0,
        trash: 0,
        sideboard: 0,
    };
    const { ...zones } = state;
    if (!initialCoreContext.cardZones) {
        initialCoreContext.cardZones = {};
    }
    initialCoreContext.cardZones[`${playerId}-deck`] = {
        id: `${playerId}-deck`,
        name: "deck",
        owner: playerId,
        visibility: "secret",
        ordered: true,
        sizeLimit: 50,
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-resourceDeck`] = {
        id: `${playerId}-resourceDeck`,
        name: "resourceDeck",
        owner: playerId,
        visibility: "secret",
        ordered: true,
        sizeLimit: 10, // +5 EX Resource tokens
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-resourceArea`] = {
        id: `${playerId}-resourceArea`,
        name: "resourceArea",
        owner: playerId,
        visibility: "public",
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-battleArea`] = {
        id: `${playerId}-battleArea`,
        name: "battleArea",
        owner: playerId,
        visibility: "public",
        sizeLimit: 6,
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-shieldBase`] = {
        id: `${playerId}-shieldBase`,
        name: "shieldBase",
        owner: playerId,
        visibility: "public",
        sizeLimit: 1,
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-shieldSection`] = {
        id: `${playerId}-shieldSection`,
        name: "shieldSection",
        owner: playerId,
        visibility: "secret",
        ordered: true,
        sizeLimit: 10,
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-removalArea`] = {
        id: `${playerId}-removalArea`,
        name: "removalArea",
        owner: playerId,
        visibility: "public",
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-hand`] = {
        id: `${playerId}-hand`,
        name: "hand",
        owner: playerId,
        visibility: "private",
        sizeLimit: 10,
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-trash`] = {
        id: `${playerId}-trash`,
        name: "trash",
        owner: playerId,
        visibility: "public",
        cards: [],
    };
    initialCoreContext.cardZones[`${playerId}-sideboard`] = {
        id: `${playerId}-sideboard`,
        name: "sideboard",
        owner: playerId,
        visibility: "secret",
        cards: [],
    };
    // Always create EX Base and EX Resource tokens for each player
    // These are fundamental game components that every player needs
    // Rule 5-2-3: Each player places one active EX Base token card into the base section of their shield area
    const exBaseInstanceId = ids.pop() || createId();
    // Add EX Base token to player's card collection
    if (initialCoreContext.cards[playerId]) {
        initialCoreContext.cards[playerId][exBaseInstanceId] = exBaseToken.id;
    }
    else {
        initialCoreContext.cards[playerId] = {
            [exBaseInstanceId]: exBaseToken.id,
        };
    }
    // Initially place EX Base token in shieldBase zone (unless test overrides)
    if (state.shieldBase === undefined) {
        initialCoreContext.cardZones[`${playerId}-shieldBase`].cards.push(exBaseInstanceId);
    }
    // Rule 5-2-4: Player Two places one active EX Resource token card into their resource area
    // But we create the token for all players, and the segment will handle placement
    const exResourceInstanceId = ids.pop() || createId();
    // Add EX Resource token to player's card collection
    initialCoreContext.cards[playerId][exResourceInstanceId] = exResourceToken.id;
    // Place the EX Resource token in the sideboard initially
    // The segment logic will move it to the appropriate zone when needed
    initialCoreContext.cardZones[`${playerId}-sideboard`].cards.push(exResourceInstanceId);
    // Process each zone from the test initial state and defaults
    const allZoneKeys = new Set([
        ...Object.keys(zones),
        ...Object.keys(defaults),
    ]);
    for (const zone of allZoneKeys) {
        const zoneKey = zone;
        const stateValue = state[zoneKey];
        const defaultValue = defaults[zoneKey];
        const value = stateValue !== undefined ? stateValue : defaultValue;
        if (value === undefined)
            continue;
        const zoneCards = typeof value === "number"
            ? range(value).map(() => {
                if (zoneKey === "resourceArea" || zoneKey === "resourceDeck") {
                    return mockResourceCard;
                }
                if (zoneKey === "shieldBase") {
                    return exBaseToken;
                }
                return mockUnitCard;
            })
            : value;
        if (zoneCards && zoneCards.length > 0) {
            for (const card of zoneCards.filter(Boolean)) {
                const instanceId = ids.pop() || createId();
                // Add card to player's card collection
                if (initialCoreContext.cards[playerId]) {
                    initialCoreContext.cards[playerId][instanceId] = card.id;
                }
                else {
                    initialCoreContext.cards[playerId] = {
                        [instanceId]: card.id,
                    };
                }
                // Add card to the appropriate zone
                const playerZone = initialCoreContext.cardZones[`${playerId}-${zoneKey}`];
                if (playerZone) {
                    playerZone.cards.push(instanceId);
                }
            }
        }
    }
}
function range(size, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
}
//# sourceMappingURL=gundam-test-engine.js.map