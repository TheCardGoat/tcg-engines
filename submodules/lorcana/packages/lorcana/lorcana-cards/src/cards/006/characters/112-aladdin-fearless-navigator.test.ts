import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinFearlessNavigator } from "./112-aladdin-fearless-navigator";

describe("Aladdin - Fearless Navigator", () => {
  it("should be a vanilla character with correct stats", () => {
    const testEngine = new LorcanaTestEngine({
      play: [aladdinFearlessNavigator],
    });

    const cardUnderTest = testEngine.getCardModel(aladdinFearlessNavigator);
    expect(cardUnderTest.strength).toBe(2);
    expect(cardUnderTest.willpower).toBe(3);
    expect(cardUnderTest.lore).toBe(1);
  });

  it("should be able to quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: aladdinFearlessNavigator, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(aladdinFearlessNavigator)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
