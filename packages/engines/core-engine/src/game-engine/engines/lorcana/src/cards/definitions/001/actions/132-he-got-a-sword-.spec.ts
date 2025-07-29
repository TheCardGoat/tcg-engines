/**
 * @jest-environment node
 */
import { describe, expect, it } from "bun:test";
import { hesGotASword } from "@lorcanito/lorcana-engine/cards/001/actions/actions.ts";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("He's Got a Sword!", () => {
  it("Chosen character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: hesGotASword.cost,
      hand: [hesGotASword],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", hesGotASword.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
  });
});
