/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { partOfYourWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Part of Your World", () => {
  it("Return a character card from your discard to your hand.", () => {
    const testStore = new TestStore({
      inkwell: partOfYourWorld.cost,
      hand: [partOfYourWorld],
      discard: [moanaOfMotunui],
    });
    const cardUnderTest = testStore.getByZoneAndId("hand", partOfYourWorld.id);

    cardUnderTest.playFromHand();

    const target = testStore.getByZoneAndId("discard", moanaOfMotunui.id);

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
  });
});
