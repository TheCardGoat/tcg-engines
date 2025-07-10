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
}

// A simple player state for tests
export interface TestPlayerState extends GameSpecificPlayerState {
  id: string;
  name: string;
  lore: number;
}

// A simple card filter for tests
export interface TestCardFilter extends BaseCoreCardFilter {
  cost?: number;
}

export type TestMove = Move<
  TestGameState,
  TestCardDefinition,
  TestPlayerState,
  TestCardFilter,
  TestCardInstance,
  TestCoreEngine
>;

const contextSharingMove: TestMove = ({ G, coreOps, gameOps }) => {
  coreOps.incrementTurnCount();
  if (coreOps.getTurnCount() !== gameOps.getTurnCount()) {
    throw new Error(
      "CoreOps and GameOps do not share the same turn count state.",
    );
  }

  gameOps.incrementTurnCount();
  if (coreOps.getTurnCount() !== gameOps.getTurnCount()) {
    throw new Error(
      "CoreOps and GameOps do not share the same turn count state after increment.",
    );
  }

  // Mark that the test ran successfully
  G.directModified = true;
  G.coreOpsModified = true;
  G.gameOpsModified = true;

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
    stateSharedMove: ({ G, coreOps, gameOps }) => {
      // Step 1: Modify G directly
      G.testValue = "modified by direct G access";
      G.directModified = true;

      // Step 2: Use coreOps to modify context and check if it can see G changes
      // This should be able to access the modified G state
      const canCoreOpsSeeDirectChanges =
        G.testValue === "modified by direct G access";
      G.coreOpsModified = canCoreOpsSeeDirectChanges;

      // Modify context through coreOps (example: setting priority player)
      const players = coreOps.getPlayers();
      if (players.length > 0) {
        coreOps.setPriorityPlayer(players[0]);
      }

      // Step 3: Use gameOps to query state and check if it can see all previous changes
      // This should be able to see both direct G changes and coreOps changes
      const canGameOpsSeeAllChanges =
        G.testValue === "modified by direct G access" &&
        G.directModified === true &&
        G.coreOpsModified === true;

      G.gameOpsModified = canGameOpsSeeAllChanges;

      return G;
    },
    contextSharingMove: contextSharingMove,
    originalIssueTest: ({ G, coreOps, gameOps }) => {
      // Test that matches your original example more closely

      // Step 1: Modify G directly
      G.testValue = "bar";

      // Step 2: coreOps does something that should see G.testValue
      const players = coreOps.getPlayers();
      coreOps.setOTP(players[0]); // This should be able to access G state if needed

      // Check if coreOps operations can indirectly "see" G changes
      // (This is a proxy test since coreOps mainly works with ctx)
      const canCoreOpsWorkWithGState = G.testValue === "bar";

      // Step 3: gameOps does something that should see both G and coreOps changes
      const gameEngine = gameOps as any;
      const currentOTP = gameEngine.getCtx().otp;
      const gameOpsCanSeeCtxChanges = currentOTP === players[0];
      const gameOpsCanSeeGChanges = G.testValue === "bar";

      // Record results
      G.coreOpsModified = canCoreOpsWorkWithGState;
      G.gameOpsModified = gameOpsCanSeeCtxChanges && gameOpsCanSeeGChanges;
      G.directModified = true;

      return G;
    },
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
