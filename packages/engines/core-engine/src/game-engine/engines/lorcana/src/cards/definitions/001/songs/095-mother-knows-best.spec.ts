/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { motherKnowsBest } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mother Knows Best", () => {
  it("Your own card", () => {
    const testStore = new TestStore({
      inkwell: motherKnowsBest.cost,
      hand: [motherKnowsBest],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", motherKnowsBest.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
  });

  it("Opponent's card", () => {
    const testStore = new TestStore(
      {
        inkwell: motherKnowsBest.cost,
        hand: [motherKnowsBest],
      },
      { play: [moanaOfMotunui] },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", motherKnowsBest.id);
    const target = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("hand");
  });
});
