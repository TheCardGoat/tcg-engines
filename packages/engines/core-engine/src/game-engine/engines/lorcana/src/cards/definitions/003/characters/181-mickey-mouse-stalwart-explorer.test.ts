/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mickeyMouseStalwartExplorer } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
