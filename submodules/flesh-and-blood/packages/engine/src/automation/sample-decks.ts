import type { FabTestFixture } from "../testing/test-fixtures.ts";
import { DEFAULT_BOT_DECK_ID, DEFAULT_PLAYER_DECK_ID } from "./deck-text-fixtures.ts";
import { resolveSafeFabDeckSelection, type FabDeckCardLibrary } from "./resolve-text-deck.ts";

export const PRACTICE_PLAYER_1 = "player-1";
export const PRACTICE_PLAYER_2 = "player-2";

export interface FabPracticeMatchFixtureInput {
  readonly player1DeckId?: string;
  readonly player2DeckId?: string;
  readonly seed?: string;
  readonly firstPlayerId?: string;
  readonly player1Id?: string;
  readonly player2Id?: string;
  readonly player1Life?: number;
  readonly player2Life?: number;
  /** Saved account automation defaults applied to the human seat at creation. */
  readonly automation?: FabTestFixture["automation"];
}

/** Build a {@link FabTestFixture} seating two format-legal catalog decks. */
export function buildFabPracticeTestFixture(
  cardLibrary: FabDeckCardLibrary,
  input: FabPracticeMatchFixtureInput = {},
): FabTestFixture {
  const seed = input.seed ?? "fab-practice";
  const player1 = resolveSafeFabDeckSelection(
    cardLibrary,
    input.player1DeckId,
    seed,
    DEFAULT_PLAYER_DECK_ID,
  );
  const player2 = resolveSafeFabDeckSelection(
    cardLibrary,
    input.player2DeckId,
    `${seed}:p2`,
    DEFAULT_BOT_DECK_ID,
  );

  return {
    seed,
    player1Id: input.player1Id ?? PRACTICE_PLAYER_1,
    player2Id: input.player2Id ?? PRACTICE_PLAYER_2,
    firstPlayerId: input.firstPlayerId ?? input.player1Id ?? PRACTICE_PLAYER_1,
    player1: {
      ...player1.player,
      ...(input.player1Life !== undefined ? { life: input.player1Life } : {}),
    },
    player2: {
      ...player2.player,
      ...(input.player2Life !== undefined ? { life: input.player2Life } : {}),
    },
    cardDefinitions: {
      ...player1.cardDefinitions,
      ...player2.cardDefinitions,
    },
    ...(input.automation ? { automation: input.automation } : {}),
  };
}
