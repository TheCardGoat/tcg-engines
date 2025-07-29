/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyMouseFoodFightDefender } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { candyDrift } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Candy Drift", () => {
  it("Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.", async () => {
    const testEngine = new TestEngine({
      inkwell: candyDrift.cost,
      play: [mickeyMouseFoodFightDefender],
      hand: [candyDrift],
      deck: 10,
    });

    await testEngine.playCard(candyDrift, {
      targets: [mickeyMouseFoodFightDefender],
    });

    expect(testEngine.getCardModel(mickeyMouseFoodFightDefender).strength).toBe(
      mickeyMouseFoodFightDefender.strength + 5,
    );
    expect(testEngine.getZonesCardCount().hand).toBe(1);

    await testEngine.passTurn();

    expect(testEngine.getCardModel(mickeyMouseFoodFightDefender).zone).toBe(
      "discard",
    );
  });

  it("Draws a card without a target for rest of it", async () => {
    const testEngine = new TestEngine({
      inkwell: candyDrift.cost,
      play: [],
      hand: [candyDrift],
      deck: 10,
    });

    await testEngine.playCard(candyDrift);

    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
