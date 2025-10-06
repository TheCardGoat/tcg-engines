/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { zazuPrideLandsManager } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { forbiddenMountainMaleficentsCastle } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";

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
