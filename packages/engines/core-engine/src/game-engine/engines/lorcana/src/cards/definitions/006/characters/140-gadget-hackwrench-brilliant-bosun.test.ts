/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { donaldDuckStruttingHisStuff } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { gadgetHackwrenchBrilliantBosun } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gadget Hackwrench - Brilliant Bosun", () => {
  it("**MECHANICALLY SAVVY** While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.", () => {
    const testStore = new TestEngine({
      play: [gadgetHackwrenchBrilliantBosun, pawpsicle, pawpsicle, pawpsicle],
      hand: [donaldDuckStruttingHisStuff],
    });

    const cardUnderTest = testStore.getCardModel(donaldDuckStruttingHisStuff);

    expect(cardUnderTest.cost).toBe(donaldDuckStruttingHisStuff.cost - 1);
  });
});
