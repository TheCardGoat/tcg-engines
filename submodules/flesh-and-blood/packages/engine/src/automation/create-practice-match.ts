import { FabTestEngine } from "../testing/test-engine.ts";
import { buildFabPracticeTestFixture, type FabPracticeMatchFixtureInput } from "./sample-decks.ts";
import type { FabDeckCardLibrary } from "./resolve-text-deck.ts";
import type { FabPracticeMatch } from "./practice-match.ts";

export type { FabPracticeMatch } from "./practice-match.ts";

/** Create a local engine-backed match from two format-legal catalog decks. */
export function createFabPracticeMatch(
  cardLibrary: FabDeckCardLibrary,
  input: FabPracticeMatchFixtureInput = {},
): FabPracticeMatch {
  const fixture = buildFabPracticeTestFixture(cardLibrary, input);
  const engine = FabTestEngine.create(fixture);
  return {
    runtime: engine.getRuntime(),
    engine,
    player1Id: fixture.player1Id ?? "player-1",
    player2Id: fixture.player2Id ?? "player-2",
    seed: fixture.seed ?? "fab-practice",
  };
}
