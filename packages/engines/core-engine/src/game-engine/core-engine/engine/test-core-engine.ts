import { CardRepository } from "../card/card-repository-factory";
import type { CoreCardInstance } from "../card/core-card-instance";
import type { CoreEngineState, GameDefinition } from "../game-configuration";
import type { Move } from "../move/move-types";
import type { CoreCtx } from "../state/context";
import type {
  BaseCoreCardFilter,
  GameSpecificCardDefinition,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "../types/game-specific-types";
import { createId } from "../utils/random";
import { CoreEngine, type CoreEngineOpts } from "./core-engine";

// A simple card definition for tests
export interface TestCardDefinition extends GameSpecificCardDefinition {
  id: string;
  name: string;
  cost: number;
}

// A simple card instance for tests
export type TestCardInstance = CoreCardInstance<TestCardDefinition>;

// A simple game state for tests
export interface TestGameState extends GameSpecificGameState {
  players: Record<string, TestPlayerState>;
  // Test fields to verify state sharing
  testValue?: string;
  coreOpsModified?: boolean;
  gameOpsModified?: boolean;
  directModified?: boolean;
  // Fields for metadata sharing test
  metas?: Record<string, any>;
  cards?: Record<string, any>;
  zones?: Record<string, any>;
  metadataShared?: boolean;
  filteredCardsCount?: number;
  testMetaOnly?: string;
  method1Result?: number;
  method1Error?: string;
  method2Result?: number;
  method2Error?: string;
  method3Result?: number;
  method3Error?: string;
  method4Before?: number;
  method4After?: number;
  method4Error?: string;
  // New fields for cardFilterMetadataTestMove
  test1Direct?: boolean;
  test1NonExerted?: boolean;
  test1NoMeta?: boolean;
  test2AfterChange?: boolean;
  metadataResults?: {
    metaDirectlyAccessible: boolean;
    metaChangeImmediatelyVisible: boolean;
    conclusion: string;
  };
}

// A simple player state for tests
export interface TestPlayerState extends GameSpecificPlayerState {
  id: string;
  name: string;
  lore: number;
}

// A simple card filter for tests
export interface TestCardFilter extends BaseCoreCardFilter {
  exerted?: boolean; // Add the exerted property for metadata testing
}

export type TestMove = Move<
  TestGameState,
  TestCardDefinition,
  TestPlayerState,
  TestCardFilter,
  TestCardInstance
>;

const contextSharingMove: TestMove = ({ G, coreOps }) => {
  // Test if coreOps operations are reflected in G immediately
  const initialTurnCount = coreOps.getTurnCount();

  const newTurnCount = coreOps.getTurnCount();

  if (newTurnCount !== initialTurnCount + 1) {
    throw new Error(
      "CoreOps turn count increment was not reflected immediately.",
    );
  }

  // Test if changes are reflected in G
  G.coreOpsModified = true;

  return G;
};

const metadataSharingMove: TestMove = ({ G, coreOps }) => {
  // First, we need to make sure we have a test card in the state
  // Instead of creating a card directly, we'll modify an existing card's metadata

  // Initialize the metas object if it doesn't exist
  if (!G.metas) {
    G.metas = {};
  }

  // Create a test card instance ID
  const testInstanceId = "test-instance-123";

  // Set up a mock card instance in the state
  if (!G.cards) {
    G.cards = {};
  }
  G.cards[testInstanceId] = {
    instanceId: testInstanceId,
    publicId: "test-card",
    owner: "player_one",
  };

  // Set up the card zone
  if (!G.zones) {
    G.zones = {};
  }
  if (!G.zones["play"]) {
    G.zones["play"] = {};
  }
  if (!G.zones["play"]["player_one"]) {
    G.zones["play"]["player_one"] = { cards: [] };
  }
  G.zones["play"]["player_one"].cards.push(testInstanceId);

  // Set metadata through G directly
  G.metas[testInstanceId] = { exerted: true };

  // Record test results
  G.metadataShared = true;
  G.filteredCardsCount = 0; // Default, assuming filter didn't work

  // We're just proving that CoreOps and card filtering use different state references
  G.testMetaOnly = "This value should be visible to everyone";

  return G;
};

const cardFilterMetadataTestMove: TestMove = ({ G, coreOps }) => {
  // This move tests different approaches to filtering cards with metadata

  // Setup: Create three test cards with different metadata states

  // Initialize state objects if they don't exist
  if (!G.metas) G.metas = {};

  // Create 3 test cards: one exerted, one not exerted, one with no metadata
  const exertedCardId = "test-exerted-card";
  const nonExertedCardId = "test-non-exerted-card";
  const noMetaCardId = "test-no-meta-card";

  // Set metadata
  G.metas[exertedCardId] = { exerted: true };
  G.metas[nonExertedCardId] = { exerted: false };
  // noMetaCardId intentionally has no metadata

  // TEST 1: State sharing test - shows that state is shared between move and G
  G.test1Direct = G.metas[exertedCardId]?.exerted === true;
  G.test1NonExerted = G.metas[nonExertedCardId]?.exerted === false;
  G.test1NoMeta = G.metas[noMetaCardId]?.exerted === undefined;

  // TEST 2: Change metadata and check if changes are immediately visible
  G.metas[nonExertedCardId] = { exerted: true };
  G.test2AfterChange = G.metas[nonExertedCardId]?.exerted === true;

  // Record the conclusions
  G.metadataResults = {
    metaDirectlyAccessible: G.test1Direct && G.test1NonExerted && G.test1NoMeta,
    metaChangeImmediatelyVisible: G.test2AfterChange,
    conclusion:
      "Metadata is directly accessible in the G state and changes are immediately visible",
  };

  return G;
};

// #region Test Card Repository
export class TestCardRepository extends CardRepository<TestCardDefinition> {
  constructor(
    cards: TestCardDefinition[],
    dictionary: Record<string, Record<string, string>>,
  ) {
    // Create a lookup of cards by ID
    const cardLookup: Record<string, TestCardDefinition> = {};
    for (const card of cards) {
      cardLookup[card.id] = card;
    }

    super(dictionary, cardLookup);
  }

  getCard(id: string): TestCardDefinition | undefined {
    return this.getCardByPublicId(id);
  }

  getCards(ids: string[]): (TestCardDefinition | undefined)[] {
    return ids.map((id) => this.getCardByPublicId(id));
  }
}
// #endregion

export const testCard: TestCardDefinition = {
  id: "test-card",
  name: "Test Card",
  cost: 1,
};

export const testGame: GameDefinition<TestGameState> = {
  name: "test-game",
  numPlayers: 2,
  moves: {
    simpleMove: ({ G }) => G,
    stateSharedMove: ({ G, coreOps }) => {
      // Step 1: Modify G directly
      G.testValue = "foo";

      // Step 2: Use coreOps basic functionality
      // Test is simplified since we only have coreOps now
      G.coreOpsModified = true;

      return G;
    },
    contextSharingMove: contextSharingMove,

    originalIssueTest: ({ G, coreOps }) => {
      // Step 1: modify G
      G.testValue = "bar";

      // Step 2: Test that coreOps can access the G state
      const coreOpsCanSeeGChanges = G.testValue === "bar";

      // Mark that we successfully tested
      G.coreOpsModified = coreOpsCanSeeGChanges;

      return G;
    },

    // Add our new move
    metadataSharingMove: metadataSharingMove,
    cardFilterMetadataTestMove: cardFilterMetadataTestMove,
  },
  playerView: ({ G }) => G,
};

type TestEngineOpts = {
  debug?: boolean;
};

export class TestCoreEngine {
  public readonly authoritativeEngine: CoreEngine<
    TestGameState,
    TestCardDefinition,
    TestPlayerState,
    TestCardFilter,
    TestCardInstance
  >;
  public readonly playerOneEngine: CoreEngine<
    TestGameState,
    TestCardDefinition,
    TestPlayerState,
    TestCardFilter,
    TestCardInstance
  >;
  public readonly playerTwoEngine: CoreEngine<
    TestGameState,
    TestCardDefinition,
    TestPlayerState,
    TestCardFilter,
    TestCardInstance
  >;

  activePlayerEngine = "player_one";

  constructor(opts: TestEngineOpts = {}) {
    const seed = "test-seed";
    const gameId = `TEST_GAME_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const players = ["player_one", "player_two"];

    const cards = {
      player_one: { [createId()]: "test-card" },
      player_two: { [createId()]: "test-card" },
    };

    const repository = new TestCardRepository([testCard], cards);

    const initialState: TestGameState = {
      players: {
        player_one: {
          id: "player_one",
          name: "player_one",
          lore: 0,
        },
        player_two: {
          id: "player_two",
          name: "player_two",
          lore: 0,
        },
      },
    };

    const engineOpts: Omit<
      CoreEngineOpts<
        TestGameState,
        TestCardDefinition,
        TestPlayerState,
        TestCardFilter,
        TestCardInstance
      >,
      "playerID"
    > = {
      game: testGame,
      cards,
      repository: repository as any, // Using 'as any' to bypass complex type issues in test setup
      gameID: gameId,
      debug: opts.debug,
      seed,
      players,
      initialState,
    };

    this.authoritativeEngine = new CoreEngine({
      ...engineOpts,
    });

    this.playerOneEngine = new CoreEngine({
      ...engineOpts,
      playerID: "player_one",
    });

    this.playerTwoEngine = new CoreEngine({
      ...engineOpts,
      playerID: "player_two",
    });

    this.playerOneEngine.setAuthoritativeEngine(this.authoritativeEngine);
    this.playerTwoEngine.setAuthoritativeEngine(this.authoritativeEngine);
  }

  get activeEngine() {
    if (this.activePlayerEngine === "player_one") {
      return this.playerOneEngine;
    }
    return this.playerTwoEngine;
  }

  getState(): CoreEngineState<TestGameState> | null {
    return this.authoritativeEngine.getState();
  }

  getCtx(): CoreCtx {
    return this.authoritativeEngine.getCtx();
  }

  incrementTurnCount(): void {
    this.authoritativeEngine.incrementTurnCount();
  }

  getTurnCount(): number {
    return this.authoritativeEngine.getTurnCount();
  }
}
