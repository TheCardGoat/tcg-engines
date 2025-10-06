/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { turboRoyalHack } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
