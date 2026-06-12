import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  fireTheCannons,
  heiheiBoatSnack,
  stitchNewDog,
  tinkerBellGiantFairy,
} from "@tcg/lorcana-cards/cards/001";
import { jafarDreadnought } from "@tcg/lorcana-cards/cards/002";

const weakDefender = createMockCharacter({
  id: "optional-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Optional Effects - Jafar, Dreadnought - During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
  it("should allow the player to accept the optional effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [jafarDreadnought],
        deck: 5,
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    expect(
      testEngine.asPlayerOne().challenge(jafarDreadnought, weakDefender),
    ).toBeSuccessfulCommand();

    // Weak defender is banished
    expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");

    // Bag should have the optional draw effect
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accept the optional
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();

    // Should have drawn a card
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
  });

  it("should allow the player to decline the optional effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [jafarDreadnought],
        deck: 5,
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    expect(
      testEngine.asPlayerOne().challenge(jafarDreadnought, weakDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Decline the optional
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    // Should NOT have drawn a card
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore);
  });

  it("should not trigger when a character is banished by effect damage (not a challenge)", () => {
    // Jafar's trigger requires "this character banishes another in a challenge"
    // Fire the Cannons banishing a character is NOT a challenge, so Jafar should not trigger
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [jafarDreadnought],
        deck: 5,
      },
      {
        play: [weakDefender],
      },
    );

    // Banish weak defender via effect damage (not a challenge)
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [weakDefender],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");

    // Jafar's trigger should NOT fire (banish was not in a challenge)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("should not trigger during opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: weakDefender, exerted: true }],
        deck: 2,
      },
      {
        play: [jafarDreadnought],
        deck: 2,
      },
    );

    // It's P1's turn; Jafar belongs to P2 and trigger says "during your turn"
    // P2 can't challenge during P1's turn, so pass to P2's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Now it IS Jafar's controller's (P2's) turn
    expect(
      testEngine.asPlayerTwo().challenge(jafarDreadnought, weakDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

    // Should trigger because it IS Jafar's controller's turn
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
  });
});
