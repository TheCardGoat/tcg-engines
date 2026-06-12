import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { liquidatorIcedOver } from "./111-liquidator-iced-over";

describe("Liquidator - Iced Over", () => {
  it("has Reckless keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [liquidatorIcedOver],
    });

    const cardUnderTest = testEngine.getCardModel(liquidatorIcedOver);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });

  it("cannot be played with insufficient ink when you are the first player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [liquidatorIcedOver],
      inkwell: liquidatorIcedOver.cost - 1,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(liquidatorIcedOver).success).toBe(false);
  });

  it("costs 1 less on the first turn when not the first player (UNDERDOG)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 5 },
      {
        hand: [liquidatorIcedOver],
        inkwell: liquidatorIcedOver.cost - 1, // 1 ink — enough with Underdog
        deck: 5,
      },
    );

    // Pass player one's first turn
    testEngine.asPlayerOne().passTurn();

    // Player two is NOT the first player, first turn → Underdog applies
    const result = testEngine.asPlayerTwo().playCard(liquidatorIcedOver);
    expect(result.success).toBe(true);
    expect(testEngine.asPlayerTwo().getCardZone(liquidatorIcedOver)).toBe("play");
  });
});
