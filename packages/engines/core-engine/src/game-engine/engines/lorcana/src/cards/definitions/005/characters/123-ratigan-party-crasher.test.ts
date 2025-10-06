/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { ratiganPartyCrasher } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Ratigan - Party Crasher", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: ratiganPartyCrasher.cost,
      play: [ratiganPartyCrasher],
    });

    const cardUnderTest = testStore.getCard(ratiganPartyCrasher);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: ratiganPartyCrasher.cost,
      play: [ratiganPartyCrasher],
    });

    const cardUnderTest = testStore.getCard(ratiganPartyCrasher);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**DELIGHTFULLY WICKED** Your damaged characters get -2 {S}.", () => {
    const testStore = new TestStore({
      inkwell: ratiganPartyCrasher.cost,
      play: [ratiganPartyCrasher],
    });

    const cardUnderTest = testStore.getCard(ratiganPartyCrasher);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
