import { expect } from "bun:test";

import { createCtx } from "~/game-engine/core-engine/state/context";

import type { GameCards } from "~/game-engine/core-engine/types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import {
  createId,
  createShortAndUniqueIds,
} from "~/game-engine/core-engine/utils/random";
import type {
  AccessoryCard,
  AlphaClashCard,
  ClashCard,
  ClashgroundCard,
  ContenderCard,
} from "~/game-engine/engines/alpha-clash/src/cards/definitions/cardTypes";
import { AlphaClashEngine } from "../../alpha-clash-engine";
import type {
  AlphaClashGameState,
  AlphaClashPlayerState,
} from "../../alpha-clash-engine-types";
import { AlphaClashCardRepository } from "../cards/alpha-clash-card-repository";

// Zone type for Alpha Clash
export type AlphaClashZoneType =
  | "deck"
  | "hand"
  | "contender"
  | "clash"
  | "resource"
  | "accessory"
  | "clashground"
  | "oblivion"
  | "standby";

export type TestInitialState = Partial<{
  contender: ContenderCard;
  clashground: ClashgroundCard;
  clash: ClashCard[];
  accessory: AccessoryCard[];
  deck: number | AlphaClashCard[];
  hand: number | AlphaClashCard[];
  resource: number | AlphaClashCard[];
  oblivion: AlphaClashCard[];
  standby: AlphaClashCard[];
}>;

export type TestOptions = {
  skipPreGame?: boolean;
  debug?: boolean;
};

export class AlphaClashTestEngine {
  authoritativeEngine: AlphaClashEngine;
  playerOneEngine: AlphaClashEngine;
  playerTwoEngine: AlphaClashEngine;

  constructor(
    playerOneState?: TestInitialState,
    playerTwoState?: TestInitialState,
    options: TestOptions = {},
  ) {
    const { skipPreGame = true, debug = false } = options;

    // Create game IDs
    const gameId = createId();
    const playerOneId = "player_one";
    const playerTwoId = "player_two";
    const playerIds = [playerOneId, playerTwoId];

    // Create card collections
    const cards: GameCards = {
      [playerOneId]: {},
      [playerTwoId]: {},
    };

    // Create card repository
    const cardRepository = new AlphaClashCardRepository(cards);

    // Create default states if not provided
    const defaultState: TestInitialState = {
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
    const initialState = this.createInitialState(
      playerIds,
      p1State,
      p2State,
      skipPreGame,
    );

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

  private createInitialState(
    playerIds: string[],
    p1State: TestInitialState,
    p2State: TestInitialState,
    skipPreGame: boolean,
  ): AlphaClashGameState {
    return {
      currentPhase: skipPreGame ? "primary" : undefined,
      currentSegment: skipPreGame ? "duringGame" : "startingAGame",
      priorityState: null,
      players: playerIds.reduce(
        (acc, playerId, index) => {
          const state = index === 0 ? p1State : p2State;
          acc[playerId] = {
            id: playerId,
            name: `Player ${index + 1}`,
            health: 20,
            resources: 0,
            turnHistory: [],
          } as AlphaClashPlayerState;
          return acc;
        },
        {} as Record<string, AlphaClashPlayerState>,
      ),
    };
  }

  private initializeCardZones(
    playerId: string,
    state: TestInitialState,
    initialCoreCtx: any,
  ): void {
    const zones: AlphaClashZoneType[] = [
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
      } else if (Array.isArray(zoneValue)) {
        cardCount = zoneValue.length;
      } else if (zoneValue !== undefined && zoneValue !== null) {
        cardCount = 1; // Single card objects (contender, clashground)
      } else {
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
  assertThatZonesContain(
    expectedState: TestInitialState,
    playerId: string,
  ): void {
    const ctx = this.authoritativeEngine.getGameState().ctx;

    for (const [zone, expectedValue] of Object.entries(expectedState)) {
      const zoneKey = `${playerId}-${zone}`;
      const actualCount = ctx.cardZones[zoneKey]?.cards?.length || 0;

      let expectedCount = 0;

      if (typeof expectedValue === "number") {
        expectedCount = expectedValue;
      } else if (Array.isArray(expectedValue)) {
        expectedCount = expectedValue.length;
      } else if (expectedValue !== undefined && expectedValue !== null) {
        expectedCount = 1; // Single card objects (contender, clashground)
      } else {
        expectedCount = 0; // undefined/null means empty zone
      }

      expect(actualCount).toBe(expectedCount);
    }
  }

  getGameSegment(): string {
    return (
      this.authoritativeEngine.getGameState().G.currentSegment || "unknown"
    );
  }

  getGamePhase(): string {
    return this.authoritativeEngine.getGameState().G.currentPhase || "unknown";
  }
}
