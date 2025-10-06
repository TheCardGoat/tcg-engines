/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { simbaSonOfMufasa } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Simba - Son of Mufasa", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: simbaSonOfMufasa.cost,
      play: [simbaSonOfMufasa],
    });

    const cardUnderTest = testStore.getCard(simbaSonOfMufasa);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**FEARSOME ROAR** When you play this character, you may banish chosen item or location.", () => {
    const testStore = new TestStore({
      inkwell: simbaSonOfMufasa.cost,
      hand: [simbaSonOfMufasa],
    });

    const cardUnderTest = testStore.getCard(simbaSonOfMufasa);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
