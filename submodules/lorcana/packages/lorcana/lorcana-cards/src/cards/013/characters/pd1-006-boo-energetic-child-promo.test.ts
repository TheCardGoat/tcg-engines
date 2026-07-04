import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { booEnergeticChildPD1Promo } from "./pd1-006-boo-energetic-child-promo";

const weakDefender = createMockCharacter({
  id: "boo-energetic-child-promo-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 3,
  willpower: 5,
});

describe("Boo - Energetic Child Promo", () => {
  it("matches the base Rush and Kid-tastrophe behavior", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [booEnergeticChildPD1Promo],
        inkwell: booEnergeticChildPD1Promo.cost,
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(booEnergeticChildPD1Promo)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(booEnergeticChildPD1Promo, weakDefender),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(booEnergeticChildPD1Promo),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: booEnergeticChildPD1Promo, value: 0 });
  });
});
