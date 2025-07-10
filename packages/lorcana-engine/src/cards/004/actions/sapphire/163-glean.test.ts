/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { glaner } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Glean", () => {
  it("Targeting your own card", async () => {
    const testEngine = new TestEngine({
      inkwell: glaner.cost,
      hand: [glaner],
      play: [pawpsicle],
    });

    const cardUnderTest = testEngine.getCardModel(glaner);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getLoreForPlayer()).toEqual(2);
  });

  it("Targeting opponent's card", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: glaner.cost,
        hand: [glaner],
      },
      {
        play: [pawpsicle],
      },
    );

    const cardUnderTest = testEngine.getCardModel(glaner);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getLoreForPlayer("player_two")).toEqual(2);
  });
});
