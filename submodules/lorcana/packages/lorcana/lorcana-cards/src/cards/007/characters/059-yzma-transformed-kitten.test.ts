import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yzmaTransformedKitten } from "./059-yzma-transformed-kitten";

const opposingAttacker = createMockCharacter({
  id: "yzma-transformed-kitten-attacker",
  name: "Opposing Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const firstHandCard = createMockCharacter({
  id: "yzma-transformed-kitten-hand-1",
  name: "First Hand Card",
  cost: 1,
});

const secondHandCard = createMockCharacter({
  id: "yzma-transformed-kitten-hand-2",
  name: "Second Hand Card",
  cost: 2,
});

const thirdHandCard = createMockCharacter({
  id: "yzma-transformed-kitten-hand-3",
  name: "Third Hand Card",
  cost: 3,
});

const opponentHandCard = createMockCharacter({
  id: "yzma-transformed-kitten-opponent-hand",
  name: "Opponent Hand Card",
  cost: 1,
});

describe("Yzma - Transformed Kitten", () => {
  it("may return itself to your hand when banished if you have more cards in hand than each opponent", () => {
    // Player one has 3 cards in hand; player two starts with 1 and draws 1 at start of turn = 2.
    // Condition: 3 > 2 is true, so the ability should trigger.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: yzmaTransformedKitten, exerted: true }],
        hand: [firstHandCard, secondHandCard, thirdHandCard],
      },
      {
        play: [opposingAttacker],
        hand: [opponentHandCard],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, yzmaTransformedKitten),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(yzmaTransformedKitten, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(yzmaTransformedKitten)).toBe("hand");
  });

  it("does NOT trigger when banished if controller does not have more cards in hand than each opponent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: yzmaTransformedKitten, exerted: true }],
        hand: [firstHandCard],
      },
      {
        play: [opposingAttacker],
        hand: [opponentHandCard, secondHandCard],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, yzmaTransformedKitten),
    ).toBeSuccessfulCommand();

    // Condition not met: controller has 1 card in hand, opponent starts with 2 and draws 1 = 3 — ability should not trigger
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(yzmaTransformedKitten)).not.toBe("hand");
  });
});
