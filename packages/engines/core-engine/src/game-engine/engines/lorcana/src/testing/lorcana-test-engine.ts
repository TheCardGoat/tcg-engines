import { expect } from "bun:test";
import type {
  LorcanitoCard,
  LorcanitoCharacterCard,
  Zones,
} from "@lorcanito/lorcana-engine";
import { allCardsById } from "@lorcanito/lorcana-engine";
import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";

import {
  type CoreCtx,
  createCtx,
} from "~/game-engine/core-engine/state/context";
import type { InstanceId } from "~/game-engine/core-engine/types";
import { range } from "~/game-engine/core-engine/utils/array-utils";
import {
  createId,
  createShortAndUniqueIds,
} from "~/game-engine/core-engine/utils/id-utils";
import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";
import { mockCharacterCard } from "~/game-engine/engines/lorcana/src/testing/mockCards";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import { LorcanaCardRepository } from "../cards/lorcana-card-repository";
import { type LorcanaCardFilter, LorcanaEngine } from "../lorcana-engine";
import type { LorcanaGameState, Zone } from "../lorcana-engine-types";
import { createEmptyLorcanaGameState } from "../utils/createEmptyLorcanaGameState";

// Creates a test card repository that includes both official cards and test cards
function createTestCardRepository(
  dictionary: Record<string, Record<string, string>>,
  testCards: LorcanitoCard[],
): LorcanaCardRepository {
  for (const card of testCards) {
    allCardsById[card.id] = card;
  }

  return new LorcanaCardRepository(dictionary);
}

export const testCharacterCard: LorcanitoCharacterCard = {
  ...mockCharacterCard,
  id: "999999999999",
  name: "Test Card",
};

// Test card without inkwell symbol
export const cardWithoutInkwell: LorcanitoCharacterCard = {
  ...testCharacterCard,
  id: "test-without-inkwell",
  name: "Test Card Without Inkwell",
  inkwell: false,
};

export type TestInitialState = Partial<
  Record<Zone, LorcanitoCard[] | number>
> & { lore?: number };

type Opts = {
  debug?: boolean;
  skipPreGame?: boolean;
  cardRepository?: LorcanaCardRepository;
  testCards?: LorcanitoCard[];
};

export class LorcanaTestEngine {
  private readonly cards: Record<string, Record<string, string>>;

  // We create three engines, to simulate a game with two players and an authoritative engine
  // This adds complexity, but allows us to test the game logic in a more realistic way
  // As this can catch serialization issues and other bugs that might not be caught
  public readonly authoritativeEngine: LorcanaEngine; // Simulates the server-side authoritative engine
  public readonly playerOneEngine: LorcanaEngine; // Simulates the first player actions
  public readonly playerTwoEngine: LorcanaEngine; // Simulates the second player actions

  activePlayerEngine = "player_one";

  private collectCardsFromStates(
    playerState: TestInitialState,
    opponentState: TestInitialState,
  ): LorcanitoCard[] {
    const cards: LorcanitoCard[] = [];
    const cardSet = new Set<string>(); // To avoid duplicates

    // Define zones that can contain cards
    const zones: (keyof TestInitialState)[] = [
      "deck",
      "hand",
      "play",
      "inkwell",
      "discard",
      "bag",
    ];

    // Extract cards from both player states
    for (const state of [playerState, opponentState]) {
      for (const zone of zones) {
        const zoneValue = state[zone];
        if (Array.isArray(zoneValue)) {
          // If it's an array of cards, add them
          for (const card of zoneValue) {
            if (
              card &&
              typeof card === "object" &&
              "id" in card &&
              !cardSet.has(card.id)
            ) {
              cards.push(card);
              cardSet.add(card.id);
            }
          }
        }
        // If it's a number, we don't need to do anything as it will use default test cards
      }
    }

    return cards;
  }

  constructor(
    playerState: TestInitialState = {},
    opponentState: TestInitialState = {},
    opts: Opts = {
      debug: process.env.CI !== "true",
      skipPreGame: true,
    },
  ) {
    if (typeof playerState.deck === "undefined") {
      playerState.deck = 10;
    }

    if (typeof opponentState.deck === "undefined") {
      opponentState.deck = 10;
    }

    // Auto-collect cards from player states
    const autoCollectedCards = this.collectCardsFromStates(
      playerState,
      opponentState,
    );

    const { initialCoreContext, game } = createLorcanaEngineMocks(
      playerState,
      opponentState,
      opts.skipPreGame,
    );
    this.cards = initialCoreContext.cards;
    // Create card repository if not provided
    // For test engines, we need to create a repository that includes our test cards
    const defaultTestCards = [testCharacterCard, cardWithoutInkwell];
    const allTestCards = opts.testCards
      ? [...defaultTestCards, ...autoCollectedCards, ...opts.testCards]
      : [...defaultTestCards, ...autoCollectedCards];

    const repository =
      opts.cardRepository ||
      createTestCardRepository(initialCoreContext.cards, allTestCards);

    const seed = "seed-for-test"; // Use a fixed seed for reproducibility

    // Use unique game ID to avoid cache pollution between tests
    const gameId = `TEST_GAME_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const players = ["player_one", "player_two"];

    // Create authoritative engine (no playerID = authoritative)
    this.authoritativeEngine = new LorcanaEngine({
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
    this.playerOneEngine = new LorcanaEngine({
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

    this.playerTwoEngine = new LorcanaEngine({
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

  dispose() {}

  // Return possible moves for the engine owner
  potentialMoves() {
    const state = this.authoritativeEngine.getGameState();
    if (!state) {
      return [];
    }

    const currentSegment = state.ctx.currentSegment;
    const currentPhase = state.ctx.currentPhase;

    const availableMoves: any[] = [];

    // Only return moves that are configured for the current segment/phase
    if (currentSegment === "startingAGame") {
      if (currentPhase === "chooseFirstPlayer") {
        // In chooseFirstPlayer phase, only chooseWhoGoesFirstMove is available
        availableMoves.push({
          move: "chooseWhoGoesFirstMove",
          type: "player",
          targets: ["player_one", "player_two"],
        });
      } else if (currentPhase === "alterHand") {
        // In alterHand phase, only alterHand is available
        const priorityPlayers = this.getPriorityPlayers();
        if (priorityPlayers.length > 0) {
          const currentPlayer = priorityPlayers[0];
          const playerHandCards = this.getCardsInZone(
            "hand",
            currentPlayer,
          ).map((card) => card.instanceId);

          availableMoves.push({
            move: "alterHand",
            targets: playerHandCards,
            min: 0,
            max: playerHandCards.length,
          });
        }
      }
    }

    return availableMoves;
  }

  exertCard(params: { card: LorcanaCardInstance | LorcanitoCard }) {
    const card = this.getCardModel(params.card);

    const response = this.moves.manualMoves.exertCard({
      card: card.instanceId,
      exerted: true,
    });

    this.wasMoveExecutedAndPropagated();

    return { card, result: response };
  }

  moveToLocation(params: {
    location: LorcanaCardInstance | LorcanitoCard;
    character: LorcanaCardInstance | LorcanitoCard;
    skipAssertion?: boolean;
    doNotThrow?: boolean; // If true, do not throw on failure
  }) {
    const location = this.getCardModel(params.location);
    const character = this.getCardModel(params.character);

    const response = this.moves.moveCharToLocation({
      location: location.instanceId,
      character: character.instanceId,
    });

    if (!(response.success || params.doNotThrow)) {
      throw new Error(JSON.stringify(response));
    }

    this.wasMoveExecutedAndPropagated();

    if (!(params.skipAssertion || params.doNotThrow)) {
      expect(character.isAtLocation(location)).toBe(true);
      expect(location.containsCharacter(character)).toBe(true);
    }

    return { location, character, result: response };
  }

  getZone(zone: Zones, playerId = "player_one"): string[] {
    return (
      getCardZone(this.playerOneEngine.getCtx(), zone, playerId)?.cards || []
    );
  }

  getCardsByZone(zone: Zones, playerId = "player_one") {
    return this.getZone(zone, playerId).map((instanceId) =>
      this.authoritativeEngine.cardInstanceStore.getCardByInstanceId(
        instanceId,
      ),
    );
  }

  changeActivePlayer(playerId: string) {
    if (playerId !== "player_one" && playerId !== "player_two") {
      throw new Error(`Invalid player ID: ${playerId}`);
    }

    if (debuggers.testEngine) {
      logger.debug(`Changing active player to: ${playerId}`);
    }
    this.activePlayerEngine = playerId;
  }

  get activeEngine() {
    if (this.activePlayerEngine === "player_one") {
      return this.playerOneEngine;
    }

    if (this.activePlayerEngine === "player_two") {
      return this.playerTwoEngine;
    }

    logger.warn("==> No player has priority, returning authoritative engine");
    return this.authoritativeEngine;
  }

  getZonesCardCount(player?: string) {
    return this.authoritativeEngine.getZonesCardCount(player);
  }

  assertThatZonesContain(
    zones: Partial<Record<Zone, number>>,
    playerId?: string,
  ) {
    expect(this.getZonesCardCount(playerId)).toEqual(
      expect.objectContaining(zones),
    );
  }

  getState(): LorcanaGameState {
    // Always read state from the authoritative engine to ensure consistency
    return this.authoritativeEngine.getGameState()?.G;
  }

  getCtx(): CoreCtx {
    return this.authoritativeEngine.getCtx();
  }

  getCards() {
    return this.cards;
  }

  getCardModel(
    card: LorcanitoCard | LorcanaCardInstance,
    index?: number,
  ): LorcanaCardInstance {
    const results = this.authoritativeEngine.queryCardsByFilter({
      publicId: card.id,
    });

    if (results.length === 0) {
      throw new Error(`Unable to find card: ${card.id} (${card.name})`);
    }

    if (typeof index === "undefined" && results.length > 1) {
      throw new Error(`Multiple cards found for ${card.id} (${card.name}).`);
    }

    return results[0];
  }

  getPlayerLore(player = "player_one") {
    const ctx = this.getCtx();
    return ctx.players[player]?.lore || 0;
  }

  getNumTurns() {
    return this.authoritativeEngine.getNumTurns();
  }

  getNumMoves() {
    return this.authoritativeEngine.getNumMoves();
  }

  getNumTurnMoves() {
    return this.authoritativeEngine.getNumTurnMoves();
  }

  getGameSegment() {
    // Always read game segment from the authoritative engine to ensure consistency
    return this.authoritativeEngine.getGameSegment();
  }

  getGamePhase() {
    return this.authoritativeEngine.getGamePhase();
  }

  getGameStep() {
    return this.authoritativeEngine.getGameStep();
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
      gamePhase: this.authoritativeEngine.getCtx().currentPhase,
      gameStep: this.authoritativeEngine.getCtx().currentStep,
      priorityPlayers: this.getPriorityPlayers(),
      turnPlayer: this.getTurnPlayer(),
      numTurns: this.getNumTurns(),
      numMoves: this.getNumMoves(),
    };
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

  /**
   * Get all cards in a specific zone using the new CardManager
   */
  getCardsInZone(zone: string, owner?: string): LorcanaCardInstance[] {
    const filter: LorcanaCardFilter = {
      zone,
      owner,
    };

    // The engine's queryCards should already return properly typed LorcanaCardInstance objects
    return this.authoritativeEngine.cardInstanceStore.queryCards(filter);
  }

  // Moves
  // Moves must be called from the active engine, to ensure the correct player is making the move

  private get moves() {
    return this.activeEngine.moves;
  }

  private wasMoveExecutedAndPropagated() {
    const hashes = this.engineHashes;

    if (this.activePlayerEngine === "player_one") {
      if (hashes.playerOne !== hashes.authoritative) {
        throw new Error(
          "Player One engine state is out of sync with authoritative engine.",
        );
      }

      if (hashes.playerOne !== hashes.playerTwo) {
        throw new Error(
          "Player One engine state is out of sync with Player Two engine.",
        );
      }
    }

    if (this.activePlayerEngine === "player_two") {
      if (hashes.playerTwo !== hashes.authoritative) {
        throw new Error(
          "Player Two engine state is out of sync with authoritative engine.",
        );
      }

      if (hashes.playerTwo !== hashes.playerOne) {
        throw new Error(
          "Player Two engine state is out of sync with Player One engine.",
        );
      }
    }
  }

  chooseWhoGoesFirst(playerID: string) {
    const response = this.moves.chooseWhoGoesFirstMove(playerID);

    if (!response.success) {
      logger.error(
        `Failed to choose who goes first for player ${playerID}: ${response}`,
      );
      throw new Error(JSON.stringify(response));
    }

    this.wasMoveExecutedAndPropagated();

    return response;
  }

  alterHand(cards: InstanceId[]) {
    const response = this.moves.alterHand(cards);

    if (!response.success) {
      throw new Error(JSON.stringify(response));
    }

    this.wasMoveExecutedAndPropagated();

    return response;
  }

  putACardIntoTheInkwell(instanceId: string) {
    const response = this.moves.putACardIntoTheInkwell(instanceId);

    if (!response.success) {
      logger.error(
        `Failed to put card ${instanceId} into the inkwell: ${JSON.stringify("error" in response ? response.error : response)}`,
      );
      throw new Error(JSON.stringify(response));
    }

    this.wasMoveExecutedAndPropagated();

    return response;
  }

  passTurn() {
    const response = this.moves.passTurn();

    if (!response.success) {
      logger.error(
        `Failed to pass turn: ${JSON.stringify("error" in response ? response.error : response)}`,
      );
      throw new Error(JSON.stringify(response));
    }

    this.wasMoveExecutedAndPropagated();

    return response;
  }

  /**
   * Returns the total number of cards in the player's inkwell
   */
  getTotalInk(playerId: string): number {
    return this.authoritativeEngine.getTotalInk(playerId);
  }

  /**
   * Returns the number of ink currently available to spend
   */
  getAvailableInk(playerId: string): number {
    return this.authoritativeEngine.getAvailableInk(playerId);
  }
}

export function createLorcanaEngineMocks(
  playerState: TestInitialState = {},
  opponentState: TestInitialState = {},
  skipPreMatch = true,
) {
  const lorcanaGameState = createEmptyLorcanaGameState(
    "TEST_MATCH_ID",
    "TEST_GAME_ID",
    "SEED",
    "", // No first player initially - will be set by chooseWhoGoesFirst
    ["player_one", "player_two"],
  );

  const initialCoreContext = createCtx({
    playerOrder: ["player_one", "player_two"],
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
    // Set initial segment and phase based on skipPreMatch
    initialSegment: skipPreMatch ? "duringGame" : "startingAGame",
    initialPhase: skipPreMatch ? "mainPhase" : "chooseFirstPlayer",
    initialStep: skipPreMatch ? "idle" : undefined,
  });

  if (skipPreMatch) {
    // When skipping pre-match, set player_one as the turn player and priority player
    initialCoreContext.otp = "player_one";
    initialCoreContext.turnPlayerPos = 0; // player_one is at index 0
    initialCoreContext.priorityPlayerPos = 0; // player_one has priority
  } else {
    // Set up for pre-game phase where first player needs to be chosen
    initialCoreContext.choosingFirstPlayer = "player_one";
  }

  const ids = createShortAndUniqueIds(120);
  updateInitialState(
    "player_one",
    playerState,
    lorcanaGameState,
    ids,
    initialCoreContext,
  );
  updateInitialState(
    "player_two",
    opponentState,
    lorcanaGameState,
    ids,
    initialCoreContext,
  );

  return {
    game: JSON.parse(JSON.stringify(lorcanaGameState)) as LorcanaGameState,
    initialCoreContext: JSON.parse(
      JSON.stringify(initialCoreContext),
    ) as CoreCtx,
  };
}

function updateInitialState(
  playerId: string,
  state: TestInitialState,
  game: LorcanaGameState,
  ids: string[],
  initialCoreContext: CoreCtx,
) {
  const { lore, ...zones } = state;

  if (!initialCoreContext.cardZones) {
    initialCoreContext.cardZones = {};
  }

  initialCoreContext.cardZones[`${playerId}-discard`] = {
    id: `${playerId}-discard`,
    name: "discard",
    owner: playerId,
    visibility: "public",
    cards: [],
  };

  initialCoreContext.cardZones[`${playerId}-inkwell`] = {
    id: `${playerId}-inkwell`,
    name: "inkwell",
    owner: playerId,
    visibility: "secret",
    cards: [],
  };

  initialCoreContext.cardZones[`${playerId}-hand`] = {
    id: `${playerId}-hand`,
    name: "hand",
    owner: playerId,
    visibility: "private",
    cards: [],
  };

  initialCoreContext.cardZones[`${playerId}-play`] = {
    id: `${playerId}-play`,
    name: "play",
    owner: playerId,
    visibility: "public",
    cards: [],
  };

  initialCoreContext.cardZones[`${playerId}-deck`] = {
    id: `${playerId}-deck`,
    name: "deck",
    owner: playerId,
    visibility: "secret",
    ordered: true,
    cards: [],
  };

  for (const zone of Object.keys(zones)) {
    const zoneKey = zone as Zone;
    const value = state[zoneKey];
    const zoneCards: LorcanitoCard[] =
      typeof value === "number"
        ? range(value).map(() => testCharacterCard)
        : (value as LorcanitoCard[]);

    if (zoneCards) {
      for (const card of zoneCards.filter(Boolean)) {
        const instanceId = ids.pop() || createId();

        if (initialCoreContext.cards[playerId]) {
          initialCoreContext.cards[playerId][instanceId] = card.id;
        } else {
          initialCoreContext.cards[playerId] = {
            [instanceId]: card.id,
          };
        }

        const playerTable =
          initialCoreContext.cardZones[`${playerId}-${zoneKey}`];
        if (playerTable) {
          playerTable.cards.push(instanceId);
        }
      }
    }
  }

  // Store lore data in player state if provided
  if (lore !== undefined) {
    initialCoreContext.players[playerId].lore = lore;
  }
}
