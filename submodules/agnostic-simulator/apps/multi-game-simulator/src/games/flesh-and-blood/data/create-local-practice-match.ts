/**
 * Local practice match factory for the multi-game FAB simulator.
 *
 * Accepts format-legal tournament text fixture ids and seats them through
 * {@link resolvePracticeDeckSelection}.
 */
import { FabTestEngine, type FabTestFixture } from "@tcg/flesh-and-blood-engine/testing";
import {
  DEFAULT_BOT_DECK_ID,
  DEFAULT_PLAYER_DECK_ID,
  PRACTICE_PLAYER_1,
  PRACTICE_PLAYER_2,
  type FabPracticeMatchFixtureInput,
} from "@tcg/flesh-and-blood-engine/automation";
import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";

import { resolvePracticeDeckSelection, type ResolvedPracticeSeat } from "./resolve-text-deck";

export type { FabPracticeMatchFixtureInput as FabLocalPracticeMatchInput } from "@tcg/flesh-and-blood-engine/automation";

/** Create a local engine-backed practice match from tournament decks. */
export function createFabLocalPracticeMatch(
  input: FabPracticeMatchFixtureInput = {},
): FabPracticeMatch {
  const seed = input.seed ?? "fab-practice";
  const player1Id = input.player1Id ?? PRACTICE_PLAYER_1;
  const player2Id = input.player2Id ?? PRACTICE_PLAYER_2;
  const player1DeckId = input.player1DeckId ?? DEFAULT_PLAYER_DECK_ID;
  const player2DeckId = input.player2DeckId ?? DEFAULT_BOT_DECK_ID;

  const player1 = resolvePracticeDeckSelection(player1DeckId, seed);
  const player2 = resolvePracticeDeckSelection(player2DeckId, `${seed}:p2`);

  const fixture: FabTestFixture = {
    seed,
    player1Id,
    player2Id,
    firstPlayerId: input.firstPlayerId ?? player1Id,
    player1: player1.player,
    player2: player2.player,
    cardDefinitions: {
      ...player1.cardDefinitions,
      ...player2.cardDefinitions,
    },
    ...(input.automation ? { automation: input.automation } : {}),
  };

  const engine = FabTestEngine.create(fixture);
  return {
    runtime: engine.getRuntime(),
    engine,
    player1Id,
    player2Id,
    seed,
  };
}

/** Start local practice with an externally decoded player seat and a curated bot deck. */
export function createFabLocalPracticeMatchFromPlayerSeat(
  player1: ResolvedPracticeSeat,
  input: Omit<FabPracticeMatchFixtureInput, "player1DeckId" | "firstPlayerId"> & {
    readonly firstPlayerId: string;
    readonly opponent?: ResolvedPracticeSeat;
  },
): FabPracticeMatch {
  const seed = input.seed ?? "fab-practice";
  const player1Id = input.player1Id ?? PRACTICE_PLAYER_1;
  const player2Id = input.player2Id ?? PRACTICE_PLAYER_2;
  const player2 =
    input.opponent ??
    resolvePracticeDeckSelection(input.player2DeckId ?? DEFAULT_BOT_DECK_ID, `${seed}:p2`);
  const engine = FabTestEngine.create({
    seed,
    player1Id,
    player2Id,
    firstPlayerId: input.firstPlayerId,
    player1: player1.player,
    player2: player2.player,
    cardDefinitions: { ...player1.cardDefinitions, ...player2.cardDefinitions },
    ...(input.automation ? { automation: input.automation } : {}),
  });
  return { runtime: engine.getRuntime(), engine, player1Id, player2Id, seed };
}
