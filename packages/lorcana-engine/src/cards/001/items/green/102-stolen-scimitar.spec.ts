/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import {
  aladdinHeroicOutlaw,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { stolenScimitar } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Stolen Scimitar", () => {
  it("[Aladdin] Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.", () => {
    const testStore = new TestStore({
      play: [stolenScimitar, aladdinHeroicOutlaw],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", stolenScimitar.id);
    const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
  });

  it("[Non Aladdin] Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.", () => {
    const testStore = new TestStore({
      play: [stolenScimitar, moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", stolenScimitar.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 1);
  });
});
