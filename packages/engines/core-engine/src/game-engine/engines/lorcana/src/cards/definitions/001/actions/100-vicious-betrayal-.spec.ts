/**
 * @jest-environment node
 */
import { describe, expect, it } from "bun:test";
import { viciousBetrayal } from "@lorcanito/lorcana-engine/cards/001/actions/actions.ts";
import {
  moanaOfMotunui,
  teKaTheBurningOne,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Vicious Betrayal", () => {
  it("[Non Villain] Chosen character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: viciousBetrayal.cost,
      hand: [viciousBetrayal],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", viciousBetrayal.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
  });

  it("[Villain] Chosen character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: viciousBetrayal.cost,
      hand: [viciousBetrayal],
      play: [teKaTheBurningOne],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", viciousBetrayal.id);
    const target = testStore.getByZoneAndId("play", teKaTheBurningOne.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 3);
  });
});
