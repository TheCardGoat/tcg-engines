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
  liloMakingAWish,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { queenOfHeartsCapriciousMonarch } from "@tcg/lorcana-cards/cards/002";

const weakDefender = createMockCharacter({
  id: "banish-trigger-weak",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("OFF WITH THEIR HEADS! - Queen of Hearts, Capricious Monarch - Whenever an opposing character is banished, you may ready this character.", () => {
  it("should trigger when an opposing character is banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: queenOfHeartsCapriciousMonarch, exerted: true, isDrying: false },
          { card: stitchNewDog, isDrying: false },
        ],
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(true);

    // Challenge and banish opponent's character
    expect(testEngine.asPlayerOne().challenge(stitchNewDog, weakDefender)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");

    // Queen's trigger should fire (optional ready)
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Accept the optional to ready Queen
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(false);
  });

  it("should trigger when an opposing character is banished by an effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [{ card: queenOfHeartsCapriciousMonarch, exerted: true, isDrying: false }],
      },
      {
        play: [weakDefender],
      },
    );

    // Deal 2 damage to the 1-wp opponent => banished
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [weakDefender],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");

    // Queen's trigger should fire
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
  });

  it("should NOT trigger when one of your own characters is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
        play: [
          { card: queenOfHeartsCapriciousMonarch, exerted: true, isDrying: false },
          weakDefender,
        ],
      },
      {},
    );

    // Banish our own character
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [weakDefender],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

    // Queen's trigger should NOT fire (it's "opposing character", not own)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("should allow declining the optional trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: queenOfHeartsCapriciousMonarch, exerted: true, isDrying: false },
          { card: stitchNewDog, isDrying: false },
        ],
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().challenge(stitchNewDog, weakDefender)).toBeSuccessfulCommand();

    // Decline the optional
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    // Queen should stay exerted
    expect(testEngine.asPlayerOne().isExerted(queenOfHeartsCapriciousMonarch)).toBe(true);
  });
});
