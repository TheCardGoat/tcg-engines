/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { zazuPrideLandsManager } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Zazu - Pride Land’s Manager", () => {
  it("**IT’S TIME TO LEAVE!** While this character is at a location, he gets +1 lore.", () => {
    const testStore = new TestStore({
      inkwell: zazuPrideLandsManager.cost,
      play: [zazuPrideLandsManager, forbiddenMountainMaleficentsCastle],
    });

    const cardUnderTest = testStore.getCard(zazuPrideLandsManager);
    const location = testStore.getCard(forbiddenMountainMaleficentsCastle);

    expect(cardUnderTest.lore).toEqual(zazuPrideLandsManager.lore);
    cardUnderTest.enterLocation(location);
    expect(cardUnderTest.lore).toEqual(zazuPrideLandsManager.lore + 1);
  });
});
