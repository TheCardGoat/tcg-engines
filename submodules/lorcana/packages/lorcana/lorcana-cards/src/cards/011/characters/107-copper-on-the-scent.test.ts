import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { copperOnTheScent } from "./107-copper-on-the-scent";

const opponentCharacter = createMockCharacter({
  id: "opponent-char",
  name: "Opponent Character",
  strength: 2,
  willpower: 2,
  cost: 2,
});

describe("Copper - On the Scent", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [copperOnTheScent],
    });

    const cardUnderTest = testEngine.getCardModel(copperOnTheScent);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [copperOnTheScent],
    });

    const cardUnderTest = testEngine.getCardModel(copperOnTheScent);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });

  it("should be able to challenge the turn it's played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [copperOnTheScent],
        inkwell: copperOnTheScent.cost,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(copperOnTheScent)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(copperOnTheScent, opponentCharacter),
    ).toBeSuccessfulCommand();
  });

  it("should not be able to quest due to Reckless", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [copperOnTheScent],
    });

    const result = testEngine.asPlayerOne().quest(copperOnTheScent) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("RECKLESS_CANT_QUEST");
  });

  it("should have 0 lore value", () => {
    const testEngine = new LorcanaTestEngine({
      play: [copperOnTheScent],
    });

    const cardUnderTest = testEngine.getCardModel(copperOnTheScent);
    expect(cardUnderTest.lore).toBe(0);
  });
});
