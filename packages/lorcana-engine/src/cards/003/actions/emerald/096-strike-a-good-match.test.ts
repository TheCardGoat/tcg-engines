/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  quickPatch,
  strikeAGoodMatch,
} from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Strike a Good Match", () => {
  it("Draw 2 cards, then choose and discard a card.", async () => {
    const testStore = new TestEngine({
      inkwell: strikeAGoodMatch.cost,
      hand: [strikeAGoodMatch],
      deck: [mickeyBraveLittleTailor, quickPatch],
      discard: [],
    });

    await testStore.playCard(strikeAGoodMatch, {
      targets: [mickeyBraveLittleTailor],
    });

    expect(testStore.getZonesCardCount().discard).toBe(2);
    expect(testStore.getZonesCardCount().hand).toBe(1);
    expect(testStore.getZonesCardCount().deck).toBe(0);
    expect(testStore.getCardModel(mickeyBraveLittleTailor).zone).toBe(
      "discard",
    );
  });
});
