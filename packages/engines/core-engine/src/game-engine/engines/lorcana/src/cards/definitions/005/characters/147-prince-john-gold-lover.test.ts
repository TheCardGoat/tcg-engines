/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { princeJohnGoldLover } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince John - Gold Lover", () => {
  it.skip("**BEAUTIFUL, LOVELY TAXES** {E} – Play an item from your hand or discard with cost 5 or less for free, exerted.", () => {
    const testStore = new TestStore({
      inkwell: princeJohnGoldLover.cost,
      play: [princeJohnGoldLover],
    });

    const cardUnderTest = testStore.getCard(princeJohnGoldLover);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
