import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  quickPatch,
  strikeAGoodMatch,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
