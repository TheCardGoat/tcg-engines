/**
 * Deterministic QA fixtures for real practice-deck matchups.
 *
 * Unlike the player-facing practice flow, these fixtures deliberately put the
 * main deck into each player's deck. Equipment remains outside the deck: the
 * default loadout starts equipped and the rest stays in inventory. These are
 * test setup, not a format-legal pregame selection.
 */
import {
  DEFAULT_BOT_DECK_ID,
  DEFAULT_PLAYER_DECK_ID,
  PRACTICE_PLAYER_1,
  PRACTICE_PLAYER_2,
  type FabPracticeMatchFixtureInput,
} from "@tcg/flesh-and-blood-engine/automation";
import { seedFromString, shuffleWith } from "@tcg/flesh-and-blood-engine/simulator";
import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import { FabTestEngine, type FabTestFixture } from "@tcg/flesh-and-blood-engine/testing";

import { resolvePracticeDeckSelection, type ResolvedPracticeSeat } from "./resolve-text-deck";
import { applyFabVisualFixtureAutomation } from "../fixture-automation";

const OPENING_HAND_SIZE = 4;

function mainDeckCards(seat: ResolvedPracticeSeat): string[] {
  return seat.cardPool.entries.flatMap((entry) =>
    entry.source === "main" ? Array.from({ length: entry.quantity }, () => entry.canonicalId) : [],
  );
}

function materializeQaDeck(seat: ResolvedPracticeSeat, seed: string) {
  const shuffled = shuffleWith(
    mainDeckCards(seat),
    seedFromString(`${seed}:qa-matchup-deck:${seat.deckId}`),
  ).array;

  return {
    heroCardId: seat.player.heroCardId,
    life: seat.player.life,
    hand: shuffled.slice(0, OPENING_HAND_SIZE),
    deck: shuffled.slice(OPENING_HAND_SIZE),
    // Keep the route's default legal loadout on the board and all remaining
    // equipment in inventory; CR 4.1.5a excludes arena-cards from a deck.
    head: seat.player.head,
    chest: seat.player.chest,
    arms: seat.player.arms,
    legs: seat.player.legs,
    weapon1: seat.player.weapon1,
    weapon2: seat.player.weapon2,
    inventory: seat.player.inventory,
  };
}

/**
 * Build an engine fixture from two real practice decks for QA.
 *
 * Both seats receive their tournament main deck, default equipment loadout,
 * and remaining equipment inventory. A given seed always produces the same
 * opening hand and remaining deck order; use a different seed to inspect
 * another deterministic order.
 */
export function buildFabPracticeMatchupFixture(
  input: FabPracticeMatchFixtureInput = {},
): FabTestFixture {
  const seed = input.seed ?? "fab-practice-matchup";
  const player1Id = input.player1Id ?? PRACTICE_PLAYER_1;
  const player2Id = input.player2Id ?? PRACTICE_PLAYER_2;
  const player1 = resolvePracticeDeckSelection(input.player1DeckId ?? DEFAULT_PLAYER_DECK_ID, seed);
  const player2 = resolvePracticeDeckSelection(
    input.player2DeckId ?? DEFAULT_BOT_DECK_ID,
    `${seed}:p2`,
  );

  return {
    seed,
    player1Id,
    player2Id,
    firstPlayerId: input.firstPlayerId ?? player1Id,
    player1: {
      ...materializeQaDeck(player1, seed),
      ...(input.player1Life === undefined ? {} : { life: input.player1Life }),
    },
    player2: {
      ...materializeQaDeck(player2, `${seed}:p2`),
      ...(input.player2Life === undefined ? {} : { life: input.player2Life }),
    },
    cardDefinitions: { ...player1.cardDefinitions, ...player2.cardDefinitions },
  };
}

/** Boot a real-deck QA fixture through the same local engine used by practice. */
export function createFabPracticeMatchup(
  input: FabPracticeMatchFixtureInput = {},
): FabPracticeMatch {
  const fixture = buildFabPracticeMatchupFixture(input);
  const engine = FabTestEngine.create(fixture);
  const player1Id = fixture.player1Id ?? PRACTICE_PLAYER_1;
  const player2Id = fixture.player2Id ?? PRACTICE_PLAYER_2;
  applyFabVisualFixtureAutomation(engine, player1Id, player2Id);
  return {
    runtime: engine.getRuntime(),
    engine,
    player1Id,
    player2Id,
    seed: fixture.seed ?? "fab-practice-matchup",
  };
}
