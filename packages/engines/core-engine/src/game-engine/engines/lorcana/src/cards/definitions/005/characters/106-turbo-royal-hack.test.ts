/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { turboRoyalHack } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Turbo - Royal Hack", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: turboRoyalHack.cost,
      play: [turboRoyalHack],
    });

    const cardUnderTest = testStore.getCard(turboRoyalHack);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**GAME JUMP** This character also counts as being named King Candy for **Shift**.", () => {
    const testStore = new TestStore({
      inkwell: turboRoyalHack.cost,
      play: [turboRoyalHack],
    });

    const cardUnderTest = testStore.getCard(turboRoyalHack);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
