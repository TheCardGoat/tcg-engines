/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items.ts";
import { glean } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Glean", () => {
  it("Targeting your own card", async () => {
    const testEngine = new TestEngine({
      inkwell: glean.cost,
      hand: [glean],
      play: [pawpsicle],
    });

    const cardUnderTest = testEngine.getCardModel(glean);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getLoreForPlayer()).toEqual(2);
  });

  it("Targeting opponent's card", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: glean.cost,
        hand: [glean],
      },
      {
        play: [pawpsicle],
      },
    );

    const cardUnderTest = testEngine.getCardModel(glean);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getLoreForPlayer("player_two")).toEqual(2);
  });
});
