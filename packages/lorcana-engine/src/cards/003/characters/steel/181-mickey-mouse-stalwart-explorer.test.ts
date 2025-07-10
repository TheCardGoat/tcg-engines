/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseStalwartExplorer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mickey Mouse - Stalwart Explorer", () => {
  it.skip("**LET'S TAKE A LOOK** This character gets +1 {S} for each location you have in play.", () => {
    const testStore = new TestStore({
      inkwell: mickeyMouseStalwartExplorer.cost,
      play: [mickeyMouseStalwartExplorer],
    });

    const cardUnderTest = testStore.getCard(mickeyMouseStalwartExplorer);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
