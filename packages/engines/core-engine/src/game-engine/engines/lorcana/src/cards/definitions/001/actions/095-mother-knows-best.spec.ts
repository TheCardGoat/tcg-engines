/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import {
  letItGo,
  motherKnowsBest,
} from "@lorcanito/lorcana-engine/cards/001/songs/songs.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
