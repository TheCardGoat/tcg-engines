import { DECK_FIXTURES } from "../deck-fixtures/index.js";
import { DEFAULT_AUTOMATED_ACTION_STRATEGY_ID } from "@tcg/lorcana-engine";
import type { AutomatedMatchConfig } from "./types.js";

const EMPTY_FIXTURE = {
  cards: "",
  id: "custom-deck",
  name: "Custom deck",
} as const;

const DEFAULT_PLAYER_ONE_FIXTURE = DECK_FIXTURES[0] ?? EMPTY_FIXTURE;
const DEFAULT_PLAYER_TWO_FIXTURE = DECK_FIXTURES[1] ?? DEFAULT_PLAYER_ONE_FIXTURE;

export function createAutomatedMatchSeed(now = Date.now()): string {
  if (!Number.isFinite(now)) {
    throw new RangeError("Automated match seed requires a finite timestamp.");
  }

  return `ai-match:${now}`;
}

export function createDefaultAutomatedMatchConfig(): AutomatedMatchConfig {
  return {
    playerOneDeckText: DEFAULT_PLAYER_ONE_FIXTURE?.cards ?? "",
    playerTwoDeckText: DEFAULT_PLAYER_TWO_FIXTURE?.cards ?? "",
    playerOneFixtureId: DEFAULT_PLAYER_ONE_FIXTURE?.id,
    playerTwoFixtureId: DEFAULT_PLAYER_TWO_FIXTURE?.id,
    playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    playerTwoStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    seed: createAutomatedMatchSeed(0),
  };
}

type DeckFixtureSelectionConfig = {
  playerOneDeckText: string;
  playerOneFixtureId?: string;
  playerTwoDeckText: string;
  playerTwoFixtureId?: string;
};

export function getDeckFixtureById(id?: string) {
  if (!id) {
    return undefined;
  }

  return DECK_FIXTURES.find((fixture) => fixture.id === id);
}

export function replaceDeckTextWithFixture<TConfig extends DeckFixtureSelectionConfig>(
  config: TConfig,
  side: "playerOne" | "playerTwo",
  fixtureId: string,
): TConfig {
  const fixture = getDeckFixtureById(fixtureId);
  if (!fixture) {
    return config;
  }

  if (side === "playerOne") {
    return {
      ...config,
      playerOneDeckText: fixture.cards,
      playerOneFixtureId: fixture.id,
    };
  }

  return {
    ...config,
    playerTwoDeckText: fixture.cards,
    playerTwoFixtureId: fixture.id,
  };
}
