/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rollyHungryPup } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Rolly - Hungry Pup", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      play: [rollyHungryPup],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", rollyHungryPup.id);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
