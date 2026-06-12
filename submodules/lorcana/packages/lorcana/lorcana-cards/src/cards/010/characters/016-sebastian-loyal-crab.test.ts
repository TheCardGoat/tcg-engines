import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { sebastianLoyalCrab } from "./016-sebastian-loyal-crab";

describe("Sebastian - Loyal Crab", () => {
  it("can be played and quests for 3 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sebastianLoyalCrab],
        inkwell: sebastianLoyalCrab.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(sebastianLoyalCrab)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(sebastianLoyalCrab)).toBe("play");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(sebastianLoyalCrab)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(3);
  });

  it("cannot be put into the inkwell (not inkable)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sebastianLoyalCrab],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    const result = testEngine.asPlayerOne().ink(sebastianLoyalCrab);
    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(sebastianLoyalCrab)).toBe("hand");
  });
});
