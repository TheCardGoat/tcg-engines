import { expect } from "bun:test";
import { createCtx, } from "~/game-engine/core-engine/state/context";
import { logger } from "~/game-engine/core-engine/utils/logger";
import { createId, createShortAndUniqueIds, } from "~/game-engine/core-engine/utils/random";
import { AlphaClashEngine } from "../../alpha-clash-engine";
import { AlphaClashCardRepository } from "../cards/alpha-clash-card-repository";
export class AlphaClashTestEngine {
    authoritativeEngine;
    playerOneEngine;
    playerTwoEngine;
    constructor(playerOneState, playerTwoState, options = {}) {
        const { skipPreGame = true, debug = false } = options;
        // Create game IDs
        const gameId = createId();
        const playerOneId = "player_one";
        const playerTwoId = "player_two";
        const playerIds = [playerOneId, playerTwoId];
        // Create card collections
        const cards = {
            [playerOneId]: {},
            [playerTwoId]: {},
        };
        // Create card repository
        const cardRepository = new AlphaClashCardRepository(cards);
        // Create default states if not provided
        const defaultState = {
            deck: 30,
            hand: 5,
            contender: undefined,
            clashground: undefined,
            clash: [],
            accessory: [],
            resource: 0,
            oblivion: [],
            standby: [],
        };
        const p1State = { ...defaultState, ...playerOneState };
        const p2State = { ...defaultState, ...playerTwoState };
        // Create initial game state
        const initialState = this.createInitialState(playerIds, p1State, p2State, skipPreGame);
        // Create initial context
        const initialCoreCtx = createCtx({
            playerOrder: playerIds,
            initialSegment: skipPreGame ? "duringGame" : "startingAGame",
            initialPhase: skipPreGame ? "primary" : "chooseFirstPlayer",
            players: {
                [playerOneId]: {
                    id: playerOneId,
                    name: "Player One",
                },
                [playerTwoId]: {
                    id: playerTwoId,
                    name: "Player Two",
                },
            },
            cards: {},
            cardZones: {},
            gameId: createId(),
            matchId: createId(),
            seed: "test-seed",
        });
        // Initialize card zones for both players
        this.initializeCardZones(playerOneId, p1State, initialCoreCtx);
        this.initializeCardZones(playerTwoId, p2State, initialCoreCtx);
        // Initialize engines
        this.authoritativeEngine = new AlphaClashEngine({
            initialState,
            initialCoreCtx,
            cards,
            cardRepository,
            gameId,
            players: playerIds,
            debug,
        });
        this.playerOneEngine = new AlphaClashEngine({
            initialState,
            initialCoreCtx,
            cards,
            cardRepository,
            gameId,
            playerId: playerOneId,
            players: playerIds,
            debug,
        });
        this.playerTwoEngine = new AlphaClashEngine({
            initialState,
            initialCoreCtx,
            cards,
            cardRepository,
            gameId,
            playerId: playerTwoId,
            players: playerIds,
            debug,
        });
        if (debug) {
            logger.info("Alpha Clash Test Engine initialized with debug mode");
        }
    }
    createInitialState(playerIds, p1State, p2State, skipPreGame) {
        return {
            currentPhase: skipPreGame ? "primary" : undefined,
            currentSegment: skipPreGame ? "duringGame" : "startingAGame",
            priorityState: null,
            players: playerIds.reduce((acc, playerId, index) => {
                const state = index === 0 ? p1State : p2State;
                acc[playerId] = {
                    id: playerId,
                    name: `Player ${index + 1}`,
                    health: 20,
                    resources: 0,
                    turnHistory: [],
                };
                return acc;
            }, {}),
        };
    }
    initializeCardZones(playerId, state, initialCoreCtx) {
        const zones = [
            "deck",
            "hand",
            "contender",
            "clash",
            "resource",
            "accessory",
            "clashground",
            "oblivion",
            "standby",
        ];
        // Generate card IDs for each zone
        const allIds = createShortAndUniqueIds(200); // Generate enough IDs
        let idIndex = 0;
        for (const zone of zones) {
            const zoneKey = `${playerId}-${zone}`;
            const zoneValue = state[zone];
            let cardCount = 0;
            // Determine card count based on zone value type
            if (typeof zoneValue === "number") {
                cardCount = zoneValue;
            }
            else if (Array.isArray(zoneValue)) {
                cardCount = zoneValue.length;
            }
            else if (zoneValue !== undefined && zoneValue !== null) {
                cardCount = 1; // Single card objects (contender, clashground)
            }
            else {
                cardCount = 0; // undefined/null means empty zone
            }
            const cardIds = allIds.slice(idIndex, idIndex + cardCount);
            idIndex += cardCount;
            initialCoreCtx.cardZones[zoneKey] = {
                id: zoneKey,
                cards: cardIds,
            };
            // Add cards to the cards collection
            for (const cardId of cardIds) {
                initialCoreCtx.cards[cardId] = {
                    instanceId: cardId,
                    definitionId: `test-card-${zone}`,
                    ownerPlayerId: playerId,
                };
            }
        }
    }
    // Helper methods
    assertThatZonesContain(expectedState, playerId) {
        const ctx = this.authoritativeEngine.getGameState().ctx;
        for (const [zone, expectedValue] of Object.entries(expectedState)) {
            const zoneKey = `${playerId}-${zone}`;
            const actualCount = ctx.cardZones[zoneKey]?.cards?.length || 0;
            let expectedCount = 0;
            if (typeof expectedValue === "number") {
                expectedCount = expectedValue;
            }
            else if (Array.isArray(expectedValue)) {
                expectedCount = expectedValue.length;
            }
            else if (expectedValue !== undefined && expectedValue !== null) {
                expectedCount = 1; // Single card objects (contender, clashground)
            }
            else {
                expectedCount = 0; // undefined/null means empty zone
            }
            expect(actualCount).toBe(expectedCount);
        }
    }
    getGameSegment() {
        return (this.authoritativeEngine.getGameState().G.currentSegment || "unknown");
    }
    getGamePhase() {
        return this.authoritativeEngine.getGameState().G.currentPhase || "unknown";
    }
}
//# sourceMappingURL=alpha-clash-test-engine.js.map