/**
 * Wilds Unknown (Set 012) — Rules Clarifications Test Specification
 *
 * Source: .agents/skills/lorcana-rules/references/wilds-unknown-release-notes
 *
 * Covers two rules clarifications that need full multiplayer-flow harness:
 *   1. Drying characters can't {E} for any reason (5.1.1.11/12).
 *   2. When a location leaves play, visiting characters stay in play and
 *      `atLocationId` clears (5.6.5.1 / 5.6.6).
 *
 * These live in the simulator package because they exercise gameplay flow
 * via `LorcanaMultiplayerTestEngine` — the engine package's unit tests use
 * the lighter `unit-harness` and don't import the multiplayer engine.
 */

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
  createMockSong,
} from "@tcg/lorcana-engine/testing";

describe("Wilds Unknown — drying characters cannot exert for any reason (5.1.1.11/12)", () => {
  it("drying singer cannot be exerted to sing a song", () => {
    const dryingSinger = createMockCharacter({
      id: "drying-singer",
      name: "Drying Singer",
      cost: 5,
    });

    const song = createMockSong({
      id: "drying-test-song",
      name: "Test Song",
      cost: 4,
      text: "Test song effect.",
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song, dryingSinger],
      inkwell: dryingSinger.cost,
    });

    // Play the singer this turn so it is drying.
    expect(engine.asPlayerOne().playCard(dryingSinger)).toBeSuccessfulCommand();

    // Attempt to sing the song using the drying singer — must fail.
    expect(engine.asPlayerOne().singSong(song, dryingSinger)).not.toBeSuccessfulCommand();

    // Singer must remain ready (not exerted) and the song still in hand.
    expect(engine.asPlayerOne().isExerted(dryingSinger)).toBe(false);
    expect(engine.asPlayerOne().getCardZone(song)).toBe("hand");
  });
});

describe("Wilds Unknown — banished location clears atLocation on visiting characters (5.6.5.1 / 5.6.6)", () => {
  it("character at a banished location stays in play and atLocationId clears", () => {
    const fragileLocation = createMockLocation({
      id: "banished-loc-fragile",
      name: "Fragile Location",
      cost: 2,
      moveCost: 1,
      willpower: 3,
      lore: 1,
    });

    const visitor = createMockCharacter({
      id: "banished-loc-visitor",
      name: "Visitor",
      cost: 2,
      strength: 1,
      willpower: 4,
      lore: 1,
    });

    const attacker = createMockCharacter({
      id: "banished-loc-attacker",
      name: "Attacker",
      cost: 3,
      strength: 3,
      willpower: 3,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: attacker, isDrying: false }] },
      {
        play: [fragileLocation, { card: visitor, atLocation: fragileLocation, isDrying: false }],
      },
    );

    // Sanity: visitor starts at the location.
    const visitorBefore = engine.asPlayerTwo().getCard(visitor);
    expect(visitorBefore.atLocationId).toBeDefined();

    // Player One challenges and banishes the location with lethal damage.
    const locationId = engine.findCardInstanceId(fragileLocation, "play", PLAYER_TWO);
    expect(engine.asPlayerOne().challenge(attacker, locationId)).toBeSuccessfulCommand();

    // Location should be banished.
    expect(engine.asPlayerTwo().getCardZone(fragileLocation)).toBe("discard");

    // Visitor must remain in play but no longer be at any location.
    expect(engine.asPlayerTwo().getCardZone(visitor)).toBe("play");
    const visitorAfter = engine.asPlayerTwo().getCard(visitor);
    expect(visitorAfter.atLocationId).toBeUndefined();
  });
});
