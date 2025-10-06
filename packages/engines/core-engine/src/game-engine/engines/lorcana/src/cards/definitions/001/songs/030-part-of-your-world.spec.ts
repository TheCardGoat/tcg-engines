/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { partOfYourWorld } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
