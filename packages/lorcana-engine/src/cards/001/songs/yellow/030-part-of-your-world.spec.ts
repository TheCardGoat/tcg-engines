/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { partOfOurWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Part of Your World", () => {
  it("Return a character card from your discard to your hand.", () => {
    const testStore = new TestStore({
      inkwell: partOfOurWorld.cost,
      hand: [partOfOurWorld],
      discard: [moanaOfMotunui],
    });
    const cardUnderTest = testStore.getByZoneAndId("hand", partOfOurWorld.id);

    cardUnderTest.playFromHand();

    const target = testStore.getByZoneAndId("discard", moanaOfMotunui.id);

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
  });
});
