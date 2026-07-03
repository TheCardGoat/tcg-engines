import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { booEnergeticChild } from "./127-boo-energetic-child";

const weakDefender = createMockCharacter({
  id: "boo-energetic-child-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 3,
  willpower: 5,
});

describe("Boo - Energetic Child", () => {
  it("can challenge the turn she is played and banishes a character with 3 strength or less without taking challenge damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [booEnergeticChild],
        inkwell: booEnergeticChild.cost,
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(booEnergeticChild)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(booEnergeticChild, weakDefender),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(booEnergeticChild),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: booEnergeticChild, value: 0 });
  });
});
